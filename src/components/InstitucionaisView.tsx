import React, { useState } from 'react';
import { InstTab, MonthData, TrainingTypeData, AgendaItem } from '../types';

interface InstitucionaisViewProps {
  baseData: MonthData[];
  tiposData: TrainingTypeData[];
  agendaData: AgendaItem[];
}

export const InstitucionaisView: React.FC<InstitucionaisViewProps> = ({
  baseData,
  tiposData,
  agendaData
}) => {
  const [instTab, setInstTab] = useState<InstTab>('Evolução Realizados');

  const maxPrev = Math.max(...baseData.map(b => b.previsto));
  const maxReal = Math.max(...baseData.map(b => b.realizado));
  const maxTipo = Math.max(...tiposData.map(t => t.previsto));

  const chartTitle = {
    'Evolução Realizados': 'Evolução — Treinamentos Realizados',
    'Previsto x Realizado': 'Previsto x Realizado por MêsAno',
    'Tipo': 'Previsto x Realizado por Tipo'
  }[instTab];

  return (
    <div className="pt-3.5 px-7 grid grid-cols-1 xl:grid-cols-[1.25fr_1fr] gap-3.5 items-start">
      {/* Left Card: Evolution / Previsto x Realizado / Tipo */}
      <div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs overflow-hidden">
        {/* Subtabs header */}
        <div className="flex border-b border-[#e4e8ee] bg-[#fcfdfe]">
          {(['Evolução Realizados', 'Previsto x Realizado', 'Tipo'] as InstTab[]).map(tab => {
            const isActive = instTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setInstTab(tab)}
                className={`h-[42px] px-4.5 border-none text-[13px] font-semibold cursor-pointer transition-all border-b-2 ${
                  isActive
                    ? 'bg-white text-[#183a75] border-[#eb6200]'
                    : 'bg-[#f6f8fa] text-[#6b7684] border-transparent hover:text-[#183a75]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="p-5 pb-3.5">
          <div className="text-[15px] font-bold text-[#183a75]">
            {chartTitle}
          </div>

          {/* Subtab 1: Evolução Realizados */}
          {instTab === 'Evolução Realizados' && (
            <div className="mt-4 grid grid-cols-12 gap-2 items-end h-[190px]">
              {baseData.map((m, i) => {
                const heightPct = (m.realizado / maxReal) * 100;
                return (
                  <div
                    key={i}
                    className="h-full flex flex-col justify-end items-center gap-1.5 group"
                  >
                    <div className="text-[11.5px] font-bold text-[#183a75] transition-transform group-hover:scale-110">
                      {m.realizado}
                    </div>
                    <div
                      className="w-full max-w-[40px] bg-[#183a75] rounded-t-[3px] transition-all hover:bg-[#234d94]"
                      style={{ height: `${heightPct}%` }}
                      title={`${m.mesAno}: ${m.realizado} realizados`}
                    ></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Subtab 2: Previsto x Realizado */}
          {instTab === 'Previsto x Realizado' && (
            <div className="mt-4 grid grid-cols-12 gap-2 items-end h-[190px]">
              {baseData.map((m, i) => {
                const hPrev = (m.previsto / maxPrev) * 100;
                const hReal = (m.realizado / maxPrev) * 100;
                return (
                  <div
                    key={i}
                    className="h-full flex gap-1 items-end justify-center group"
                  >
                    <div
                      className="w-[13px] bg-[#cdd6e6] rounded-t-[2px] transition-all group-hover:opacity-90"
                      style={{ height: `${hPrev}%` }}
                      title={`${m.mesAno} - Previsto: ${m.previsto}`}
                    ></div>
                    <div
                      className="w-[13px] bg-[#183a75] rounded-t-[2px] transition-all group-hover:bg-[#234d94]"
                      style={{ height: `${hReal}%` }}
                      title={`${m.mesAno} - Realizado: ${m.realizado}`}
                    ></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Subtab 3: Tipo */}
          {instTab === 'Tipo' && (
            <div className="mt-4.5 flex flex-col gap-4 min-h-[190px] justify-center">
              {tiposData.map((t, i) => {
                const pct = Math.round((t.realizado / t.previsto) * 100);
                const wPrev = (t.previsto / maxTipo) * 100;
                const wReal = (t.realizado / maxTipo) * 100;
                return (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="font-semibold text-[#1f2733]">{t.nome}</span>
                      <span className="text-[#6b7684] text-xs">
                        {t.realizado} / {t.previsto} · {pct}%
                      </span>
                    </div>
                    <div className="h-[9px] bg-[#eef0f3] rounded-full relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-[#cdd6e6] rounded-full"
                        style={{ width: `${wPrev}%` }}
                      ></div>
                      <div
                        className="absolute inset-y-0 left-0 bg-[#eb6200] rounded-full transition-all"
                        style={{ width: `${wReal}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Month labels footer */}
          <div
            className="grid gap-2 mt-2 border-t border-[#e4e8ee] pt-2"
            style={{
              gridTemplateColumns: instTab === 'Tipo' ? '1fr' : 'repeat(12, minmax(0, 1fr))'
            }}
          >
            {instTab !== 'Tipo' &&
              baseData.map((m, i) => (
                <div key={i} className="text-center text-[11px] text-[#6b7684]">
                  {m.mesAno}
                </div>
              ))}
          </div>

          {/* Legend */}
          <div className="mt-2.5 flex items-center gap-4 text-[12.5px] text-[#4a5462]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#cdd6e6] rounded-[2px]"></span>
              Previsto
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#183a75] rounded-[2px]"></span>
              Realizado
            </span>
            <span className="flex-1"></span>
            <span className="text-[#8a93a0] text-xs">MêsAno</span>
          </div>
        </div>
      </div>

      {/* Right Column: % Evolution & Agenda */}
      <div className="flex flex-col gap-3.5">
        {/* Right Top Card: Evolução — Percentual de Realização */}
        <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-4 px-5 pb-3.5 shadow-2xs">
          <div className="text-[15px] font-bold text-[#183a75]">
            Evolução — Percentual de Realização
          </div>
          <div className="mt-3.5 grid grid-cols-12 gap-1.5 items-end h-[150px]">
            {baseData.map((m, i) => {
              const pct = Math.round((m.realizado / m.previsto) * 100);
              const barBg = pct >= 100 ? '#183a75' : pct >= 50 ? '#3f66a8' : '#9fb0cd';
              return (
                <div
                  key={i}
                  className="h-full flex flex-col justify-end items-center gap-1 group"
                >
                  <div className="text-[10.5px] font-bold text-[#eb6200] leading-tight">
                    {pct}%
                  </div>
                  <div
                    className="w-full max-w-[30px] rounded-t-[3px] transition-all hover:opacity-90"
                    style={{ height: `${pct}%`, background: barBg }}
                    title={`${m.mesAno}: ${pct}% realizado (${m.realizado}/${m.previsto})`}
                  ></div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-12 gap-1.5 mt-2 border-t border-[#e4e8ee] pt-2">
            {baseData.map((m, i) => (
              <div key={i} className="text-center text-[10.5px] text-[#6b7684]">
                {m.mesAno}
              </div>
            ))}
          </div>
        </div>

        {/* Right Bottom Card: Agenda */}
        <div className="bg-white border border-[#e4e8ee] rounded-[6px] pt-4 shadow-2xs overflow-hidden">
          <div className="px-5 text-[15px] font-bold text-[#183a75]">
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
                  <div className="text-[#1f2733] font-medium truncate pr-2" title={a.nome}>
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
          <div className="py-2.5 px-6 pb-3.5 text-[12.5px] text-[#6b7684] bg-white border-t border-[#f1f3f6]">
            Exibindo 7 de 50 treinamentos previstos
          </div>
        </div>
      </div>
    </div>
  );
};
