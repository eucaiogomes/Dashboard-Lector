import React from 'react';
import { AgendaItem } from '../types';
import { agendaData as defaultAgendaData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';

interface AgendaBlockProps {
  agendaData?: AgendaItem[];
  onVerDetalhes?: () => void;
}

export const AgendaBlock: React.FC<AgendaBlockProps> = ({
  agendaData = defaultAgendaData,
  onVerDetalhes
}) => {
  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] pt-4 shadow-2xs overflow-hidden">
      <div className="px-5 text-[15px] font-bold text-[#004e4c]">
        Agenda
      </div>
      <div className="mt-3 grid grid-cols-[78px_1fr_135px_116px] bg-[#f6f8fa] border-y border-[#e4e8ee] px-5 py-2">
        <div className="text-[11px] uppercase tracking-wider text-[#6b7684] font-bold">
          MêsAno
        </div>
        <div className="text-[11px] uppercase tracking-wider text-[#6b7684] font-bold">
          Nome
        </div>
        <div className="text-[11px] uppercase tracking-wider text-[#6b7684] font-bold">
          Tipo
        </div>
        <div className="text-[11px] uppercase tracking-wider text-[#6b7684] font-bold text-center">
          Status
        </div>
      </div>
      <div className="divide-y divide-[#f1f3f6]">
        {agendaData.map((a, i) => {
          const statusStyle =
            a.status === 'REALIZADO'
              ? 'text-[#0f6b3f] bg-[#e6f4ec]'
              : a.status === 'AGENDADO'
              ? 'text-[#8a5a00] bg-[#fdf3e0]'
              : 'text-[#a32020] bg-[#fbeaea]';
          return (
            <div
              key={i}
              className="grid grid-cols-[78px_1fr_135px_116px] px-5 py-2.5 hover:bg-[#fbfcfd] items-center transition-colors text-[12.5px]"
            >
              <div className="text-[#4a5462] font-medium">{a.mesAno}</div>
              <div className="text-[#004e4c] font-medium truncate pr-2" title={a.nome}>
                {a.nome}
              </div>
              <div className="text-[12px] text-[#6b7684] truncate">{a.tipo}</div>
              <div className="text-center">
                <span
                  className={`inline-block px-2 py-0.5 rounded-[3px] text-[11px] font-bold tracking-wide ${statusStyle}`}
                >
                  {a.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="py-2.5 px-6 pb-3.5 flex items-center justify-between gap-3 text-[12.5px] text-[#6b7684] bg-white border-t border-[#f1f3f6]">
        <span>Exibindo {agendaData.length} de 50 treinamentos previstos</span>
        {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} className="mt-0" />}
      </div>
    </div>
  );
};
