import { ViewType, MonthData, TrainingTypeData, AgendaItem, InternalTraining, JobPositionData, CostCenterRow, KPIItem, FilterItem } from '../types';

interface SheetColumn {
  label: string;
  w?: number;
  align?: 'left' | 'center' | 'right';
}

function bar(v: number, max: number, color = '#004e4c'): string {
  const n = Math.max(1, Math.round((v / (max || 1)) * 14));
  return (
    '<span style="font-family:Consolas,monospace;color:' +
    color +
    ';letter-spacing:-1px;">' +
    new Array(n + 1).join('█') +
    '</span>'
  );
}

function badge(text: string, kind: 'ok' | 'warn' | 'bad'): string {
  const colors: Record<string, [string, string]> = {
    ok: ['#0F6B3F', '#E6F4EC'],
    warn: ['#8A5A00', '#FDF3E0'],
    bad: ['#A32020', '#FBEAEA']
  };
  const [c0, c1] = colors[kind] || ['#1F2733', '#FFFFFF'];
  return `<span style="color:${c0};background:${c1};font-weight:700;">&nbsp;${text}&nbsp;</span>`;
}

function xlsSheet(
  title: string,
  sub: string,
  cols: SheetColumn[],
  rows: (string | number)[][],
  totals?: (string | number)[]
): string {
  const th = cols
    .map(
      c =>
        `<th style="background:#004e4c;color:#FFFFFF;font-weight:700;font-size:10pt;border:1px solid #0F2A57;padding:7px 8px;text-align:${c.align || 'left'};vertical-align:middle;">${c.label}</th>`
    )
    .join('');

  const defaultCol: SheetColumn = { label: '', align: 'left', w: 120 };

  const tr = rows
    .map((r, ri) => {
      const rowHtml = r
        .map((cell, i) => {
          const c = cols[i] ?? defaultCol;
          const numeric = c.align === 'right' && /^[\d.,\-:]+$/.test(String(cell));
          return `<td style="background:${ri % 2 ? '#F4F7FB' : '#FFFFFF'};border:1px solid #D7DEE9;padding:5px 8px;font-size:10pt;color:#1F2733;text-align:${c.align || 'left'};vertical-align:middle;${numeric ? '' : 'mso-number-format:\\@;'}">${cell}</td>`;
        })
        .join('');
      return `<tr>${rowHtml}</tr>`;
    })
    .join('');

  const tot = totals
    ? `<tr>${totals
        .map((cell, i) => {
          const c = cols[i] ?? defaultCol;
          return `<td style="background:#DDE4EF;border:1px solid #B9C5DA;padding:6px 8px;font-size:10pt;font-weight:700;color:#004e4c;text-align:${c.align || 'left'};mso-number-format:\\@;">${cell}</td>`;
        })
        .join('')}</tr>`
    : '';

  const colTags = cols.map(c => `<col width="${c.w || 120}" />`).join('');
  const n = cols.length;

  return (
    `<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Calibri,Arial,sans-serif;">` +
    colTags +
    `<tr><td colspan="${n}" style="height:8px;background:#f47920;"></td></tr>` +
    `<tr><td colspan="${n}" style="height:30px;font-size:15pt;font-weight:700;color:#004e4c;">${title}</td></tr>` +
    `<tr><td colspan="${n}" style="height:18px;font-size:9.5pt;color:#4A5462;">${sub}</td></tr>` +
    `<tr><td colspan="${n}" style="height:16px;font-size:8.5pt;color:#8A93A0;">Lector Live · Unimed Volta Redonda — emitido em 31/08/2026 07h12</td></tr>` +
    `<tr><td colspan="${n}" style="height:8px;"></td></tr>` +
    `<tr>${th}</tr>` +
    tr +
    tot +
    `</table>`
  );
}

export function exportToExcel(
  view: ViewType,
  kpis: KPIItem[],
  filters: FilterItem[],
  afastados: boolean,
  base: MonthData[],
  tiposRaw: TrainingTypeData[],
  agenda: AgendaItem[],
  treinamentos: InternalTraining[],
  cargosRaw: JobPositionData[],
  rawRows: CostCenterRow[]
) {
  const period = filters.map(f => `${f.label}: ${f.value}`).join('   ·   ');
  const faixa = (v: number): 'ok' | 'warn' | 'bad' => (v >= 80 ? 'ok' : v >= 60 ? 'warn' : 'bad');
  const sheets: { nome: string; html: string }[] = [];

  const maxKpi = Math.max(
    ...kpis.map(x => parseFloat(String(x.value).replace(/\./g, '').replace(',', '.')) || 1)
  );

  sheets.push({
    nome: 'Painel',
    html: xlsSheet(
      'Painel de indicadores — ' + view,
      period,
      [
        { label: 'Indicador', w: 260 },
        { label: 'Valor', w: 130, align: 'right' },
        { label: 'Leitura', w: 340 },
        { label: 'Observação', w: 260 }
      ],
      kpis.map(k => {
        const numVal = parseFloat(String(k.value).replace(/\./g, '').replace(',', '.')) || 1;
        return [k.label, k.value + (k.unit ? ' ' + k.unit : ''), bar(numVal, maxKpi), k.delta];
      })
    )
  });

  sheets.push({
    nome: 'Filtros',
    html: xlsSheet(
      'Filtros aplicados',
      'Seleções vigentes no momento da exportação',
      [
        { label: 'Filtro', w: 300 },
        { label: 'Seleção', w: 260 }
      ],
      filters
        .map(f => [f.label, f.value])
        .concat([
          [
            'Afastados (status bloqueado)',
            afastados ? 'Incluídos na base de ativos' : 'Excluídos da base de ativos'
          ]
        ])
    )
  });

  if (view === 'Treinamentos Institucionais') {
    const maxP = Math.max(...base.map(b => b.previsto));
    const totPrev = base.reduce((s, b) => s + b.previsto, 0);
    const totReal = base.reduce((s, b) => s + b.realizado, 0);
    sheets.push({
      nome: 'Previsto x Realizado',
      html: xlsSheet(
        'Previsto x Realizado por MêsAno',
        'Treinamentos institucionais previstos e efetivamente realizados',
        [
          { label: 'MêsAno', w: 100 },
          { label: 'Previsto', w: 90, align: 'right' },
          { label: 'Realizado', w: 95, align: 'right' },
          { label: '% Realização', w: 105, align: 'center' },
          { label: 'Previsto (gráfico)', w: 170 },
          { label: 'Realizado (gráfico)', w: 170 }
        ],
        base.map(b => {
          const pct = Math.round((b.realizado / b.previsto) * 100);
          return [
            b.mesAno,
            b.previsto,
            b.realizado,
            badge(pct + '%', faixa(pct)),
            bar(b.previsto, maxP, '#CDD6E6'),
            bar(b.realizado, maxP)
          ];
        }),
        ['Total', totPrev, totReal, Math.round((totReal / totPrev) * 100) + '%', '', '']
      )
    });

    const maxT = Math.max(...tiposRaw.map(t => t.previsto));
    sheets.push({
      nome: 'Por Tipo',
      html: xlsSheet(
        'Previsto x Realizado por Tipo',
        'Campo "Tipos do Treinamento"',
        [
          { label: 'Tipo de Treinamento', w: 260 },
          { label: 'Previsto', w: 90, align: 'right' },
          { label: 'Realizado', w: 95, align: 'right' },
          { label: '% Realização', w: 105, align: 'center' },
          { label: 'Realizado (gráfico)', w: 190 }
        ],
        tiposRaw.map(t => {
          const pct = Math.round((t.realizado / t.previsto) * 100);
          return [t.nome, t.previsto, t.realizado, badge(pct + '%', faixa(pct)), bar(t.realizado, maxT)];
        }),
        [
          'Total',
          tiposRaw.reduce((s, t) => s + t.previsto, 0),
          tiposRaw.reduce((s, t) => s + t.realizado, 0),
          '',
          ''
        ]
      )
    });

    sheets.push({
      nome: 'Agenda',
      html: xlsSheet(
        'Agenda de treinamentos',
        'Situação de cada treinamento previsto no período',
        [
          { label: 'Nome', w: 420 },
          { label: 'MêsAno', w: 95, align: 'center' },
          { label: 'Tipo', w: 190 },
          { label: 'Status', w: 150, align: 'center' }
        ],
        agenda.map(a => [
          a.nome,
          a.mesAno,
          a.tipo,
          badge(a.status, a.status === 'REALIZADO' ? 'ok' : a.status === 'AGENDADO' ? 'warn' : 'bad')
        ])
      )
    });
  } else if (view === 'Treinamentos Internos') {
    const maxH = Math.max(...base.map(b => b.horasTreinadas));
    sheets.push({
      nome: 'Evolução',
      html: xlsSheet(
        'Evolução por MêsAno',
        'Participação, colaboradores treinados e horas dos eventos presenciais internos',
        [
          { label: 'MêsAno', w: 100 },
          { label: 'Colab. Treinados', w: 120, align: 'right' },
          { label: 'Total Participantes', w: 130, align: 'right' },
          { label: 'Horas Treinadas', w: 120, align: 'right' },
          { label: 'Treinamentos', w: 110, align: 'right' },
          { label: 'Ativos', w: 85, align: 'right' },
          { label: '% Adesão', w: 100, align: 'center' },
          { label: 'Horas (gráfico)', w: 180 }
        ],
        base.map(b => {
          const pct = Math.round((b.colabTreinados / b.ativos) * 100);
          return [
            b.mesAno,
            b.colabTreinados,
            b.totalParticipantes,
            b.horasTreinadas,
            b.qtdTreinamentos,
            b.ativos,
            badge(pct + '%', faixa(pct)),
            bar(b.horasTreinadas, maxH)
          ];
        }),
        [
          'Total',
          base.reduce((s, b) => s + b.colabTreinados, 0),
          base.reduce((s, b) => s + b.totalParticipantes, 0),
          base.reduce((s, b) => s + b.horasTreinadas, 0),
          base.reduce((s, b) => s + b.qtdTreinamentos, 0),
          '',
          '',
          ''
        ]
      )
    });

    const maxTr = 2799;
    sheets.push({
      nome: 'Treinamentos',
      html: xlsSheet(
        'Horas treinadas por treinamento',
        'Ranking dos treinamentos internos por carga horária',
        [
          { label: 'Treinamento', w: 300 },
          { label: 'Horas', w: 130, align: 'right' },
          { label: 'Gráfico', w: 200 }
        ],
        treinamentos.map(t => [t.nome, t.horasFormatted, bar(t.horasVal, maxTr)])
      )
    });

    const maxPart = Math.max(...cargosRaw.map(c => c.participantes));
    sheets.push({
      nome: 'Rank por Cargo',
      html: xlsSheet(
        'Ranking por cargo — ativos x adesão',
        'Participações totais e percentual de ativos treinados',
        [
          { label: 'Cargo', w: 230 },
          { label: 'Participantes', w: 120, align: 'right' },
          { label: 'Ativos', w: 85, align: 'right' },
          { label: 'Treinados', w: 95, align: 'right' },
          { label: '% Adesão', w: 100, align: 'center' },
          { label: 'Participações (gráfico)', w: 200 }
        ],
        cargosRaw.map(c => {
          const pct = Math.round((c.treinados / c.ativos) * 100);
          return [
            c.cargo,
            c.participantes,
            c.ativos,
            c.treinados,
            badge(pct + '%', faixa(pct)),
            bar(c.participantes, maxPart)
          ];
        }),
        [
          'Total',
          cargosRaw.reduce((s, c) => s + c.participantes, 0),
          cargosRaw.reduce((s, c) => s + c.ativos, 0),
          cargosRaw.reduce((s, c) => s + c.treinados, 0),
          '',
          ''
        ]
      )
    });
  } else {
    const totInsc = rawRows.reduce((s, r) => s + r.inscritos, 0);
    const totReal = rawRows.reduce((s, r) => s + r.realizaram, 0);
    const totPlan = rawRows.reduce((s, r) => s + r.turmasPlanejadas, 0);
    const totExced = rawRows.reduce((s, r) => s + r.turmasExcedentes, 0);

    sheets.push({
      nome: 'Centro de Custo',
      html: xlsSheet(
        'Indicadores por centro de custo',
        'Inscritos x realizados, adesão mensal, turmas planejadas x excedentes e esforço extra',
        [
          { label: 'Centro de custo', w: 175 },
          { label: 'Gestor', w: 150 },
          { label: 'Supervisor', w: 120 },
          { label: 'Treinamento', w: 210 },
          { label: 'Aula', w: 130 },
          { label: 'Instrutor', w: 120 },
          { label: 'Inscritos', w: 85, align: 'right' },
          { label: 'Realizaram', w: 95, align: 'right' },
          { label: '% Adesão', w: 95, align: 'center' },
          { label: 'Adesão (gráfico)', w: 160 },
          { label: 'Turmas planej.', w: 110, align: 'right' },
          { label: 'Turmas exced.', w: 110, align: 'right' },
          { label: 'Esforço extra', w: 105, align: 'center' }
        ],
        rawRows.map(r => {
          const pct = Math.round((r.realizaram / r.inscritos) * 100);
          const esf = Math.round((r.turmasExcedentes / r.turmasPlanejadas) * 100);
          return [
            r.area,
            r.gestor,
            r.supervisor,
            r.treinamento,
            r.aula,
            r.instrutor,
            r.inscritos,
            r.realizaram,
            badge(pct + '%', faixa(pct)),
            bar(pct, 100),
            r.turmasPlanejadas,
            r.turmasExcedentes,
            badge(esf + '%', esf >= 40 ? 'bad' : esf > 0 ? 'warn' : 'ok')
          ];
        }),
        [
          'Total',
          '',
          '',
          '',
          '',
          '',
          totInsc,
          totReal,
          Math.round((totReal / totInsc) * 100) + '%',
          '',
          totPlan,
          totExced,
          Math.round((totExced / totPlan) * 100) + '%'
        ]
      )
    });
  }

  const body = sheets
    .map(
      s =>
        `<x:ExcelWorksheet><x:Name>${s.nome}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>`
    )
    .join('');

  const html =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">' +
    '<head><meta charset="utf-8" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>' +
    body +
    '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>' +
    sheets.map(s => s.html).join('<br clear="all" style="mso-special-character:line-break;page-break-before:always" />') +
    '</body></html>';

  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = view.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  a.href = url;
  a.download = `indicadores-td-${slug}-2026-08.xls`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

interface ReportTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Exports a single report table (as shown in the "Ver Detalhes" overlay) to a real CSV file. */
export function exportTableToCsv(
  title: string,
  columns: ReportTableColumn[],
  rows: Record<string, string | number>[]
) {
  const escapeCsv = (v: string | number) => {
    const s = String(v ?? '');
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = [
    columns.map(c => escapeCsv(c.label)).join(';'),
    ...rows.map(r => columns.map(c => escapeCsv(r[c.key])).join(';'))
  ];

  const blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `${slugify(title)}.csv`);
}

/** Exports a single report table to an .xls file readable by Excel (HTML-table trick, same
 * technique as exportToExcel above, simplified to one plain sheet). */
export function exportTableToXls(
  title: string,
  subtitle: string,
  columns: ReportTableColumn[],
  rows: Record<string, string | number>[]
) {
  const th = columns
    .map(
      c =>
        `<th style="background:#004e4c;color:#FFFFFF;font-weight:700;font-size:10pt;border:1px solid #0F2A57;padding:7px 8px;text-align:${c.align || 'left'};">${c.label}</th>`
    )
    .join('');

  const tr = rows
    .map((r, ri) => {
      const cells = columns
        .map(c => {
          const val = r[c.key] ?? '';
          const numeric = typeof val === 'number';
          return `<td style="background:${ri % 2 ? '#F4F7FB' : '#FFFFFF'};border:1px solid #D7DEE9;padding:5px 8px;font-size:10pt;color:#1F2733;text-align:${c.align || 'left'};${numeric ? '' : 'mso-number-format:\\@;'}">${val}</td>`;
        })
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  const n = columns.length;
  const table =
    `<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Calibri,Arial,sans-serif;">` +
    columns.map(() => '<col width="150" />').join('') +
    `<tr><td colspan="${n}" style="height:8px;background:#f47920;"></td></tr>` +
    `<tr><td colspan="${n}" style="height:30px;font-size:15pt;font-weight:700;color:#004e4c;">${title}</td></tr>` +
    `<tr><td colspan="${n}" style="height:18px;font-size:9.5pt;color:#4A5462;">${subtitle}</td></tr>` +
    `<tr><td colspan="${n}" style="height:8px;"></td></tr>` +
    `<tr>${th}</tr>` +
    tr +
    `</table>`;

  const html =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">' +
    '<head><meta charset="utf-8" /></head><body>' +
    table +
    '</body></html>';

  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  downloadBlob(blob, `${slugify(title)}.xls`);
}
