import React, { useState } from 'react';
import {
  CHART_CATALOG,
  CHART_GROUPS,
  DEFAULT_TRAINING_CATEGORIES,
  CatalogChartDef,
  DashboardCardItem,
  SupportedChartType
} from '../data/dashboardCatalog';
import { DashboardChartRenderer } from './DashboardChartRenderer';
import { AddChartModal } from './AddChartModal';
import { DetailedIndicadoresModal } from './DetailedIndicadoresModal';
import { ViewType } from '../types';

interface DashboardViewProps {
  onGoToIndicadores?: (subView?: ViewType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onGoToIndicadores }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Agosto - 2026');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openTypeDropdown, setOpenTypeDropdown] = useState<string | null>(null);
  const [selectedCardForModal, setSelectedCardForModal] = useState<DashboardCardItem | null>(null);

  // Helper to create all charts from the catalog
  const createAllCards = (period: string = 'Agosto - 2026'): DashboardCardItem[] => {
    return CHART_CATALOG.map((chartDef) => {
      const defaultCat = 'Todos os Treinamentos';
      const generated = chartDef.generateData({ period, category: defaultCat });
      return {
        id: `card_${chartDef.id}`,
        catalogId: chartDef.id,
        title: chartDef.title,
        subtitle: chartDef.subtitle,
        group: chartDef.group,
        chartType: chartDef.defaultType,
        allowedTypes: chartDef.allowedTypes,
        selectedCategory: defaultCat,
        availableCategories: chartDef.categories || DEFAULT_TRAINING_CATEGORIES,
        maxScale: generated.maxScale,
        ticks: generated.ticks,
        unit: chartDef.unit,
        data: generated.data,
        meta: generated.meta
      };
    });
  };

  // Initial cards: All catalog charts
  const [cards, setCards] = useState<DashboardCardItem[]>(() => createAllCards('Agosto - 2026'));

  const handleRemoveCard = (cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
  };

  const handleAddChartFromCatalog = (chartDef: CatalogChartDef) => {
    const defaultCat = 'Todos os Treinamentos';
    const generated = chartDef.generateData({ period: selectedPeriod, category: defaultCat });
    const newCard: DashboardCardItem = {
      id: `card_${chartDef.id}_${Date.now()}`,
      catalogId: chartDef.id,
      title: chartDef.title,
      subtitle: chartDef.subtitle,
      group: chartDef.group,
      chartType: chartDef.defaultType,
      allowedTypes: chartDef.allowedTypes,
      selectedCategory: defaultCat,
      availableCategories: chartDef.categories || DEFAULT_TRAINING_CATEGORIES,
      maxScale: generated.maxScale,
      ticks: generated.ticks,
      unit: chartDef.unit,
      data: generated.data,
      meta: generated.meta
    };

    setCards(prev => [...prev, newCard]);
  };

  const handleChangeChartType = (cardId: string, newType: SupportedChartType) => {
    setCards(prev =>
      prev.map(card => (card.id === cardId ? { ...card, chartType: newType } : card))
    );
    setOpenTypeDropdown(null);
  };

  const handleCardCategoryChange = (cardId: string, newCategory: string) => {
    setCards(prev =>
      prev.map(card => {
        if (card.id !== cardId) return card;
        const chartDef = CHART_CATALOG.find(c => c.id === card.catalogId);
        if (!chartDef) return { ...card, selectedCategory: newCategory };

        const regenerated = chartDef.generateData({ period: selectedPeriod, category: newCategory });
        return {
          ...card,
          selectedCategory: newCategory,
          data: regenerated.data,
          maxScale: regenerated.maxScale,
          ticks: regenerated.ticks,
          meta: regenerated.meta
        };
      })
    );
  };

  const handleResetDefaultCards = () => {
    setCards(createAllCards(selectedPeriod));
  };

  const existingChartIds = cards.map(c => c.catalogId);

  return (
    <div
      className={`p-6 min-h-[calc(100vh-280px)] bg-[#f4f6f9] transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#f4f6f9] p-8 overflow-y-auto' : ''
      }`}
    >
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-[14px]">
          <span className="font-bold text-[#1f2733]">Minha Área</span>
          <span className="text-[#a0abb8]">/</span>
          <span className="font-semibold text-[#eb6200]">Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-[#6b7684] hover:text-[#183a75] hover:bg-white rounded transition-colors cursor-pointer border border-transparent hover:border-[#cfd6e0]"
            title={isFullscreen ? 'Sair de tela cheia' : 'Tela cheia'}
          >
            <i className="icon-fullscreen text-[16px]"></i>
          </button>
        </div>
      </div>

      {/* Filter Row & Add Chart Action (Removed the global training filter from here) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-2.5 px-3.5 rounded-[6px] border border-[#e0e5eb] shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector Pill */}
          <div className="relative flex items-center h-[34px] px-3.5 bg-[#f8fafc] border border-[#cfd6e0] rounded-[6px] text-[13px] text-[#4a5462] font-medium cursor-pointer shadow-2xs hover:border-[#183a75] transition-colors">
            <span>{selectedPeriod}</span>
            <i className="icon-calendar text-[#8a93a0] ml-3 text-[14px]"></i>
          </div>

          {/* Add Chart Button (+) */}
          <button
            onClick={() => setShowAddModal(true)}
            className="h-[34px] px-3.5 rounded-[6px] bg-[#eb6200] hover:bg-[#cf5700] text-white text-[12.5px] font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Adicionar gráfico do catálogo de indicadores"
          >
            <i className="icon-plus text-[12px] font-bold"></i>
            <span>Adicionar Gráfico</span>
          </button>
        </div>

        {/* Quick actions on the right */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleResetDefaultCards}
            className="text-[#6b7684] hover:text-[#183a75] px-2 py-1 rounded hover:bg-[#f0f4f8] transition-colors cursor-pointer"
            title="Voltar aos 2 gráficos padrão"
          >
            Restaurar Padrão
          </button>
        </div>
      </div>

      {/* Empty State */}
      {cards.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#e0e5eb] p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#183a75]/10 text-[#183a75] flex items-center justify-center mx-auto mb-3">
            <i className="icon-performance text-[28px]"></i>
          </div>
          <h3 className="text-base font-bold text-[#183a75]">Nenhum gráfico no painel</h3>
          <p className="text-xs text-[#6b7684] max-w-md mx-auto mt-1 mb-4">
            Seu Dashboard está vazio. Clique no botão abaixo para escolher entre os {CHART_CATALOG.length} gráficos disponíveis dos Indicadores T&amp;D.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#eb6200] hover:bg-[#cf5700] text-white text-xs font-bold rounded shadow cursor-pointer transition-all"
          >
            <i className="icon-plus mr-1.5"></i>
            Explorar Catálogo de Gráficos
          </button>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {cards.map(card => {
            const groupInfo = CHART_GROUPS.find(g => g.id === card.group);

            return (
              <div
                key={card.id}
                className="bg-white rounded-[6px] border border-[#e0e5eb] shadow-2xs p-5 flex flex-col justify-between hover:border-[#cfd8e3] transition-all relative"
              >
                {/* Card Top Header with Internal Category Filter and Close Button */}
                <div className="pb-2 border-b border-[#f0f3f7]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-[15.5px] font-bold text-[#183a75] tracking-tight">
                          {card.title}
                        </h2>
                        {groupInfo && (
                          <span className="text-[9.5px] font-bold text-[#183a75] bg-[#183a75]/10 px-1.5 py-0.5 rounded">
                            {groupInfo.name.split('(')[0].trim()}
                          </span>
                        )}
                      </div>

                      {card.subtitle && (
                        <p className="text-[11px] text-[#6b7684] mt-0.5 font-medium truncate">
                          {card.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Action buttons on the right of the card header */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Tipo de Treinamento Dropdown inside the chart card */}
                      <div className="relative">
                        <select
                          value={card.selectedCategory}
                          onChange={e => handleCardCategoryChange(card.id, e.target.value)}
                          className="h-[28px] pl-2.5 pr-7 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cfd6e0] rounded text-[11.5px] text-[#334155] font-semibold appearance-none cursor-pointer outline-none focus:border-[#183a75] transition-colors max-w-[190px] sm:max-w-[210px] truncate"
                          title="Filtrar tipo de treinamento neste gráfico"
                        >
                          {card.availableCategories.map(cat => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#eb6200] text-[9px]">
                          <i className="icon-pointer-down"></i>
                        </div>
                      </div>

                      {/* Remove card button */}
                      <button
                        onClick={() => handleRemoveCard(card.id)}
                        className="text-[#8a93a0] hover:text-[#eb6200] p-1 transition-colors cursor-pointer rounded hover:bg-[#f5f8fa]"
                        title="Remover gráfico do Dashboard"
                      >
                        <i className="icon-close-mini text-[14px]"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chart Graphic Area */}
                <div className="py-2 my-auto min-h-[220px] flex flex-col justify-center">
                  <DashboardChartRenderer card={card} />
                </div>

                {/* Card Footer / Chart Type Selector & Detailed Indicators CTA */}
                <div className="pt-3 mt-3 border-t border-[#f0f3f7] flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                  <div className="flex items-center gap-1.5 text-[#606d80] relative">
                    <span>Tipo de gráfico:</span>
                    <button
                      onClick={() =>
                        setOpenTypeDropdown(openTypeDropdown === card.id ? null : card.id)
                      }
                      className="font-semibold text-[#eb6200] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{card.chartType}</span>
                      <i className="icon-pointer-down text-[9px]"></i>
                    </button>

                    {/* Chart type dropdown menu */}
                    {openTypeDropdown === card.id && (
                      <div className="absolute left-24 bottom-6 bg-white border border-[#dfe4ea] rounded-[4px] shadow-lg py-1 z-30 min-w-[120px]">
                        {card.allowedTypes.map(t => (
                          <button
                            key={t}
                            onClick={() => handleChangeChartType(card.id, t)}
                            className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#f5f8fa] hover:text-[#183a75] flex items-center justify-between cursor-pointer ${
                              card.chartType === t
                                ? 'text-[#eb6200] font-bold bg-[#eb6200]/5'
                                : 'text-[#4a5462]'
                            }`}
                          >
                            <span>{t}</span>
                            {card.chartType === t && (
                              <i className="icon-calendar-today text-[10px]"></i>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ver Indicadores T&D Detalhados Action Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCardForModal(card)}
                      className="px-2.5 py-1.5 bg-[#183a75]/8 hover:bg-[#183a75] text-[#183a75] hover:text-white text-[11.5px] font-bold rounded border border-[#183a75]/20 hover:border-[#183a75] flex items-center gap-1.5 transition-all cursor-pointer group shadow-2xs active:scale-95"
                      title="Abrir modal com o gráfico em destaque e o relatório analítico completo da aba Indicadores T&D"
                    >
                      <i className="icon-performance text-[12px] text-[#eb6200] group-hover:text-white transition-colors"></i>
                      <span>Ver Indicadores T&amp;D Detalhados</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Chart Modal with Groups & Catalog */}
      <AddChartModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectChart={handleAddChartFromCatalog}
        existingChartIds={existingChartIds}
      />

      {/* Detailed T&D Indicators Modal with Chart on Top + Full Report Below */}
      <DetailedIndicadoresModal
        isOpen={!!selectedCardForModal}
        onClose={() => setSelectedCardForModal(null)}
        card={selectedCardForModal}
        onGoToIndicadores={onGoToIndicadores}
        onUpdateCardType={(cardId, newType) => {
          handleChangeChartType(cardId, newType);
          setSelectedCardForModal(prev => (prev ? { ...prev, chartType: newType } : null));
        }}
        onUpdateCardCategory={(cardId, newCategory) => {
          handleCardCategoryChange(cardId, newCategory);
          setSelectedCardForModal(prev => {
            if (!prev) return null;
            const chartDef = CHART_CATALOG.find(c => c.id === prev.catalogId);
            if (!chartDef) return { ...prev, selectedCategory: newCategory };
            const regenerated = chartDef.generateData({ period: selectedPeriod, category: newCategory });
            return {
              ...prev,
              selectedCategory: newCategory,
              data: regenerated.data,
              maxScale: regenerated.maxScale,
              ticks: regenerated.ticks,
              meta: regenerated.meta
            };
          });
        }}
      />
    </div>
  );
};
