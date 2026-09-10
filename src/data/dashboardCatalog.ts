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
    generateData: specialWidgetStub
  },

  // Institucionais - Evolução — Percentual de Realização (bloco completo)
  {
    id: SPECIAL_WIDGET_IDS.institucionaisPercentual,
    title: 'Evolução — Percentual de Realização (bloco completo)',
    subtitle: 'Idêntico ao card de Indicadores T&D — Institucionais',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Percentual mensal de realização (realizado ÷ previsto), exatamente como aparece em Indicadores T&D.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    generateData: specialWidgetStub
  },

  // Institucionais - Agenda (bloco completo)
  {
    id: SPECIAL_WIDGET_IDS.institucionaisAgenda,
    title: 'Agenda de Treinamentos (bloco completo)',
    subtitle: 'Idêntico ao card de Indicadores T&D — Institucionais',
    group: 'ted_indicadores',
    icon: 'icon-calendar',
    description: 'Lista de treinamentos agendados com status, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    generateData: specialWidgetStub
  },

  // Internos - Evolução por Métrica (bloco completo)
  {
    id: SPECIAL_WIDGET_IDS.internosEvolucao,
    title: 'Evolução por Métrica — Internos (bloco completo)',
    subtitle: 'Idêntico ao card de Indicadores T&D — Internos',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Evolução mensal com seletor de métrica (Colaboradores, Horas, Participantes, Treinamentos), exatamente como aparece em Indicadores T&D.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    generateData: specialWidgetStub
  },

  // Internos - Ativos x Treinados (bloco completo)
  {
    id: SPECIAL_WIDGET_IDS.internosAtivosTreinados,
    title: 'Ativos x Treinados (bloco completo)',
    subtitle: 'Idêntico ao card de Indicadores T&D — Internos',
    group: 'ted_indicadores',
    icon: 'icon-participants',
    description: 'Card com abas Ativos x Treinados e Adesão, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Coluna',
    allowedTypes: STANDARD_CHART_TYPES,
    generateData: specialWidgetStub
  },

  // Internos - Treinamentos por Horas (bloco completo)
  {
    id: SPECIAL_WIDGET_IDS.internosTreinamentosHoras,
    title: 'Treinamentos por Horas — Internos (bloco completo)',
    subtitle: 'Idêntico ao card de Indicadores T&D — Internos',
    group: 'ted_indicadores',
    icon: 'icon-courses',
    description: 'Ranking de treinamentos internos por horas treinadas, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    generateData: specialWidgetStub
  },

  // Internos - Ranking por Cargo (bloco completo)
  {
    id: SPECIAL_WIDGET_IDS.internosRankingCargo,
    title: 'Ranking por Cargo — Internos (bloco completo)',
    subtitle: 'Idêntico ao card de Indicadores T&D — Internos',
    group: 'ted_indicadores',
    icon: 'icon-medal',
    description: 'Card com abas Rank Geral e Rank Adesão, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Barra',
    allowedTypes: STANDARD_CHART_TYPES,
    generateData: specialWidgetStub
  },

  // Centro de Custo - Tabela completa (bloco completo)
  {
    id: SPECIAL_WIDGET_IDS.centroCustoTabela,
    title: 'Indicadores por Centro de Custo (bloco completo)',
    subtitle: 'Idêntico ao card de Indicadores T&D — Centro de Custo',
    group: 'ted_indicadores',
    icon: 'icon-manage',
    description: 'Tabela com abas Adesão e Esforço extra, paginação inclusa, exatamente como aparece em Indicadores T&D.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    generateData: specialWidgetStub
  },

  // Execução das Turmas por Período — donut de status (Realizado / Agendado / Não Realizado)
  {
    id: SPECIAL_WIDGET_IDS.turmasExecucao,
    title: 'Execução das Turmas por Período (rosca)',
    subtitle: 'Percentual de realização com filtro de Mês/Ano',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Gráfico de rosca com o percentual de realização em destaque e a distribuição das turmas previstas entre Realizado, Agendado e Não Realizado.',
    defaultType: 'Pizza',
    allowedTypes: STANDARD_CHART_TYPES,
    generateData: specialWidgetStub
  },

  // Relatório de Educação Permanente — snapshot por setor (colaboradores, adesão, turmas, esforço extra)
  {
    id: SPECIAL_WIDGET_IDS.educacaoPermanente,
    title: 'Relatório de Educação Permanente (por setor)',
    subtitle: 'Colaboradores, adesão, turmas e esforço extra com filtro de Setor',
    group: 'ted_indicadores',
    icon: 'icon-certificate',
    description: 'Relatório em formato de ficha: elegíveis x treinados, adesão mensal x meta, turmas planejadas x executadas e esforço extra, por setor e supervisor.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    generateData: specialWidgetStub
  },

  // ==========================================
  // GRUPO 2: MATRÍCULAS (roadmap — ainda não construídos)
  // ==========================================
  {
    id: 'matriculas_grafico',
    title: 'Gráfico de Matrículas',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-courses',
    description: 'Visão geral do volume de matrículas no período.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'matriculas_por_usuario',
    title: 'Gráfico de Matrículas por Usuário',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-profile',
    description: 'Matrículas agrupadas por colaborador.',
    defaultType: 'Barra',
    allowedTypes: ['Barra'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'matriculas_novas',
    title: 'Gráfico de Novas Matrículas',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-add',
    description: 'Evolução de novas matrículas realizadas no período.',
    defaultType: 'Linha',
    allowedTypes: ['Linha'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'matriculas_ativas',
    title: 'Gráfico de Matrículas Ativas',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-checked',
    description: 'Matrículas atualmente em andamento.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'usuarios_matriculados_grafico',
    title: 'Gráfico de Usuários Matriculados',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-participants',
    description: 'Total de usuários únicos com ao menos uma matrícula.',
    defaultType: 'Barra',
    allowedTypes: ['Barra'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'matriculas_adquiridas',
    title: 'Número de Matrículas Adquiridas',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-add',
    description: 'Total de matrículas adquiridas no período.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'matriculas_utilizadas',
    title: 'Número de Matrículas Utilizadas',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-checked',
    description: 'Matrículas adquiridas que já foram utilizadas.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'matriculas_disponiveis',
    title: 'Número de Matrículas Disponíveis',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-unchecked',
    description: 'Matrículas adquiridas ainda não utilizadas.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'matriculas_novas_numero',
    title: 'Número de Matrículas Novas',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-add',
    description: 'Contagem de matrículas novas no período selecionado.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'matriculas_concluidas',
    title: 'Número de Matrículas Concluídas',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-diploma',
    description: 'Matrículas finalizadas com sucesso.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'matriculas_finalizadas',
    title: 'Matrículas finalizadas',
    subtitle: 'Em breve',
    group: 'matriculas',
    icon: 'icon-diploma',
    description: 'Total de matrículas encerradas, concluídas ou não.',
    defaultType: 'Pizza',
    allowedTypes: ['Pizza'],
    comingSoon: true,
    generateData: specialWidgetStub
  },

  // ==========================================
  // GRUPO 3: ÍNDICES E DESEMPENHO (roadmap — ainda não construídos)
  // ==========================================
  {
    id: 'media_horas_treinamento_pessoa',
    title: 'Média de Horas/Treinamento por Pessoa',
    subtitle: 'Em breve',
    group: 'indices_desempenho',
    icon: 'icon-clock',
    description: 'Carga horária média de treinamento por colaborador.',
    defaultType: 'Barra',
    allowedTypes: ['Barra'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'indice_aproveitamento',
    title: 'Índice de Aproveitamento',
    subtitle: 'Em breve',
    group: 'indices_desempenho',
    icon: 'icon-performance',
    description: 'Percentual de aproveitamento nas avaliações dos treinamentos.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'indice_adesao',
    title: 'Índice de Adesão',
    subtitle: 'Em breve',
    group: 'indices_desempenho',
    icon: 'icon-checked-all',
    description: 'Percentual de colaboradores que aderiram aos treinamentos propostos.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'indice_evasao',
    title: 'Índice de Evasão',
    subtitle: 'Em breve',
    group: 'indices_desempenho',
    icon: 'icon-exit',
    description: 'Percentual de abandono das matrículas iniciadas.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'indice_satisfacao',
    title: 'Índice de Satisfação',
    subtitle: 'Em breve',
    group: 'indices_desempenho',
    icon: 'icon-rating',
    description: 'Nota média de satisfação atribuída pelos participantes.',
    defaultType: 'Barra',
    allowedTypes: ['Barra'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'roi_horas_consumidas',
    title: 'ROI de horas consumidas',
    subtitle: 'Em breve',
    group: 'indices_desempenho',
    icon: 'icon-performance',
    description: 'Retorno estimado sobre as horas de treinamento consumidas.',
    defaultType: 'Barra',
    allowedTypes: ['Barra'],
    comingSoon: true,
    generateData: specialWidgetStub
  },

  // ==========================================
  // GRUPO 4: ENGAJAMENTO E CONSUMO (roadmap — ainda não construídos)
  // ==========================================
  {
    id: 'consumo_total_horas',
    title: 'Consumo total de horas',
    subtitle: 'Em breve',
    group: 'engajamento_consumo',
    icon: 'icon-clock',
    description: 'Total de horas consumidas em treinamentos no período.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'maior_tempo_navegacao',
    title: 'Maior tempo de navegação',
    subtitle: 'Em breve',
    group: 'engajamento_consumo',
    icon: 'icon-clock',
    description: 'Colaboradores com maior tempo de navegação na plataforma.',
    defaultType: 'Barra',
    allowedTypes: ['Barra'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'menor_tempo_navegacao',
    title: 'Menor tempo de navegação',
    subtitle: 'Em breve',
    group: 'engajamento_consumo',
    icon: 'icon-clock',
    description: 'Colaboradores com menor tempo de navegação na plataforma.',
    defaultType: 'Barra',
    allowedTypes: ['Barra'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'cursos_mais_procurados',
    title: 'Cursos mais procurados',
    subtitle: 'Em breve',
    group: 'engajamento_consumo',
    icon: 'icon-star',
    description: 'Ranking dos cursos com maior procura.',
    defaultType: 'Barra',
    allowedTypes: ['Barra'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'cursos_menos_procurados',
    title: 'Cursos menos procurados',
    subtitle: 'Em breve',
    group: 'engajamento_consumo',
    icon: 'icon-thumbs-down',
    description: 'Ranking dos cursos com menor procura.',
    defaultType: 'Barra',
    allowedTypes: ['Barra'],
    comingSoon: true,
    generateData: specialWidgetStub
  },
  {
    id: 'ultimos_cancelamentos',
    title: 'Últimos cancelamentos',
    subtitle: 'Em breve',
    group: 'engajamento_consumo',
    icon: 'icon-discard',
    description: 'Lista dos cancelamentos mais recentes de matrículas.',
    defaultType: 'Tabela',
    allowedTypes: ['Tabela'],
    comingSoon: true,
    generateData: specialWidgetStub
  }
];
