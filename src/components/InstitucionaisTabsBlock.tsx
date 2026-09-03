import React, { useState } from 'react';
import { InstTab } from '../types';
import { monthlyBaseData, trainingTypesData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';

interface InstitucionaisTabsBlockProps {
  onVerDetalhes?: () => void;
}

/**
 * Exact copy of the "Left Card" block from InstitucionaisView (Indicadores T&D →
 * Treinamentos Institucionais) — same markup, classes and logic, unchanged, just
 * relocated so it can be added as a single widget on the Dashboard.
 */
export const InstitucionaisTabsBlock: React.FC<InstitucionaisTabsBlockProps> = ({ onVerDetalhes }) => {
  const baseData = monthlyBaseData;
  const tiposData = trainingTypesData;

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
                  ? 'bg-white text-[#004e4c] border-[#f47920]'
                  : 'bg-[#f6f8fa] text-[#6b7684] border-transparent hover:text-[#004e4c]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="p-5 pb-3.5">
        <div className="text-[15px] font-bold text-[#004e4c]">
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
                  <div className="text-[11.5px] font-bold text-[#004e4c] transition-transform group-hover:scale-110">
                    {m.realizado}
                  </div>
                  <div
                    className="w-full max-w-[40px] bg-[#004e4c] rounded-t-[3px] transition-all hover:bg-[#00706c]"
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
                    className="w-[13px] bg-[#cde3bb] rounded-t-[2px] transition-all group-hover:opacity-90"
                    style={{ height: `${hPrev}%` }}
                    title={`${m.mesAno} - Previsto: ${m.previsto}`}
                  ></div>
                  <div
                    className="w-[13px] bg-[#004e4c] rounded-t-[2px] transition-all group-hover:bg-[#00706c]"
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
                    <span className="font-semibold text-[#004e4c]">{t.nome}</span>
                    <span className="text-[#6b7684] text-xs">
                      {t.realizado} / {t.previsto} · {pct}%
                    </span>
                  </div>
                  <div className="h-[9px] bg-[#eef0f3] rounded-full relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#cde3bb] rounded-full"
                      style={{ width: `${wPrev}%` }}
                    ></div>
                    <div
                      className="absolute inset-y-0 left-0 bg-[#004e4c] rounded-full transition-all"
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
            <span className="w-2.5 h-2.5 bg-[#cde3bb] rounded-[2px]"></span>
            Previsto
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#004e4c] rounded-[2px]"></span>
            Realizado
          </span>
          <span className="flex-1"></span>
          <span className="text-[#8a93a0] text-xs">MêsAno</span>
        </div>

        {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} />}
      </div>
    </div>
  );
};
