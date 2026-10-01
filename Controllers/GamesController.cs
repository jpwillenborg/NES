using Microsoft.AspNetCore.Mvc;
using NES_Box_Art.Models;
using NES_Box_Art.Services;

namespace NES_Box_Art.Controllers;

[ApiController]
[Route("api/games")]
public sealed class GamesController(IGameTimelineService gameTimelineService) : ControllerBase
{
    /// <summary>Returns NES release and cartridge data for the comparison visualizer.</summary>
    [EndpointSummary("List NES release and cartridge data")]
    [EndpointDescription("Returns IGDB release metadata and curated cartridge capacity and mapper estimates for the NES comparison tool.")]
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<GameTimelineGameResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<IReadOnlyList<GameTimelineGameResponse>>> GetGames(CancellationToken cancellationToken)
    {
        if (!gameTimelineService.IsConfigured)
        {
            return Problem(
                statusCode: StatusCodes.Status503ServiceUnavailable,
                title: "Game data is temporarily unavailable.",
                detail: "The IGDB integration is not configured on this service.");
        }

        var games = await gameTimelineService.GetGamesAsync(cancellationToken);
        return Ok(games);
    }
}