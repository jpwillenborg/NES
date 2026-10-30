export default function LoadingCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] items-stretch mt-12 md:mt-6 lg:mt-[24px] max-[767px]:mt-2">
      <div className="col-span-1 md:col-span-3">
        <div 
          className="w-full bg-[#111823] rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex flex-col justify-start items-center h-[585px] md:h-[500px] lg:h-[530px] pt-[88px] md:pt-0 md:justify-center px-6 box-border"
          role="status"
        >
          <div className="flex flex-col gap-2 text-center select-none animate-pulse font-mono">
            <span className="text-[1.1rem] text-portfolio-cyan font-normal tracking-[0.05em]">
              Spinning Up Web Service
            </span>
            <span className="text-[0.9rem] text-[#a0aec0] font-normal tracking-[0.02em]">
              (Please allow up to 60 seconds)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
