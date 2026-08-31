import {
  monthlyBaseData,
  trainingTypesData,
  internalTrainingsData,
  jobPositionsData,
  costCenterRowsData
} from './mockData';

export interface ChartDataPoint {
  label: string;
  value: number;
  valueSecondary?: number;
  color?: string;
  extra?: string;
}

export type SupportedChartType = 'Barra' | 'Coluna' | 'Pizza' | 'Linha' | 'Tabela';

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
    color: '#eb6200',
    description: 'Todos os indicadores de Treinamento e Desenvolvimento (Institucionais, Internos, Centro de Custo e Metas)'
  },
  {
    id: 'lms_geral',
    name: 'Geral LMS & Matrículas',
    icon: 'icon-participants',
    color: '#183a75',
    description: 'Status de aprovação, engajamento geral e matriculados na plataforma'
  }
];

export const CHART_CATALOG: CatalogChartDef[] = [
  // ==========================================
  // GRUPO 1: INDICADORES DE T&D (TODOS JUNTOS NO MESMO GRUPO)
  // ==========================================

  // 1.1 Institucionais - Evolução Treinamentos Realizados
  {
    id: 'inst_evolucao_realizados',
    title: 'Evolução — Treinamentos Realizados',
    subtitle: 'Histórico mensal de eventos concluídos (12 meses)',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Acompanhe a curva de execução de treinamentos institucionais ao longo dos meses.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna', 'Linha', 'Barra', 'Tabela'],
    unit: 'treinamentos',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const f = cat.includes('Comportamentais') ? 0.4 : cat.includes('Obrigatórios') ? 0.7 : 1.0;
      return {
        data: monthlyBaseData.map((m, idx) => ({
          label: m.mesAno,
          value: Math.max(1, Math.round(m.realizado * f)),
          color: idx === monthlyBaseData.length - 1 ? '#eb6200' : '#183a75'
        })),
        maxScale: Math.max(4, Math.round(6 * f)),
        ticks: [0, 1, 2, 3, 4, 5, 6],
        meta: { legendPrimary: 'Realizados' }
      };
    }
  },

  // 1.2 Institucionais - Previsto x Realizado por Mês/Ano
  {
    id: 'inst_previsto_x_realizado',
    title: 'Previsto x Realizado por Mês/Ano',
    subtitle: 'Comparativo de meta vs. execução institucional',
    group: 'ted_indicadores',
    icon: 'icon-calendar',
    description: 'Contrasta as turmas planejadas na matriz com as efetivamente realizadas.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna', 'Linha', 'Barra', 'Tabela'],
    unit: 'turmas',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const f = cat.includes('Obrigatórios') ? 0.6 : 1.0;
      return {
        data: monthlyBaseData.slice(-8).map((m, idx, arr) => ({
          label: m.mesAno,
          value: Math.round(m.realizado * f),
          valueSecondary: Math.round(m.previsto * f),
          color: idx === arr.length - 1 ? '#eb6200' : '#183a75'
        })),
        maxScale: 6,
        ticks: [0, 1, 2, 3, 4, 5, 6],
        meta: { legendPrimary: 'Realizado', legendSecondary: 'Previsto' }
      };
    }
  },

  // 1.3 Institucionais - Previsto x Realizado por Tipo
  {
    id: 'inst_por_tipo',
    title: 'Previsto x Realizado por Tipo de Treinamento',
    subtitle: 'Distribuição entre Assistencial, Técnico, NR e Comportamental',
    group: 'ted_indicadores',
    icon: 'icon-legal-document',
    description: 'Volume de capacitação segmentado por natureza e obrigatoriedade.',
    defaultType: 'Barra',
    allowedTypes: ['Barra', 'Coluna', 'Pizza', 'Tabela'],
    unit: 'treinamentos',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: () => {
      const colors = ['#183a75', '#0f6b3f', '#eb6200', '#7a8699', '#4a5568'];
      return {
        data: trainingTypesData.map((t, idx) => ({
          label: t.nome,
          value: t.realizado,
          valueSecondary: t.previsto,
          color: colors[idx % colors.length]
        })),
        maxScale: 30,
        ticks: [0, 5, 10, 15, 20, 25, 30],
        meta: { legendPrimary: 'Realizado', legendSecondary: 'Previsto' }
      };
    }
  },

  // 1.4 Internos - Evolução de Colaboradores Treinados
  {
    id: 'internos_colab_treinados',
    title: 'Evolução de Colaboradores Treinados',
    subtitle: 'Total de colaboradores únicos capacitados mensalmente',
    group: 'ted_indicadores',
    icon: 'icon-participants',
    description: 'Adesão de colaboradores ativos nas turmas internas ao longo dos meses.',
    defaultType: 'Linha',
    allowedTypes: ['Linha', 'Coluna', 'Barra', 'Tabela'],
    unit: 'colaboradores',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const f = cat.includes('Obrigatórios') ? 0.75 : cat.includes('Trilhas') ? 0.35 : 1.0;
      return {
        data: monthlyBaseData.slice(-6).map((m, idx, arr) => ({
          label: m.mesAno,
          value: Math.round(m.colabTreinados * f),
          color: idx === arr.length - 1 ? '#eb6200' : '#183a75'
        })),
        maxScale: Math.round(1200 * f),
        ticks: [0, Math.round(300 * f), Math.round(600 * f), Math.round(900 * f), Math.round(1200 * f)],
        meta: { legendPrimary: 'Colaboradores Treinados' }
      };
    }
  },

  // 1.5 Internos - Evolução de Horas Treinadas
  {
    id: 'internos_horas_treinadas',
    title: 'Evolução de Horas Treinadas',
    subtitle: 'Carga horária acumulada de capacitação mensal',
    group: 'ted_indicadores',
    icon: 'icon-calendar-today',
    description: 'Volume de horas-homem de treinamento ministradas em cada mês.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna', 'Linha', 'Barra', 'Tabela'],
    unit: 'horas',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const f = cat.includes('Obrigatórios') ? 0.7 : cat.includes('Trilhas') ? 0.4 : 1.0;
      return {
        data: monthlyBaseData.slice(-6).map((m, idx, arr) => ({
          label: m.mesAno,
          value: Math.round(m.horasTreinadas * f),
          color: idx === arr.length - 1 ? '#eb6200' : '#183a75'
        })),
        maxScale: Math.round(4500 * f),
        ticks: [0, Math.round(1000 * f), Math.round(2000 * f), Math.round(3000 * f), Math.round(4500 * f)],
        meta: { legendPrimary: 'Horas Treinadas' }
      };
    }
  },

  // 1.6 Internos - Total de Participantes por Mês
  {
    id: 'internos_total_participantes',
    title: 'Evolução de Total de Participantes',
    subtitle: 'Volume total de participações em turmas no período',
    group: 'ted_indicadores',
    icon: 'icon-participants',
    description: 'Soma total de presenças registradas em todas as ações de capacitação.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna', 'Linha', 'Barra', 'Tabela'],
    unit: 'participantes',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const f = cat.includes('Obrigatórios') ? 0.75 : 1.0;
      return {
        data: monthlyBaseData.slice(-6).map((m, idx, arr) => ({
          label: m.mesAno,
          value: Math.round(m.totalParticipantes * f),
          color: idx === arr.length - 1 ? '#eb6200' : '#183a75'
        })),
        maxScale: Math.round(4000 * f),
        ticks: [0, Math.round(1000 * f), Math.round(2000 * f), Math.round(3000 * f), Math.round(4000 * f)],
        meta: { legendPrimary: 'Participantes' }
      };
    }
  },

  // 1.7 Internos - Ranking de Participação por Cargo
  {
    id: 'internos_ranking_cargos',
    title: 'Ranking de Participação por Cargo',
    subtitle: 'Participações registradas por função profissional',
    group: 'ted_indicadores',
    icon: 'icon-medal',
    description: 'Top cargos com maior volume de participação nos treinamentos internos.',
    defaultType: 'Barra',
    allowedTypes: ['Barra', 'Coluna', 'Tabela', 'Pizza'],
    unit: 'participantes',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const f = cat.includes('Obrigatórios') ? 0.8 : 1.0;
      return {
        data: jobPositionsData.slice(0, 6).map((j, idx) => ({
          label: j.cargo,
          value: Math.round(j.participantes * f),
          color: idx === 0 ? '#183a75' : idx === 2 ? '#eb6200' : '#4a5568'
        })),
        maxScale: Math.round(13000 * f),
        ticks: [0, Math.round(3000 * f), Math.round(6000 * f), Math.round(9000 * f), Math.round(13000 * f)],
        meta: { legendPrimary: 'Participantes' }
      };
    }
  },

  // 1.8 Internos - Top Treinamentos Internos por Carga Horária
  {
    id: 'internos_top_treinamentos',
    title: 'Top Treinamentos Internos por Horas',
    subtitle: 'Cursos com maior carga horária total aplicada',
    group: 'ted_indicadores',
    icon: 'icon-courses',
    description: 'Cursos mais intensivos em horas ministradas (ex: Integração, Cirurgia Segura).',
    defaultType: 'Barra',
    allowedTypes: ['Barra', 'Coluna', 'Pizza', 'Tabela'],
    unit: 'horas',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: () => ({
      data: internalTrainingsData.map((t, idx) => ({
        label: t.nome,
        value: t.horasVal,
        color: idx === 0 ? '#eb6200' : idx === 1 ? '#183a75' : idx === 2 ? '#0f6b3f' : '#7a8699'
      })),
      maxScale: 3000,
      ticks: [0, 600, 1200, 1800, 2400, 3000],
      meta: { legendPrimary: 'Horas Aplicadas' }
    })
  },

  // 1.9 Internos - Cobertura de Ativos Treinados por Cargo
  {
    id: 'internos_cobertura_cargos',
    title: 'Cobertura de Ativos Treinados por Cargo',
    subtitle: 'Percentual do quadro ativo capacitado no período',
    group: 'ted_indicadores',
    icon: 'icon-documents',
    description: 'Percentual de colaboradores treinados em relação ao total ativo por função.',
    defaultType: 'Barra',
    allowedTypes: ['Barra', 'Coluna', 'Tabela'],
    unit: '%',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: () => ({
      data: jobPositionsData.slice(0, 6).map((j, idx) => {
        const pct = Math.round((j.treinados / j.ativos) * 100);
        return {
          label: j.cargo,
          value: pct,
          color: pct >= 80 ? '#0f6b3f' : pct >= 60 ? '#183a75' : '#eb6200'
        };
      }),
      maxScale: 100,
      ticks: [0, 20, 40, 60, 80, 100],
      meta: { legendPrimary: '% Treinados' }
    })
  },

  // 1.10 Centro de Custo - Turmas Planejadas x Excedentes
  {
    id: 'turmas_planejadas_excedentes',
    title: 'Turmas Planejadas x Excedentes',
    subtitle: 'Balanço do esforço extra de capacitação',
    group: 'ted_indicadores',
    icon: 'icon-manage',
    description: 'Proporção entre turmas previstas na grade regular e turmas extras convocadas.',
    defaultType: 'Pizza',
    allowedTypes: ['Pizza', 'Barra', 'Coluna'],
    unit: 'turmas',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const f = cat.includes('Obrigatórios') ? 0.6 : 1.0;
      return {
        data: [
          { label: 'Turmas Planejadas (Meta)', value: Math.round(142 * f), color: '#183a75' },
          { label: 'Turmas Excedentes (Extras)', value: Math.round(18 * f), color: '#eb6200' }
        ],
        maxScale: Math.round(160 * f),
        ticks: [0, 40, 80, 120, Math.round(160 * f)],
        meta: { legendPrimary: 'Turmas' }
      };
    }
  },

  // 1.11 Centro de Custo - Realização vs. Inscritos por Setor
  {
    id: 'centro_custo_adesao_setores',
    title: 'Realização vs. Inscritos por Setor / Área',
    subtitle: 'Presença efetiva nas turmas por área hospitalar',
    group: 'ted_indicadores',
    icon: 'icon-documents',
    description: 'Taxa de conversão de inscritos em presenças confirmadas nas salas de treinamento.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna', 'Barra', 'Tabela'],
    unit: 'colaboradores',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const f = cat.includes('Obrigatórios') ? 0.8 : 1.0;
      return {
        data: costCenterRowsData.slice(0, 6).map((c) => ({
          label: c.area,
          value: Math.round(c.realizaram * f),
          valueSecondary: Math.round(c.inscritos * f),
          color: '#183a75'
        })),
        maxScale: 45,
        ticks: [0, 10, 20, 30, 40, 45],
        meta: { legendPrimary: 'Realizaram', legendSecondary: 'Inscritos' }
      };
    }
  },

  // 1.12 Metas T&D - Média de Horas por Colaborador
  {
    id: 'kpi_horas_colaborador',
    title: 'Média de Horas por Colaborador (Meta Anual)',
    subtitle: 'Meta corporativa de 10h de treinamento/colaborador',
    group: 'ted_indicadores',
    icon: 'icon-performance',
    description: 'Média acumulada de horas de treinamento realizadas por colaborador da Unimed.',
    defaultType: 'Barra',
    allowedTypes: ['Barra', 'Coluna', 'Linha'],
    unit: 'horas/colab',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const val = cat.includes('Obrigatórios') ? 5.2 : cat.includes('Trilhas') ? 3.4 : 8.6;
      return {
        data: [
          { label: 'Média Atual (Ago/26)', value: val, color: '#0f6b3f' },
          { label: 'Meta Anual Unimed', value: 10.0, color: '#eb6200' },
          { label: 'Média Ano Anterior', value: 7.8, color: '#7a8699' }
        ],
        maxScale: 12,
        ticks: [0, 2, 4, 6, 8, 10, 12],
        meta: { legendPrimary: 'Horas/Colaborador' }
      };
    }
  },

  // 1.13 Metas T&D - Índice de Conformidade NR-1 & Normas
  {
    id: 'kpi_conformidade_nr',
    title: 'Índice de Conformidade NR-1 & Normas Regulamentadoras',
    subtitle: 'Treinamentos regulamentares obrigatórios (NRs)',
    group: 'ted_indicadores',
    icon: 'icon-legal-document',
    description: 'Status de conformidade e cobertura das NRs (NR-01, NR-32, NR-05, NR-23).',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna', 'Barra', 'Pizza', 'Tabela'],
    unit: '%',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: () => ({
      data: [
        { label: 'NR-01 (Integração)', value: 96.8, color: '#0f6b3f' },
        { label: 'NR-32 (Saúde)', value: 95.1, color: '#0f6b3f' },
        { label: 'NR-05 (CIPA)', value: 100.0, color: '#0f6b3f' },
        { label: 'NR-23 (Brigada)', value: 87.8, color: '#eb6200' }
      ],
      maxScale: 100,
      ticks: [0, 20, 40, 60, 80, 100],
      meta: { legendPrimary: '% Cobertura' }
    })
  },

  // ==========================================
  // GRUPO 2: GERAL LMS & MATRÍCULAS
  // ==========================================
  {
    id: 'matriculas_status',
    title: 'Matrículas',
    subtitle: 'Distribuição de aprovação geral no período',
    group: 'lms_geral',
    icon: 'icon-courses',
    description: 'Acompanhamento de aprovações, reprovações e matrículas em andamento no LMS.',
    defaultType: 'Barra',
    allowedTypes: ['Barra', 'Coluna', 'Pizza', 'Linha'],
    unit: 'matrículas',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      let factor = 1.0;
      if (cat.includes('Obrigatórios')) factor = 0.55;
      else if (cat.includes('Trilhas')) factor = 0.4;
      else if (cat.includes('Institucionais')) factor = 0.65;
      else if (cat.includes('Internos')) factor = 0.8;
      else if (cat.includes('Comportamentais')) factor = 0.25;

      const aprov = Math.round(84 * factor);
      const andam = Math.round(37 * factor);
      const reprov = Math.max(1, Math.round(3 * factor));
      const maxVal = Math.ceil((aprov + 10) / 10) * 10;
      const step = Math.max(5, Math.ceil(maxVal / 9 / 5) * 5);
      const ticks = [];
      for (let i = 0; i <= maxVal; i += step) ticks.push(i);

      return {
        data: [
          { label: 'Aprovados', value: aprov, color: '#eb6200' },
          { label: 'Em andamento', value: andam, color: '#183a75' },
          { label: 'Reprovados', value: reprov, color: '#7a8699' }
        ],
        maxScale: maxVal,
        ticks,
        meta: { legendPrimary: 'Matrículas' }
      };
    }
  },
  {
    id: 'usuarios_matriculados',
    title: 'Usuários Matriculados',
    subtitle: 'Status consolidado por indivíduo',
    group: 'lms_geral',
    icon: 'icon-participants',
    description: 'Quantidade única de usuários ativos com treinamentos pendentes ou concluídos.',
    defaultType: 'Barra',
    allowedTypes: ['Barra', 'Coluna', 'Pizza', 'Linha'],
    unit: 'usuários',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      let factor = 1.0;
      if (cat.includes('Obrigatórios')) factor = 0.6;
      else if (cat.includes('Trilhas')) factor = 0.45;
      else if (cat.includes('Institucionais')) factor = 0.7;
      else if (cat.includes('Internos')) factor = 0.85;
      else if (cat.includes('Comportamentais')) factor = 0.3;

      const aprov = Math.round(24 * factor);
      const andam = Math.round(37 * factor);
      const reprov = Math.max(1, Math.round(1 * factor));
      const maxVal = Math.ceil((andam + 5) / 5) * 5;
      const step = 5;
      const ticks = [];
      for (let i = 0; i <= maxVal; i += step) ticks.push(i);

      return {
        data: [
          { label: 'Aprovados', value: aprov, color: '#eb6200' },
          { label: 'Em andamento', value: andam, color: '#183a75' },
          { label: 'Reprovados', value: reprov, color: '#7a8699' }
        ],
        maxScale: maxVal,
        ticks,
        meta: { legendPrimary: 'Usuários' }
      };
    }
  },
  {
    id: 'adesao_polos',
    title: 'Adesão por Polo / Unidade',
    subtitle: 'Percentual de participação por unidade Unimed',
    group: 'lms_geral',
    icon: 'icon-web',
    description: 'Comparativo de engajamento entre Hospital, PA, Retiro e Sede.',
    defaultType: 'Coluna',
    allowedTypes: ['Coluna', 'Barra', 'Pizza', 'Tabela'],
    unit: '%',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const offset = cat.includes('Obrigatórios') ? 4 : cat.includes('Trilhas') ? -5 : 0;
      return {
        data: [
          { label: 'Hospital Unimed', value: Math.min(100, 92 + offset), color: '#0f6b3f' },
          { label: 'Pronto Atendimento', value: Math.min(100, 87 + offset), color: '#183a75' },
          { label: 'Unidade Retiro', value: Math.min(100, 84 + offset), color: '#eb6200' },
          { label: 'Sede Adm.', value: Math.min(100, 78 + offset), color: '#7a8699' }
        ],
        maxScale: 100,
        ticks: [0, 20, 40, 60, 80, 100],
        meta: { legendPrimary: '% Adesão' }
      };
    }
  },
  {
    id: 'conclusao_modalidade',
    title: 'Conclusão por Modalidade (EAD vs. Presencial)',
    subtitle: 'Volume de conclusões por formato de ensino',
    group: 'lms_geral',
    icon: 'icon-evaluations',
    description: 'Volume relativo entre treinamentos digitais via LMS e eventos presenciais/práticos.',
    defaultType: 'Pizza',
    allowedTypes: ['Pizza', 'Barra', 'Coluna'],
    unit: '%',
    categories: DEFAULT_TRAINING_CATEGORIES,
    generateData: (ctx) => {
      const cat = ctx?.category || 'Todos os Treinamentos';
      const isNR = cat.includes('Obrigatórios');
      return {
        data: [
          { label: 'EAD / Online', value: isNR ? 55 : 68, color: '#183a75' },
          { label: 'Presencial / Prático', value: isNR ? 35 : 24, color: '#eb6200' },
          { label: 'Híbrido / Workshop', value: 10, color: '#0f6b3f' }
        ],
        maxScale: 100,
        ticks: [0, 25, 50, 75, 100],
        meta: { legendPrimary: '% Participação' }
      };
    }
  }
];
