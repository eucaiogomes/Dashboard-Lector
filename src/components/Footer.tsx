import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <>
      <footer className="no-print w-full bg-[#013330] border-t border-[#001312] py-5 px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white relative select-none">
        {/* Left: Social Media Icons */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center text-white transition-all hover:scale-105"
            title="YouTube"
          >
            <i className="icon-youtube text-[13px]"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center text-white transition-all hover:scale-105"
            title="X (Twitter)"
          >
            <i className="icon-twitter text-[13px]"></i>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center text-white transition-all hover:scale-105"
            title="Facebook"
          >
            <i className="icon-facebook text-[13px]"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center text-white transition-all hover:scale-105"
            title="Instagram"
          >
            <i className="icon-instagram text-[13px]"></i>
          </a>
        </div>

        {/* Center: Lector Brand + Social Connection */}
        <div className="flex flex-col items-center justify-center gap-0.5">
          <div className="flex items-center gap-2">
            {/* Lector Loop Symbol */}
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-5 h-5">
                <path d="M20,50 C20,30 40,20 60,30 C80,40 80,70 60,80 C40,90 20,70 20,50 Z" fill="none" stroke="#f47920" strokeWidth="12" />
                <path d="M50,20 C70,20 80,40 70,60 C60,80 30,80 20,60 C10,40 30,20 50,20 Z" fill="none" stroke="#ffffff" strokeWidth="12" />
              </svg>
            </div>
            <span className="text-[22px] font-black tracking-tight text-white">lector</span>
            <span className="text-[12px] font-medium text-white/80 ml-2">Conectar às Redes Sociais</span>
          </div>
        </div>

        {/* Right: Lector Live Logo */}
        <div className="flex items-center gap-1.5">
          <span className="text-[20px] font-extrabold tracking-tight text-white">Lector</span>
          <span className="text-[16px] font-semibold text-[#f47920] italic">live</span>
        </div>
      </footer>

      {/* Floating Mascot / Support Button */}
      <div className="fixed right-5 bottom-5 z-40">
        <button
          onClick={() => setShowSupportModal(true)}
          className="w-12 h-12 rounded-full bg-[#00995d] hover:bg-[#00824f] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 border-2 border-white"
          title="Fale Conosco / Livia Suporte"
        >
          <i className="icon-livia text-[22px]"></i>
        </button>
      </div>

      {/* Quick Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#cfd6e0] shadow-xl max-w-sm w-full p-5 text-[#1f2733]">
            <div className="flex items-center justify-between pb-3 border-b border-[#eef0f3]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#00995d] text-white flex items-center justify-center text-xs">
                  <i className="icon-livia text-[15px]"></i>
                </div>
                <h3 className="text-[15px] font-bold text-[#004e4c]">Suporte Unimed &amp; Livia</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-[#8a93a0] hover:text-[#004e4c] p-1"
              >
                <i className="icon-close-mini text-[13px]"></i>
              </button>
            </div>
            <div className="py-4 text-xs space-y-3 text-[#4a5462]">
              <p>
                Dúvidas ou dificuldades de acesso aos treinamentos da <strong>Unimed Volta Redonda</strong>?
              </p>
              <div className="p-3 bg-[#f8fafc] rounded border border-[#dfe4ea] space-y-1.5">
                <div className="font-semibold text-[#004e4c]">Setor de T&amp;D Unimed:</div>
                <div>Ramal: 4210 / 4215</div>
                <div>E-mail: treinamentos@unimedvr.com.br</div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-1.5 bg-[#004e4c] hover:bg-[#00706c] text-white text-xs font-semibold rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
