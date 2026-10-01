# NES Cartridge Memory Compare

A split-hosting portfolio demo for comparing curated NES cartridge capacity and mapper estimates against game release data from IGDB.

## Architecture

- `nes-client/`: React 19, Vite, and Tailwind CSS 3 frontend, preserving the original Razor page's utility-class layout and deployed as static files to Bluehost at [nes.jpwillenborg.com](https://nes.jpwillenborg.com).
- `Controllers/GamesController.cs`: controller-based ASP.NET Core Web API endpoint returning JSON.
- `Services/GameTimelineService.cs`: IGDB request, release-date and cartridge metadata mapping, and six-hour in-memory cache.
- Render: hosts the .NET 10 API using the repository Dockerfile.

The UI is React, not a Razor view. The backend uses ASP.NET Core controllers and the MVC framework for its API boundary; it should be described as a React frontend with an ASP.NET Core Web API, not as a traditional Razor MVC website. Cartridge sizes and mapper labels are curated comparison estimates, not a binary ROM inspection.

Newtonsoft.Json is explicitly pinned to 13.0.1 to override the vulnerable version brought in transitively by the IGDB client.

## Local Development

Requirements: .NET 10 SDK, Node.js 20 or later, and IGDB/Twitch API credentials.

Configure local .NET user secrets without placing credentials in source control:

```bash
dotnet user-secrets set "Twitch:ClientId" "your-client-id" --project "NES Box Art.csproj"
dotnet user-secrets set "Twitch:ClientSecret" "your-client-secret" --project "NES Box Art.csproj"
```

Start the API from the repository root:

```bash
dotnet run --project "NES Box Art.csproj" --launch-profile http
```

The API listens at `http://localhost:5220`; `GET /api/games` returns the catalog. With missing credentials it responds with `503 Service Unavailable` and a Problem Details response rather than exposing an exception.

In another terminal, configure and run the client:

```bash
cd nes-client
npm ci
cp .env.example .env.local
npm run dev
```

The client runs at `http://localhost:5173` by default. When running alongside the Portfolio, use `npm run dev -- --port 5174`. Set `VITE_API_BASE_URL` to the API origin. Those local dev origins and the production NES subdomain are allowed by default; production origins can be replaced through `Frontend__AllowedOrigins`.

## Production Deployment

### Render API

Deploy the .NET service with the existing root `Dockerfile`. Configure `Twitch__ClientId` and `Twitch__ClientSecret` in Render’s environment settings. Set `Frontend__AllowedOrigins__0` to `https://nes.jpwillenborg.com` (and add another indexed origin only when needed). OpenAPI is available at `/openapi/v1.json` in Development only.

### Bluehost frontend

Create `nes-client/.env.production` with `VITE_API_BASE_URL` set to the public Render service URL before building. Run `npm ci` and `npm run build` in `nes-client/`, then upload the contents of `nes-client/dist/` to the Bluehost document root for `nes.jpwillenborg.com`. Vite environment values are embedded in the frontend bundle; never put IGDB credentials there.

The API returns game name, cover URL, release date, estimated cartridge capacity, and mapper label. See [`api.http`](api.http) for the local request examples.

## Checks

```bash
dotnet build "NES Box Art.csproj"
cd nes-client
npm ci
npm run build
```
