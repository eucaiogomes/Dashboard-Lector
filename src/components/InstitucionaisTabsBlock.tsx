import React, { useState } from 'react';
import { InstTab, MonthData, TrainingTypeData } from '../types';
import { monthlyBaseData, trainingTypesData } from '../data/mockData';
import { VerDetalhesButton } from './VerDetalhesButton';
import { ChartTypeSelector, ChartTypeOption } from './ChartTypeSelector';
import { UniversalChartRenderer } from './UniversalChartRenderer';

interface InstitucionaisTabsBlockProps {
  baseData?: MonthData[];
  tiposData?: TrainingTypeData[];
  onVerDetalhes?: () => void;
}

export const InstitucionaisTabsBlock: React.FC<InstitucionaisTabsBlockProps> = ({
  baseData = monthlyBaseData,
  tiposData = trainingTypesData,
  onVerDetalhes
}) => {
  const [instTab, setInstTab] = useState<InstTab>('Evolução Realizados');
  const [chartType, setChartType] = useState<ChartTypeOption>('Coluna');

  const chartTitle = {
    'Evolução Realizados': 'Evolução — Treinamentos Realizados',
    'Previsto x Realizado': 'Previsto x Realizado por MêsAno',
    'Tipo': 'Previsto x Realizado por Tipo'
  }[instTab];

  // Data mappings for UniversalChartRenderer
  const dataEvolucao = baseData.map(m => ({
    label: m.mesAno,
    value: m.realizado
  }));

  const dataPrevistoRealizado = baseData.map(m => ({
    label: m.mesAno,
    value: m.realizado,
    valueSecondary: m.previsto
  }));

  const dataTipo = tiposData.map(t => ({
    label: t.nome,
    value: t.realizado,
    valueSecondary: t.previsto
  }));

  return (
    <div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs h-full w-full flex flex-col justify-between overflow-hidden relative">
      {/* Subtabs header */}
      <div className="flex border-b border-[#e4e8ee] bg-[#fcfdfe] rounded-t-[6px] overflow-hidden shrink-0">
        {(['Evolução Realizados', 'Previsto x Realizado', 'Tipo'] as InstTab[]).map(tab => {
          const isActive = instTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setInstTab(tab);
                if (tab === 'Tipo' && chartType === 'Coluna') {
                  setChartType('Barra');
                }
              }}
              className={`h-[38px] px-3.5 sm:px-4 border-none text-[12px] sm:text-[12.5px] font-semibold cursor-pointer transition-all border-b-2 ${
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

      {/* Chart Body */}
      <div className="flex-1 min-h-0 flex flex-col p-3.5 sm:p-4 overflow-hidden">
        <div className="text-[13.5px] sm:text-[14.5px] font-bold text-[#004e4c] mb-1.5 shrink-0 truncate">
          {chartTitle}
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
          {instTab === 'Evolução Realizados' && (
            <UniversalChartRenderer
              data={dataEvolucao}
              chartType={chartType}
              legendPrimary="Realizados"
              primaryColor="#004e4c"
            />
          )}

          {instTab === 'Previsto x Realizado' && (
            <UniversalChartRenderer
              data={dataPrevistoRealizado}
              chartType={chartType}
              legendPrimary="Realizado"
              legendSecondary="Previsto"
              primaryColor="#004e4c"
              secondaryColor="#cde3bb"
            />
          )}

          {instTab === 'Tipo' && (
            <UniversalChartRenderer
              data={dataTipo}
              chartType={chartType}
              legendPrimary="Realizado"
              legendSecondary="Previsto"
              primaryColor="#004e4c"
              secondaryColor="#cde3bb"
            />
          )}
        </div>
      </div>

      {/* Card Footer: Tipo de gráfico + Ver Detalhes */}
      <div className="shrink-0 pt-2 border-t border-[#f0f3f7] px-4 pb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartTypeSelector
          currentType={chartType}
          onChangeType={setChartType}
          direction="up"
        />
        {onVerDetalhes && <VerDetalhesButton onClick={onVerDetalhes} className="mt-0" />}
      </div>
    </div>
  );
};
