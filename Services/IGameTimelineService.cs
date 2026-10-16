using NES_Box_Art.Models;

namespace NES_Box_Art.Services;

public interface IGameTimelineService
{
    bool IsConfigured { get; }

    Task<IReadOnlyList<GameTimelineGameResponse>> GetGamesAsync(CancellationToken cancellationToken);
}