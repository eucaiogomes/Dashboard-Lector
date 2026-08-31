import React from 'react';

interface TurmasPlanejadasCardProps {
  planejadas?: number;
  excedentes?: number;
}

export const TurmasPlanejadasCard: React.FC<TurmasPlanejadasCardProps> = ({
  planejadas = 142,
  excedentes = 18
}) => {
  const esforcoPct = planejadas > 0 ? ((excedentes / planejadas) * 100).toFixed(1).replace('.', ',') : '0';

  return (
    <div className="pt-3.5 px-7">
      <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-3.5 px-5 shadow-2xs flex flex-wrap items-center justify-between gap-4 max-w-full">
        <div>
          <div className="text-[13px] font-bold text-[#183a75]">
            Turmas planejadas x excedentes
          </div>
          <div className="text-xs text-[#8a93a0] mt-0.5">
            Acompanhamento de esforço operacional e turmas extraordinárias
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div>
            <div className="text-[22px] font-bold text-[#183a75] leading-tight">
              {planejadas}
            </div>
            <div className="text-xs text-[#8a93a0] font-medium">
              Planejadas
            </div>
          </div>
          <div>
            <div className="text-[22px] font-bold text-[#eb6200] leading-tight">
              {excedentes}
            </div>
            <div className="text-xs text-[#8a93a0] font-medium">
              Excedentes
            </div>
          </div>
          <div>
            <div className="text-[22px] font-bold text-[#183a75] leading-tight">
              {esforcoPct}%
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

