export interface TrainingCatalogRow {
  treinamento: string;
  autor: string;
  turma: string;
  cargaHoraria: string;
  situacao: 'REALIZADO' | 'AGENDADO' | 'NÃO REALIZADO';
  inicioInscricoes: string;
  fimInscricoes: string;
}

// Detailed, per-turma listing behind "Evolução — Treinamentos Realizados" and the other
// Institucionais widgets — every row is one training class, not a monthly aggregate.
export const trainingCatalogData: TrainingCatalogRow[] = [
  { treinamento: 'Protocolo Institucional de Prevenção de Aspiração Broncopulmonar', autor: 'R. Menezes', turma: 'Turma 04 · 12/09', cargaHoraria: '02:00:00', situacao: 'REALIZADO', inicioInscricoes: '01/09/2025', fimInscricoes: '10/09/2025' },
  { treinamento: 'Precauções e Isolamento', autor: 'L. Andrade', turma: 'Turma 02 · 18/09', cargaHoraria: '01:30:00', situacao: 'REALIZADO', inicioInscricoes: '02/09/2025', fimInscricoes: '15/09/2025' },
  { treinamento: 'NR32 e Biossegurança', autor: 'M. Souza', turma: 'Turma 07 · 03/10', cargaHoraria: '04:00:00', situacao: 'REALIZADO', inicioInscricoes: '20/09/2025', fimInscricoes: '30/09/2025' },
  { treinamento: 'Código de Conduta e Compliance', autor: 'Ana Paula Ribeiro', turma: 'Turma 01 · 22/10', cargaHoraria: '01:00:00', situacao: 'REALIZADO', inicioInscricoes: '05/10/2025', fimInscricoes: '18/10/2025' },
  { treinamento: 'Segurança do Paciente — Metas Internacionais', autor: 'Carlos E. Moura', turma: 'Turma 05 · 14/11', cargaHoraria: '03:00:00', situacao: 'REALIZADO', inicioInscricoes: '25/10/2025', fimInscricoes: '10/11/2025' },
  { treinamento: 'Comunicação Não Violenta no Atendimento', autor: 'Fernanda Lima', turma: 'Turma 03 · 27/11', cargaHoraria: '02:00:00', situacao: 'NÃO REALIZADO', inicioInscricoes: '08/11/2025', fimInscricoes: '22/11/2025' },
  { treinamento: 'Integração — Visita Técnica', autor: 'S. Barreto', turma: 'Turma 09 · 05/12', cargaHoraria: '06:00:00', situacao: 'REALIZADO', inicioInscricoes: '18/11/2025', fimInscricoes: '01/12/2025' },
  { treinamento: 'Cirurgia Segura', autor: 'R. Menezes', turma: 'Turma 06 · 19/12', cargaHoraria: '04:30:00', situacao: 'NÃO REALIZADO', inicioInscricoes: '01/12/2025', fimInscricoes: '15/12/2025' },
  { treinamento: 'Política Institucional — Qualidade', autor: 'M. Souza', turma: 'Turma 02 · 21/01', cargaHoraria: '02:30:00', situacao: 'REALIZADO', inicioInscricoes: '05/01/2026', fimInscricoes: '18/01/2026' },
  { treinamento: 'Política Institucional — Segurança', autor: 'L. Andrade', turma: 'Turma 08 · 09/02', cargaHoraria: '02:00:00', situacao: 'REALIZADO', inicioInscricoes: '20/01/2026', fimInscricoes: '05/02/2026' },
  { treinamento: 'Prevenção de Quedas', autor: 'Carlos E. Moura', turma: 'Turma 04 · 24/02', cargaHoraria: '01:30:00', situacao: 'REALIZADO', inicioInscricoes: '06/02/2026', fimInscricoes: '20/02/2026' },
  { treinamento: 'Higienização das Mãos — Cinco Momentos', autor: 'Ana Paula Ribeiro', turma: 'Turma 01 · 10/03', cargaHoraria: '01:00:00', situacao: 'REALIZADO', inicioInscricoes: '20/02/2026', fimInscricoes: '05/03/2026' },
  { treinamento: 'Acolhimento e Classificação de Risco', autor: 'Fernanda Lima', turma: 'Turma 07 · 26/03', cargaHoraria: '03:00:00', situacao: 'AGENDADO', inicioInscricoes: '10/03/2026', fimInscricoes: '24/03/2026' },
  { treinamento: 'Prevenção e Controle de Infecção Hospitalar', autor: 'S. Barreto', turma: 'Turma 03 · 08/04', cargaHoraria: '04:00:00', situacao: 'REALIZADO', inicioInscricoes: '22/03/2026', fimInscricoes: '05/04/2026' },
  { treinamento: 'Ventilação Mecânica — Fundamentos', autor: 'M. Souza', turma: 'Turma 05 · 21/04', cargaHoraria: '05:00:00', situacao: 'AGENDADO', inicioInscricoes: '03/04/2026', fimInscricoes: '17/04/2026' },
  { treinamento: 'Uso Racional de Antimicrobianos', autor: 'R. Menezes', turma: 'Turma 02 · 06/05', cargaHoraria: '02:00:00', situacao: 'REALIZADO', inicioInscricoes: '18/04/2026', fimInscricoes: '02/05/2026' },
  { treinamento: 'Manejo de Feridas e Curativos', autor: 'L. Andrade', turma: 'Turma 06 · 19/05', cargaHoraria: '03:30:00', situacao: 'REALIZADO', inicioInscricoes: '01/05/2026', fimInscricoes: '15/05/2026' },
  { treinamento: 'Ética Profissional e Sigilo do Paciente', autor: 'Carlos E. Moura', turma: 'Turma 04 · 02/06', cargaHoraria: '01:30:00', situacao: 'NÃO REALIZADO', inicioInscricoes: '14/05/2026', fimInscricoes: '29/05/2026' },
  { treinamento: 'Brigada de Incêndio — Reciclagem Anual', autor: 'Ana Paula Ribeiro', turma: 'Turma 01 · 17/06', cargaHoraria: '04:00:00', situacao: 'REALIZADO', inicioInscricoes: '29/05/2026', fimInscricoes: '12/06/2026' },
  { treinamento: 'Comunicação de Más Notícias', autor: 'Fernanda Lima', turma: 'Turma 08 · 07/07', cargaHoraria: '02:00:00', situacao: 'AGENDADO', inicioInscricoes: '19/06/2026', fimInscricoes: '03/07/2026' },
  { treinamento: 'Protocolo de Sepse — Identificação Precoce', autor: 'S. Barreto', turma: 'Turma 03 · 22/07', cargaHoraria: '03:00:00', situacao: 'REALIZADO', inicioInscricoes: '03/07/2026', fimInscricoes: '17/07/2026' },
  { treinamento: 'Cuidados Paliativos — Introdução', autor: 'M. Souza', turma: 'Turma 05 · 11/08', cargaHoraria: '02:30:00', situacao: 'REALIZADO', inicioInscricoes: '24/07/2026', fimInscricoes: '07/08/2026' },
  { treinamento: 'Registro e Prontuário Eletrônico', autor: 'R. Menezes', turma: 'Turma 02 · 26/08', cargaHoraria: '01:30:00', situacao: 'AGENDADO', inicioInscricoes: '08/08/2026', fimInscricoes: '21/08/2026' }
];
