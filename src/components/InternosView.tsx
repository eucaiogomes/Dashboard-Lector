import React from 'react';
import { MonthData, InternalTraining, JobPositionData } from '../types';
import { InternosEvolucaoBlock } from './InternosEvolucaoBlock';
import { AtivosTreinadosBlock } from './AtivosTreinadosBlock';
import { TreinamentosRankingBlock } from './TreinamentosRankingBlock';
import { RankingCargoBlock } from './RankingCargoBlock';

interface InternosViewProps {
  baseData: MonthData[];
  treinamentosData: InternalTraining[];
  cargosData: JobPositionData[];
}

export const InternosView: React.FC<InternosViewProps> = ({
  baseData,
  treinamentosData,
  cargosData
}) => {
  return (
    <div className="pt-3.5 px-7 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_1fr] gap-3.5 items-start">
      {/* 1. Left Column: Evolução por Métrica */}
      <InternosEvolucaoBlock baseData={baseData} />

      {/* 2. Middle Column: Ativos x Treinados + Treinamentos por Horas */}
      <div className="flex flex-col gap-3.5">
        <AtivosTreinadosBlock baseData={baseData} />
        <TreinamentosRankingBlock treinamentosData={treinamentosData} />
      </div>

      {/* 3. Right Column: Ranking por Cargo */}
      <RankingCargoBlock cargosData={cargosData} />
    </div>
  );
};
