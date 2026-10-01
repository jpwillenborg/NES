import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');
const MEMORY_BLOCKS = 768;

const SORT_OPTIONS = [
  { value: 'date-oldest', label: 'Release Date (Oldest)' },
  { value: 'date-newest', label: 'Release Date (Newest)' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'size-desc', label: 'Size (Largest First)' }
];

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [sortBy, setSortBy] = useState('date-oldest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!API_BASE_URL) {
      setError('The game data service is not configured for this deployment.');
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/games`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          const problem = await response.json().catch(() => ({}));
          throw new Error(problem.detail || 'The game data service could not be reached.');
        }
        return response.json();
      })
      .then(setGames)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const sortedGames = [...games].sort((first, second) => {
    if (sortBy === 'name-asc') return first.name.localeCompare(second.name);
    if (sortBy === 'size-desc') return second.sizeInKb - first.sizeInKb;
    const dateOrder = new Date(first.releaseDate) - new Date(second.releaseDate);
    return sortBy === 'date-newest' ? -dateOrder : dateOrder;
  });

  const toggleGame = (game) => {
    setSelectedGames((current) => {
      const existingIndex = current.findIndex((selected) => selected.name === game.name);
      if (existingIndex >= 0) return current.filter((_, index) => index !== existingIndex);
      return [...current, game].slice(-2);
    });
  };

  const firstGame = selectedGames[0];
  const secondGame = selectedGames[1];
  const memoryDifference = firstGame && secondGame
    ? Math.abs(firstGame.sizeInKb - secondGame.sizeInKb)
    : 0;

  return (
    <div className="app-shell">
      <header>
        <nav className="fixed top-0 left-0 w-full z-50 py-[1.25rem] bg-[#06090f] transition-colors duration-200 ease-in-out">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between w-full m-0">
              <div className="w-1/2 md:w-1/4 text-left">
                <a href="https://jpwillenborg.com/#top" className="text-[1.75rem] font-bold text-white no-underline tracking-tight inline-block lowercase font-sans">
                  john<span className="text-[#00e5ff]">.</span>willenborg
                </a>
              </div>
              <div className="hidden md:flex md:w-1/2 justify-center items-center">
                <div className="flex gap-[2.75rem]">
                  <a href="https://jpwillenborg.com/#top" className="no-underline font-mono text-[#a0aec0] opacity-85 hover:text-[#00e5ff] hover:opacity-100 transition-all duration-200 text-[1.05rem] font-normal tracking-normal inline-block text-center">Overview</a>
                  <a href="https://jpwillenborg.com/#stacks" className="no-underline font-mono text-[#a0aec0] opacity-85 hover:text-[#00e5ff] hover:opacity-100 transition-all duration-200 text-[1.05rem] font-normal tracking-normal inline-block text-center">Tech Stack</a>
                  <a href="https://jpwillenborg.com/#apps" className="no-underline font-mono text-[#a0aec0] opacity-85 hover:text-[#00e5ff] hover:opacity-100 transition-all duration-200 text-[1.05rem] font-normal tracking-normal inline-block text-center">Web Apps</a>
                  <a href="https://jpwillenborg.com/#gamedev" className="no-underline font-mono text-[#a0aec0] opacity-85 hover:text-[#00e5ff] hover:opacity-100 transition-all duration-200 text-[1.05rem] font-normal tracking-normal inline-block text-center">Game Dev</a>
                  <a href="https://jpwillenborg.com/#modeling" className="no-underline font-mono text-[#a0aec0] opacity-85 hover:text-[#00e5ff] hover:opacity-100 transition-all duration-200 text-[1.05rem] font-normal tracking-normal inline-block text-center">3D Modeling</a>
                </div>
              </div>
              <div className="w-1/2 md:w-1/4 text-right flex justify-end items-center">
                <a href="https://jpwillenborg.com/#contact" className="hidden md:block bg-[#00e5ff] text-[#090d16] font-sans font-medium text-[0.85rem] tracking-[0.01em] rounded-[6px] px-[1.25rem] py-[0.45rem] shadow-[0_0_16px_4px_rgba(0,0,0,0.35)] no-underline hover:bg-[#66efff] transition-all duration-200">
                  Let's Connect
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="w-full box-border relative z-10 px-4 sm:px-6" style={{ paddingTop: 160, paddingBottom: 120 }}>
        <main role="main" className="max-w-[1024px] mx-auto w-full box-border">
          <div id="nes-matrix-wrapper" className="w-full relative pb-16">
            <div className="flex flex-col pb-6 mb-10">
              <div className="text-left w-full">
                <span className="portfolio-tag-line block mb-0 font-mono text-[1.1rem] text-[#00e5ff] font-normal">02 / Systems Insight</span>
                <h1 className="portfolio-main-title m-0 pt-1 font-sans text-[2.1rem] font-semibold text-white leading-[1.2]">
                  NES System Bus &amp; Memory Allocation Matrix
                </h1>
                <div className="text-[#a0aec0] text-[1.05rem] leading-[1.65] mt-10 mb-0 block w-full">
                  <p className="m-0 opacity-90">
                    Standard NES hardware was originally restricted to a small 64KB address space boundary - until custom Memory Management Controllers (MMCs) or Mappers were introduced. This tool helps visualize how mappers expanded the boundaries to house larger game maps and complex audio.
                  </p>
                  <p className="m-0 pt-8 opacity-90">
                    Select two games from the list to see how <span className="text-[#00e5ff] font-semibold">CARTRIDGE A</span> and <span className="text-[#a855f7] font-semibold">CARTRIDGE B</span> compare in terms of memory footprint.
                  </p>
                </div>
              </div>
            </div>

            {isLoading && <p className="text-[#a0aec0] text-sm font-mono" role="status">Loading game catalog...</p>}
            {!isLoading && error && <div className="bg-red-900/20 border border-red-500/40 p-4 rounded-[8px] text-red-400 mb-6 font-mono text-sm" role="alert">{error}</div>}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mt-10">
                <div className="col-span-1 flex flex-col h-full">
                  <div className="bg-[#111823] p-5 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-[#1a2333]/50 flex flex-col gap-3 mb-4 flex-shrink-0">
                    <span className="text-[1rem] font-mono font-bold text-[#a0aec0] uppercase tracking-wider block text-left">Bus Matrix Sorting Engine</span>
                    <div className="grid grid-cols-[1fr_auto] gap-[10px] w-full items-center">
                      <div className="relative w-full">
                        <select id="matrix-sort-dropdown" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="appearance-none bg-[#090d16] text-white text-[0.9rem] rounded-[8px] cursor-pointer block border border-[#1a2333] hover:border-[#00e5ff]/40 transition-colors h-10 w-full pl-[14px] pr-8 box-border">
                          {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[0.7rem] text-[#a0aec0]">&#9660;</div>
                      </div>
                      <button type="button" id="reset-sorting" onClick={() => setSelectedGames([])} className="bg-[#090d16] border border-[#1a2333] text-[#a0aec0] font-medium text-[0.85rem] rounded-[8px] px-4 flex items-center justify-center hover:bg-[#161f2d] hover:text-white hover:border-[#00e5ff]/40 active:scale-95 transition-all duration-150 transform flex-shrink-0 h-10">Reset</button>
                    </div>
                  </div>
                  <div className="flex-grow h-0 min-h-[300px] flex flex-col gap-3 overflow-y-auto pl-0 pr-3 portfolio-scrollbar" id="game-selection-list">
                    {sortedGames.map((game) => {
                      const selectedIndex = selectedGames.findIndex((selected) => selected.name === game.name);
                      const selectedBorder = selectedIndex === 0 ? 'border-[#00e5ff] bg-[#141d2a]' : selectedIndex === 1 ? 'border-[#a855f7] bg-[#141d2a]' : 'border-transparent';
                      return (
                        <button
                          type="button"
                          key={game.name}
                          aria-pressed={selectedIndex >= 0}
                          onClick={() => toggleGame(game)}
                          className={`w-full text-left bg-[#111823] rounded-[10px] p-4 flex items-center gap-4 transition-all duration-150 ease-out hover:bg-[#161f2d] active:scale-[0.98] transform cursor-pointer shadow-md flex-shrink-0 border-2 ${selectedBorder}`}
                        >
                          <div className="flex-shrink-0 w-14 h-auto min-h-[4rem] rounded-[3px] overflow-hidden flex items-center justify-center">
                            {game.coverUrl && <img src={game.coverUrl} alt="" loading="lazy" className="w-full h-auto max-h-16 object-contain opacity-80 hover:opacity-100 transition-opacity shadow-none" />}
                          </div>
                          <div className="flex-grow text-left min-w-0 w-full overflow-hidden">
                            <h2 className="text-white font-bold text-[1.05rem] m-0 tracking-tight leading-tight truncate block">{game.name}</h2>
                            <span className="text-[#a0aec0] text-[0.85rem] font-mono block pt-1 truncate">{game.mapperChip} | {game.releaseLabel}</span>
                          </div>
                          <div className="flex-shrink-0 text-right flex flex-col gap-1 items-end">
                            <span className="bg-black/40 px-2 py-0.5 rounded-[4px] font-mono text-[0.85rem] font-bold text-white">{game.sizeInKb} K</span>
                            <span className={`text-[0.75rem] font-mono font-bold tracking-wider uppercase ${selectedIndex === 0 ? 'text-[#00e5ff]' : selectedIndex === 1 ? 'text-[#a855f7]' : 'text-[#475569]'}`}>{selectedIndex < 0 ? 'Idle' : `Cart ${selectedIndex === 0 ? 'A' : 'B'}`}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex flex-col gap-6 h-full justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-shrink-0">
                    <SelectionSlot label="Cartridge A" game={firstGame} tone="cyan" />
                    <SelectionSlot label="Cartridge B" game={secondGame} tone="purple" />
                  </div>

                  <div id="grid-parent-card" className="bg-[#111823] p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-[#1a2333]/50 flex flex-col gap-4 flex-grow justify-between">
                    <div className="flex justify-between items-center border-b border-[#1a2333] pb-4 flex-shrink-0">
                      <h3 className="m-0 text-[1.25rem] font-bold text-white tracking-tight">Visual Size Comparison (In KB)</h3>
                      <div className="text-right font-mono font-bold text-[#a0aec0] text-[0.95rem]">Delta Resolution Gap: <span className="text-white font-extrabold">{memoryDifference} KB</span></div>
                    </div>
                    <div className="bg-[#090d16] rounded-[12px] p-6 flex flex-col gap-4 box-border flex-grow justify-between">
                      <div id="allocation-matrix-grid" className="grid-cols-24 gap-1.5 w-full justify-center p-1" role="img" aria-label={getMatrixDescription(firstGame, secondGame)}>
                        {Array.from({ length: MEMORY_BLOCKS }, (_, index) => {
                          const memoryKb = index + 1;
                          const sizeA = firstGame?.sizeInKb ?? 0;
                          const sizeB = secondGame?.sizeInKb ?? 0;
                          const isExactMatch = sizeA > 0 && sizeB > 0 && sizeA === sizeB;
                          let backgroundColor = '#111823';
                          let isOverlapping = false;

                          if (isExactMatch && memoryKb <= sizeA) {
                            isOverlapping = true;
                          } else if (memoryKb <= sizeA && memoryKb <= sizeB) {
                            backgroundColor = sizeA <= sizeB ? '#00e5ff' : '#a855f7';
                          } else if (memoryKb <= sizeA) {
                            backgroundColor = '#00e5ff';
                          } else if (memoryKb <= sizeB) {
                            backgroundColor = '#a855f7';
                          }

                          return <div key={memoryKb} className={`aspect-square rounded-[2px] transition-all duration-150 memory-block-node ${isOverlapping ? 'is-overlapping' : ''}`} title={`Memory Block ${memoryKb} (1 KB)`} style={{ backgroundColor: isOverlapping ? undefined : backgroundColor }} />;
                        })}
                      </div>
                      <div className="flex items-center justify-start gap-6 border-t border-[#1a2333] pt-4 font-mono text-sm text-[#a0aec0] flex-wrap flex-shrink-0">
                        <LegendItem color="#111823" label="Empty Bank" />
                        <LegendItem color="#00e5ff" label="Cart A Only" />
                        <LegendItem color="#a855f7" label="Cart B Only" />
                        <div className="flex items-center gap-2 relative">
                          <div className="w-3 h-3 bg-[#00e5ff] rounded-[2px] flex items-center justify-center relative" style={{ boxShadow: 'inset 0 0 0 3px #a855f7' }} />
                          <span>Exact Overlap</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="w-full border-t border-[#1a2333]/70 bg-[#090d16] py-[0.75rem] px-4 md:px-0 mt-auto leading-normal">
        <div className="max-w-[1024px] mx-auto flex flex-col sm:flex-row justify-between gap-2 font-mono text-[#a0aec0]/65 text-[1.05rem] tracking-[0.25px]">
          <div>Made with care © 2026 John Willenborg</div>
          <div>Built using React and standard utility classes.</div>
        </div>
      </footer>
    </div>
  );
}

function SelectionSlot({ label, game, tone }) {
  return (
    <div className={`bg-[#111823] p-5 rounded-[16px] border-l-[4px] ${tone === 'cyan' ? 'border-l-[#00e5ff]' : 'border-l-[#a855f7]'} border-t border-r border-b border-[#1a2333]/50 flex gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.25)] items-center min-w-0 overflow-hidden h-[115px]`} aria-label={label}>
      <div className="w-16 h-fit max-h-[88px] self-center rounded-[4px] overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#090d16]/50">
        {game?.coverUrl
          ? <img src={game.coverUrl} alt="" loading="lazy" className="max-w-full max-h-full object-contain shadow-none" />
          : <div className="w-full py-6 flex items-center justify-center text-[#a0aec0] text-[0.85rem] font-bold font-mono">[ {label.slice(-1)} ]</div>}
      </div>
      <div className="flex flex-col justify-center flex-grow min-w-0 w-full overflow-hidden">
        <span className={`text-[0.8rem] font-mono font-bold uppercase tracking-wider block leading-none ${tone === 'cyan' ? 'text-[#00e5ff]' : 'text-[#a855f7]'}`}>{label}</span>
        <strong className="text-white text-[1.15rem] tracking-tight font-bold leading-tight truncate block pt-1.5">{game?.name || 'Select A Title'}</strong>
        <span className="text-[#a0aec0] font-mono text-[0.85rem] block truncate leading-none pt-1">{game ? `${game.sizeInKb} KB | ${game.mapperChip} | ${game.releaseLabel}` : '00 KB | NROM | NONE'}</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: color }} /><span>{label}</span></div>;
}

function getMatrixDescription(firstGame, secondGame) {
  if (!firstGame && !secondGame) return 'Empty memory map. Select one or two games to compare cartridge capacity.';
  if (firstGame && !secondGame) return `Memory map showing ${firstGame.sizeInKb} kilobytes for ${firstGame.name}.`;
  if (!firstGame && secondGame) return `Memory map showing ${secondGame.sizeInKb} kilobytes for ${secondGame.name}.`;
  return `Memory map comparing ${firstGame.name} at ${firstGame.sizeInKb} kilobytes and ${secondGame.name} at ${secondGame.sizeInKb} kilobytes.`;
}
