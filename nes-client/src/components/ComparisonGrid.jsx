const MEMORY_BLOCKS = 768;
const CYAN_HEX = 'var(--color-portfolio-cyan)';
const PURPLE_HEX = 'var(--color-portfolio-purple)';

export default function ComparisonGrid({ firstGame, secondGame, difference }) {
  return (
    <div className="col-span-1 md:col-span-2 flex flex-col gap-6 h-full justify-between">
      {/* Top Profile Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-shrink-0">
        <SelectionSlot label="Cartridge A" game={firstGame} tone="cyan" />
        <SelectionSlot label="Cartridge B" game={secondGame} tone="purple" />
      </div>

      {/* Layout Visualization Grid Matrix wrapper */}
      <div id="grid-parent-card" className="bg-[#111823] p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-[#1a2333]/50 flex flex-col gap-4 flex-grow justify-between">
        <div className="flex justify-between items-center border-b border-[#1a2333] pb-4 flex-shrink-0">
          <h3 className="m-0 text-[1.25rem] font-bold text-white tracking-tight">Visual Size Comparison (In KB)</h3>
          <div className="text-right font-mono font-bold text-[#a0aec0] text-[1.1rem]">
            Difference: <span className="text-white font-extrabold">{difference} KB</span>
          </div>
        </div>

        <div className="bg-[#090d16] rounded-[12px] p-6 flex flex-col gap-4 box-border flex-grow justify-between">
          <div 
            id="allocation-matrix-grid" 
            className="grid-cols-24 gap-1.5 w-full justify-center p-1" 
            role="img" 
            aria-label={getMatrixDescription(firstGame, secondGame)}
          >
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
                backgroundColor = sizeA <= sizeB ? CYAN_HEX : PURPLE_HEX;
              } else if (memoryKb <= sizeA) {
                backgroundColor = CYAN_HEX;
              } else if (memoryKb <= sizeB) {
                backgroundColor = PURPLE_HEX;
              }

              return (
                <div 
                  key={memoryKb} 
                  className={`aspect-square rounded-[2px] transition-all duration-150 memory-block-node ${isOverlapping ? 'is-overlapping' : ''}`} 
                  title={`Memory Block ${memoryKb} (1 KB)`} 
                  style={{ backgroundColor: isOverlapping ? undefined : backgroundColor }} 
                />
              );
            })}
          </div>

          {/* Grid Indicators Legend */}
          <div className="flex items-center justify-start gap-6 border-t border-[#1a2333] pt-4 font-mono text-sm text-[#a0aec0] flex-wrap flex-shrink-0">
            <LegendItem color="#111823" label="Empty Bank" />
            <LegendItem color={CYAN_HEX} label="Cart A Only" />
            <LegendItem color={PURPLE_HEX} label="Cart B Only" />
            <div className="flex items-center gap-2 relative">
              <div className="w-3 h-3 bg-portfolio-cyan rounded-[2px] flex items-center justify-center relative" style={{ boxShadow: `inset 0 0 0 3px ${PURPLE_HEX}` }} />
              <span>Exact Overlap</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectionSlot({ label, game, tone }) {
  return (
    <div className={`bg-[#111823] p-5 rounded-[16px] ${tone === 'cyan' ? 'border-l-portfolio-cyan' : 'border-l-portfolio-purple'} border-l-[4px] border-t border-r border-b border-[#1a2333]/50 flex gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.25)] items-center min-w-0 overflow-hidden h-[115px]`} aria-label={label}>
      
      {/* Visual Update: Changed from bg-[#090d16]/50 to portfolio configuration baseline token */}
      <div className="w-16 h-fit max-h-[88px] self-center rounded-[4px] overflow-hidden flex-shrink-0 flex items-center justify-center bg-portfolio-bg">
        {game?.coverUrl ? (
          <img src={game.coverUrl} alt="" loading="lazy" className="max-w-full max-h-full object-contain shadow-none" />
        ) : (
          <div className="w-full py-6 flex items-center justify-center text-[#a0aec0] text-[0.85rem] font-bold font-mono">[ {label.slice(-1)} ]</div>
        )}
      </div>

      <div className="flex flex-col justify-center flex-grow min-w-0 w-full overflow-hidden">
        <span className={`text-[0.85rem] font-mono font-bold uppercase tracking-wider block leading-none ${tone === 'cyan' ? 'text-portfolio-cyan' : 'text-portfolio-purple'}`}>{label}</span>
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
