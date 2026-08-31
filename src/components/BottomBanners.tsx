import React from 'react';

export const BottomBanners: React.FC = () => {
  return (
    <div className="pt-3.5 px-7 pb-10">
      {/* Turmas planejadas x excedentes */}
      <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-4 px-4.5 shadow-2xs max-w-xl">
        <div className="text-[13px] font-bold text-[#183a75]">
          Turmas planejadas x excedentes
        </div>
        <div className="flex items-center gap-7 mt-2.5">
          <div>
            <div className="text-[22px] font-bold text-[#183a75] leading-tight">
              142
            </div>
            <div className="text-xs text-[#8a93a0] font-medium">
              Planejadas
            </div>
          </div>
          <div>
            <div className="text-[22px] font-bold text-[#eb6200] leading-tight">
              18
            </div>
            <div className="text-xs text-[#8a93a0] font-medium">
              Excedentes
            </div>
          </div>
          <div>
            <div className="text-[22px] font-bold text-[#183a75] leading-tight">
              12,7%
            </div>
            <div className="text-xs text-[#8a93a0] font-medium">
              Esforço extra
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
