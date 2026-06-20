/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LayoutGrid } from 'lucide-react';
import { VehicleData, DashboardStyle } from '../../types/vehicleData';
import GaugeDashboard from './GaugeDashboard';
import GridDashboard from './GridDashboard';
import ClassicRaceDashboard from './ClassicRaceDashboard';
import PerformanceDashboard from './PerformanceDashboard';
import { Language, uiText } from '../../i18n';
import DashboardSwitcher from './DashboardSwitcher';

interface DashboardViewProps {
  data: VehicleData;
  layout?: DashboardStyle;
  language: Language;
  onLayoutChange: (layout: DashboardStyle) => void;
  chromeHidden: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  layout = 'CLASSIC',
  language,
  onLayoutChange,
  chromeHidden,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<DashboardStyle>(layout);
  const text = uiText[language].dashboard;

  useEffect(() => {
    setSelectedLayout(layout);
  }, [layout]);

  useEffect(() => {
    if (!isSwitcherOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSwitcherOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSwitcherOpen]);

  let dashboardContent: React.ReactNode;

  if (layout === 'GAUGE') {
    dashboardContent = <GaugeDashboard data={data} chromeHidden={chromeHidden} />;
  } else if (layout === 'GRID') {
    dashboardContent = <GridDashboard data={data} language={language} />;
  } else if (layout === 'CLASSIC') {
    dashboardContent = <ClassicRaceDashboard data={data} chromeHidden={chromeHidden} />;
  } else if (layout === 'PERFORMANCE') {
    dashboardContent = <PerformanceDashboard data={data} chromeHidden={chromeHidden} />;
  } else {
    dashboardContent = <ClassicRaceDashboard data={data} chromeHidden={chromeHidden} />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {dashboardContent}

      <button
        onClick={() => setIsSwitcherOpen(true)}
        className={`absolute ${layout === 'GAUGE' ? 'bottom-8' : 'bottom-4'} left-4 z-[110] flex items-center gap-2 rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-black/30 backdrop-blur transition-all hover:border-blue-400/40 hover:bg-blue-500/10 ${
          chromeHidden ? 'pointer-events-none translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <LayoutGrid size={14} />
        <span>{text.switcher.button}</span>
      </button>

      <DashboardSwitcher
        isOpen={isSwitcherOpen}
        selectedStyle={selectedLayout}
        currentStyle={layout}
        language={language}
        onSelect={setSelectedLayout}
        onApply={(nextLayout) => {
          onLayoutChange(nextLayout);
          setIsSwitcherOpen(false);
        }}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </div>
  );
};

export default DashboardView;
