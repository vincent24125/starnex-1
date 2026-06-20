/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Gauge, 
  Home as HomeIcon,
  Signal,
  AlertTriangle
} from 'lucide-react';
import { useVehicleData } from './hooks/useVehicleData';
import { ScreenMode, DashboardStyle } from './types/vehicleData';
import { Language, uiText } from './i18n';

import DashboardView from './components/Dashboard/DashboardView';
import HomeView from './components/Home/HomeView';
import SettingsView from './components/Settings/SettingsView';

export default function App() {
  const [mode, setMode] = useState<ScreenMode>('HOME');
  const [dashboardStyle, setDashboardStyle] = useState<DashboardStyle>('CLASSIC');
  const [dashboardChromeHidden, setDashboardChromeHidden] = useState(false);
  const gestureStart = useRef<{ x: number; y: number } | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'zh';
    }

    return (window.localStorage.getItem('starnex-language') as Language) || 'zh';
  });
  const vehicleData = useVehicleData();
  const text = uiText[language];
  const isDashboard = mode === 'DASHBOARD';

  useEffect(() => {
    window.localStorage.setItem('starnex-language', language);
  }, [language]);

  useEffect(() => {
    if (mode !== 'DASHBOARD') {
      setDashboardChromeHidden(false);
    }
  }, [mode]);

  const handleDashboardPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (!isDashboard) {
      return;
    }

    gestureStart.current = { x: event.clientX, y: event.clientY };
  };

  const handleDashboardPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (!isDashboard || !gestureStart.current) {
      return;
    }

    const deltaX = event.clientX - gestureStart.current.x;
    const deltaY = event.clientY - gestureStart.current.y;
    const isHorizontalSwipe = Math.abs(deltaX) > 48 && Math.abs(deltaY) < 56;

    gestureStart.current = null;

    if (isHorizontalSwipe && deltaX < 0) {
      setDashboardChromeHidden(true);
      return;
    }

    if ((isHorizontalSwipe && deltaX > 0) || dashboardChromeHidden) {
      setDashboardChromeHidden(false);
    }
  };

  const navItems = [
    { id: 'HOME', icon: HomeIcon, label: text.app.nav.home },
    { id: 'DASHBOARD', icon: Gauge, label: text.app.nav.dashboard },
    { id: 'SETTINGS', icon: Settings, label: text.app.nav.settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 font-sans select-none">
      {/* 800x480 Virtual Hardware Container */}
      <div 
        id="dashboard-container"
        className="relative w-[800px] h-[480px] bg-black border-4 border-neutral-900 rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10"
      >
        {/* Screen-integrated navigation rail */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-[78px] z-50 bg-gradient-to-r from-white/[0.045] via-white/[0.018] to-transparent transition-opacity duration-200 ${
            dashboardChromeHidden ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="absolute inset-y-3 left-3 right-3 rounded-2xl bg-black/10" />
        </div>

        <nav
          className={`absolute inset-y-0 left-0 w-[78px] flex flex-col items-center py-6 gap-7 z-[60] transition-opacity duration-200 ${
            dashboardChromeHidden
              ? '-translate-x-[72px] opacity-0 transition-transform hover:translate-x-0 hover:opacity-100'
              : 'translate-x-0 opacity-100'
          }`}
          onPointerDown={handleDashboardPointerDown}
          onPointerUp={handleDashboardPointerUp}
          onPointerCancel={() => {
            gestureStart.current = null;
          }}
        >
          {navItems.map((item) => (
            <button
              id={`nav-${item.id.toLowerCase()}`}
              key={item.id}
              onClick={() => setMode(item.id as ScreenMode)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                mode === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/30' 
                  : 'text-neutral-500 hover:text-neutral-100 hover:bg-white/[0.06]'
              }`}
              title={item.label}
            >
              <item.icon size={22} strokeWidth={2.5} />
            </button>
          ))}
          
          <div className="mt-auto flex flex-col items-center gap-4">
            <div
              className={`transition-colors ${
                vehicleData.gpsHealth === 'optimal'
                  ? 'text-blue-400'
                  : vehicleData.gpsHealth === 'locked'
                    ? 'text-emerald-400'
                    : 'text-amber-400'
              }`}
            >
              <Signal size={18} />
            </div>
            {vehicleData.coolantTemp > 105 && (
              <motion.div 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-red-500"
              >
                <AlertTriangle size={18} />
              </motion.div>
            )}
          </div>
        </nav>

        {/* Content Area */}
        <main
          className={`absolute inset-0 overflow-hidden bg-black transition-[padding] duration-300 ease-out ${
            isDashboard && dashboardChromeHidden ? 'pl-0' : 'pl-[78px]'
          }`}
          onPointerDown={handleDashboardPointerDown}
          onPointerUp={handleDashboardPointerUp}
          onPointerCancel={() => {
            gestureStart.current = null;
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full h-full"
            >
              {mode === 'DASHBOARD' && (
                <div className="relative w-full h-full">
                  <DashboardView
                    data={vehicleData}
                    layout={dashboardStyle}
                    language={language}
                    onLayoutChange={setDashboardStyle}
                    chromeHidden={dashboardChromeHidden}
                  />
                  {/* 可供车手快速切换样式的微型面板 (可选) */}
                </div>
              )}
              {mode === 'HOME' && (
                <HomeView
                  data={vehicleData}
                  onStart={() => setMode('DASHBOARD')}
                  language={language}
                />
              )}
              {mode === 'SETTINGS' && (
                <SettingsView 
                  currentStyle={dashboardStyle} 
                  onStyleChange={setDashboardStyle} 
                  vehicleData={vehicleData}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <div className="mt-8 text-neutral-600 text-xs font-mono uppercase tracking-[0.2em]">{text.app.footer}</div>
    </div>
  );
}
