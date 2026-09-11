export interface ChartDataPoint {
  label: string;
  value: number;
  valueSecondary?: number;
  color?: string;
  extra?: string;
}

export type SupportedChartType = 'Barra' | 'Coluna' | 'Pizza' | 'Linha' | 'Tabela';

export const STANDARD_CHART_TYPES: SupportedChartType[] = ['Coluna', 'Barra', 'Linha', 'Pizza'];

export const DEFAULT_TRAINING_CATEGORIES = [
  'Todos os Treinamentos',
  'Cursos Obrigatórios (NRs)',
  'Trilhas de Aprendizagem',
  'Treinamentos Institucionais',
  'Treinamentos Internos',
  'Comportamentais'
];

export interface DashboardCardItem {
  id: string;
  catalogId: string;
  title: string;
  subtitle?: string;
  group: string;
  chartType: SupportedChartType;
  allowedTypes: SupportedChartType[];
  selectedCategory: string;
  availableCategories: string[];
  maxScale?: number;
  ticks?: number[];
  unit?: string;
  data: ChartDataPoint[];
  meta?: {
    legendPrimary?: string;
    legendSecondary?: string;
  };
}

export interface CatalogChartDef {
  id: string;
  title: string;
  subtitle: string;
  group: string;
  description: string;
  icon: string;
  defaultType: SupportedChartType;
  allowedTypes: SupportedChartType[];
  unit?: string;
  categories?: string[];
  /** Listed in the catalog for roadmap visibility, but not yet built — AddChartModal shows
   * it disabled with an "Em breve" badge instead of letting it be added to the Dashboard. */
  comingSoon?: boolean;
  /** Identifies widgets requested specifically by the client (Unimed T&D / Curso presencial). */
  isClientWidget?: boolean;
  generateData: (filterContext?: { period?: string; category?: string }) => {
    data: ChartDataPoint[];
    maxScale: number;
    ticks: number[];
    meta?: { legendPrimary?: string; legendSecondary?: string };
  };
}

export const CHART_GROUPS = [
  {
    id: 'ted_indicadores',
    name: 'Indicadores de T&D',
    icon: 'icon-performance',
    color: '#f47920',
    description: 'Todos os indicadores de Treinamento e Desenvolvimento (Institucionais, Internos e Centro de Custo)'
  },
  {
    id: 'matriculas',
    name: 'Matrículas',
    icon: 'icon-courses',
    color: '#00995d',
    description: 'Volume e status das matrículas dos colaboradores nos treinamentos'
  },
  {
    id: 'indices_desempenho',
    name: 'Índices e Desempenho',
    icon: 'icon-performance',
    color: '#00995d',
    description: 'Indicadores de aproveitamento, adesão, evasão e satisfação'
  },
  {
    id: 'engajamento_consumo',
    name: 'Engajamento e Consumo',
    icon: 'icon-clock',
    color: '#00995d',
    description: 'Tempo de navegação, cursos mais/menos procurados e consumo de horas'
  }
];

/** Catalog ids of the "special" widgets — each renders its own bespoke component (an exact
 * copy of a block from the Indicadores T&D tabs) instead of going through the generic chart
 * renderer. DashboardView looks up card.catalogId against these to branch rendering. */
export const SPECIAL_WIDGET_IDS = {
  institucionaisKpis: 'inst_kpis_summary',
  institucionaisTabs: 'inst_painel_tabs',
  institucionaisPercentual: 'inst_percentual_realizacao',
  institucionaisAgenda: 'inst_agenda',
  internosKpis: 'internos_kpis_summary',
  internosEvolucao: 'internos_evolucao_metrica',
  internosAtivosTreinados: 'internos_ativos_treinados',
  internosTreinamentosHoras: 'internos_treinamentos_horas',
  internosRankingCargo: 'internos_ranking_cargo',
  centroCustoTabela: 'centro_custo_tabela',
  turmasExecucao: 'turmas_execucao_periodo',
  educacaoPermanente: 'educacao_permanente'
} as const;

/** Stub generateData shared by every special widget — their real data/rendering lives in
 * their own component, so this is never actually used by DashboardChartRenderer. */
const specialWidgetStub = () => ({ data: [], maxScale: 0, ticks: [] });

export const CHART_CATALOG: CatalogChartDef[] = [
  // Resumo Geral de Treinamentos Institucionais (KPIs + Turmas)
  {
    id: SPECIAL_WIDGET_IDS.institucionaisKpis,
    title: 'Resumo Geral de Treinamentos Institucionais (KPIs)',
    subtitle: 'Previsto, agendado, realizado, pendente, adesão e turmas',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Faixa de KPIs com Total Previsto, Agendado, Realizado, Não Realizado, % Realização e Turmas Planejadas x Excedentes.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    isClientWidget: true,
    generateData: specialWidgetStub
  },
  // Resumo Geral de Treinamentos Internos (KPIs + Turmas)
  {
    id: SPECIAL_WIDGET_IDS.internosKpis,
    title: 'Resumo Geral de Treinamentos Internos (KPIs)',
    subtitle: 'Participação, colaboradores treinados, horas e turmas',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Faixa de KPIs com Total de Treinamentos, Participantes, Colaboradores Treinados, Horas Treinadas e Turmas Planejadas x Excedentes.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    isClientWidget: true,
    generateData: specialWidgetStub
  },
  // ==========================================
  // GRUPO 1: INDICADORES DE T&D (TODOS JUNTOS NO MESMO GRUPO)
  // ==========================================

  // 1.0 Institucionais - Painel completo (Evolução / Previsto x Realizado / Tipo), idêntico ao
  // bloco da aba Indicadores T&D — Treinamentos Institucionais, com suas próprias abas internas.
  {
    id: SPECIAL_WIDGET_IDS.institucionaisTabs,
    title: 'Painel Institucional (Evolução / Previsto x Realizado / Tipo)',
    subtitle: 'Bloco completo com abas, idêntico ao painel de Indicadores T&D',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Traz o card com as três abas — Evolução Realizados, Previsto x Realizado e Tipo — exatamente como aparece em Indicadores T&D.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // Institucionais - Evolução — Percentual de Realização
  {
    id: SPECIAL_WIDGET_IDS.institucionaisPercentual,
    title: 'Evolução — Percentual de Realização',
    subtitle: 'Idêntico ao card de Indicadores T&D — Institucionais',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Percentual mensal de realização (realizado ÷ previsto), exatamente como aparece em Indicadores T&D.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // Institucionais - Agenda
  {
    id: SPECIAL_WIDGET_IDS.institucionaisAgenda,
    title: 'Agenda de Treinamentos',
    subtitle: 'Idêntico ao card de Indicadores T&D — Institucionais',
    group: 'ted_indicadores',
    icon: 'icon-calendar',
    description: 'Lista de treinamentos agendados com status, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // Internos - Evolução por Métrica
  {
    id: SPECIAL_WIDGET_IDS.internosEvolucao,
    title: 'Evolução por Métrica — Internos',
    subtitle: 'Idêntico ao card de Indicadores T&D — Internos',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Evolução mensal com seletor de métrica (Colaboradores, Horas, Participantes, Treinamentos), exatamente como aparece em Indicadores T&D.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // Internos - Ativos x Treinados
  {
    id: SPECIAL_WIDGET_IDS.internosAtivosTreinados,
    title: 'Ativos x Treinados',
    subtitle: 'Idêntico ao card de Indicadores T&D — Internos',
    group: 'ted_indicadores',
    icon: 'icon-participants',
    description: 'Card com abas Ativos x Treinados e Adesão, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // Internos - Treinamentos por Horas
  {
    id: SPECIAL_WIDGET_IDS.internosTreinamentosHoras,
    title: 'Treinamentos por Horas — Internos',
    subtitle: 'Idêntico ao card de Indicadores T&D — Internos',
    group: 'ted_indicadores',
    icon: 'icon-courses',
    description: 'Ranking de treinamentos internos por horas treinadas, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // Internos - Ranking por Cargo
  {
    id: SPECIAL_WIDGET_IDS.internosRankingCargo,
    title: 'Ranking por Cargo — Internos',
    subtitle: 'Idêntico ao card de Indicadores T&D — Internos',
    group: 'ted_indicadores',
    icon: 'icon-medal',
    description: 'Card com abas Rank Geral e Rank Adesão, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // Centro de Custo - Tabela
  {
    id: SPECIAL_WIDGET_IDS.centroCustoTabela,
    title: 'Indicadores por Centro de Custo',
    subtitle: 'Idêntico ao card de Indicadores T&D — Centro de Custo',
    group: 'ted_indicadores',
    icon: 'icon-manage',
    description: 'Tabela com abas Adesão e Esforço extra, paginação inclusa, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // Execução das Turmas por Período
  {
    id: SPECIAL_WIDGET_IDS.turmasExecucao,
    title: 'Execução das Turmas por Período',
    subtitle: 'Percentual de realização com filtro de Mês/Ano',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Gráfico de rosca com o percentual de realização em destaque e a distribuição das turmas previstas entre Realizado, Agendado e Não Realizado.',
    defaultType: 'Pizza',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // Relatório de Educação Permanente
  {
    id: SPECIAL_WIDGET_IDS.educacaoPermanente,
    title: 'Relatório de Educação Permanente',
    subtitle: 'Colaboradores, adesão, turmas e esforço extra com filtro de Setor',
    group: 'ted_indicadores',
    icon: 'icon-certificate',
    description: 'Relatório em formato de ficha: elegíveis x treinados, adesão mensal x meta, turmas planejadas x executadas e esforço extra, por setor e supervisor.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    isClientWidget: true,
    generateData: specialWidgetStub
  },

  // ==========================================
  // GRUPO 2: MATRÍCULAS (Widgets padrão da Plataforma Lector)
  // ==========================================
  {
    id: 'matriculas_grafico',
    title: 'Gráfico de Matrículas',
    subtitle: 'Volume mensal de matrículas no período',
    group: 'matriculas',
    icon: 'icon-courses',
    description: 'Visão geral do volume de matrículas no período.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 140 },
        { label: 'Fev', value: 185 },
        { label: 'Mar', value: 210 },
        { label: 'Abr', value: 195 },
        { label: 'Mai', value: 240 },
        { label: 'Jun', value: 225 },
        { label: 'Jul', value: 270 },
        { label: 'Ago', value: 295 }
      ],
      maxScale: 350,
      ticks: [0, 100, 200, 300]
    })
  },
  {
    id: 'matriculas_por_usuario',
    title: 'Gráfico de Matrículas por Usuário',
    subtitle: 'Colaboradores com maior número de matrículas',
    group: 'matriculas',
    icon: 'icon-profile',
    description: 'Matrículas agrupadas por colaborador.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Ana Paula Santos', value: 9 },
        { label: 'Carlos Eduardo Lima', value: 8 },
        { label: 'Mariana Costa', value: 7 },
        { label: 'Roberto Alves', value: 6 },
        { label: 'Fernanda Souza', value: 5 }
      ],
      maxScale: 10,
      ticks: [0, 2, 4, 6, 8, 10]
    })
  },
  {
    id: 'matriculas_novas',
    title: 'Gráfico de Novas Matrículas',
    subtitle: 'Evolução mensal de ingressos em cursos',
    group: 'matriculas',
    icon: 'icon-add',
    description: 'Evolução de novas matrículas realizadas no período.',
    defaultType: 'Linha',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 38 },
        { label: 'Fev', value: 45 },
        { label: 'Mar', value: 52 },
        { label: 'Abr', value: 48 },
        { label: 'Mai', value: 65 },
        { label: 'Jun', value: 58 },
        { label: 'Jul', value: 72 },
        { label: 'Ago', value: 81 }
      ],
      maxScale: 100,
      ticks: [0, 25, 50, 75, 100]
    })
  },
  {
    id: 'matriculas_ativas',
    title: 'Gráfico de Matrículas Ativas',
    subtitle: 'Matrículas em andamento por categoria',
    group: 'matriculas',
    icon: 'icon-checked',
    description: 'Matrículas atualmente em andamento.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Institucionais', value: 145 },
        { label: 'Obrigatórios (NR)', value: 210 },
        { label: 'Internos', value: 168 },
        { label: 'Comportamentais', value: 94 },
        { label: 'Trilhas', value: 122 }
      ],
      maxScale: 250,
      ticks: [0, 50, 100, 150, 200, 250]
    })
  },
  {
    id: 'usuarios_matriculados_grafico',
    title: 'Gráfico de Usuários Matriculados',
    subtitle: 'Colaboradores matriculados por setor',
    group: 'matriculas',
    icon: 'icon-participants',
    description: 'Total de usuários únicos com ao menos uma matrícula.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Enfermagem', value: 128 },
        { label: 'UTI Adulto', value: 95 },
        { label: 'Pronto Atendimento', value: 84 },
        { label: 'Farmácia', value: 52 },
        { label: 'Recepção', value: 46 }
      ],
      maxScale: 150,
      ticks: [0, 50, 100, 150]
    })
  },
  {
    id: 'matriculas_adquiridas',
    title: 'Número de Matrículas Adquiridas',
    subtitle: 'Volume adquirido mensalmente',
    group: 'matriculas',
    icon: 'icon-add',
    description: 'Total de matrículas adquiridas no período.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 250 },
        { label: 'Fev', value: 280 },
        { label: 'Mar', value: 300 },
        { label: 'Abr', value: 300 },
        { label: 'Mai', value: 350 },
        { label: 'Jun', value: 320 },
        { label: 'Jul', value: 400 },
        { label: 'Ago', value: 420 }
      ],
      maxScale: 500,
      ticks: [0, 100, 200, 300, 400, 500]
    })
  },
  {
    id: 'matriculas_utilizadas',
    title: 'Número de Matrículas Utilizadas',
    subtitle: 'Consumo efetivo de licenças/vagas',
    group: 'matriculas',
    icon: 'icon-checked',
    description: 'Matrículas adquiridas que já foram utilizadas.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 198 },
        { label: 'Fev', value: 225 },
        { label: 'Mar', value: 260 },
        { label: 'Abr', value: 255 },
        { label: 'Mai', value: 310 },
        { label: 'Jun', value: 285 },
        { label: 'Jul', value: 362 },
        { label: 'Ago', value: 388 }
      ],
      maxScale: 500,
      ticks: [0, 100, 200, 300, 400, 500]
    })
  },
  {
    id: 'matriculas_disponiveis',
    title: 'Número de Matrículas Disponíveis',
    subtitle: 'Saldo de matrículas disponíveis vs utilizadas',
    group: 'matriculas',
    icon: 'icon-unchecked',
    description: 'Matrículas adquiridas ainda não utilizadas.',
    defaultType: 'Pizza',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Utilizadas', value: 2283, color: '#004e4c' },
        { label: 'Disponíveis', value: 337, color: '#cde3bb' }
      ],
      maxScale: 2620,
      ticks: [0, 1000, 2000]
    })
  },
  {
    id: 'matriculas_novas_numero',
    title: 'Número de Matrículas Novas',
    subtitle: 'Novos cadastros por período',
    group: 'matriculas',
    icon: 'icon-add',
    description: 'Contagem de matrículas novas no período selecionado.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 45 },
        { label: 'Fev', value: 52 },
        { label: 'Mar', value: 60 },
        { label: 'Abr', value: 48 },
        { label: 'Mai', value: 70 },
        { label: 'Jun', value: 62 },
        { label: 'Jul', value: 78 },
        { label: 'Ago', value: 85 }
      ],
      maxScale: 100,
      ticks: [0, 25, 50, 75, 100]
    })
  },
  {
    id: 'matriculas_concluidas',
    title: 'Número de Matrículas Concluídas',
    subtitle: 'Matrículas finalizadas com aproveitamento',
    group: 'matriculas',
    icon: 'icon-diploma',
    description: 'Matrículas finalizadas com sucesso.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 128 },
        { label: 'Fev', value: 150 },
        { label: 'Mar', value: 178 },
        { label: 'Abr', value: 185 },
        { label: 'Mai', value: 215 },
        { label: 'Jun', value: 202 },
        { label: 'Jul', value: 240 },
        { label: 'Ago', value: 265 }
      ],
      maxScale: 300,
      ticks: [0, 100, 200, 300]
    })
  },
  {
    id: 'media_horas_treinamento_pessoa',
    title: 'Média de Horas/Treinamento por Pessoa',
    subtitle: 'Carga horária média por colaborador por área',
    group: 'indices_desempenho',
    icon: 'icon-clock',
    description: 'Carga horária média de treinamento por colaborador.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: 'h',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'UTI Geral', value: 16.5 },
        { label: 'Enfermagem', value: 14.2 },
        { label: 'Farmácia', value: 12.8 },
        { label: 'Pronto Socorro', value: 11.4 },
        { label: 'Administrativo', value: 8.6 }
      ],
      maxScale: 20,
      ticks: [0, 5, 10, 15, 20]
    })
  },
  {
    id: 'indice_aproveitamento',
    title: 'Índice de Aproveitamento',
    subtitle: 'Percentual de aprovação nas avaliações',
    group: 'indices_desempenho',
    icon: 'icon-performance',
    description: 'Percentual de aproveitamento nas avaliações dos treinamentos.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: '%',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 84 },
        { label: 'Fev', value: 86 },
        { label: 'Mar', value: 89 },
        { label: 'Abr', value: 87 },
        { label: 'Mai', value: 91 },
        { label: 'Jun', value: 90 },
        { label: 'Jul', value: 93 },
        { label: 'Ago', value: 92 }
      ],
      maxScale: 100,
      ticks: [0, 25, 50, 75, 100]
    })
  },
  {
    id: 'indice_adesao',
    title: 'Índice de Adesão',
    subtitle: 'Participação real sobre o público-alvo',
    group: 'indices_desempenho',
    icon: 'icon-checked-all',
    description: 'Percentual de colaboradores que aderiram aos treinamentos propostos.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: '%',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 78 },
        { label: 'Fev', value: 81 },
        { label: 'Mar', value: 84 },
        { label: 'Abr', value: 83 },
        { label: 'Mai', value: 88 },
        { label: 'Jun', value: 86 },
        { label: 'Jul', value: 90 },
        { label: 'Ago', value: 91 }
      ],
      maxScale: 100,
      ticks: [0, 25, 50, 75, 100]
    })
  },
  {
    id: 'indice_evasao',
    title: 'Índice de Evasão',
    subtitle: 'Percentual de abandono nos cursos',
    group: 'indices_desempenho',
    icon: 'icon-exit',
    description: 'Percentual de abandono das matrículas iniciadas.',
    defaultType: 'Linha',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: '%',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 9.2 },
        { label: 'Fev', value: 8.4 },
        { label: 'Mar', value: 7.1 },
        { label: 'Abr', value: 6.8 },
        { label: 'Mai', value: 5.4 },
        { label: 'Jun', value: 5.1 },
        { label: 'Jul', value: 4.2 },
        { label: 'Ago', value: 3.8 }
      ],
      maxScale: 12,
      ticks: [0, 3, 6, 9, 12]
    })
  },
  {
    id: 'indice_satisfacao',
    title: 'Índice de Satisfação',
    subtitle: 'Média de avaliação de reação dos participantes',
    group: 'indices_desempenho',
    icon: 'icon-rating',
    description: 'Nota média de satisfação atribuída pelos participantes.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: 'pts',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Instrutor', value: 4.9 },
        { label: 'Conteúdo', value: 4.7 },
        { label: 'Aplicabilidade', value: 4.6 },
        { label: 'Plataforma', value: 4.5 },
        { label: 'Recursos', value: 4.4 }
      ],
      maxScale: 5,
      ticks: [0, 1, 2, 3, 4, 5]
    })
  },
  {
    id: 'consumo_total_horas',
    title: 'Consumo total de horas',
    subtitle: 'Horas de treinamento consumidas por mês',
    group: 'engajamento_consumo',
    icon: 'icon-clock',
    description: 'Total de horas consumidas em treinamentos no período.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: 'h',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 980 },
        { label: 'Fev', value: 1120 },
        { label: 'Mar', value: 1340 },
        { label: 'Abr', value: 1260 },
        { label: 'Mai', value: 1580 },
        { label: 'Jun', value: 1420 },
        { label: 'Jul', value: 1750 },
        { label: 'Ago', value: 1920 }
      ],
      maxScale: 2200,
      ticks: [0, 500, 1000, 1500, 2000]
    })
  },
  {
    id: 'matriculas_finalizadas',
    title: 'Matrículas finalizadas',
    subtitle: 'Status de encerramento das matrículas',
    group: 'matriculas',
    icon: 'icon-diploma',
    description: 'Total de matrículas encerradas, concluídas ou não.',
    defaultType: 'Pizza',
    allowedTypes: STANDARD_CHART_TYPES,
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Concluídas c/ Certificado', value: 1845, color: '#0f6b3f' },
        { label: 'Concluídas s/ Certificado', value: 248, color: '#d99a24' },
        { label: 'Canceladas', value: 157, color: '#a32020' }
      ],
      maxScale: 2250,
      ticks: [0, 1000, 2000]
    })
  },
  {
    id: 'maior_tempo_navegacao',
    title: 'Maior tempo de navegação',
    subtitle: 'Colaboradores com maior engajamento na plataforma',
    group: 'engajamento_consumo',
    icon: 'icon-clock',
    description: 'Colaboradores com maior tempo de navegação na plataforma.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: 'h',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Juliana Ferreira', value: 34 },
        { label: 'Marcelo Lima', value: 31 },
        { label: 'Camila Rocha', value: 28 },
        { label: 'Lucas Silveira', value: 26 },
        { label: 'Beatriz Martins', value: 24 }
      ],
      maxScale: 40,
      ticks: [0, 10, 20, 30, 40]
    })
  },
  {
    id: 'menor_tempo_navegacao',
    title: 'Menor tempo de navegação',
    subtitle: 'Colaboradores que necessitam de incentivo de acesso',
    group: 'engajamento_consumo',
    icon: 'icon-clock',
    description: 'Colaboradores com menor tempo de navegação na plataforma.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: 'h',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'João Batista', value: 1.2 },
        { label: 'Marcos Castro', value: 1.5 },
        { label: 'Renata Farias', value: 1.8 },
        { label: 'Diego Mendes', value: 2.1 },
        { label: 'Patrícia Gomes', value: 2.4 }
      ],
      maxScale: 5,
      ticks: [0, 1, 2, 3, 4, 5]
    })
  },
  {
    id: 'cursos_mais_procurados',
    title: 'Cursos mais procurados',
    subtitle: 'Top cursos com maior procura na plataforma',
    group: 'engajamento_consumo',
    icon: 'icon-star',
    description: 'Ranking dos cursos com maior procura.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: 'matrículas',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'NR-32 Biossegurança', value: 342 },
        { label: 'Atendimento Humanizado', value: 298 },
        { label: 'Prevenção de Infecções', value: 265 },
        { label: 'LGPD na Saúde', value: 232 },
        { label: 'Segurança do Paciente', value: 218 }
      ],
      maxScale: 400,
      ticks: [0, 100, 200, 300, 400]
    })
  },
  {
    id: 'cursos_menos_procurados',
    title: 'Cursos menos procurados',
    subtitle: 'Cursos com menor índice de procura na plataforma',
    group: 'engajamento_consumo',
    icon: 'icon-thumbs-down',
    description: 'Ranking dos cursos com menor procura.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: 'matrículas',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Gestão de Resíduos II', value: 24 },
        { label: 'Arquivamento Digital', value: 28 },
        { label: 'Ergonomia no Home Office', value: 35 },
        { label: 'Redação Corporativa', value: 42 },
        { label: 'Telefonemas Eficazes', value: 48 }
      ],
      maxScale: 60,
      ticks: [0, 15, 30, 45, 60]
    })
  },
  {
    id: 'roi_horas_consumidas',
    title: 'ROI de horas consumidas',
    subtitle: 'Retorno estimado por hora de capacitação',
    group: 'indices_desempenho',
    icon: 'icon-performance',
    description: 'Retorno estimado sobre as horas de treinamento consumidas.',
    defaultType: 'Linha',
    allowedTypes: STANDARD_CHART_TYPES,
    unit: 'x',
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Jan', value: 1.8 },
        { label: 'Fev', value: 2.1 },
        { label: 'Mar', value: 2.4 },
        { label: 'Abr', value: 2.3 },
        { label: 'Mai', value: 2.7 },
        { label: 'Jun', value: 2.9 },
        { label: 'Jul', value: 3.2 },
        { label: 'Ago', value: 3.5 }
      ],
      maxScale: 4,
      ticks: [0, 1, 2, 3, 4]
    })
  },
  {
    id: 'ultimos_cancelamentos',
    title: 'Últimos cancelamentos',
    subtitle: 'Desistências recentes registradas',
    group: 'engajamento_consumo',
    icon: 'icon-discard',
    description: 'Lista dos cancelamentos mais recentes de matrículas.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    isClientWidget: false,
    generateData: () => ({
      data: [
        { label: 'Carlos Silva — NR-32 (Mudança de turno)', value: 1, extra: '10/08/2026' },
        { label: 'Mariana Duarte — Atendimento (Férias)', value: 1, extra: '08/08/2026' },
        { label: 'Lucas Ramos — Segurança do Paciente (Plantão)', value: 1, extra: '05/08/2026' },
        { label: 'Aline Souza — Farmácia (Licença médica)', value: 1, extra: '02/08/2026' }
      ],
      maxScale: 1,
      ticks: [0, 1]
    })
  }
];
