export interface EducacaoPermanenteRecord {
  setor: string;
  supervisores: string;
  periodo: string;
  categoria: string;
  tema: string;
  instrutores: string;
  colaboradoresElegiveis: number;
  colaboradoresTreinados: number;
  adesaoMensalPct: number;
  adesaoMetaPct: number;
  turmasPlanejadas: number;
  turmasExecutadas: number;
  esforcoExtraPct: number;
}

export const educacaoPermanenteData: EducacaoPermanenteRecord[] = [
  {
    setor: 'Centro Médico',
    supervisores: 'Beatriz Fonseca e Juliana de Paula',
    periodo: 'Julho/2026',
    categoria: 'Treinamento Institucional',
    tema: 'Acionamento do Código Laranja',
    instrutores: 'Rafaela',
    colaboradoresElegiveis: 19,
    colaboradoresTreinados: 19,
    adesaoMensalPct: 100,
    adesaoMetaPct: 89,
    turmasPlanejadas: 4,
    turmasExecutadas: 5,
    esforcoExtraPct: 25
  },
  {
    setor: 'Centro Cirúrgico',
    supervisores: 'Ana Paula Ribeiro',
    periodo: 'Agosto/2026',
    categoria: 'Treinamento Institucional',
    tema: 'Segurança do Paciente — Metas Internacionais',
    instrutores: 'R. Menezes',
    colaboradoresElegiveis: 32,
    colaboradoresTreinados: 29,
    adesaoMensalPct: 91,
    adesaoMetaPct: 89,
    turmasPlanejadas: 4,
    turmasExecutadas: 4,
    esforcoExtraPct: 0
  },
  {
    setor: 'UTI Adulto',
    supervisores: 'Carlos E. Moura',
    periodo: 'Agosto/2026',
    categoria: 'Treinamento Técnico / Operacional',
    tema: 'Ventilação Mecânica — Fundamentos',
    instrutores: 'L. Andrade',
    colaboradoresElegiveis: 28,
    colaboradoresTreinados: 21,
    adesaoMensalPct: 75,
    adesaoMetaPct: 89,
    turmasPlanejadas: 3,
    turmasExecutadas: 3,
    esforcoExtraPct: 0
  },
  {
    setor: 'Pronto Atendimento',
    supervisores: 'Fernanda Lima',
    periodo: 'Julho/2026',
    categoria: 'Obrigatório (NR)',
    tema: 'NR32 e Biossegurança',
    instrutores: 'M. Souza',
    colaboradoresElegiveis: 41,
    colaboradoresTreinados: 24,
    adesaoMensalPct: 59,
    adesaoMetaPct: 89,
    turmasPlanejadas: 5,
    turmasExecutadas: 7,
    esforcoExtraPct: 40
  },
  {
    setor: 'Sede Administrativa',
    supervisores: 'S. Barreto',
    periodo: 'Junho/2026',
    categoria: 'Treinamento Institucional',
    tema: 'Código de Conduta e Compliance',
    instrutores: 'Ana Paula Ribeiro',
    colaboradoresElegiveis: 56,
    colaboradoresTreinados: 56,
    adesaoMensalPct: 100,
    adesaoMetaPct: 89,
    turmasPlanejadas: 4,
    turmasExecutadas: 4,
    esforcoExtraPct: 0
  }
];
