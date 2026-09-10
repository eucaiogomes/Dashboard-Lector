import React from 'react';
import { MonthData, TrainingTypeData, AgendaItem } from '../types';
import { InstitucionaisTabsBlock } from './InstitucionaisTabsBlock';
import { InstitucionaisPercentualBlock } from './InstitucionaisPercentualBlock';
import { AgendaBlock } from './AgendaBlock';

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
  return (
    <div className="pt-3.5 px-7 grid grid-cols-1 xl:grid-cols-[1.25fr_1fr] gap-3.5 items-start">
      {/* Left Card: Evolution / Previsto x Realizado / Tipo with full ChartTypeSelector */}
      <InstitucionaisTabsBlock baseData={baseData} tiposData={tiposData} />

      {/* Right Column: % Evolution & Agenda */}
      <div className="flex flex-col gap-3.5">
        <InstitucionaisPercentualBlock baseData={baseData} />
        <AgendaBlock agendaData={agendaData} />
      </div>
    </div>
  );
};
