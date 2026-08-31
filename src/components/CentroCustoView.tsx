import React, { useState } from 'react';
import { CCTab, CostCenterRow } from '../types';

interface CentroCustoViewProps {
  rowsData: CostCenterRow[];
}

export const CentroCustoView: React.FC<CentroCustoViewProps> = ({ rowsData }) => {
  const [ccTab, setCcTab] = useState<CCTab>('Adesão');
  const [currentPage, setCurrentPage] = useState(1);

  const porEsforco = ccTab === 'Esforço extra';

  const sortedRows = [...rowsData].sort((a, b) => {
    if (porEsforco) {
      return b.turmasExcedentes / b.turmasPlanejadas - a.turmasExcedentes / a.turmasPlanejadas;
    }
    return a.realizaram / a.inscritos - b.realizaram / b.inscritos;
  });

  const headers = [
    { label: 'Centro de custo', align: 'text-left' },
    { label: 'Gestor', align: 'text-left' },
    { label: 'Supervisor', align: 'text-left' },
    { label: 'Treinamento / Aula', align: 'text-left' },
    { label: 'Instrutor', align: 'text-left' },
    { label: 'Inscr.', align: 'text-center' },
    { label: 'Realiz.', align: 'text-center' },
    { label: 'Adesão', align: 'text-center' },
    { label: 'Esf. extra', align: 'text-center' }
  ];

  return (
    <div className="pt-3.5 px-7">
      <div className="bg-white border border-[#e4e8ee] rounded-[6px] pt-4 shadow-2xs overflow-hidden">
        {/* Table Title and Switcher */}
        <div className="px-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[15.5px] font-bold text-[#183a75]">
              Indicadores por centro de custo
            </div>
            <div className="text-[12.5px] text-[#8a93a0] mt-0.5 font-medium">
              {porEsforco
                ? 'Ordenado por esforço extra (turmas excedentes ÷ planejadas), maior primeiro'
                : 'Ordenado por adesão mensal (inscritos x realizados), menor primeiro'}
            </div>
          </div>

          <div className="flex gap-1.5">
            {(['Adesão', 'Esforço extra'] as CCTab[]).map(tab => {
              const isActive = ccTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setCcTab(tab)}
                  className={`h-[30px] px-3.5 text-[12.5px] font-semibold rounded-[4px] cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-[#183a75] text-white border-[#183a75]'
                      : 'bg-white text-[#4a5462] border-[#dfe4ea] hover:border-[#183a75]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Content */}
        <div className="mt-4 overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1.4fr_0.85fr_0.55fr_0.55fr_0.65fr_0.7fr] bg-[#f6f8fa] border-y border-[#e4e8ee] px-5 py-2.5 min-w-[960px]">
            {headers.map((h, i) => (
              <div
                key={i}
                className={`text-[11px] uppercase tracking-wider text-[#6b7684] font-bold px-1.5 ${h.align}`}
              >
                {h.label}
              </div>
            ))}
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#f1f3f6] min-w-[960px]">
            {sortedRows.map((r, i) => {
              const pct = Math.round((r.realizaram / r.inscritos) * 100);
              const esforco = Math.round((r.turmasExcedentes / r.turmasPlanejadas) * 100);

              const adesaoColor = porEsforco
                ? 'text-[#6b7684]'
                : pct >= 80
                ? 'text-[#0f6b3f]'
                : pct >= 60
                ? 'text-[#8a5a00]'
                : 'text-[#a32020]';

              const adesaoBg = porEsforco
                ? 'bg-transparent'
                : pct >= 80
                ? 'bg-[#e6f4ec]'
                : pct >= 60
                ? 'bg-[#fdf3e0]'
                : 'bg-[#fbeaea]';

              const esforcoColor = porEsforco
                ? esforco >= 40
                  ? 'text-[#a32020]'
                  : esforco > 0
                  ? 'text-[#8a5a00]'
                  : 'text-[#0f6b3f]'
                : 'text-[#4a5462]';

              return (
                <div
                  key={i}
                  className={`grid grid-cols-[1.2fr_1fr_1fr_1.4fr_0.85fr_0.55fr_0.55fr_0.65fr_0.7fr] px-5 py-3 hover:bg-[#fbfcfd] items-center transition-colors text-[12.5px] ${
                    i % 2 ? 'bg-[#fcfdfe]' : 'bg-white'
                  }`}
                >
                  <div className="font-semibold text-[#1f2733] px-1.5 truncate">
                    {r.area}
                  </div>
                  <div className="text-[#4a5462] px-1.5 truncate">{r.gestor}</div>
                  <div className="text-[#4a5462] px-1.5 truncate">{r.supervisor}</div>
                  <div className="text-[#4a5462] px-1.5">
                    <div className="font-medium text-[#1f2733] truncate">{r.treinamento}</div>
                    <div className="text-[11.5px] text-[#a3abb6] truncate">{r.aula}</div>
                  </div>
                  <div className="text-[#4a5462] px-1.5 truncate">{r.instrutor}</div>
                  <div className="text-[#4a5462] px-1.5 text-center font-medium">
                    {r.inscritos}
                  </div>
                  <div className="text-[#4a5462] px-1.5 text-center font-medium">
                    {r.realizaram}
                  </div>
                  <div className="px-1.5 text-center">
                    <span
                      className={`inline-block min-w-[50px] px-2 py-0.5 rounded-[3px] text-[12px] font-bold ${adesaoColor} ${adesaoBg}`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="px-1.5 text-center">
                    <div className={`font-bold ${esforcoColor}`}>
                      {esforco}%
                    </div>
                    <div className="text-[11.5px] font-normal text-[#a3abb6]">
                      {r.turmasPlanejadas} + {r.turmasExcedentes}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination & Footer */}
        <div className="p-3 px-6 pb-4 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-[#6b7684] border-t border-[#f1f3f6]">
          <div>Exibindo {sortedRows.length} de 38 centros de custo</div>
          <div className="flex gap-1.5 items-center">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-2.5 py-1 border border-[#dfe4ea] hover:border-[#183a75] rounded-[3px] bg-white cursor-pointer transition-colors"
            >
              ‹
            </button>
            {[1, 2, 3].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 rounded-[3px] font-semibold cursor-pointer transition-colors ${
                  currentPage === page
                    ? 'border border-[#183a75] bg-[#183a75] text-white'
                    : 'border border-[#dfe4ea] bg-white text-[#4a5462] hover:border-[#183a75]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              className="px-2.5 py-1 border border-[#dfe4ea] hover:border-[#183a75] rounded-[3px] bg-white cursor-pointer transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
