import {
  ViewType,
  MonthData,
  TrainingTypeData,
  AgendaItem,
  InternalTraining,
  JobPositionData,
  CostCenterRow,
  KPIItem
} from '../types';
import { DateFilterValue } from '../components/DateFilterPicker';

// Hash helper for deterministic variations based on filter strings
export function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generates simulated datasets reactively
export function getSimulatedData(
  view: ViewType,
  dateFilter: DateFilterValue,
  activeFilters: Record<string, string | string[]>,
  afastados: boolean
) {
  const { year, month, mode } = dateFilter;

  const parseVal = (val: string | string[] | undefined): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (val === 'Todos' || val.endsWith(' Geral') || val.startsWith('Todas')) return [];
    return [val];
  };

  const unidade = (typeof activeFilters['Unidades'] === 'string' ? activeFilters['Unidades'] : 'Todas as unidades') || 'Todas as unidades';
  const tipoTreinamento = (typeof activeFilters['Tipo de Treinamento'] === 'string' ? activeFilters['Tipo de Treinamento'] : 'Todos os tipos') || 'Todos os tipos';
  const gerente = (typeof activeFilters['Gerente'] === 'string' ? activeFilters['Gerente'] : 'Todos') || 'Todos';
  const supervisor = (typeof activeFilters['Supervisor'] === 'string' ? activeFilters['Supervisor'] : 'Todos') || 'Todos';
  const centroCusto = (typeof activeFilters['Centro de custo'] === 'string' ? activeFilters['Centro de custo'] : 'Todos') || 'Todos';
  const gestor = (typeof activeFilters['Gestor'] === 'string' ? activeFilters['Gestor'] : 'Todos') || 'Todos';

  const cargos = parseVal(activeFilters['Cargo'] || activeFilters['cargo']);
  const setores = parseVal(activeFilters['Setor'] || activeFilters['setor']);
  const instrutores = parseVal(activeFilters['Instrutor'] || activeFilters['instrutor']);
  const treinamentos = parseVal(activeFilters['Treinamento'] || activeFilters['treinamento']);

  // Seed composite
  const seedString = `${year}-${month}-${mode}-${unidade}-${tipoTreinamento}-${gerente}-${supervisor}-${cargos.slice().sort().join(',')}-${centroCusto}-${gestor}-${afastados}-${setores.slice().sort().join(',')}-${instrutores.slice().sort().join(',')}-${treinamentos.slice().sort().join(',')}`;
  const seed = stringHash(seedString);

  // Multipliers based on Unidade
  let unitMultiplier = 1.0;
  if (unidade === 'Hospital Unimed') unitMultiplier = 0.58;
  else if (unidade === 'Pronto Atendimento') unitMultiplier = 0.22;
  else if (unidade === 'Unidade Retiro') unitMultiplier = 0.12;
  else if (unidade === 'Sede Administrativa') unitMultiplier = 0.08;

  // Multipliers based on Tipo de Treinamento
  let tipoMultiplier = 1.0;
  if (tipoTreinamento !== 'Todos os tipos' && tipoTreinamento !== 'Todos') {
    tipoMultiplier = 0.45;
  }

  // Selected filter counts
  const totalSelectedFilters = cargos.length + setores.length + instrutores.length + treinamentos.length;

  // Base growth: each selected item adds +25% cumulatively to chart values
  // 0 items: 1.0x, 1 item: 1.25x, 2 items: 1.50x, 3 items: 1.75x, 4 items: 2.0x, etc.
  const filterGrowthMultiplier = 1.0 + (totalSelectedFilters * 0.25);

  let specificFilterMultiplier = filterGrowthMultiplier;
  if (gerente !== 'Todos') specificFilterMultiplier *= 1.15;
  if (supervisor !== 'Todos') specificFilterMultiplier *= 1.12;
  if (centroCusto !== 'Todos') specificFilterMultiplier *= 1.15;
  if (gestor !== 'Todos') specificFilterMultiplier *= 1.12;

  const totalMultiplier = unitMultiplier * tipoMultiplier * specificFilterMultiplier;

  // Month names abbreviation
  const monthAbbrs = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // 1. Generate 12 Months timeline ending in selected date or current period
  const baseMonthlyData: MonthData[] = [];
  
  // Build a 12-month rolling sequence ending at the selected year/month
  const startMonthIndex = (month + 1) % 12;
  const startYear = month === 11 ? year : year - 1;

  for (let i = 0; i < 12; i++) {
    const curMIndex = (startMonthIndex + i) % 12;
    const curYearVal = startMonthIndex + i >= 12 ? startYear + 1 : startYear;
    const mStr = `${monthAbbrs[curMIndex]}/${String(curYearVal).slice(2)}`;

    // Pseudo-random monthly variation based on seed and month index
    const mSeed = (seed + i * 37 + curMIndex * 13) % 100;
    const prevCount = Math.max(1, Math.round((3 + (mSeed % 4)) * totalMultiplier));
    const realCount = Math.max(0, Math.min(prevCount, Math.round(prevCount * (0.65 + (mSeed % 30) / 100))));

    const baseAtivos = Math.round((1200 + (curMIndex * 4) + (mSeed % 15)) * unitMultiplier * totalMultiplier);
    const ativosCount = afastados ? baseAtivos : Math.round(baseAtivos * 0.95);
    
    const colabTreinados = Math.round(ativosCount * (0.45 + (mSeed % 35) / 100) * (tipoMultiplier < 1 ? 0.6 : 1));
    const totalParticipantes = Math.round(colabTreinados * (2.8 + (mSeed % 10) / 10));
    const horasTreinadas = Math.round(totalParticipantes * (1.15 + (mSeed % 8) / 20));
    const qtdTreinamentos = Math.max(2, Math.round((12 + (mSeed % 12)) * totalMultiplier));

    baseMonthlyData.push({
      mesAno: mStr,
      previsto: prevCount,
      realizado: realCount,
      ativos: ativosCount,
      colabTreinados,
      totalParticipantes,
      horasTreinadas,
      qtdTreinamentos
    });
  }

  // 2. Training Types Data
  const baseTipos = [
    { nome: 'Institucional', previstoBase: 23, realizadoBase: 16 },
    { nome: 'Institucional - Assistencial', previstoBase: 27, realizadoBase: 22 },
    { nome: 'Comportamental', previstoBase: 14, realizadoBase: 9 },
    { nome: 'Técnico / Operacional', previstoBase: 11, realizadoBase: 8 },
    { nome: 'Obrigatório (NR)', previstoBase: 9, realizadoBase: 8 }
  ];

  let trainingTypes: TrainingTypeData[] = baseTipos.map((t, idx) => {
    const tSeed = (seed + idx * 29) % 50;
    const p = Math.max(1, Math.round(t.previstoBase * totalMultiplier * (0.8 + tSeed / 100)));
    const r = Math.max(0, Math.min(p, Math.round(t.realizadoBase * totalMultiplier * (0.75 + tSeed / 100))));
    return {
      nome: t.nome,
      previsto: p,
      realizado: r
    };
  });

  if (tipoTreinamento !== 'Todos os tipos' && tipoTreinamento !== 'Todos') {
    trainingTypes = trainingTypes.filter(t => t.nome.toLowerCase().includes(tipoTreinamento.toLowerCase()) || tipoTreinamento.toLowerCase().includes(t.nome.toLowerCase()));
    if (trainingTypes.length === 0) {
      trainingTypes = [{ nome: tipoTreinamento, previsto: Math.round(18 * totalMultiplier), realizado: Math.round(14 * totalMultiplier) }];
    }
  }

  // 3. Agenda Data
  const allAgenda: AgendaItem[] = [
    { mesAno: `Jan/${String(year).slice(2)}`, nome: 'Ferramentas de melhoria de processos e prevenção de desperdício', tipo: 'Institucional', status: 'NÃO REALIZADO' },
    { mesAno: `Jan/${String(year).slice(2)}`, nome: 'Protocolo Institucional de Prevenção de Aspiração Broncopulmonar', tipo: 'Inst. - Assistencial', status: 'REALIZADO' },
    { mesAno: `Fev/${String(year).slice(2)}`, nome: 'Precauções e Isolamento Hospitalar', tipo: 'Inst. - Assistencial', status: 'REALIZADO' },
    { mesAno: `Mar/${String(year).slice(2)}`, nome: 'NR32 e Biossegurança em Serviços de Saúde', tipo: 'Obrigatório (NR)', status: 'REALIZADO' },
    { mesAno: `Abr/${String(year).slice(2)}`, nome: 'Código de Conduta, Ética e Compliance', tipo: 'Institucional', status: 'REALIZADO' },
    { mesAno: `Mai/${String(year).slice(2)}`, nome: 'Segurança do Paciente — 6 Metas Internacionais', tipo: 'Inst. - Assistencial', status: 'AGENDADO' },
    { mesAno: `Jun/${String(year).slice(2)}`, nome: 'Comunicação Não Violenta no Atendimento e Liderança', tipo: 'Comportamental', status: 'NÃO REALIZADO' },
    { mesAno: `Jul/${String(year).slice(2)}`, nome: 'Capacitação em Ventilação Mecânica e Gasometria', tipo: 'Técnico / Operacional', status: 'REALIZADO' },
    { mesAno: `Ago/${String(year).slice(2)}`, nome: 'Acolhimento com Classificação de Risco no PA', tipo: 'Inst. - Assistencial', status: 'AGENDADO' },
    { mesAno: `Set/${String(year).slice(2)}`, nome: 'Prevenção de Quedas e Lesões por Pressão', tipo: 'Inst. - Assistencial', status: 'AGENDADO' },
    { mesAno: `Out/${String(year).slice(2)}`, nome: 'Brigada de Incêndio e Evacuação NR23', tipo: 'Obrigatório (NR)', status: 'AGENDADO' },
    { mesAno: `Nov/${String(year).slice(2)}`, nome: 'Auditoria de Prontuário e Prevenção de Glosas', tipo: 'Técnico / Operacional', status: 'AGENDADO' }
  ];

  let agendaItems = allAgenda;
  if (tipoTreinamento !== 'Todos os tipos' && tipoTreinamento !== 'Todos') {
    agendaItems = allAgenda.filter(a => a.tipo.toLowerCase().includes(tipoTreinamento.toLowerCase().slice(0, 5)));
    if (agendaItems.length === 0) agendaItems = allAgenda.slice(0, 3);
  }

  // 4. Internal Trainings List
  const rawInternals = [
    { nome: 'Integração Institucional — Visita Técnica', baseHours: 2799 },
    { nome: 'Protocolo de Cirurgia Segura', baseHours: 1891 },
    { nome: 'Política Institucional — Gestão da Qualidade', baseHours: 1178 },
    { nome: 'Política Institucional — Segurança do Paciente', baseHours: 1059 },
    { nome: 'Protocolo de Prevenção de Quedas', baseHours: 842 },
    { nome: 'Treinamento de Suporte Básico de Vida (BLS)', baseHours: 720 },
    { nome: 'Higienização das Mãos e Controle de Infecção', baseHours: 650 },
    { nome: 'Administração Segura de Medicamentos de Alta Vigilância', baseHours: 580 }
  ];

  const internalTrainings: InternalTraining[] = rawInternals.slice(0, 5).map((it, i) => {
    const val = Math.max(50, Math.round(it.baseHours * totalMultiplier * (0.85 + ((seed + i * 17) % 30) / 100)));
    const mins = ((seed + i * 7) % 60).toString().padStart(2, '0');
    return {
      nome: it.nome,
      horasVal: val,
      horasFormatted: `${val}:${mins}:00`
    };
  });

  // 5. Job Positions
  const allPositions = [
    { cargo: 'Técnico de Enfermagem', basePart: 12131, baseAtivos: 312, baseTreinados: 268 },
    { cargo: 'Enfermeiro', basePart: 2976, baseAtivos: 148, baseTreinados: 121 },
    { cargo: 'Terceiro', basePart: 2184, baseAtivos: 96, baseTreinados: 44 },
    { cargo: 'Fisioterapeuta', basePart: 1069, baseAtivos: 58, baseTreinados: 41 },
    { cargo: 'Auxiliar de Farmácia', basePart: 840, baseAtivos: 44, baseTreinados: 31 },
    { cargo: 'Técnico de Radiologia', basePart: 683, baseAtivos: 38, baseTreinados: 24 },
    { cargo: 'Auxiliar Técnico', basePart: 676, baseAtivos: 36, baseTreinados: 22 },
    { cargo: 'Técnico de Patologia', basePart: 416, baseAtivos: 26, baseTreinados: 15 },
    { cargo: 'Atendente', basePart: 415, baseAtivos: 25, baseTreinados: 12 },
    { cargo: 'Recepcionista', basePart: 357, baseAtivos: 96, baseTreinados: 62 }
  ];

  let jobPositions: JobPositionData[] = allPositions.map((jp, i) => {
    const pSeed = (seed + i * 19) % 30;
    const part = Math.max(15, Math.round(jp.basePart * totalMultiplier * (0.8 + pSeed / 100)));
    const ativ = Math.max(5, Math.round(jp.baseAtivos * unitMultiplier * (afastados ? 1 : 0.94)));
    const trein = Math.max(2, Math.min(ativ, Math.round(ativ * (0.55 + pSeed / 100))));
    return {
      cargo: jp.cargo,
      participantes: part,
      ativos: ativ,
      treinados: trein
    };
  });

  if (cargos.length > 0) {
    jobPositions = jobPositions.filter(j => cargos.includes(j.cargo));
    if (jobPositions.length === 0) {
      jobPositions = cargos.map(c => ({
        cargo: c,
        participantes: Math.round(1450 * totalMultiplier),
        ativos: 48,
        treinados: 39
      }));
    }
  }

  // 6. Cost Center Rows
  const allCostCenters: CostCenterRow[] = [
    { area: 'Centro Cirúrgico', gestor: 'Ana Paula Ribeiro', supervisor: 'M. Tavares', treinamento: 'Segurança do Paciente', aula: `Turma 04 · 12/${String(month + 1).padStart(2, '0')}`, instrutor: 'R. Menezes', inscritos: 32, realizaram: 29, turmasPlanejadas: 4, turmasExcedentes: 1 },
    { area: 'UTI Adulto', gestor: 'Carlos E. Moura', supervisor: 'S. Barreto', treinamento: 'Ventilação Mecânica', aula: `Turma 02 · 18/${String(month + 1).padStart(2, '0')}`, instrutor: 'L. Andrade', inscritos: 28, realizaram: 21, turmasPlanejadas: 3, turmasExcedentes: 0 },
    { area: 'Pronto Atendimento', gestor: 'Fernanda Lima', supervisor: 'M. Tavares', treinamento: 'Acolhimento e Classificação', aula: `Turma 07 · 03/${String(month + 1).padStart(2, '0')}`, instrutor: 'M. Souza', inscritos: 41, realizaram: 24, turmasPlanejadas: 5, turmasExcedentes: 2 },
    { area: 'Internação Clínica', gestor: 'Rodrigo Salles', supervisor: 'S. Barreto', treinamento: 'Prevenção de Quedas', aula: `Turma 01 · 09/${String(month + 1).padStart(2, '0')}`, instrutor: 'R. Menezes', inscritos: 36, realizaram: 33, turmasPlanejadas: 4, turmasExcedentes: 1 },
    { area: 'Faturamento', gestor: 'Juliana Costa', supervisor: 'A. Peixoto', treinamento: 'Glosas e Auditoria', aula: `Turma 03 · 21/${String(month + 1).padStart(2, '0')}`, instrutor: 'P. Vieira', inscritos: 18, realizaram: 9, turmasPlanejadas: 2, turmasExcedentes: 1 },
    { area: 'Recepção / SAC', gestor: 'Marcos Antunes', supervisor: 'A. Peixoto', treinamento: 'Atendimento Humanizado', aula: `Turma 05 · 05/${String(month + 1).padStart(2, '0')}`, instrutor: 'C. Duarte', inscritos: 26, realizaram: 17, turmasPlanejadas: 3, turmasExcedentes: 1 },
    { area: 'Hemodiálise', gestor: 'Patrícia Nunes', supervisor: 'S. Barreto', treinamento: 'Biossegurança', aula: `Turma 02 · 14/${String(month + 1).padStart(2, '0')}`, instrutor: 'L. Andrade', inscritos: 22, realizaram: 20, turmasPlanejadas: 2, turmasExcedentes: 0 }
  ];

  let costCenterRows = allCostCenters.filter(row => {
    if (centroCusto !== 'Todos' && row.area !== centroCusto) return false;
    if (gestor !== 'Todos' && row.gestor !== gestor) return false;
    if (supervisor !== 'Todos' && row.supervisor !== supervisor) return false;
    if (setores.length > 0 && !setores.includes(row.area)) return false;
    if (instrutores.length > 0 && !instrutores.includes(row.instrutor)) return false;
    if (treinamentos.length > 0 && !treinamentos.includes(row.treinamento)) return false;
    return true;
  });

  if (costCenterRows.length === 0) {
    costCenterRows = [{
      area: setores.length > 0 ? setores[0] : (centroCusto !== 'Todos' ? centroCusto : 'Centro Cirúrgico'),
      gestor: gestor !== 'Todos' ? gestor : 'Ana Paula Ribeiro',
      supervisor: supervisor !== 'Todos' ? supervisor : 'M. Tavares',
      treinamento: treinamentos.length > 0 ? treinamentos[0] : (tipoTreinamento !== 'Todos os tipos' ? tipoTreinamento : 'Segurança do Paciente'),
      aula: `Turma 01 · 15/${String(month + 1).padStart(2, '0')}`,
      instrutor: instrutores.length > 0 ? instrutores[0] : 'R. Menezes',
      inscritos: Math.round(30 * totalMultiplier),
      realizaram: Math.round(25 * totalMultiplier),
      turmasPlanejadas: 3,
      turmasExcedentes: 1
    }];
  }

  // 7. Dynamic KPIs calculation for the active view — every card uses the same teal accent
  // for its top border, matching the brand's primary color instead of mixing in orange/red.
  const navy = '#004e4c';

  let kpis: KPIItem[] = [];

  if (view === 'Treinamentos Institucionais') {
    const totPrevisto = trainingTypes.reduce((acc, t) => acc + t.previsto, 0) || Math.round(50 * totalMultiplier);
    const totRealizado = trainingTypes.reduce((acc, t) => acc + t.realizado, 0) || Math.round(27 * totalMultiplier);
    const totAgendado = Math.max(1, Math.round((totPrevisto - totRealizado) * 0.45));
    const totNaoRealizado = Math.max(0, totPrevisto - totRealizado - totAgendado);
    const pctRealizacao = totPrevisto > 0 ? ((totRealizado / totPrevisto) * 100).toFixed(1).replace('.', ',') : '0';

    kpis = [
      { label: 'Total Previsto', value: String(totPrevisto), unit: '', delta: `em ${dateFilter.displayText}`, barColor: navy },
      { label: 'Agendado', value: String(totAgendado), unit: '', delta: 'aguardando execução', barColor: navy },
      { label: 'Realizado', value: String(totRealizado), unit: '', delta: 'turmas concluídas', barColor: navy },
      { label: 'Não Realizado', value: String(totNaoRealizado), unit: '', delta: 'canceladas ou pendentes', barColor: navy },
      { label: 'Percentual de Realização', value: pctRealizacao, unit: '%', delta: 'realizado ÷ previsto', barColor: navy }
    ];
  } else if (view === 'Treinamentos Internos') {
    const sumTreinamentos = baseMonthlyData.reduce((acc, m) => acc + m.qtdTreinamentos, 0);
    const sumParticipantes = baseMonthlyData.reduce((acc, m) => acc + m.totalParticipantes, 0);
    const sumColab = Math.round(jobPositions.reduce((acc, j) => acc + j.treinados, 0) * 1.6);
    const sumHoras = baseMonthlyData.reduce((acc, m) => acc + m.horasTreinadas, 0);

    kpis = [
      { label: 'Qtd. Treinamentos Internos', value: sumTreinamentos.toLocaleString('pt-BR'), unit: '', delta: `eventos em ${dateFilter.displayText}`, barColor: navy },
      { label: 'Qtd. Total Participantes', value: sumParticipantes.toLocaleString('pt-BR'), unit: '', delta: 'participações registradas', barColor: navy },
      { label: 'Qtd. Colab. Treinados', value: sumColab.toLocaleString('pt-BR'), unit: '', delta: 'colaboradores distintos', barColor: navy },
      { label: 'Horas Treinadas', value: `${sumHoras.toLocaleString('pt-BR')}:00`, unit: 'h', delta: 'somatório de carga horária', barColor: navy }
    ];
  } else {
    // Centro de Custo
    const ccCount = costCenterRows.length > 0 ? (centroCusto !== 'Todos' ? 1 : Math.round(38 * unitMultiplier)) : 0;
    const totInscritos = costCenterRows.reduce((acc, r) => acc + r.inscritos, 0);
    const totRealizaram = costCenterRows.reduce((acc, r) => acc + r.realizaram, 0);
    const taxaAdesao = totInscritos > 0 ? ((totRealizaram / totInscritos) * 100).toFixed(1).replace('.', ',') : '0';

    const totPlan = costCenterRows.reduce((acc, r) => acc + r.turmasPlanejadas, 0);
    const totExc = costCenterRows.reduce((acc, r) => acc + r.turmasExcedentes, 0);
    const taxaEsforco = totPlan > 0 ? ((totExc / totPlan) * 100).toFixed(1).replace('.', ',') : '0';

    const baseInscritosVal = afastados ? Math.round(1284 * unitMultiplier * specificFilterMultiplier) : Math.round(1221 * unitMultiplier * specificFilterMultiplier);
    const baseRealizadosVal = Math.round(baseInscritosVal * 0.75);
    const afastadosDiff = Math.round(63 * unitMultiplier);

    kpis = [
      { label: 'Centros de custo', value: String(ccCount || costCenterRows.length), unit: '', delta: `com treinamento no período`, barColor: navy },
      {
        label: 'Usuários inscritos',
        value: baseInscritosVal.toLocaleString('pt-BR'),
        unit: '',
        delta: afastados ? `inclui ${afastadosDiff} afastados` : `${afastadosDiff} afastados fora da base`,
        barColor: navy
      },
      { label: 'Usuários que realizaram', value: baseRealizadosVal.toLocaleString('pt-BR'), unit: '', delta: `${(baseInscritosVal - baseRealizadosVal).toLocaleString('pt-BR')} sem adesão`, barColor: navy },
      { label: 'Adesão mensal média', value: taxaAdesao, unit: '%', delta: 'inscritos x realizados', barColor: navy },
      { label: 'Esforço extra', value: taxaEsforco, unit: '%', delta: `${totExc} turmas excedentes de ${totPlan}`, barColor: navy }
    ];
  }

  return {
    monthlyData: baseMonthlyData,
    trainingTypesData: trainingTypes,
    agendaData: agendaItems,
    internalTrainingsData: internalTrainings,
    jobPositionsData: jobPositions,
    costCenterRowsData: costCenterRows,
    kpis,
    growthMultiplier: filterGrowthMultiplier
  };
}
