const MEMORY_BLOCKS = 768;
const CYAN_HEX = 'var(--color-portfolio-cyan)';
const PURPLE_HEX = 'var(--color-portfolio-purple)';

export default function ComparisonGrid({ firstGame, secondGame, difference }) {
  return (
    <div className="flex flex-col gap-[24px] h-full justify-between mt-6 md:mt-0">
      <div className="grid grid-cols-2 gap-[16px] md:gap-[24px] flex-shrink-0 md:h-[115px]">
        <SelectionSlot label="Cartridge A" game={firstGame} tone="cyan" />
        <SelectionSlot label="Cartridge B" game={secondGame} tone="purple" />
      </div>

      <div id="grid-parent-card" className="bg-[#111823] p-4 lg:p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex flex-col gap-[24px] flex-grow justify-between max-w-full overflow-hidden">
        <div className="flex flex-row items-center justify-between w-full border-b border-[#1a2333] pb-3 lg:pb-4 flex-shrink-0 gap-2 whitespace-nowrap">
          <h3 className="m-0 text-[0.85rem] lg:text-[1.25rem] font-bold text-white tracking-normal lg:tracking-tight text-left">
            Size Comparison
          </h3>
          <div className="text-right font-mono font-bold text-[#a0aec0] text-[0.8rem] lg:text-[1.1rem] flex-shrink-0">
            Diff: <span className="text-white font-extrabold">{difference} KB</span>
          </div>
        </div>

        <div className="bg-[#090d16] rounded-[12px] p-3 lg:p-6 flex flex-col gap-4 box-border flex-grow justify-between overflow-x-hidden">
          <div 
            id="allocation-matrix-grid" 
            className="w-full justify-center p-0.5 max-[767px]:-mb-6 min-[1024px]:max-[1279px]:mb-5 xl:mb-3" 
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
                  className={`aspect-square rounded-[1px] md:rounded-[2px] transition-all duration-150 memory-block-node ${isOverlapping ? 'is-overlapping' : ''}`} 
                  title={`Memory Block ${memoryKb} (1 KB)`} 
                  style={{ backgroundColor: isOverlapping ? undefined : backgroundColor }} 
                />
              );
            })}
          </div>

          <div className="flex items-center justify-start gap-x-4 gap-y-2 border-t border-[#1a2333] pt-3 font-mono text-[10px] md:text-sm text-[#a0aec0] flex-wrap flex-shrink-0">
            <div className="max-md:order-2">
              <LegendItem color="#111823" label="Empty Bank" />
            </div>
            <div className="max-md:order-1">
              <LegendItem color={CYAN_HEX} label="Cart A Only" />
            </div>
            <div className="max-md:order-3">
              <LegendItem color={PURPLE_HEX} label="Cart B Only" />
            </div>
            <div className="flex items-center gap-1.5 relative max-md:order-4">
              <div className="w-2.5 h-2.5 bg-[#39ff14] rounded-[1px] md:rounded-[2px] flex items-center justify-center relative" />
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
    <div className={`bg-[#111823] p-2.5 pb-1.5 max-[767px]:p-2.5 max-[767px]:pb-1.5 md:py-3 md:px-5 rounded-[12px] md:rounded-[16px] ${tone === 'cyan' ? 'border-l-portfolio-cyan' : 'border-l-portfolio-purple'} border-l-[3px] md:border-l-[4px] border-t border-r border-b border-[#1a2333]/50 flex flex-col md:flex-row gap-1 md:gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.25)] items-center md:justify-start min-w-0 overflow-hidden h-[138px] md:h-full`} aria-label={label}>
      <div className="w-full text-center md:hidden flex-shrink-0 mb-0.5">
        <span className={`text-[0.6rem] font-mono font-bold uppercase tracking-wider block leading-none ${tone === 'cyan' ? 'text-portfolio-cyan' : 'text-portfolio-purple'}`}>{label.slice(-1) === 'A' ? 'Cart A' : 'Cart B'}</span>
      </div>

      <div className="h-16 md:h-[75px] aspect-[3/4] rounded-[4px] overflow-hidden flex-shrink-0 flex items-center justify-center bg-portfolio-bg">
        {game?.coverUrl ? (
          <img src={game.coverUrl} alt="" loading="lazy" className="w-full h-full object-cover shadow-none" />
        ) : (
          <div className="w-full py-4 md:py-6 flex items-center justify-center text-[#a0aec0] text-[0.65rem] md:text-[0.85rem] font-bold font-mono">[ {label.slice(-1)} ]</div>
        )}
      </div>

      <div className="flex flex-col justify-start items-center md:items-start text-center md:text-left flex-grow min-w-0 w-full overflow-hidden mt-1 md:mt-0 md:pl-1 md:justify-center md:gap-y-1">
        <span className={`hidden md:block text-[0.85rem] font-mono font-bold uppercase tracking-wider leading-none ${tone === 'cyan' ? 'text-portfolio-cyan' : 'text-portfolio-purple'}`}>{label}</span>
        <strong className="text-white text-[0.85rem] md:text-[1.15rem] tracking-tight font-bold truncate block w-full leading-normal">{game?.name || 'Select Title'}</strong>
        <span className="text-[#a0aec0]/85 font-mono text-[0.7rem] md:text-[0.85rem] block truncate leading-none">{game ? `${game.sizeInKb}K | ${game.mapperChip}` : '00K | NROM'}</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[1px] md:rounded-[2px]" style={{ backgroundColor: color }} /><span>{label}</span></div>;
}

function getMatrixDescription(firstGame, secondGame) {
  if (!firstGame && !secondGame) return 'Empty memory map. Select one or two games to compare cartridge capacity.';
  if (firstGame && !secondGame) return `Memory map showing ${firstGame.sizeInKb} kilobytes for ${firstGame.name}.`;
  if (!firstGame && secondGame) return `Memory map showing ${secondGame.sizeInKb} kilobytes for ${secondGame.name}.`;
  return `Memory map comparing ${firstGame.name} at ${firstGame.sizeInKb} kilobytes and ${secondGame.name} at ${secondGame.sizeInKb} kilobytes.`;
}
