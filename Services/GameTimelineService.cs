using IGDB;
using IGDB.Models;
using Microsoft.Extensions.Caching.Memory;
using NES_Box_Art.Models;

namespace NES_Box_Art.Services;

public sealed class GameTimelineService(
    IGDBClient client,
    IMemoryCache cache,
    IConfiguration configuration) : IGameTimelineService
{
    private const string CacheKey = "nes-game-timeline";

    private static readonly string[] GameNames =
    [
        "Super Mario Bros.", "Castlevania", "The Legend of Zelda", "Contra", "Metroid",
        "Rad Racer", "Mike Tyson's Punch-Out!!", "Ninja Gaiden", "Excitebike",
        "Zelda II: The Adventure of Link", "Final Fantasy", "Tetris", "Mega Man",
        "Mega Man 2", "Mega Man 3", "Blaster Master", "Kirby's Adventure", "StarTropics",
        "Dragon Warrior", "Faxanadu", "R.C. Pro-Am", "Tecmo Bowl", "Life Force",
        "Double Dragon", "Kid Icarus", "Ice Hockey", "Rygar", "Ghosts 'n Goblins"
    ];

    private static readonly IReadOnlyDictionary<string, DateTimeOffset> ReleaseDateOverrides =
        new Dictionary<string, DateTimeOffset>(StringComparer.OrdinalIgnoreCase)
        {
            ["Super Mario Bros."] = new(1985, 10, 18, 0, 0, 0, TimeSpan.Zero),
            ["Excitebike"] = new(1985, 10, 18, 0, 0, 0, TimeSpan.Zero),
            ["The Legend of Zelda"] = new(1987, 7, 1, 0, 0, 0, TimeSpan.Zero),
            ["Zelda II: The Adventure of Link"] = new(1988, 12, 1, 0, 0, 0, TimeSpan.Zero),
            ["Metroid"] = new(1987, 8, 1, 0, 0, 0, TimeSpan.Zero),
            ["Castlevania"] = new(1987, 5, 1, 0, 0, 0, TimeSpan.Zero),
            ["Kid Icarus"] = new(1987, 7, 1, 0, 0, 0, TimeSpan.Zero),
            ["Mega Man"] = new(1987, 12, 1, 0, 0, 0, TimeSpan.Zero),
            ["Mike Tyson's Punch-Out!!"] = new(1987, 10, 1, 0, 0, 0, TimeSpan.Zero),
            ["Ninja Gaiden"] = new(1989, 3, 1, 0, 0, 0, TimeSpan.Zero),
            ["Ghosts 'n Goblins"] = new(1986, 11, 1, 0, 0, 0, TimeSpan.Zero),
            ["Rygar"] = new(1987, 7, 1, 0, 0, 0, TimeSpan.Zero),
            ["Ice Hockey"] = new(1988, 3, 1, 0, 0, 0, TimeSpan.Zero),
            ["Contra"] = new(1988, 2, 1, 0, 0, 0, TimeSpan.Zero),
            ["Rad Racer"] = new(1987, 10, 1, 0, 0, 0, TimeSpan.Zero),
            ["Tetris"] = new(1989, 11, 1, 0, 0, 0, TimeSpan.Zero)
        };

    private static readonly IReadOnlyDictionary<string, (int SizeInKb, string MapperChip)> HardwareByGame =
        new Dictionary<string, (int, string)>(StringComparer.OrdinalIgnoreCase)
        {
            ["Super Mario Bros."] = (40, "NROM"),
            ["Castlevania"] = (128, "UNROM"),
            ["The Legend of Zelda"] = (128, "MMC1"),
            ["Contra"] = (128, "UNROM"),
            ["Metroid"] = (128, "MMC1"),
            ["Rad Racer"] = (128, "CNROM"),
            ["Mike Tyson's Punch-Out!!"] = (256, "MMC2"),
            ["Ninja Gaiden"] = (256, "MMC1"),
            ["Excitebike"] = (24, "NROM"),
            ["Zelda II: The Adventure of Link"] = (256, "MMC1"),
            ["Final Fantasy"] = (256, "MMC1"),
            ["Tetris"] = (48, "NROM"),
            ["Mega Man"] = (128, "UNROM"),
            ["Mega Man 2"] = (256, "MMC1"),
            ["Mega Man 3"] = (384, "MMC3"),
            ["Blaster Master"] = (256, "MMC1"),
            ["Kirby's Adventure"] = (768, "MMC5"),
            ["StarTropics"] = (512, "MMC6"),
            ["Dragon Warrior"] = (64, "MMC1"),
            ["Faxanadu"] = (256, "MMC1"),
            ["R.C. Pro-Am"] = (64, "SEROM"),
            ["Tecmo Bowl"] = (192, "MMC1"),
            ["Life Force"] = (128, "UNROM"),
            ["Double Dragon"] = (256, "MMC1"),
            ["Kid Icarus"] = (128, "MMC1"),
            ["Ice Hockey"] = (48, "NROM"),
            ["Rygar"] = (128, "UNROM"),
            ["Ghosts 'n Goblins"] = (128, "CNROM")
        };

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(configuration["Twitch:ClientId"] ?? configuration["IGDB:ClientId"]) &&
        !string.IsNullOrWhiteSpace(configuration["Twitch:ClientSecret"] ?? configuration["IGDB:ClientSecret"]);

    public async Task<IReadOnlyList<GameTimelineGameResponse>> GetGamesAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (!IsConfigured) return Array.Empty<GameTimelineGameResponse>();

        var games = await cache.GetOrCreateAsync<IReadOnlyList<GameTimelineGameResponse>>(CacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6);

            var namesQuery = string.Join(", ", GameNames.Select(name => $"\"{name}\""));
            var query = "fields name, cover.*, first_release_date, release_dates.*; " +
                        $"where name = ({namesQuery}) & platforms = (18) & cover != null; " +
                        "limit 50;";

            var results = await client.QueryAsync<Game>(IGDBClient.Endpoints.Games, query);
            var gameList = results.ToList();
            var tetrisVariants = gameList
                .Where(game => game.Name?.Equals("Tetris", StringComparison.OrdinalIgnoreCase) == true)
                .ToList();

            if (tetrisVariants.Count > 1)
            {
                var selectedTetris = tetrisVariants.OrderByDescending(game => game.FirstReleaseDate).First();
                gameList.RemoveAll(game => game.Name?.Equals("Tetris", StringComparison.OrdinalIgnoreCase) == true);
                gameList.Add(selectedTetris);
            }

            return gameList
                .Where(game => !string.IsNullOrWhiteSpace(game.Name))
                .Select(MapGame)
                .OrderBy(game => game.ReleaseDate)
                .ToList();
        });

        cancellationToken.ThrowIfCancellationRequested();
        return games ?? Array.Empty<GameTimelineGameResponse>();
    }

    private static GameTimelineGameResponse MapGame(Game game)
    {
        var name = game.Name!;
        var releaseDate = GetReleaseDate(game, name);
        var hardware = HardwareByGame.TryGetValue(name, out var knownHardware)
            ? knownHardware
            : (32, "NROM");
        var imageId = game.Cover?.Value?.ImageId;
        var coverUrl = string.IsNullOrWhiteSpace(imageId)
            ? string.Empty
            : IGDB.ImageHelper.GetImageUrl(imageId, ImageSize.CoverBig, false);
        if (coverUrl.StartsWith("//", StringComparison.Ordinal)) coverUrl = $"https:{coverUrl}";

        return new GameTimelineGameResponse(
            name,
            coverUrl,
            hardware.Item1,
            hardware.Item2,
            releaseDate,
            releaseDate.ToString("MMM yyyy", System.Globalization.CultureInfo.InvariantCulture).ToUpperInvariant());
    }

    private static DateTimeOffset GetReleaseDate(Game game, string name)
    {
        if (ReleaseDateOverrides.TryGetValue(name, out var overrideDate)) return overrideDate;

        var releaseDate = game.FirstReleaseDate?.ToUniversalTime() ??
            new DateTimeOffset(1980, 1, 1, 0, 0, 0, TimeSpan.Zero);
        var northAmericanRelease = game.ReleaseDates?.Values?.FirstOrDefault(date =>
            date.Human != null &&
            (date.Human.Contains("North America", StringComparison.OrdinalIgnoreCase) ||
             date.Human.Contains("USA", StringComparison.OrdinalIgnoreCase)));

        return northAmericanRelease?.Date?.ToUniversalTime() ?? releaseDate;
    }
}