# NES Mapper Benchmark Tool

An interactive hardware catalog visualization application designed to chart retro gaming architecture allocations, cartridge capacity variations, and memory mapper configurations side-by-side inside a reactive performance-matrix component layout.

🔗 **Live Production Deployment:** [https://memory.jpwillenborg.com/](https://memory.jpwillenborg.com/)

🏗️ System Architecture & Engineering
This software platform functions across an explicit multi-tier decoupled structure:

*   **Frontend Player Layer (`nes-client`):** A high-performance responsive Single Page Application (SPA) driven by React 19 and Vite 8. It employs specialized ARIA semantic mapping handles to deliver complete visual-grid layout accessibility for screen readers.
*   **Backend Service Layer (`nes-server`):** A compiled C# ASP.NET Core 10 Web API built on a controller-based architecture. The server processes third-party API payloads, implements memory-backed metadata caching, and exposes structured payloads securely using cross-origin resource sharing (CORS).

⚡ Core Technical Features
*   **Visual Size Allocation Matrix:** Computes precise size values dynamically and projects byte layout scales across an adaptive grid layout component, mapping hardware overlaps or data bank properties instantaneously via custom Tailwind CSS injections.
*   **Automated Third-Party Integration:** Incorporates an isolated backend token handling system to interface directly with external IGDB web networks, retrieving legacy meta-catalogs and packaging attributes securely under server-side controllers.
*   **Graceful Initialization Handshake:** Built-in validation structures that actively verify Twitch developer credentials at startup. If keys are absent, the application downgrades gracefully to preserve system operations without throwing fatal exceptions.

🛠️ Stack Configuration & Primitives
*   **Frontend UI:** React 19, Vite 8, Tailwind CSS, JavaScript (ES6+)
*   **Backend API:** C#, .NET 10.0 SDK, ASP.NET Web API Framework
*   **Third-Party Services:** IGDB Client Engine Wrapper
*   **Live Infrastructure Hosting:** Apache Linux Systems (Static Web Content), Render Web Containers (Compiled .NET API Executables)

---

## 💻 Local Development Setup

### 1. Backend Web API Execution
Ensure the **.NET Core 10.0 SDK** environment is installed on your system. Open your terminal inside the server root directory:

```bash
dotnet restore
```

To fully populate live game catalog artwork, the server integrates with the IGDB platform. You can supply your Twitch Developer credentials inside your local environment configurations or map them directly into your `appsettings.Development.json` file:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Frontend": {
    "AllowedOrigins": ["http://localhost:5175"]
  },
  "Twitch": {
    "ClientId": "your_igdb_client_id_here",
    "ClientSecret": "your_igdb_client_secret_here"
  }
}
```

> ⚙️ **Localized Runtime Switch:** If external Twitch/IGDB API keys are omitted in your local workspace, the server gracefully redirects API endpoints to utilize native map definitions. The interface will render all metrics and data calculations completely, substituting the live binary cover art streams with generic dark theme assets. To observe the live cover art populating natively, explore the live pipeline at [https://memory.jpwillenborg.com/](https://memory.jpwillenborg.com/).

Execute the backend developer stream:
```bash
dotnet run
```
The server will bind and start listening on: `http://localhost:5220`.

### 2. Frontend Client Setup
Open a separate terminal window inside the client environment folder (`nes-client`):

```bash
npm install
```

Configure your local environment variables inside a `.env` file at the root of the client folder to target the .NET application pipeline correctly:

```env
VITE_PORTFOLIO_URL=http://localhost:5175
VITE_API_BASE_URL=http://localhost:5220
```

Launch the development compilation loop:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5175`** to view the application.
