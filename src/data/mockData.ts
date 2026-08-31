import { MonthData, TrainingTypeData, AgendaItem, InternalTraining, JobPositionData, CostCenterRow } from '../types';

export const monthlyBaseData: MonthData[] = [
  { mesAno: 'Set/25', previsto: 4, realizado: 2, ativos: 1240, colabTreinados: 712, totalParticipantes: 2380, horasTreinadas: 2810, qtdTreinamentos: 14 },
  { mesAno: 'Out/25', previsto: 5, realizado: 4, ativos: 1244, colabTreinados: 748, totalParticipantes: 2510, horasTreinadas: 3020, qtdTreinamentos: 16 },
  { mesAno: 'Nov/25', previsto: 3, realizado: 3, ativos: 1248, colabTreinados: 690, totalParticipantes: 2190, horasTreinadas: 2640, qtdTreinamentos: 12 },
  { mesAno: 'Dez/25', previsto: 3, realizado: 1, ativos: 1251, colabTreinados: 512, totalParticipantes: 1620, horasTreinadas: 1980, qtdTreinamentos: 9 },
  { mesAno: 'Jan/26', previsto: 5, realizado: 5, ativos: 1256, colabTreinados: 902, totalParticipantes: 3110, horasTreinadas: 3720, qtdTreinamentos: 21 },
  { mesAno: 'Fev/26', previsto: 4, realizado: 3, ativos: 1261, colabTreinados: 868, totalParticipantes: 2940, horasTreinadas: 3480, qtdTreinamentos: 19 },
  { mesAno: 'Mar/26', previsto: 5, realizado: 3, ativos: 1265, colabTreinados: 941, totalParticipantes: 3180, horasTreinadas: 3860, qtdTreinamentos: 20 },
  { mesAno: 'Abr/26', previsto: 4, realizado: 2, ativos: 1270, colabTreinados: 995, totalParticipantes: 3320, horasTreinadas: 4010, qtdTreinamentos: 18 },
  { mesAno: 'Mai/26', previsto: 5, realizado: 1, ativos: 1274, colabTreinados: 966, totalParticipantes: 3240, horasTreinadas: 3910, qtdTreinamentos: 17 },
  { mesAno: 'Jun/26', previsto: 4, realizado: 1, ativos: 1278, colabTreinados: 727, totalParticipantes: 2480, horasTreinadas: 2960, qtdTreinamentos: 15 },
  { mesAno: 'Jul/26', previsto: 4, realizado: 1, ativos: 1281, colabTreinados: 1024, totalParticipantes: 3410, horasTreinadas: 4120, qtdTreinamentos: 22 },
  { mesAno: 'Ago/26', previsto: 4, realizado: 1, ativos: 1284, colabTreinados: 968, totalParticipantes: 3210, horasTreinadas: 3880, qtdTreinamentos: 23 }
];

export const trainingTypesData: TrainingTypeData[] = [
  { nome: 'Institucional', previsto: 23, realizado: 5 },
  { nome: 'Institucional - Assistencial', previsto: 27, realizado: 22 },
  { nome: 'Comportamental', previsto: 14, realizado: 9 },
  { nome: 'Técnico / Operacional', previsto: 11, realizado: 8 },
  { nome: 'Obrigatório (NR)', previsto: 9, realizado: 8 }
];

export const agendaData: AgendaItem[] = [
  { mesAno: 'Jan/26', nome: 'Ferramentas de melhoria de processos e prevenção de desperdício', tipo: 'Institucional', status: 'NÃO REALIZADO' },
  { mesAno: 'Jan/26', nome: 'Protocolo Institucional de Prevenção de Aspiração Broncopulmonar', tipo: 'Inst. - Assistencial', status: 'REALIZADO' },
  { mesAno: 'Fev/26', nome: 'Precauções e Isolamento', tipo: 'Inst. - Assistencial', status: 'REALIZADO' },
  { mesAno: 'Mar/26', nome: 'NR32 e Biossegurança', tipo: 'Obrigatório (NR)', status: 'REALIZADO' },
  { mesAno: 'Abr/26', nome: 'Código de Conduta e Compliance', tipo: 'Institucional', status: 'REALIZADO' },
  { mesAno: 'Mai/26', nome: 'Segurança do Paciente — Metas Internacionais', tipo: 'Inst. - Assistencial', status: 'AGENDADO' },
  { mesAno: 'Jun/26', nome: 'Comunicação Não Violenta no Atendimento', tipo: 'Comportamental', status: 'NÃO REALIZADO' }
];

export const internalTrainingsData: InternalTraining[] = [
  { nome: 'Integração — Visita Técnica', horasVal: 2799, horasFormatted: '2799:30:00' },
  { nome: 'Cirurgia Segura', horasVal: 1891, horasFormatted: '1891:00:00' },
  { nome: 'Política Institucional — Qualidade', horasVal: 1178, horasFormatted: '1178:00:00' },
  { nome: 'Política Institucional — Segurança', horasVal: 1059, horasFormatted: '1059:25:00' },
  { nome: 'Prevenção de Quedas', horasVal: 842, horasFormatted: '842:10:00' }
];

export const jobPositionsData: JobPositionData[] = [
  { cargo: 'Técnico de Enfermagem', participantes: 12131, ativos: 312, treinados: 268 },
  { cargo: 'Enfermeiro', participantes: 2976, ativos: 148, treinados: 121 },
  { cargo: 'Terceiro', participantes: 2184, ativos: 96, treinados: 44 },
  { cargo: 'Fisioterapeuta', participantes: 1069, ativos: 58, treinados: 41 },
  { cargo: 'Auxiliar de Farmácia', participantes: 840, ativos: 44, treinados: 31 },
  { cargo: 'Técnico de Radiologia', participantes: 683, ativos: 38, treinados: 24 },
  { cargo: 'Auxiliar Técnico', participantes: 676, ativos: 36, treinados: 22 },
  { cargo: 'Técnico de Patologia', participantes: 416, ativos: 26, treinados: 15 },
  { cargo: 'Atendente', participantes: 415, ativos: 25, treinados: 12 },
  { cargo: 'Recepcionista', participantes: 357, ativos: 96, treinados: 62 }
];

export const costCenterRowsData: CostCenterRow[] = [
  { area: 'Centro Cirúrgico', gestor: 'Ana Paula Ribeiro', supervisor: 'M. Tavares', treinamento: 'Segurança do Paciente', aula: 'Turma 04 · 12/06', instrutor: 'R. Menezes', inscritos: 32, realizaram: 29, turmasPlanejadas: 4, turmasExcedentes: 1 },
  { area: 'UTI Adulto', gestor: 'Carlos E. Moura', supervisor: 'S. Barreto', treinamento: 'Ventilação Mecânica', aula: 'Turma 02 · 18/06', instrutor: 'L. Andrade', inscritos: 28, realizaram: 21, turmasPlanejadas: 3, turmasExcedentes: 0 },
  { area: 'Pronto Atendimento', gestor: 'Fernanda Lima', supervisor: 'M. Tavares', treinamento: 'Acolhimento e Classificação', aula: 'Turma 07 · 03/07', instrutor: 'M. Souza', inscritos: 41, realizaram: 24, turmasPlanejadas: 5, turmasExcedentes: 2 },
  { area: 'Internação Clínica', gestor: 'Rodrigo Salles', supervisor: 'S. Barreto', treinamento: 'Prevenção de Quedas', aula: 'Turma 01 · 09/07', instrutor: 'R. Menezes', inscritos: 36, realizaram: 33, turmasPlanejadas: 4, turmasExcedentes: 1 },
  { area: 'Faturamento', gestor: 'Juliana Costa', supervisor: 'A. Peixoto', treinamento: 'Glosas e Auditoria', aula: 'Turma 03 · 21/07', instrutor: 'P. Vieira', inscritos: 18, realizaram: 9, turmasPlanejadas: 2, turmasExcedentes: 1 },
  { area: 'Recepção / SAC', gestor: 'Marcos Antunes', supervisor: 'A. Peixoto', treinamento: 'Atendimento Humanizado', aula: 'Turma 05 · 05/08', instrutor: 'C. Duarte', inscritos: 26, realizaram: 17, turmasPlanejadas: 3, turmasExcedentes: 1 },
  { area: 'Hemodiálise', gestor: 'Patrícia Nunes', supervisor: 'S. Barreto', treinamento: 'Biossegurança', aula: 'Turma 02 · 14/08', instrutor: 'L. Andrade', inscritos: 22, realizaram: 20, turmasPlanejadas: 2, turmasExcedentes: 0 }
];

export const navGroups = [
  'Social',
  'Vitrines',
  'Diários de classe',
  'Trilhas',
  'Treinamentos',
  'Gravações',
  'Webconferência',
  'Documentos',
  'Avaliações',
  'Cadastros'
];
