# NES Mapper Benchmark Tool — Frontend Client Layout

The client-side decoupled interface architecture for the NES Mapper Benchmark Tool. This component renders real-time data calculations, reactive hardware allocation comparisons, and memory distribution matrix structures.

🔗 **Live Production Deployment:** [https://memory.jpwillenborg.com/](https://memory.jpwillenborg.com/)

## 🏗️ Architecture & Component Design
The interface functions as a dedicated Single Page Application (SPA) prioritizing performance metrics and modern layouts:
*   **Compilation & Runtimes:** Built on React 19 and compiled via Vite 8.
*   **Layout Adaptability:** Employs customized, mobile-first Tailwind CSS injection tokens to scale matrix views seamlessly.
*   **Aria Grid Core Accessibility:** Integrated with specific semantic element handling structures to keep hardware comparative tables highly legible for screen reader devices.
*   **Automated Continuous Delivery:** Fully integrated via GitHub Actions workflows. Pushing code updates directly to the `main` branch inside this folder kicks off headless Ubuntu compilations and securely delivers minimized production assets to Apache servers using encrypted FTPS layers.

---

## 💻 Local Workspace Engineering Setup

Ensure Node.js 20 or higher is configured on your machine. Open an isolated shell dashboard inside this specific client directory (`nes-client/`):

### 1. Ingest Structural Primitives
Download dependencies and install target nodes cleanly using the package manifest:
```bash
npm install
```

### 2. Formulate Environment Mappings
Establish localized routing keys inside a newly generated `.env` file right within the client directory root:
```env
VITE_PORTFOLIO_URL=http://localhost:5175
VITE_API_BASE_URL=http://localhost:5220
```

### 3. Initialize Compilation Loops
Launch the local developer hot-reloading pipeline:
```bash
npm run dev
```
Open an accessible browser window and explore the development thread at: **`http://localhost:5175`**
