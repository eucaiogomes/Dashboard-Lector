import React from 'react';
import { ViewType } from '../types';

interface OtherViewsProps {
  activeItem: string;
  onGoToIndicadores: (subView?: ViewType) => void;
}

export const OtherViews: React.FC<OtherViewsProps> = ({ activeItem, onGoToIndicadores }) => {
  if (activeItem === 'Dashboard') {
    return (
      <div className="p-7 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12.5px] text-[#6b7684] flex items-center gap-1.5 font-medium">
              <span>Minha Área</span>
              <span className="text-[#b6bdc7]">/</span>
              <span className="text-[#eb6200] font-semibold">Dashboard Executivo</span>
            </div>
            <h1 className="mt-1.5 text-[26px] font-bold text-[#183a75] tracking-tight flex items-center gap-2.5">
              <i className="icon-dashboard text-[24px] text-[#183a75]"></i>
              Visão Geral de Aprendizagem &amp; Desenvolvimento
            </h1>
            <p className="mt-1 text-[13.5px] text-[#6b7684]">
              Panorama consolidado dos programas de capacitação, adesão e capacitação contínua — Unimed Volta Redonda.
            </p>
          </div>

          <button
            onClick={() => onGoToIndicadores('Treinamentos Institucionais')}
            className="h-[38px] px-4.5 bg-[#183a75] hover:bg-[#122c59] text-white text-[13px] font-semibold rounded-[4px] cursor-pointer transition-colors flex items-center gap-2 shadow-2xs"
          >
            <i className="icon-performance text-[14px]"></i>
            Abrir Indicadores T&amp;D Detalhados
          </button>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-lg border border-[#e0e4ea] shadow-xs">
            <div className="text-[12px] font-medium text-[#6b7684] flex items-center justify-between">
              <span>Colaboradores Ativos</span>
              <i className="icon-participants text-[#183a75] text-[15px]"></i>
            </div>
            <div className="mt-2 text-[24px] font-bold text-[#183a75]">2.148</div>
            <div className="text-[11px] text-[#0f6b3f] mt-1 font-medium flex items-center gap-1">
              <span>● Base atualizada (Ago/2026)</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#e0e4ea] shadow-xs">
            <div className="text-[12px] font-medium text-[#6b7684] flex items-center justify-between">
              <span>Horas de Treinamento</span>
              <i className="icon-calendar-today text-[#183a75] text-[15px]"></i>
            </div>
            <div className="mt-2 text-[24px] font-bold text-[#183a75]">18.420h</div>
            <div className="text-[11px] text-[#0f6b3f] mt-1 font-medium flex items-center gap-1">
              <span>▲ +12% vs. período anterior</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#e0e4ea] shadow-xs">
            <div className="text-[12px] font-medium text-[#6b7684] flex items-center justify-between">
              <span>Média Horas/Colab.</span>
              <i className="icon-performance text-[#183a75] text-[15px]"></i>
            </div>
            <div className="mt-2 text-[24px] font-bold text-[#183a75]">8,57h</div>
            <div className="text-[11px] text-[#6b7684] mt-1 font-medium">Meta anual: 10h/colab</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#e0e4ea] shadow-xs">
            <div className="text-[12px] font-medium text-[#6b7684] flex items-center justify-between">
              <span>Adesão Geral</span>
              <i className="icon-like text-[#0f6b3f] text-[15px]"></i>
            </div>
            <div className="mt-2 text-[24px] font-bold text-[#0f6b3f]">88,4%</div>
            <div className="text-[11px] text-[#0f6b3f] mt-1 font-medium">Acima da meta (85%)</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#e0e4ea] shadow-xs">
            <div className="text-[12px] font-medium text-[#6b7684] flex items-center justify-between">
              <span>Treinamentos Ativos</span>
              <i className="icon-courses text-[#eb6200] text-[15px]"></i>
            </div>
            <div className="mt-2 text-[24px] font-bold text-[#eb6200]">42</div>
            <div className="text-[11px] text-[#6b7684] mt-1 font-medium">18 Obrigatórios / NR</div>
          </div>
        </div>

        {/* Action modules cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            onClick={() => onGoToIndicadores('Treinamentos Institucionais')}
            className="bg-white p-5 rounded-lg border border-[#dfe4ea] hover:border-[#183a75] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded bg-[#183a75]/10 flex items-center justify-center text-[#183a75] mb-3">
                <i className="icon-legal-document text-[18px]"></i>
              </div>
              <h3 className="text-[16px] font-bold text-[#183a75]">Treinamentos Institucionais</h3>
              <p className="text-[12.5px] text-[#6b7684] mt-1.5 leading-relaxed">
                Acompanhe o previsto vs. realizado, agenda mensal e percentual de realização por tipo de capacitação.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eef0f3] flex items-center justify-between text-[12.5px] font-semibold text-[#183a75]">
              <span>Ver relatórios institucionais</span>
              <i className="icon-pointer-right text-[11px]"></i>
            </div>
          </div>

          <div
            onClick={() => onGoToIndicadores('Treinamentos Internos')}
            className="bg-white p-5 rounded-lg border border-[#dfe4ea] hover:border-[#183a75] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded bg-[#0f6b3f]/10 flex items-center justify-center text-[#0f6b3f] mb-3">
                <i className="icon-courses text-[18px]"></i>
              </div>
              <h3 className="text-[16px] font-bold text-[#183a75]">Treinamentos Internos</h3>
              <p className="text-[12.5px] text-[#6b7684] mt-1.5 leading-relaxed">
                Análise de participação presencial, colaboradores treinados, horas aplicadas e ranking detalhado por cargo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eef0f3] flex items-center justify-between text-[12.5px] font-semibold text-[#0f6b3f]">
              <span>Ver participação e cargos</span>
              <i className="icon-pointer-right text-[11px]"></i>
            </div>
          </div>

          <div
            onClick={() => onGoToIndicadores('Por Centro de Custo')}
            className="bg-white p-5 rounded-lg border border-[#dfe4ea] hover:border-[#183a75] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded bg-[#eb6200]/10 flex items-center justify-center text-[#eb6200] mb-3">
                <i className="icon-manage text-[18px]"></i>
              </div>
              <h3 className="text-[16px] font-bold text-[#183a75]">Por Centro de Custo</h3>
              <p className="text-[12.5px] text-[#6b7684] mt-1.5 leading-relaxed">
                Desempenho por setor, gestor e supervisor com turmas planejadas, excedentes e cálculo de esforço extra.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eef0f3] flex items-center justify-between text-[12.5px] font-semibold text-[#eb6200]">
              <span>Ver análise por área</span>
              <i className="icon-pointer-right text-[11px]"></i>
            </div>
          </div>
        </div>

        {/* Recent Schedule Banner */}
        <div className="bg-white p-5 rounded-lg border border-[#dfe4ea]">
          <div className="flex items-center justify-between pb-3 border-b border-[#eef0f3]">
            <div className="flex items-center gap-2">
              <i className="icon-calendar text-[#183a75] text-[16px]"></i>
              <h3 className="text-[15px] font-bold text-[#183a75]">Próximos Treinamentos Agendados</h3>
            </div>
            <span className="text-[12px] text-[#6b7684]">Agosto / Setembro 2026</span>
          </div>
          <div className="divide-y divide-[#f0f3f7] mt-2">
            <div className="py-2.5 flex items-center justify-between text-[13px]">
              <div>
                <span className="font-semibold text-[#1f2733]">NR-32: Segurança e Saúde no Trabalho em Serviços de Saúde</span>
                <span className="ml-2 text-xs text-[#eb6200] font-medium bg-[#eb6200]/10 px-2 py-0.5 rounded">Obrigatório</span>
              </div>
              <div className="text-right text-[#6b7684] text-xs">
                <span>02/09/2026 · Auditório Hospital Unimed (35 vagas)</span>
              </div>
            </div>
            <div className="py-2.5 flex items-center justify-between text-[13px]">
              <div>
                <span className="font-semibold text-[#1f2733]">Atendimento Humanizado e Experiência do Paciente Unimed</span>
                <span className="ml-2 text-xs text-[#183a75] font-medium bg-[#183a75]/10 px-2 py-0.5 rounded">Institucional</span>
              </div>
              <div className="text-right text-[#6b7684] text-xs">
                <span>05/09/2026 · Sala de Treinamento Sede (28 vagas)</span>
              </div>
            </div>
            <div className="py-2.5 flex items-center justify-between text-[13px]">
              <div>
                <span className="font-semibold text-[#1f2733]">Prevenção e Controle de Infecção Hospitalar (SCIH)</span>
                <span className="ml-2 text-xs text-[#0f6b3f] font-medium bg-[#0f6b3f]/10 px-2 py-0.5 rounded">Assistencial</span>
              </div>
              <div className="text-right text-[#6b7684] text-xs">
                <span>10/09/2026 · EAD / Turma Prática (40 vagas)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeItem === 'NR-1') {
    return (
      <div className="p-7 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12.5px] text-[#6b7684] flex items-center gap-1.5 font-medium">
              <span>Minha Área</span>
              <span className="text-[#b6bdc7]">/</span>
              <span className="text-[#eb6200] font-semibold">NR-1 — Disposições Gerais e GRO</span>
            </div>
            <h1 className="mt-1.5 text-[26px] font-bold text-[#183a75] tracking-tight flex items-center gap-2.5">
              <i className="icon-legal-document text-[24px] text-[#183a75]"></i>
              Conformidade NR-1 &amp; Gerenciamento de Riscos Ocupacionais
            </h1>
            <p className="mt-1 text-[13.5px] text-[#6b7684]">
              Monitoramento dos treinamentos admissionais, periódicos e reciclagens obrigatórias conforme diretrizes normativas.
            </p>
          </div>
          <button
            onClick={() => onGoToIndicadores('Treinamentos Institucionais')}
            className="h-[38px] px-4.5 bg-white border border-[#cfd6e0] hover:border-[#183a75] text-[#183a75] text-[13px] font-semibold rounded-[4px] cursor-pointer transition-colors flex items-center gap-2"
          >
            <i className="icon-performance text-[14px]"></i>
            Ver Indicadores Gerais
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-lg border border-[#e0e4ea]">
            <div className="text-xs text-[#6b7684] font-medium">Índice Geral de Conformidade</div>
            <div className="text-2xl font-bold text-[#0f6b3f] mt-1.5">94,2%</div>
            <div className="text-[11px] text-[#0f6b3f] mt-1">Conforme auditoria periódica</div>
          </div>
          <div className="bg-white p-4.5 rounded-lg border border-[#e0e4ea]">
            <div className="text-xs text-[#6b7684] font-medium">Treinados / Vigentes</div>
            <div className="text-2xl font-bold text-[#183a75] mt-1.5">2.024</div>
            <div className="text-[11px] text-[#6b7684] mt-1">De 2.148 ativos elegíveis</div>
          </div>
          <div className="bg-white p-4.5 rounded-lg border border-[#e0e4ea]">
            <div className="text-xs text-[#6b7684] font-medium">Pendências em Regularização</div>
            <div className="text-2xl font-bold text-[#eb6200] mt-1.5">124</div>
            <div className="text-[11px] text-[#eb6200] mt-1">Turmas convocadas para o mês</div>
          </div>
          <div className="bg-white p-4.5 rounded-lg border border-[#e0e4ea]">
            <div className="text-xs text-[#6b7684] font-medium">Reciclagens Vencendo (30d)</div>
            <div className="text-2xl font-bold text-[#1f2733] mt-1.5">38</div>
            <div className="text-[11px] text-[#6b7684] mt-1">Notificações automáticas enviadas</div>
          </div>
        </div>

        {/* NR compliance table */}
        <div className="bg-white rounded-lg border border-[#dfe4ea] overflow-hidden">
          <div className="p-4 border-b border-[#eef0f3] flex items-center justify-between">
            <h3 className="text-[14.5px] font-bold text-[#183a75]">Treinamentos Regulamentares por Unidade</h3>
            <span className="text-xs text-[#6b7684]">Status Atual</span>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[#4a5462] font-semibold border-b border-[#dfe4ea]">
                <th className="py-2.5 px-4">Norma Regulamentadora</th>
                <th className="py-2.5 px-4">Público-Alvo / Setores</th>
                <th className="py-2.5 px-4 text-center">Elegíveis</th>
                <th className="py-2.5 px-4 text-center">Concluídos</th>
                <th className="py-2.5 px-4 text-center">% Cobertura</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef0f3]">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#183a75]">NR-01 — Integração de Segurança e GRO</td>
                <td className="py-3 px-4 text-[#6b7684]">Todos os colaboradores (Admissional)</td>
                <td className="py-3 px-4 text-center font-medium">2.148</td>
                <td className="py-3 px-4 text-center font-medium text-[#0f6b3f]">2.080</td>
                <td className="py-3 px-4 text-center font-bold text-[#0f6b3f]">96,8%</td>
                <td className="py-3 px-4 text-center"><span className="bg-[#0f6b3f]/10 text-[#0f6b3f] px-2 py-0.5 rounded font-semibold text-[11px]">Regular</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#183a75]">NR-32 — Segurança em Serviços de Saúde</td>
                <td className="py-3 px-4 text-[#6b7684]">Enfermagem, Médicos, Higienização, Laboratório</td>
                <td className="py-3 px-4 text-center font-medium">1.420</td>
                <td className="py-3 px-4 text-center font-medium text-[#0f6b3f]">1.350</td>
                <td className="py-3 px-4 text-center font-bold text-[#0f6b3f]">95,1%</td>
                <td className="py-3 px-4 text-center"><span className="bg-[#0f6b3f]/10 text-[#0f6b3f] px-2 py-0.5 rounded font-semibold text-[11px]">Regular</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#183a75]">NR-05 — CIPA / Prevenção de Acidentes</td>
                <td className="py-3 px-4 text-[#6b7684]">Membros eleitos e designados</td>
                <td className="py-3 px-4 text-center font-medium">64</td>
                <td className="py-3 px-4 text-center font-medium text-[#0f6b3f]">64</td>
                <td className="py-3 px-4 text-center font-bold text-[#0f6b3f]">100%</td>
                <td className="py-3 px-4 text-center"><span className="bg-[#0f6b3f]/10 text-[#0f6b3f] px-2 py-0.5 rounded font-semibold text-[11px]">Regular</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#183a75]">NR-23 — Proteção Contra Incêndio / Brigada</td>
                <td className="py-3 px-4 text-[#6b7684]">Brigadistas voluntários hospitalares</td>
                <td className="py-3 px-4 text-center font-medium">180</td>
                <td className="py-3 px-4 text-center font-medium text-[#eb6200]">158</td>
                <td className="py-3 px-4 text-center font-bold text-[#eb6200]">87,8%</td>
                <td className="py-3 px-4 text-center"><span className="bg-[#eb6200]/10 text-[#eb6200] px-2 py-0.5 rounded font-semibold text-[11px]">Em Reciclagem</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeItem === 'Meus Treinamentos') {
    return (
      <div className="p-7 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12.5px] text-[#6b7684] flex items-center gap-1.5 font-medium">
              <span>Minha Área</span>
              <span className="text-[#b6bdc7]">/</span>
              <span className="text-[#eb6200] font-semibold">Meus Treinamentos</span>
            </div>
            <h1 className="mt-1.5 text-[26px] font-bold text-[#183a75] tracking-tight flex items-center gap-2.5">
              <i className="icon-courses text-[24px] text-[#183a75]"></i>
              Meus Treinamentos &amp; Capacitações
            </h1>
            <p className="mt-1 text-[13.5px] text-[#6b7684]">
              Cursos em andamento, treinamentos concluídos e convocações ativas.
            </p>
          </div>
          <button
            onClick={() => onGoToIndicadores('Treinamentos Institucionais')}
            className="h-[38px] px-4 bg-white border border-[#cfd6e0] hover:border-[#183a75] text-[#183a75] text-[13px] font-semibold rounded-[4px] cursor-pointer transition-colors"
          >
            Ver Indicadores T&amp;D
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-lg border border-[#dfe4ea] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#eb6200] mb-2">
                <span>EM ANDAMENTO</span>
                <span>75%</span>
              </div>
              <h3 className="text-[15px] font-bold text-[#183a75]">Segurança do Paciente &amp; Protocolos Hospitalares</h3>
              <p className="text-xs text-[#6b7684] mt-1.5">Carga horária: 12h · Modalidade: EAD com avaliação prática</p>
              <div className="w-full bg-[#eef0f3] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#eb6200] h-full w-[75%]"></div>
              </div>
            </div>
            <button className="mt-4 w-full py-2 bg-[#183a75] hover:bg-[#122c59] text-white text-xs font-semibold rounded transition-colors">
              Continuar Treinamento
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#dfe4ea] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#0f6b3f] mb-2">
                <span>CONCLUÍDO</span>
                <span>100%</span>
              </div>
              <h3 className="text-[15px] font-bold text-[#183a75]">NR-01 e Integração Institucional Unimed</h3>
              <p className="text-xs text-[#6b7684] mt-1.5">Carga horária: 8h · Concluído em 15/08/2026</p>
              <div className="w-full bg-[#eef0f3] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#0f6b3f] h-full w-full"></div>
              </div>
            </div>
            <button className="mt-4 w-full py-2 bg-white border border-[#0f6b3f] text-[#0f6b3f] hover:bg-[#0f6b3f]/5 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5">
              <i className="icon-certificate text-[13px]"></i>
              Visualizar Certificado
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#dfe4ea] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#183a75] mb-2">
                <span>NOVA CONVOCAÇÃO</span>
                <span>Prazo: 20/09</span>
              </div>
              <h3 className="text-[15px] font-bold text-[#183a75]">Comunicação Assertiva e Feedback Construtivo</h3>
              <p className="text-xs text-[#6b7684] mt-1.5">Carga horária: 6h · Trilha de Liderança e Gestão</p>
              <div className="w-full bg-[#eef0f3] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#183a75] h-full w-[0%]"></div>
              </div>
            </div>
            <button className="mt-4 w-full py-2 bg-[#eb6200] hover:bg-[#cf5700] text-white text-xs font-semibold rounded transition-colors">
              Iniciar Agora
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeItem === 'Minhas Trilhas') {
    return (
      <div className="p-7 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12.5px] text-[#6b7684] flex items-center gap-1.5 font-medium">
              <span>Minha Área</span>
              <span className="text-[#b6bdc7]">/</span>
              <span className="text-[#eb6200] font-semibold">Minhas Trilhas de Aprendizagem</span>
            </div>
            <h1 className="mt-1.5 text-[26px] font-bold text-[#183a75] tracking-tight flex items-center gap-2.5">
              <i className="icon-trails text-[24px] text-[#183a75]"></i>
              Trilhas de Desenvolvimento Profissional
            </h1>
            <p className="mt-1 text-[13.5px] text-[#6b7684]">
              Jornadas estruturadas de conhecimento para desenvolvimento técnico, assistencial e de liderança.
            </p>
          </div>
          <button
            onClick={() => onGoToIndicadores('Treinamentos Institucionais')}
            className="h-[38px] px-4 bg-white border border-[#cfd6e0] hover:border-[#183a75] text-[#183a75] text-[13px] font-semibold rounded-[4px] cursor-pointer transition-colors"
          >
            Ver Indicadores T&amp;D
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-lg border border-[#dfe4ea]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#eb6200] uppercase">Trilha Assistencial de Excelência</span>
              <span className="text-xs font-semibold text-[#6b7684]">3 de 5 Módulos</span>
            </div>
            <h3 className="text-[17px] font-bold text-[#183a75] mt-1.5">Cuidado Centrado na Pessoa e Práticas Hospitalares</h3>
            <p className="text-xs text-[#6b7684] mt-1">Carga total: 40 horas · 60% concluída</p>
            <div className="w-full bg-[#eef0f3] h-2.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#eb6200] h-full w-[60%]"></div>
            </div>
            <div className="mt-4 space-y-2 border-t border-[#eef0f3] pt-3 text-xs">
              <div className="flex items-center justify-between text-[#0f6b3f]">
                <span>✓ Módulo 1: Boas Práticas e Protocolos SCIH</span>
                <span className="font-semibold">Concluído</span>
              </div>
              <div className="flex items-center justify-between text-[#0f6b3f]">
                <span>✓ Módulo 2: Administração Segura de Medicamentos</span>
                <span className="font-semibold">Concluído</span>
              </div>
              <div className="flex items-center justify-between text-[#183a75] font-semibold">
                <span>▶ Módulo 3: Comunicação Interdisciplinar no PA</span>
                <span>Em Andamento</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#dfe4ea]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#183a75] uppercase">Trilha de Liderança Unimed</span>
              <span className="text-xs font-semibold text-[#6b7684]">2 de 4 Módulos</span>
            </div>
            <h3 className="text-[17px] font-bold text-[#183a75] mt-1.5">Gestão de Pessoas, Cultura e Resultados em Saúde</h3>
            <p className="text-xs text-[#6b7684] mt-1">Carga total: 32 horas · 50% concluída</p>
            <div className="w-full bg-[#eef0f3] h-2.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#183a75] h-full w-[50%]"></div>
            </div>
            <div className="mt-4 space-y-2 border-t border-[#eef0f3] pt-3 text-xs">
              <div className="flex items-center justify-between text-[#0f6b3f]">
                <span>✓ Módulo 1: Papel da Liderança Cooperativa</span>
                <span className="font-semibold">Concluído</span>
              </div>
              <div className="flex items-center justify-between text-[#0f6b3f]">
                <span>✓ Módulo 2: Gestão de Indicadores e Metas</span>
                <span className="font-semibold">Concluído</span>
              </div>
              <div className="flex items-center justify-between text-[#183a75] font-semibold">
                <span>▶ Módulo 3: Gestão de Clima e Resolução de Conflitos</span>
                <span>Disponível</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeItem === 'Meus Certificados') {
    return (
      <div className="p-7 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12.5px] text-[#6b7684] flex items-center gap-1.5 font-medium">
              <span>Minha Área</span>
              <span className="text-[#b6bdc7]">/</span>
              <span className="text-[#eb6200] font-semibold">Meus Certificados</span>
            </div>
            <h1 className="mt-1.5 text-[26px] font-bold text-[#183a75] tracking-tight flex items-center gap-2.5">
              <i className="icon-certificate text-[24px] text-[#183a75]"></i>
              Repositório de Certificados Emitidos
            </h1>
            <p className="mt-1 text-[13.5px] text-[#6b7684]">
              Histórico oficial de certificações com código de validação e emissão digital.
            </p>
          </div>
          <button
            onClick={() => onGoToIndicadores('Treinamentos Institucionais')}
            className="h-[38px] px-4 bg-white border border-[#cfd6e0] hover:border-[#183a75] text-[#183a75] text-[13px] font-semibold rounded-[4px] cursor-pointer transition-colors"
          >
            Ver Indicadores T&amp;D
          </button>
        </div>

        <div className="bg-white rounded-lg border border-[#dfe4ea] overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[#4a5462] font-semibold border-b border-[#dfe4ea]">
                <th className="py-2.5 px-4">Treinamento / Evento</th>
                <th className="py-2.5 px-4">Carga Horária</th>
                <th className="py-2.5 px-4">Data de Conclusão</th>
                <th className="py-2.5 px-4">Código de Autenticação</th>
                <th className="py-2.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef0f3]">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#183a75]">NR-01 — Integração Geral de Segurança</td>
                <td className="py-3 px-4 text-[#6b7684]">8 horas</td>
                <td className="py-3 px-4 text-[#6b7684]">15/08/2026</td>
                <td className="py-3 px-4 font-mono text-[#6b7684]">UNIMED-VR-2026-94812</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-[#183a75] hover:text-[#eb6200] font-semibold flex items-center gap-1 ml-auto">
                    <i className="icon-pdf text-[13px]"></i> Baixar PDF
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#183a75]">Protocolos de Prevenção de Quedas e Lesões</td>
                <td className="py-3 px-4 text-[#6b7684]">6 horas</td>
                <td className="py-3 px-4 text-[#6b7684]">28/07/2026</td>
                <td className="py-3 px-4 font-mono text-[#6b7684]">UNIMED-VR-2026-88301</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-[#183a75] hover:text-[#eb6200] font-semibold flex items-center gap-1 ml-auto">
                    <i className="icon-pdf text-[13px]"></i> Baixar PDF
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#183a75]">Boas Práticas de Higiene das Mãos e Biossegurança</td>
                <td className="py-3 px-4 text-[#6b7684]">4 horas</td>
                <td className="py-3 px-4 text-[#6b7684]">10/06/2026</td>
                <td className="py-3 px-4 font-mono text-[#6b7684]">UNIMED-VR-2026-77419</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-[#183a75] hover:text-[#eb6200] font-semibold flex items-center gap-1 ml-auto">
                    <i className="icon-pdf text-[13px]"></i> Baixar PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeItem === 'Meu Calendário') {
    return (
      <div className="p-7 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12.5px] text-[#6b7684] flex items-center gap-1.5 font-medium">
              <span>Minha Área</span>
              <span className="text-[#b6bdc7]">/</span>
              <span className="text-[#eb6200] font-semibold">Meu Calendário</span>
            </div>
            <h1 className="mt-1.5 text-[26px] font-bold text-[#183a75] tracking-tight flex items-center gap-2.5">
              <i className="icon-calendar text-[24px] text-[#183a75]"></i>
              Agenda de Treinamentos &amp; Turmas
            </h1>
            <p className="mt-1 text-[13.5px] text-[#6b7684]">
              Programação de aulas, workshops presenciais e prazos de avaliação da Unimed Volta Redonda.
            </p>
          </div>
          <button
            onClick={() => onGoToIndicadores('Treinamentos Institucionais')}
            className="h-[38px] px-4 bg-white border border-[#cfd6e0] hover:border-[#183a75] text-[#183a75] text-[13px] font-semibold rounded-[4px] cursor-pointer transition-colors"
          >
            Ver Indicadores T&amp;D
          </button>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#dfe4ea]">
          <div className="flex items-center justify-between pb-4 border-b border-[#eef0f3]">
            <h3 className="text-[16px] font-bold text-[#183a75]">Agosto / Setembro 2026</h3>
            <span className="text-xs text-[#0f6b3f] font-semibold bg-[#0f6b3f]/10 px-2.5 py-1 rounded">3 Eventos Confirmados</span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="p-3.5 rounded border border-[#eef0f3] bg-[#f8fafc] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded bg-[#183a75] text-white flex flex-col items-center justify-center text-xs font-bold leading-tight">
                  <span>02</span>
                  <span className="text-[9px] font-normal uppercase">Set</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#183a75]">Treinamento Presencial NR-32</h4>
                  <p className="text-xs text-[#6b7684]">Horário: 08:30 às 12:30 · Local: Auditório Principal Hospital Unimed</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#0f6b3f] bg-white px-2.5 py-1 rounded border border-[#dfe4ea]">Inscrição Confirmada</span>
            </div>

            <div className="p-3.5 rounded border border-[#eef0f3] bg-[#f8fafc] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded bg-[#eb6200] text-white flex flex-col items-center justify-center text-xs font-bold leading-tight">
                  <span>05</span>
                  <span className="text-[9px] font-normal uppercase">Set</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#183a75]">Workshop de Experiência do Paciente</h4>
                  <p className="text-xs text-[#6b7684]">Horário: 14:00 às 17:00 · Local: Sala de Treinamentos Sede</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#eb6200] bg-white px-2.5 py-1 rounded border border-[#dfe4ea]">Turma Agendada</span>
            </div>

            <div className="p-3.5 rounded border border-[#eef0f3] bg-[#f8fafc] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded bg-[#6b7684] text-white flex flex-col items-center justify-center text-xs font-bold leading-tight">
                  <span>15</span>
                  <span className="text-[9px] font-normal uppercase">Set</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#183a75]">Prazo Final: Avaliação EAD de Farmacovigilância</h4>
                  <p className="text-xs text-[#6b7684]">Plataforma Virtual Lector Live</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#6b7684] bg-white px-2.5 py-1 rounded border border-[#dfe4ea]">Atividade EAD</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for other modules (Social, Vitrines, Diários de classe, etc.)
  return (
    <div className="p-7 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[12.5px] text-[#6b7684] flex items-center gap-1.5 font-medium">
            <span>Minha Área</span>
            <span className="text-[#b6bdc7]">/</span>
            <span className="text-[#eb6200] font-semibold">{activeItem}</span>
          </div>
          <h1 className="mt-1.5 text-[26px] font-bold text-[#183a75] tracking-tight">
            {activeItem}
          </h1>
          <p className="mt-1 text-[13.5px] text-[#6b7684]">
            Gestão e registros do módulo {activeItem} — Unimed Volta Redonda.
          </p>
        </div>
        <button
          onClick={() => onGoToIndicadores('Treinamentos Institucionais')}
          className="h-[38px] px-4.5 bg-[#183a75] hover:bg-[#122c59] text-white text-[13px] font-semibold rounded-[4px] cursor-pointer transition-colors flex items-center gap-2 shadow-2xs"
        >
          <i className="icon-performance text-[14px]"></i>
          Ir para Indicadores T&amp;D
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-[#dfe4ea] text-center py-12">
        <div className="w-12 h-12 rounded-full bg-[#183a75]/10 text-[#183a75] flex items-center justify-center mx-auto mb-3">
          <i className="icon-documents text-[22px]"></i>
        </div>
        <h3 className="text-[17px] font-bold text-[#183a75]">Módulo de {activeItem}</h3>
        <p className="text-xs text-[#6b7684] max-w-[460px] mx-auto mt-1.5 leading-relaxed">
          Os registros e configurações de {activeItem} estão sincronizados com a base da Unimed Volta Redonda.
        </p>
        <button
          onClick={() => onGoToIndicadores('Treinamentos Institucionais')}
          className="mt-5 px-4 py-2 bg-white border border-[#183a75] text-[#183a75] hover:bg-[#183a75]/5 text-xs font-semibold rounded transition-colors"
        >
          Retornar ao Dashboard de Indicadores T&amp;D
        </button>
      </div>
    </div>
  );
};
