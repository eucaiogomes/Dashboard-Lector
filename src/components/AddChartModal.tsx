import React, { useState, useMemo } from 'react';
import { CHART_GROUPS, CHART_CATALOG, CatalogChartDef } from '../data/dashboardCatalog';

interface AddChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChart: (chartDef: CatalogChartDef) => void;
  existingChartIds: string[];
}

export const AddChartModal: React.FC<AddChartModalProps> = ({
  isOpen,
  onClose,
  onSelectChart,
  existingChartIds
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCharts = useMemo(() => {
    return CHART_CATALOG.filter(chart => {
      const matchesGroup = selectedGroupId === 'all' || chart.group === selectedGroupId;
      const matchesSearch =
        searchTerm.trim() === '' ||
        chart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chart.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chart.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [selectedGroupId, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in select-none">
      <div className="bg-white rounded-xl border border-[#cfd6e0] shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="p-5 px-6 border-b border-[#e5e9f0] flex items-center justify-between bg-linear-to-r from-[#183a75] to-[#122b56] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#eb6200]">
              <i className="icon-performance text-[20px] text-white"></i>
            </div>
            <div>
              <h2 className="text-[17px] font-bold tracking-tight text-white flex items-center gap-2">
                <span>Adicionar Gráfico ao Dashboard</span>
                <span className="text-[11px] font-semibold bg-[#eb6200] text-white px-2 py-0.5 rounded-full">
                  {CHART_CATALOG.length} disponíveis
                </span>
              </h2>
              <p className="text-[12px] text-white/80 mt-0.5">
                Selecione os gráficos dos Indicadores T&amp;D e Geral LMS organizados por grupos temáticos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Fechar"
          >
            <i className="icon-close-mini text-[14px]"></i>
          </button>
        </div>

        {/* Search Bar & Stats */}
        <div className="p-4 px-6 bg-[#f8fafc] border-b border-[#e5e9f0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <i className="icon-spyglass absolute left-3 top-1/2 -translate-y-1/2 text-[#8a93a0] text-[13px]"></i>
            <input
              type="text"
              placeholder="Buscar gráfico por nome ou indicador..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#cfd6e0] rounded-md outline-none focus:border-[#183a75] text-[#1f2733] placeholder-[#8a93a0]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a93a0] hover:text-[#1f2733]"
              >
                <i className="icon-close-mini text-[11px]"></i>
              </button>
            )}
          </div>

          <div className="text-[12px] text-[#6b7684]">
            Exibindo <strong className="text-[#183a75]">{filteredCharts.length}</strong> de {CHART_CATALOG.length} gráficos
          </div>
        </div>

        {/* Body Container: Sidebar Groups + Charts Grid */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Groups Sidebar */}
          <div className="w-full md:w-[240px] shrink-0 bg-[#f4f7fa] border-r border-[#e5e9f0] p-3 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold text-[#8a93a0] uppercase tracking-wider px-3 py-1.5">
              Grupos de Indicadores
            </div>

            {/* All items group */}
            <button
              onClick={() => setSelectedGroupId('all')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                selectedGroupId === 'all'
                  ? 'bg-[#183a75] text-white shadow-xs'
                  : 'text-[#4a5462] hover:bg-[#e9eff6] hover:text-[#183a75]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <i className="icon-home text-[13px]"></i>
                <span>Todos os Gráficos</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedGroupId === 'all' ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#64748b]'
              }`}>
                {CHART_CATALOG.length}
              </span>
            </button>

            {/* Catalog Defined Groups */}
            {CHART_GROUPS.map(group => {
              const isSelected = selectedGroupId === group.id;
              const countInGroup = CHART_CATALOG.filter(c => c.group === group.id).length;

              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#183a75] text-white shadow-xs'
                      : 'text-[#4a5462] hover:bg-[#e9eff6] hover:text-[#183a75]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <i className={`${group.icon} text-[13px] ${isSelected ? 'text-[#eb6200]' : 'text-[#64748b]'}`}></i>
                    <span className="truncate">{group.name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#64748b]'
                  }`}>
                    {countInGroup}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="flex-1 p-5 overflow-y-auto bg-white">
            {filteredCharts.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-[#8a93a0]">
                <i className="icon-spyglass text-[32px] mb-2 opacity-50"></i>
                <p className="text-sm font-semibold text-[#4a5462]">Nenhum gráfico encontrado</p>
                <p className="text-xs text-[#8a93a0] mt-1">Tente buscar por outro termo ou selecione outro grupo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCharts.map(chart => {
                  const groupInfo = CHART_GROUPS.find(g => g.id === chart.group);
                  const isAlreadyAdded = existingChartIds.includes(chart.id);

                  return (
                    <div
                      key={chart.id}
                      className="border border-[#e0e5eb] rounded-lg p-4 bg-white hover:border-[#183a75] hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Group badge and icon */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10.5px] font-semibold text-[#183a75] bg-[#183a75]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <i className={`${groupInfo?.icon || 'icon-performance'} text-[10px]`}></i>
                            <span>{groupInfo?.name.split('(')[0].trim() || 'Geral'}</span>
                          </span>

                          <span className="text-[10px] text-[#8a93a0] font-medium">
                            Padrão: {chart.defaultType}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-[14px] font-bold text-[#183a75] group-hover:text-[#eb6200] transition-colors">
                          {chart.title}
                        </h3>
                        <p className="text-[11px] text-[#6b7684] mt-0.5 font-medium">
                          {chart.subtitle}
                        </p>
                        <p className="text-[11.5px] text-[#4a5462] mt-2 line-clamp-2 leading-relaxed">
                          {chart.description}
                        </p>

                        {/* Supported chart types pills */}
                        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-[#8a93a0] mr-1">Formatos:</span>
                          {chart.allowedTypes.map(type => (
                            <span
                              key={type}
                              className="text-[9.5px] font-medium bg-[#f0f4f8] text-[#4a5462] px-1.5 py-0.5 rounded border border-[#e2e8f0]"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Add Button */}
                      <div className="mt-4 pt-3 border-t border-[#f0f3f7] flex items-center justify-between">
                        {isAlreadyAdded && (
                          <span className="text-[10.5px] text-[#0f6b3f] font-semibold flex items-center gap-1">
                            <i className="icon-calendar-today text-[11px]"></i>
                            <span>No Dashboard</span>
                          </span>
                        )}
                        {!isAlreadyAdded && <span></span>}

                        <button
                          onClick={() => {
                            onSelectChart(chart);
                            onClose();
                          }}
                          className="h-7 px-3 bg-[#eb6200] hover:bg-[#cf5700] text-white text-[11.5px] font-bold rounded flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <i className="icon-plus text-[10px]"></i>
                          <span>Adicionar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 px-6 bg-[#f8fafc] border-t border-[#e5e9f0] flex items-center justify-between text-xs text-[#6b7684]">
          <span>Selecione quantos gráficos desejar para personalizar a visão do seu Dashboard.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#334155] font-semibold rounded transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
