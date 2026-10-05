# NES Mapper Benchmark Tool

An interactive hardware catalog visualization application designed to chart retro gaming architecture allocations, cartridge capacity variations, and memory mapper configurations side-by-side inside a reactive performance-matrix component layout.

## 🏗️ System Architecture & Engineering

This software platform functions across an explicit multi-tier decoupled structure:

*   **Frontend Player Layer (`nes-client`):** A high-performance responsive Single Page Application (SPA) driven by React and Vite. It employs specialized ARIA semantic mapping handles (`role="img"`, dynamic context injections) to deliver complete visual-grid layout accessibility for screen readers.
*   **Backend Service Layer (`nes-server`):** A compiled C# ASP.NET Core Web API built on a controller-based architecture. The server processes third-party API payloads, formats legacy cart mapping telemetry arrays, and implements strict endpoint authorization via cross-origin validation checks.

## ⚡ Core Technical Features

*   **Visual Size Allocation Matrix:** Computes precise size values dynamically and projects byte layout scales across a 768-node aspect-grid layout component, mapping hardware overlaps or data bank properties instantaneously via CSS variable injection.
*   **Automated Third-Party Integration:** Incorporates a tailored HTTP client wrapper to integrate directly with external IGDB web networks, retrieving legacy meta-catalogs and packaging attributes securely under server-side controller structures.
*   **Cross-Subdomain Deep Navigation:** Interfaces with multi-app configurations via absolute routing models, allowing seamless entry into specialized hash targets (`/#stacks`, `/#apps`) on external root servers.

## 🛠️ Stack Configuration & Primitives

*   **Frontend UI:** React, Vite, Tailwind CSS Engine, Geist Typefaces, JavaScript
*   **Backend API:** C#, .NET 10.0 Core, ASP.NET Web API Framework
*   **Live Infrastructure Hosting:** Apache Server (Static Web App Content), Render Web Service Environment (Compiled .NET Web API Container)

---

## 💻 Local Development Setup

### 1. Backend Web API Execution
Ensure a .NET Core 10.0 SDK environment is installed on the local system. Open a PowerShell console inside the server directory:
```bash
cd nes-server
dotnet restore
```
Configure application configuration profiles inside an `appsettings.Development.json` text block:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Frontend": {
    "AllowedOrigins": ["http://localhost:5173", "http://localhost:5175"]
  }
}
```
Execute the backend development stream:
```bash
dotnet run
```

### 2. Frontend Client Setup
Open a separate PowerShell terminal window inside the client environment folder:
```bash
cd nes-client
npm install
```
Configure local development parameters inside a `.env` properties sheet:
```text
VITE_PORTFOLIO_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5220
```
Launch the compilation listener:
```bash
npm run dev
```
