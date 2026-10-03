export default function LoadingCard() {
  return (
    <div 
      className="w-full bg-[#111823] rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex items-center justify-center min-h-[140px] px-6 mt-10 box-border"
      role="status"
    >
      <span className="font-mono text-[1.1rem] text-portfolio-cyan font-normal tracking-[0.05em] text-center select-none animate-pulse">
        Loading game catalog...
      </span>
    </div>
  );
}
