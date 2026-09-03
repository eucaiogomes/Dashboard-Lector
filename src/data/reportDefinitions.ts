import { SPECIAL_WIDGET_IDS } from './dashboardCatalog';
import { monthlyBaseData, agendaData, internalTrainingsData, jobPositionsData, costCenterRowsData } from './mockData';
import { trainingCatalogData } from './trainingCatalogData';
import { turmasExecucaoData } from './turmasExecucaoData';
import { educacaoPermanenteData } from './educacaoPermanenteData';

export interface ReportColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  type?: 'text' | 'number' | 'status';
}

export interface ReportDefinition {
  title: string;
  subtitle: string;
  columns: ReportColumn[];
  rows: Record<string, string | number>[];
}

const pct = (num: number, den: number): number => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);

/** One detailed report per "bloco completo" widget — each report's columns and rows are
 * built from the same underlying data the widget itself renders, just at record level
 * instead of chart-aggregate level. Keyed by SPECIAL_WIDGET_IDS. */
export const REPORT_DEFINITIONS: Record<string, ReportDefinition> = {
  [SPECIAL_WIDGET_IDS.institucionaisTabs]: {
    title: 'Evolução — Treinamentos Realizados',
    subtitle: 'Relatório completo de turmas institucionais, por treinamento',
    columns: [
      { key: 'treinamento', label: 'Treinamento', type: 'text' },
      { key: 'autor', label: 'Autor', type: 'text' },
      { key: 'turma', label: 'Turma', type: 'text' },
      { key: 'cargaHoraria', label: 'Carga Horária', align: 'center', type: 'text' },
      { key: 'situacao', label: 'Situação', align: 'center', type: 'status' },
      { key: 'inicioInscricoes', label: 'Início das Inscrições', align: 'center', type: 'text' },
      { key: 'fimInscricoes', label: 'Fim das Inscrições', align: 'center', type: 'text' }
    ],
    rows: trainingCatalogData.map(r => ({ ...r }))
  },

  [SPECIAL_WIDGET_IDS.institucionaisPercentual]: {
    title: 'Evolução — Percentual de Realização',
    subtitle: 'Relatório mensal de previsto x realizado e percentual de realização',
    columns: [
      { key: 'mesAno', label: 'Mês/Ano', type: 'text' },
      { key: 'previsto', label: 'Previsto', align: 'right', type: 'number' },
      { key: 'realizado', label: 'Realizado', align: 'right', type: 'number' },
      { key: 'percentual', label: '% Realização', align: 'right', type: 'number' }
    ],
    rows: monthlyBaseData.map(m => ({
      mesAno: m.mesAno,
      previsto: m.previsto,
      realizado: m.realizado,
      percentual: pct(m.realizado, m.previsto)
    }))
  },

  [SPECIAL_WIDGET_IDS.institucionaisAgenda]: {
    title: 'Agenda de Treinamentos',
    subtitle: 'Relatório completo da agenda institucional, por status',
    columns: [
      { key: 'mesAno', label: 'Mês/Ano', type: 'text' },
      { key: 'nome', label: 'Treinamento', type: 'text' },
      { key: 'tipo', label: 'Tipo', type: 'text' },
      { key: 'status', label: 'Status', align: 'center', type: 'status' }
    ],
    rows: agendaData.map(a => ({ ...a }))
  },

  [SPECIAL_WIDGET_IDS.internosEvolucao]: {
    title: 'Evolução por Métrica — Internos',
    subtitle: 'Relatório mensal de colaboradores, horas, participantes e treinamentos internos',
    columns: [
      { key: 'mesAno', label: 'Mês/Ano', type: 'text' },
      { key: 'colabTreinados', label: 'Colab. Treinados', align: 'right', type: 'number' },
      { key: 'horasTreinadas', label: 'Horas Treinadas', align: 'right', type: 'number' },
      { key: 'totalParticipantes', label: 'Total Participantes', align: 'right', type: 'number' },
      { key: 'qtdTreinamentos', label: 'Treinamentos', align: 'right', type: 'number' }
    ],
    rows: monthlyBaseData.map(m => ({
      mesAno: m.mesAno,
      colabTreinados: m.colabTreinados,
      horasTreinadas: m.horasTreinadas,
      totalParticipantes: m.totalParticipantes,
      qtdTreinamentos: m.qtdTreinamentos
    }))
  },

  [SPECIAL_WIDGET_IDS.internosAtivosTreinados]: {
    title: 'Ativos x Treinados',
    subtitle: 'Relatório mensal de colaboradores ativos, treinados e adesão',
    columns: [
      { key: 'mesAno', label: 'Mês/Ano', type: 'text' },
      { key: 'ativos', label: 'Ativos', align: 'right', type: 'number' },
      { key: 'colabTreinados', label: 'Treinados', align: 'right', type: 'number' },
      { key: 'percentual', label: '% Adesão', align: 'right', type: 'number' }
    ],
    rows: monthlyBaseData.slice(-6).map(m => ({
      mesAno: m.mesAno,
      ativos: m.ativos,
      colabTreinados: m.colabTreinados,
      percentual: pct(m.colabTreinados, m.ativos)
    }))
  },

  [SPECIAL_WIDGET_IDS.internosTreinamentosHoras]: {
    title: 'Treinamentos por Horas — Internos',
    subtitle: 'Relatório de treinamentos internos por carga horária aplicada',
    columns: [
      { key: 'nome', label: 'Treinamento', type: 'text' },
      { key: 'horasFormatted', label: 'Horas Aplicadas', align: 'right', type: 'text' }
    ],
    rows: internalTrainingsData.map(t => ({ nome: t.nome, horasFormatted: t.horasFormatted }))
  },

  [SPECIAL_WIDGET_IDS.internosRankingCargo]: {
    title: 'Ranking por Cargo — Internos',
    subtitle: 'Relatório de participação e adesão por cargo',
    columns: [
      { key: 'cargo', label: 'Cargo', type: 'text' },
      { key: 'participantes', label: 'Participantes', align: 'right', type: 'number' },
      { key: 'ativos', label: 'Ativos', align: 'right', type: 'number' },
      { key: 'treinados', label: 'Treinados', align: 'right', type: 'number' },
      { key: 'percentual', label: '% Adesão', align: 'right', type: 'number' }
    ],
    rows: jobPositionsData.map(j => ({
      cargo: j.cargo,
      participantes: j.participantes,
      ativos: j.ativos,
      treinados: j.treinados,
      percentual: pct(j.treinados, j.ativos)
    }))
  },

  [SPECIAL_WIDGET_IDS.centroCustoTabela]: {
    title: 'Indicadores por Centro de Custo',
    subtitle: 'Relatório completo de inscritos, realizados e turmas por centro de custo',
    columns: [
      { key: 'area', label: 'Centro de Custo', type: 'text' },
      { key: 'gestor', label: 'Gestor', type: 'text' },
      { key: 'supervisor', label: 'Supervisor', type: 'text' },
      { key: 'treinamento', label: 'Treinamento', type: 'text' },
      { key: 'instrutor', label: 'Instrutor', type: 'text' },
      { key: 'inscritos', label: 'Inscritos', align: 'right', type: 'number' },
      { key: 'realizaram', label: 'Realizaram', align: 'right', type: 'number' },
      { key: 'percentual', label: '% Adesão', align: 'right', type: 'number' }
    ],
    rows: costCenterRowsData.map(r => ({
      area: r.area,
      gestor: r.gestor,
      supervisor: r.supervisor,
      treinamento: r.treinamento,
      instrutor: r.instrutor,
      inscritos: r.inscritos,
      realizaram: r.realizaram,
      percentual: pct(r.realizaram, r.inscritos)
    }))
  },

  [SPECIAL_WIDGET_IDS.turmasExecucao]: {
    title: 'Execução das Turmas por Período',
    subtitle: 'Relatório mensal de turmas previstas por status de execução',
    columns: [
      { key: 'mesAno', label: 'Mês/Ano', type: 'text' },
      { key: 'previsto', label: 'Previsto', align: 'right', type: 'number' },
      { key: 'realizado', label: 'Realizado', align: 'right', type: 'number' },
      { key: 'agendado', label: 'Agendado', align: 'right', type: 'number' },
      { key: 'naoRealizado', label: 'Não Realizado', align: 'right', type: 'number' },
      { key: 'percentual', label: '% Realização', align: 'right', type: 'number' }
    ],
    rows: turmasExecucaoData.map(t => ({
      mesAno: t.mesAno,
      previsto: t.previsto,
      realizado: t.realizado,
      agendado: t.agendado,
      naoRealizado: t.naoRealizado,
      percentual: pct(t.realizado, t.previsto)
    }))
  },

  [SPECIAL_WIDGET_IDS.educacaoPermanente]: {
    title: 'Relatório de Educação Permanente',
    subtitle: 'Relatório completo por setor: colaboradores, adesão, turmas e esforço extra',
    columns: [
      { key: 'setor', label: 'Setor', type: 'text' },
      { key: 'supervisores', label: 'Supervisor', type: 'text' },
      { key: 'periodo', label: 'Período', type: 'text' },
      { key: 'tema', label: 'Tema', type: 'text' },
      { key: 'instrutores', label: 'Instrutores', type: 'text' },
      { key: 'elegiveis', label: 'Elegíveis', align: 'right', type: 'number' },
      { key: 'treinados', label: 'Treinados', align: 'right', type: 'number' },
      { key: 'adesao', label: '% Adesão', align: 'right', type: 'number' },
      { key: 'meta', label: '% Meta', align: 'right', type: 'number' },
      { key: 'planejadas', label: 'Turmas Planej.', align: 'right', type: 'number' },
      { key: 'executadas', label: 'Turmas Exec.', align: 'right', type: 'number' },
      { key: 'esforcoExtra', label: '% Esforço Extra', align: 'right', type: 'number' }
    ],
    rows: educacaoPermanenteData.map(r => ({
      setor: r.setor,
      supervisores: r.supervisores,
      periodo: r.periodo,
      tema: r.tema,
      instrutores: r.instrutores,
      elegiveis: r.colaboradoresElegiveis,
      treinados: r.colaboradoresTreinados,
      adesao: r.adesaoMensalPct,
      meta: r.adesaoMetaPct,
      planejadas: r.turmasPlanejadas,
      executadas: r.turmasExecutadas,
      esforcoExtra: r.esforcoExtraPct
    }))
  }
};

