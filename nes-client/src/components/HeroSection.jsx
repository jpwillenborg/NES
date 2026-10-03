export default function HeroSection() {
  return (
    <div className="flex flex-col pb-6 mb-10">
      <div className="text-left w-full">
        <span className="portfolio-tag-line block mb-0 font-mono text-[1.1rem] text-portfolio-cyan font-normal">
          // Memory Comparison
        </span>
        <h1 className="portfolio-main-title m-0 pt-1 font-sans text-[2.1rem] font-semibold text-white leading-[1.2]">
          NES Mapper Benchmark Tool
        </h1>
        <div className="text-[#a0aec0] text-[1.05rem] leading-[1.65] mt-10 mb-0 block w-full">
          <p className="m-0 opacity-90">
            A React/Vite visualizer hosted on Apache, backed by a controller-based ASP.NET Core Web API on Render. The API retrieves and caches IGDB release data and pairs it with curated NES cartridge-capacity and mapper estimates for side-by-side comparison.
          </p>
          <p className="m-0 pt-8 opacity-90">
            Select two games from the list to see how <span className="text-portfolio-cyan font-semibold">CARTRIDGE A</span> and <span className="text-portfolio-purple font-semibold">CARTRIDGE B</span> compare in terms of memory footprint.
          </p>
        </div>
      </div>
    </div>
  );
}
