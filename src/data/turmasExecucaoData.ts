export interface TurmasExecucaoRecord {
  mesAno: string;
  previsto: number;
  realizado: number;
  agendado: number;
  naoRealizado: number;
}

// Each record: realizado + agendado + naoRealizado === previsto.
export const turmasExecucaoData: TurmasExecucaoRecord[] = [
  { mesAno: 'Setembro/2025', previsto: 78, realizado: 52, agendado: 9, naoRealizado: 17 },
  { mesAno: 'Outubro/2025', previsto: 82, realizado: 61, agendado: 10, naoRealizado: 11 },
  { mesAno: 'Novembro/2025', previsto: 75, realizado: 55, agendado: 8, naoRealizado: 12 },
  { mesAno: 'Dezembro/2025', previsto: 64, realizado: 38, agendado: 6, naoRealizado: 20 },
  { mesAno: 'Janeiro/2026', previsto: 88, realizado: 70, agendado: 11, naoRealizado: 7 },
  { mesAno: 'Fevereiro/2026', previsto: 80, realizado: 58, agendado: 13, naoRealizado: 9 },
  { mesAno: 'Março/2026', previsto: 85, realizado: 62, agendado: 12, naoRealizado: 11 },
  { mesAno: 'Abril/2026', previsto: 79, realizado: 54, agendado: 10, naoRealizado: 15 },
  { mesAno: 'Maio/2026', previsto: 83, realizado: 57, agendado: 14, naoRealizado: 12 },
  { mesAno: 'Junho/2026', previsto: 76, realizado: 49, agendado: 9, naoRealizado: 18 },
  { mesAno: 'Julho/2026', previsto: 87, realizado: 63, agendado: 11, naoRealizado: 13 },
  { mesAno: 'Agosto/2026', previsto: 91, realizado: 64, agendado: 12, naoRealizado: 15 }
];
