import React, { useEffect, useMemo, useState } from 'react';
import { ReportDefinition } from '../data/reportDefinitions';
import { exportTableToCsv, exportTableToXls } from '../utils/exportUtils';

interface ReportDetailOverlayProps {
  definition: ReportDefinition | null;
  onClose: () => void;
}

const PAGE_SIZE = 10;

type SortDir = 'asc' | 'desc';

const STATUS_BADGE: Record<string, string> = {
  REALIZADO: 'text-[#0f6b3f] bg-[#e6f4ec]',
  ATIVO: 'text-[#0f6b3f] bg-[#e6f4ec]',
  AGENDADO: 'text-[#8a5a00] bg-[#fdf3e0]',
  'NÃO REALIZADO': 'text-[#a32020] bg-[#fbeaea]',
  INATIVO: 'text-[#a32020] bg-[#fbeaea]'
};

/**
 * Center overlay with the full detail report for one Dashboard widget: a searchable,
 * sortable table plus CSV / Excel / print export — opened from that widget's
 * "Ver Detalhes" button. Driven entirely by a ReportDefinition (title/columns/rows).
 */
export const ReportDetailOverlay: React.FC<ReportDetailOverlayProps> = ({ definition, onClose }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearch('');
    setSortKey(null);
    setSortDir('asc');
    setPage(1);
  }, [definition]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredRows = useMemo(() => {
    if (!definition) return [];
    const term = search.trim().toLowerCase();
    if (!term) return definition.rows;
    return definition.rows.filter(row =>
      definition.columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(term))
    );
  }, [definition, search]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filteredRows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv), 'pt-BR') * dir;
    });
  }, [filteredRows, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const pageRows = sortedRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!definition) return null;

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleExportCsv = () => exportTableToCsv(definition.title, definition.columns, sortedRows);
  const handleExportXls = () => exportTableToXls(definition.title, definition.subtitle, definition.columns, sortedRows);
  const handlePrint = () => window.print();

  return (
    <div className="report-detail-backdrop fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in select-none">
      <div
        id="report-detail-print-root"
        className="bg-white rounded-xl border border-[#cfd6e0] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 px-6 flex items-start justify-between gap-3 border-b border-[#e4e8ee] shrink-0">
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold tracking-tight text-[#004e4c]">
              {definition.title}
            </h2>
            <p className="text-[12px] text-[#64748b] mt-0.5">{definition.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="no-print w-8 h-8 shrink-0 rounded-md bg-[#f8fafc] hover:bg-rose-50 text-[#64748b] hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer border border-[#cfd6e0]"
            title="Fechar"
          >
            <i className="icon-close-mini text-[15px]"></i>
          </button>
        </div>

        {/* Toolbar: search + export actions */}
        <div className="no-print px-6 py-3.5 border-b border-[#e4e8ee] bg-[#fafbfc] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[200px] max-w-[340px]">
            <i className="icon-spyglass absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#8a93a0] pointer-events-none"></i>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar no relatório..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#cfd6e0] rounded-full text-[13px] text-[#1f2733] outline-none focus:border-[#004e4c] transition-colors placeholder:text-[#a0abb8]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="w-8 h-8 rounded-full bg-[#00995d] hover:bg-[#00824f] text-[#eef7f4] flex items-center justify-center transition-colors cursor-pointer shadow-2xs active:scale-95"
              title="Exportar CSV"
            >
              <i className="icon-file-csv text-[14px]"></i>
            </button>
            <button
              onClick={handleExportXls}
              className="w-8 h-8 rounded-full bg-[#00995d] hover:bg-[#00824f] text-[#eef7f4] flex items-center justify-center transition-colors cursor-pointer shadow-2xs active:scale-95"
              title="Exportar Excel"
            >
              <i className="icon-file-xls text-[14px]"></i>
            </button>
            <button
              onClick={handlePrint}
              className="w-8 h-8 rounded-full bg-[#00995d] hover:bg-[#00824f] text-[#eef7f4] flex items-center justify-center transition-colors cursor-pointer shadow-2xs active:scale-95"
              title="Imprimir / Salvar como PDF"
            >
              <i className="icon-pdf text-[14px]"></i>
            </button>
            <button
              onClick={handlePrint}
              className="w-8 h-8 rounded-full bg-[#00995d] hover:bg-[#00824f] text-[#eef7f4] flex items-center justify-center transition-colors cursor-pointer shadow-2xs active:scale-95"
              title="Imprimir"
            >
              <i className="icon-printer text-[14px]"></i>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="report-detail-table-scroll flex-1 overflow-auto">
          <table className="w-full text-[12.5px] border-collapse">
            <thead className="sticky top-0 z-[1]">
              <tr className="bg-[#f6f8fa] border-b border-[#e4e8ee]">
                {definition.columns.map(col => {
                  const isSorted = sortKey === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className={`text-[11px] uppercase tracking-wider text-[#6b7684] font-bold px-4 py-2.5 whitespace-nowrap cursor-pointer select-none hover:text-[#004e4c] transition-colors ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        <i
                          className={`icon-pointer-down text-[8px] transition-transform ${
                            isSorted ? 'text-[#f47920]' : 'text-[#c3cad4]'
                          } ${isSorted && sortDir === 'desc' ? 'rotate-180' : ''}`}
                        ></i>
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f6]">
              {pageRows.map((row, ri) => (
                <tr key={ri} className={`hover:bg-[#fbfcfd] transition-colors ${ri % 2 ? 'bg-[#fcfdfe]' : 'bg-white'}`}>
                  {definition.columns.map(col => {
                    const value = row[col.key];
                    const alignClass =
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';

                    if (col.type === 'status') {
                      const badgeClass = STATUS_BADGE[String(value).toUpperCase()] || 'text-[#4a5462] bg-[#f1f3f6]';
                      return (
                        <td key={col.key} className={`px-4 py-2.5 ${alignClass}`}>
                          <span className={`inline-block px-2 py-0.5 rounded-[3px] text-[11px] font-bold tracking-wide ${badgeClass}`}>
                            {value}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={col.key} className={`px-4 py-2.5 text-[#334155] ${alignClass} ${col.type === 'number' ? 'font-semibold' : ''}`}>
                        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={definition.columns.length} className="px-4 py-10 text-center text-[#8a93a0] text-[13px]">
                    Nenhum registro encontrado para "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: count + pagination */}
        <div className="no-print px-6 py-3 border-t border-[#f1f3f6] flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-[#6b7684] shrink-0">
          <div>
            Exibindo {pageRows.length} de {sortedRows.length} registro{sortedRows.length === 1 ? '' : 's'}
            {search && ` (filtrado de ${definition.rows.length})`}
          </div>

          {totalPages > 1 && (
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1 border border-[#dfe4ea] hover:border-[#004e4c] rounded-[3px] bg-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              <span className="px-2 font-medium text-[#4a5462]">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1 border border-[#dfe4ea] hover:border-[#004e4c] rounded-[3px] bg-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
