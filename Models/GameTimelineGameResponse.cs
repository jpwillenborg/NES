namespace NES_Box_Art.Models;

/// <summary>NES release and cartridge metadata used by the comparison visualizer.</summary>
public sealed record GameTimelineGameResponse(
    string Name,
    string CoverUrl,
    int SizeInKb,
    string MapperChip,
    DateTimeOffset ReleaseDate,
    string ReleaseLabel);