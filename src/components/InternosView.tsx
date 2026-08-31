import React, { useState } from 'react';
import { MetricaType, AtivosTab, RankTab, MonthData, InternalTraining, JobPositionData } from '../types';

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
  const [metrica, setMetrica] = useState<MetricaType>('Qtd. Colab. Treinados');
  const [ativosTab, setAtivosTab] = useState<AtivosTab>('Ativos x Treinados');
  const [rankTab, setRankTab] = useState<RankTab>('Rank Geral');

  const metricas: MetricaType[] = [
    'Qtd. Colab. Treinados',
    'Qtd. Horas Treinadas',
    'Qtd. Total Participantes',
    'Qtd. Treinamentos Internos'
  ];

  const getMetricValue = (m: MonthData): number => {
    switch (metrica) {
      case 'Qtd. Colab. Treinados':
        return m.colabTreinados;
      case 'Qtd. Horas Treinadas':
        return m.horasTreinadas;
      case 'Qtd. Total Participantes':
        return m.totalParticipantes;
      case 'Qtd. Treinamentos Internos':
        return m.qtdTreinamentos;
    }
  };

  const metricValues = baseData.map(getMetricValue);
  const maxMetric = Math.max(...metricValues);

  // Last 6 months for Ativos x Treinados
  const last6 = baseData.slice(-6);
  const porAdesao = ativosTab === 'Adesão';

  // Cargos sorting
  const porRankAdesao = rankTab === 'Rank Adesão';
  const cargosSorted = [...cargosData].sort((a, b) =>
    porRankAdesao
      ? b.treinados / b.ativos - a.treinados / a.ativos
      : b.participantes - a.participantes
  );
  const maxPart = Math.max(...cargosData.map(c => c.participantes));
  const maxHours = 2799;

  return (
    <div className="pt-3.5 px-7 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_1fr] gap-3.5 items-start">
      {/* 1. Left Card: Evolution by Metric */}
      <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-4 px-5 pb-3.5 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div className="text-[15px] font-bold text-[#183a75]">
            Evolução
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {metricas.map(m => {
              const isActive = metrica === m;
              return (
                <button
                  key={m}
                  onClick={() => setMetrica(m)}
                  className={`h-[26px] px-2.5 text-[11.5px] font-semibold rounded-[3px] cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-[#183a75] text-white border-[#183a75]'
                      : 'bg-white text-[#4a5462] border-[#dfe4ea] hover:border-[#183a75]'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-[12.5px] text-[#8a93a0] mt-0.5 font-medium">
          {metrica} por MêsAno
        </div>

        <div className="mt-3.5 grid grid-cols-12 gap-1.5 items-end h-[200px]">
          {baseData.map((m, i) => {
            const val = getMetricValue(m);
            const heightPct = (val / maxMetric) * 100;
            const labelStr =
              val >= 1000
                ? (val / 1000).toFixed(1).replace('.', ',') + 'k'
                : String(val);

            return (
              <div
                key={i}
                className="h-full flex flex-col justify-end items-center gap-1 group"
              >
                <div className="text-[10.5px] font-bold text-[#183a75] leading-tight group-hover:scale-105 transition-transform">
                  {labelStr}
                </div>
                <div
                  className="w-full max-w-[34px] bg-[#183a75] rounded-t-[3px] transition-all group-hover:bg-[#234d94]"
                  style={{ height: `${heightPct}%` }}
                  title={`${m.mesAno}: ${val.toLocaleString('pt-BR')}`}
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

      {/* 2. Middle Column: Ativos x Treinados & Treinamentos ranking */}
      <div className="flex flex-col gap-3.5">
        {/* Ativos x Treinados Card */}
        <div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs overflow-hidden">
          <div className="flex border-b border-[#e4e8ee] bg-[#fcfdfe]">
            {(['Ativos x Treinados', 'Adesão'] as AtivosTab[]).map(tab => {
              const isActive = ativosTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setAtivosTab(tab)}
                  className={`h-10 px-4 border-none text-[13px] font-semibold cursor-pointer transition-all border-b-2 ${
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

          <div className="p-3.5 px-4.5 pb-3">
            <div className="text-[12.5px] text-[#8a93a0] font-medium">
              {porAdesao
                ? 'Percentual de colaboradores ativos treinados por mês'
                : 'Colaboradores ativos e treinados por mês'}
            </div>

            <div className="mt-3 grid grid-cols-6 gap-3 items-end h-[168px]">
              {last6.map((s, i) => {
                const pct = Math.round((s.colabTreinados / s.ativos) * 100);
                const hAtivos = porAdesao ? 100 : (s.ativos / 1300) * 100;
                const hTreinados = (s.colabTreinados / s.ativos) * 100;

                return (
                  <div
                    key={i}
                    className="h-full flex flex-col justify-end items-center gap-1 group"
                  >
                    <div className="text-[11.5px] font-bold text-[#eb6200]">
                      {porAdesao ? `${pct}%` : String(s.colabTreinados)}
                    </div>
                    <div
                      className="w-full max-w-[52px] bg-[#cdd6e6] rounded-t-[3px] relative"
                      style={{ height: `${hAtivos}%` }}
                      title={`${s.mesAno} - Ativos: ${s.ativos}`}
                    >
                      <div
                        className="absolute inset-x-0 bottom-0 bg-[#183a75] rounded-t-[3px] transition-all group-hover:bg-[#234d94]"
                        style={{ height: `${hTreinados}%` }}
                        title={`${s.mesAno} - Treinados: ${s.colabTreinados} (${pct}%)`}
                      ></div>
                    </div>
                    <div className="text-[11px] text-[#6b7684] mt-0.5">{s.mesAno}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-center gap-4 text-xs text-[#4a5462]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#cdd6e6] rounded-[2px]"></span>
                Ativos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#183a75] rounded-[2px]"></span>
                Treinados
              </span>
            </div>
          </div>
        </div>

        {/* Treinamentos Ranking Card */}
        <div className="bg-white border border-[#e4e8ee] rounded-[6px] p-4 px-4.5 pb-3.5 shadow-2xs">
          <div className="text-[15px] font-bold text-[#183a75]">
            Treinamentos
          </div>
          <div className="text-[12.5px] text-[#8a93a0] mt-0.5 font-medium">
            Horas treinadas por treinamento interno
          </div>

          <div className="mt-3.5 flex flex-col gap-2.5">
            {treinamentosData.map((t, i) => {
              const widthPct = (t.horasVal / maxHours) * 100;
              return (
                <div
                  key={i}
                  className="grid grid-cols-[minmax(96px,152px)_minmax(50px,1fr)_auto] gap-2.5 items-center"
                >
                  <div
                    className="text-[12.5px] text-[#1f2733] font-medium truncate"
                    title={t.nome}
                  >
                    {t.nome}
                  </div>
                  <div className="h-4 bg-[#f4f6f9] rounded-[3px] overflow-hidden">
                    <div
                      className="h-4 bg-[#183a75] rounded-[3px] transition-all hover:bg-[#234d94]"
                      style={{ width: `${widthPct}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-[#6b7684] whitespace-nowrap font-mono font-medium">
                    {t.horasFormatted}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Right Card: Ranking por Cargo */}
      <div className="bg-white border border-[#e4e8ee] rounded-[6px] shadow-2xs overflow-hidden">
        <div className="flex border-b border-[#e4e8ee] bg-[#fcfdfe]">
          {(['Rank Geral', 'Rank Adesão'] as RankTab[]).map(tab => {
            const isActive = rankTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setRankTab(tab)}
                className={`h-10 px-4 border-none text-[13px] font-semibold cursor-pointer transition-all border-b-2 ${
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

        <div className="p-3.5 px-4.5 pb-4">
          <div className="text-[12.5px] text-[#8a93a0] font-medium">
            {porRankAdesao
              ? 'Cargo por percentual de ativos com adesão'
              : 'Cargo por quantidade total de participantes'}
          </div>

          <div className="mt-3.5 flex flex-col gap-2.5">
            {cargosSorted.map((c, i) => {
              const pct = Math.round((c.treinados / c.ativos) * 100);
              const wBase = porRankAdesao ? '100%' : `${(c.participantes / maxPart) * 100}%`;
              const wFore = porRankAdesao ? `${pct}%` : `${(c.participantes / maxPart) * 100}%`;
              const legenda = porRankAdesao
                ? `${c.treinados}/${c.ativos} · ${pct}%`
                : c.participantes.toLocaleString('pt-BR');

              return (
                <div
                  key={i}
                  className="grid grid-cols-[minmax(104px,158px)_minmax(50px,1fr)_auto] gap-2.5 items-center"
                >
                  <div
                    className="text-[12.5px] text-[#1f2733] font-medium truncate"
                    title={c.cargo}
                  >
                    {c.cargo}
                  </div>
                  <div className="h-[17px] bg-[#f4f6f9] rounded-[3px] relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#dbe2ee] rounded-[3px]"
                      style={{ width: wBase }}
                    ></div>
                    <div
                      className="absolute inset-y-0 left-0 bg-[#183a75] rounded-[3px] transition-all"
                      style={{ width: wFore }}
                    ></div>
                  </div>
                  <div className="text-xs text-[#6b7684] whitespace-nowrap font-medium">
                    {legenda}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
