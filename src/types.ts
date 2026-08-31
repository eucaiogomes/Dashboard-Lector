export type ViewType = 'Treinamentos Institucionais' | 'Treinamentos Internos' | 'Por Centro de Custo';

export type InstTab = 'Evolução Realizados' | 'Previsto x Realizado' | 'Tipo';

export type MetricaType = 'Qtd. Colab. Treinados' | 'Qtd. Horas Treinadas' | 'Qtd. Total Participantes' | 'Qtd. Treinamentos Internos';

export type AtivosTab = 'Ativos x Treinados' | 'Adesão';

export type RankTab = 'Rank Geral' | 'Rank Adesão';

export type CCTab = 'Adesão' | 'Esforço extra';

export interface MonthData {
  mesAno: string;
  previsto: number;
  realizado: number;
  ativos: number;
  colabTreinados: number;
  totalParticipantes: number;
  horasTreinadas: number;
  qtdTreinamentos: number;
}

export interface TrainingTypeData {
  nome: string;
  previsto: number;
  realizado: number;
}

export interface AgendaItem {
  mesAno: string;
  nome: string;
  tipo: string;
  status: 'REALIZADO' | 'AGENDADO' | 'NÃO REALIZADO';
}

export interface InternalTraining {
  nome: string;
  horasVal: number;
  horasFormatted: string;
}

export interface JobPositionData {
  cargo: string;
  participantes: number;
  ativos: number;
  treinados: number;
}

export interface CostCenterRow {
  area: string;
  gestor: string;
  supervisor: string;
  treinamento: string;
  aula: string;
  instrutor: string;
  inscritos: number;
  realizaram: number;
  turmasPlanejadas: number;
  turmasExcedentes: number;
}

export interface FilterItem {
  label: string;
  value: string;
  options: string[];
}

export interface KPIItem {
  label: string;
  value: string;
  unit: string;
  delta: string;
  barColor: string;
}
