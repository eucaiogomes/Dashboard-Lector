import React from 'react';
import { ViewType } from '../types';
import { FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

interface ViewHeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  exportStatus?: string;
}

export const ViewHeader: React.FC<ViewHeaderProps> = ({
  view,
  onViewChange,
  onExportExcel,
  onExportPdf,
  exportStatus
}) => {
  const views: ViewType[] = [
    'Treinamentos Institucionais',
    'Treinamentos Internos',
    'Por Centro de Custo'
  ];

  const viewDescriptions: Record<ViewType, string> = {
    'Treinamentos Institucionais':
      'Previsto, agendado e realizado dos treinamentos institucionais, com percentual de realização e agenda por MêsAno e tipo.',
    'Treinamentos Internos':
      'Participação, colaboradores treinados e horas treinadas dos eventos presenciais internos, com ativos x treinados e ranking por cargo.',
    'Por Centro de Custo':
      'Indicadores por área, gestor e supervisor: inscritos x realizados, adesão mensal, turmas planejadas x excedentes e esforço extra.'
  };

  return (
    <div className="no-print">
      {/* Top Breadcrumb & Action row */}
      <div className="pt-[22px] px-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[12.5px] text-[#6b7684] flex items-center gap-1.5 font-medium">
            <span>Minha Área</span>
            <span className="text-[#b6bdc7]">/</span>
            <span>Indicadores T&amp;D</span>
            <span className="text-[#b6bdc7]">/</span>
            <span className="text-[#eb6200] font-semibold">{view}</span>
          </div>
          <h1 className="mt-1.5 text-[26px] font-bold text-[#183a75] tracking-tight">
            {view}
          </h1>
          <p className="mt-1 text-[13.5px] text-[#6b7684] max-w-[820px] leading-relaxed">
            {viewDescriptions[view]}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {exportStatus && (
            <span className="text-xs text-[#183a75] bg-[#eef0f3] px-2.5 py-1 rounded flex items-center gap-1 font-medium animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0f6b3f]" />
              {exportStatus}
            </span>
          )}
          <button
            onClick={onExportExcel}
            className="h-[38px] px-4 border border-[#cfd6e0] bg-white hover:border-[#183a75] hover:bg-[#f6f8fa] text-[#183a75] text-[13px] font-semibold rounded-[4px] cursor-pointer transition-colors flex items-center gap-2 shadow-2xs active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0f6b3f]" />
            Exportar Excel
          </button>
          <button
            onClick={onExportPdf}
            className="h-[38px] px-4 border-none bg-[#eb6200] hover:bg-[#cf5700] text-white text-[13px] font-semibold rounded-[4px] cursor-pointer transition-colors flex items-center gap-2 shadow-2xs active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 text-white" />
            Gerar PDF
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="pt-4 px-7 flex gap-1 border-b border-[#dfe4ea]">
        {views.map(v => {
          const isActive = view === v;
          return (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`h-[38px] px-4.5 border-none bg-transparent text-[13.5px] font-semibold cursor-pointer transition-all ${
                isActive
                  ? 'text-[#183a75] border-b-[3px] border-[#eb6200] font-bold'
                  : 'text-[#6b7684] hover:text-[#183a75] border-b-[3px] border-transparent'
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
};
