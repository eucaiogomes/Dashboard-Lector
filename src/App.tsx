import { useState } from 'react';
import { ViewType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { OtherViews } from './components/OtherViews';
import { Footer } from './components/Footer';

export default function App() {
  const [sidebarItem, setSidebarItem] = useState('Dashboard');

  // "Ver Indicadores"/"Ver Detalhes"-style CTAs elsewhere in the app used to jump to a
  // standalone Indicadores T&D screen — that screen now lives inside the Dashboard as panels
  // (see DashboardView's "Adicionar Painel"), so these CTAs instead ask the Dashboard to
  // focus (or create) the matching panel. `token` forces a re-focus even when the same view
  // is requested twice in a row.
  const [dashboardFocusRequest, setDashboardFocusRequest] = useState<{ view: ViewType; token: number } | null>(null);

  const goToIndicadoresPanel = (subView: ViewType = 'Treinamentos Institucionais') => {
    setSidebarItem('Dashboard');
    setDashboardFocusRequest({ view: subView, token: Date.now() });
  };

  return (
    <div className="min-h-screen min-w-[1024px] bg-[#f4f6f9] text-[#1f2733] flex flex-col font-['Barlow'] antialiased">
      {/* 1. Web Top Header with Banner */}
      <Header />

      {/* 2. Main Layout Container: Sidebar + Content */}
      <div className="flex flex-1 items-stretch">
        {/* Left Sidebar */}
        <Sidebar activeItem={sidebarItem} onSelectItem={item => setSidebarItem(item)} />

        {/* Center/Right Dynamic Body */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-36">
          {sidebarItem === 'Dashboard' ? (
            <DashboardView focusViewRequest={dashboardFocusRequest} />
          ) : (
            <OtherViews activeItem={sidebarItem} onGoToIndicadores={goToIndicadoresPanel} />
          )}
        </main>
      </div>

      {/* 3. Web Bottom Footer Banner */}
      <Footer />
    </div>
  );
}
