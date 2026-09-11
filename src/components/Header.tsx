import React, { useState } from 'react';

interface HeaderProps {
  currentDateStr?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <header className="no-print bg-[#013330] w-full select-none">
      {/* Top Utility Bar */}
      <div className="h-[46px] px-5 bg-[#013330] flex items-center justify-end border-b border-white/10 gap-4 text-white/70">
        {/* Quick Tools Icons */}
        <div className="flex items-center gap-3 border-r border-white/15 pr-4">
          <button className="text-white/70 hover:text-white p-1 transition-colors cursor-pointer" title="Portal Web">
            <i className="icon-web text-[17px]"></i>
          </button>
          <button className="text-white/70 hover:text-white p-1 transition-colors cursor-pointer" title="Acessibilidade">
            <i className="icon-accessibility text-[17px]"></i>
          </button>
          <button className="text-white/70 hover:text-white p-1 transition-colors cursor-pointer" title="Anotações & Diários">
            <i className="icon-book text-[17px]"></i>
          </button>
          <button className="text-white/70 hover:text-white p-1 transition-colors cursor-pointer" title="Materiais de Apoio">
            <i className="icon-documents text-[17px]"></i>
          </button>
          <button className="relative text-white/70 hover:text-white p-1 transition-colors cursor-pointer" title="Notificações">
            <i className="icon-bell text-[17px]"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#f47920] rounded-full ring-2 ring-[#013330]"></span>
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 px-2 py-1 border border-white/20 rounded-[4px] text-[12.5px] text-white/85 bg-white/10 cursor-pointer hover:border-white/40">
          <span>Português</span>
          <i className="icon-pointer-down text-[9px] text-white/60"></i>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="text-right leading-tight">
            <div className="text-[12.5px] font-bold text-white">Alex</div>
            <div className="text-[11px] font-bold text-[#eef7f4]">Administrador</div>
          </div>

          <div className="w-[34px] h-[34px] rounded-full overflow-hidden border-2 border-white/25 bg-[#00995d] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Alex"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="select-none">A</span>
          </div>

          <div className="flex items-center gap-1 text-[12px] font-bold text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
            <i className="icon-medal text-[#f47920] text-[13px]"></i>
            <span>10600 pts.</span>
          </div>
        </div>
      </div>

      {/* Hero Banner with Custom Image Banner and Carousel */}
      <div className="relative h-[135px] sm:h-[170px] md:h-[200px] lg:h-[230px] w-full flex items-center justify-center overflow-hidden border-b border-[#001312] bg-[#013330]">
        {/* Banner Background Image */}
        <img
          src="/banner-unimed.png"
          alt="Banner Unimed"
          className="w-full h-full object-cover object-center z-0"
        />

        {/* Module logo (top-left, over the banner) */}
        <div className="absolute left-4 sm:left-6 top-3 sm:top-4 z-20 leading-[1.05]">
          <div className="text-white font-bold text-[17px] sm:text-[20px] md:text-[22px] tracking-tight">Educação</div>
          <div className="text-white font-bold text-[17px] sm:text-[20px] md:text-[22px] tracking-tight">Corporativa</div>
        </div>

        {/* Alterar imagem button (bottom right) */}
        <div className="absolute right-3 sm:right-4 bottom-2 z-20">
          <button
            className="bg-black/40 hover:bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-[3px] flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer border border-white/20"
            title="Alterar banner do portal"
          >
            <i className="icon-camera text-[11px]"></i>
            <span className="hidden xs:inline">Alterar imagem</span>
          </button>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide(prev => (prev === 0 ? 2 : prev - 1))}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#004e4c] flex items-center justify-center shadow-md cursor-pointer transition-all z-20"
          title="Anterior"
        >
          <i className="icon-pointer-left text-[10px]"></i>
        </button>

        <button
          onClick={() => setCurrentSlide(prev => (prev === 2 ? 0 : prev + 1))}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#004e4c] flex items-center justify-center shadow-md cursor-pointer transition-all z-20"
          title="Próximo"
        >
          <i className="icon-pointer-right text-[10px]"></i>
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {[0, 1, 2].map(dot => (
            <button
              key={dot}
              onClick={() => setCurrentSlide(dot)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlide === dot ? 'bg-white scale-110 shadow-xs' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </header>
  );
};
