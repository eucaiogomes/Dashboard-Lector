import React, { useState } from 'react';

interface SidebarProps {
  activeItem?: string;
  onSelectItem?: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = 'Dashboard',
  onSelectItem
}) => {
  const [minhaAreaOpen, setMinhaAreaOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const minhaAreaList = [
    'Dashboard',
    'NR-1',
    'Minhas Habilidades',
    'Meus Treinamentos',
    'Minhas Trilhas',
    'Minhas Pontuações',
    'Meus Certificados',
    'Meu Calendário',
    'Meu Cadastro',
    'Minhas Compras',
    'Faturamento'
  ];

  const groupSections = [
    { name: 'Social', icon: 'icon-social' },
    { name: 'Vitrines', icon: 'icon-products' },
    { name: 'Trilhas', icon: 'icon-trails' },
    { name: 'Treinamentos', icon: 'icon-courses' },
    { name: 'Gravações', icon: 'icon-recordings' },
    { name: 'Webconferência', icon: 'icon-webconference' },
    { name: 'Documentos', icon: 'icon-documents' },
    { name: 'Avaliações', icon: 'icon-evaluations' },
    { name: 'Questões', icon: 'icon-questions' },
    { name: 'Produtos', icon: 'icon-products' }
  ];

  if (isCollapsed) {
    return (
      <aside className="no-print w-[58px] shrink-0 bg-[#f8fafc] border-r border-[#e0e5eb] min-h-[calc(100vh-160px)] flex flex-col items-center py-4 justify-between select-none">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-9 h-9 rounded bg-[#004e4c]/10 text-[#004e4c] flex items-center justify-center cursor-pointer hover:bg-[#004e4c] hover:text-white transition-colors"
            title="Expandir menu"
          >
            <i className="icon-home text-[16px]"></i>
          </button>
        </div>

        <button
          onClick={() => setIsCollapsed(false)}
          className="w-8 h-8 rounded bg-[#00995d] text-white flex items-center justify-center cursor-pointer hover:bg-[#00824f] transition-colors"
          title="Expandir barra lateral"
        >
          <i className="icon-pointer-right text-[12px]"></i>
        </button>
      </aside>
    );
  }

  return (
    <aside className="no-print w-[214px] shrink-0 bg-[#f8fafc] border-r border-[#e0e5eb] min-h-[calc(100vh-160px)] flex flex-col justify-between select-none">
      <div>
        {/* Minha Área Top Header */}
        <div className="h-[44px] px-3.5 flex items-center justify-between border-b border-[#e2efe8] bg-white">
          <div className="flex items-center gap-2">
            <i className="icon-home text-[#004e4c] text-[15px]"></i>
            <span className="font-bold text-[13px] text-[#004e4c]">Minha área</span>
          </div>

          <div className="flex items-center gap-1 text-[#8a93a0]">
            <button className="p-1 hover:text-[#004e4c] cursor-pointer" title="Buscar">
              <i className="icon-spyglass text-[13px]"></i>
            </button>
            <button
              onClick={() => setMinhaAreaOpen(!minhaAreaOpen)}
              className="p-1 hover:text-[#004e4c] cursor-pointer"
              title="Expandir/Recolher"
            >
              <i className={minhaAreaOpen ? 'icon-pointer-up text-[10px]' : 'icon-pointer-down text-[10px]'}></i>
            </button>
          </div>
        </div>

        {/* Minha Área List Items */}
        {minhaAreaOpen && (
          <div className="py-1 bg-[#eaf5ef]/50 border-b border-[#dcebe4]">
            {minhaAreaList.map(item => {
              const isActive = activeItem === item;
              return (
                <button
                  key={item}
                  onClick={() => onSelectItem && onSelectItem(item)}
                  className={`w-full text-left py-[6.5px] px-5 text-[12.5px] font-normal transition-colors cursor-pointer block ${
                    isActive
                      ? 'bg-[#d8eee0] text-[#004e4c] font-bold border-l-3 border-[#f47920]'
                      : 'text-[#4b5666] hover:bg-[#e3f3ea] hover:text-[#004e4c]'
                  }`}
                >
                  <span className="truncate">{item}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Group Navigation Accordions */}
        <div className="py-1 flex flex-col bg-white">
          {groupSections.map(group => {
            const isExpanded = expandedGroups[group.name];
            return (
              <div key={group.name} className="border-b border-[#f0f3f7] last:border-b-0">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] text-[#2c3747] hover:bg-[#f6f9fc] hover:text-[#004e4c] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <i className={`${group.icon} text-[15px] text-[#4a5568] group-hover:text-[#004e4c]`}></i>
                    <span className="font-bold text-[12.5px] text-[#2b3648]">{group.name}</span>
                  </div>
                  <i className={`text-[9px] text-[#8a93a0] ${isExpanded ? 'icon-pointer-down' : 'icon-pointer-right'}`}></i>
                </button>

                {isExpanded && (
                  <div className="bg-[#f8fafc] py-1.5 pl-9 pr-3 text-[12px] space-y-1 border-t border-[#f0f3f7]">
                    <div
                      onClick={() => onSelectItem && onSelectItem(group.name)}
                      className="py-1 px-2 text-[#4a5568] hover:text-[#004e4c] hover:bg-white rounded cursor-pointer transition-colors"
                    >
                      Ver todos os itens de {group.name}
                    </div>
                    <div
                      onClick={() => onSelectItem && onSelectItem('Dashboard')}
                      className="py-1 px-2 text-[#4a5568] hover:text-[#004e4c] hover:bg-white rounded cursor-pointer transition-colors"
                    >
                      Relatórios e Indicadores
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar Bottom Bar */}
      <div className="p-3 border-t border-[#dcebe4] bg-white flex items-center justify-between text-[11px] text-[#8a93a0]">
        <span>Lector Live © 2026 - v2.0</span>
        <button
          onClick={() => setIsCollapsed(true)}
          className="w-7 h-7 bg-[#00995d] hover:bg-[#00824f] text-white rounded-[3px] flex items-center justify-center cursor-pointer transition-colors"
          title="Recolher barra lateral"
        >
          <i className="icon-pointer-left text-[11px]"></i>
        </button>
      </div>
    </aside>
  );
};
