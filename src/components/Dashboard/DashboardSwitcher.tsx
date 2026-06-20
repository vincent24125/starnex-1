import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  Gauge,
  LayoutGrid,
  Sparkles,
  X,
} from 'lucide-react';
import { DashboardStyle } from '../../types/vehicleData';
import { Language, uiText } from '../../i18n';

interface DashboardSwitcherProps {
  isOpen: boolean;
  selectedStyle: DashboardStyle;
  currentStyle: DashboardStyle;
  language: Language;
  onSelect: (style: DashboardStyle) => void;
  onApply: (style: DashboardStyle) => void;
  onClose: () => void;
}

const styleIconMap = {
  CLASSIC: Activity,
  PERFORMANCE: Sparkles,
  GAUGE: Gauge,
  GRID: LayoutGrid,
} as const;

const styleAccentMap: Record<DashboardStyle, string> = {
  CLASSIC: 'from-blue-500/25 via-cyan-400/10 to-transparent',
  PERFORMANCE: 'from-red-500/25 via-orange-400/10 to-transparent',
  GAUGE: 'from-neutral-200/20 via-neutral-500/10 to-transparent',
  GRID: 'from-emerald-500/25 via-teal-400/10 to-transparent',
};

const DashboardSwitcher: React.FC<DashboardSwitcherProps> = ({
  isOpen,
  selectedStyle,
  currentStyle,
  language,
  onSelect,
  onApply,
  onClose,
}) => {
  const switcherText = uiText[language].dashboard.switcher;
  const styleText = uiText[language].settings.visual.styles;

  const styleDetails: {
    id: DashboardStyle;
    label: string;
    desc: string;
  }[] = [
    { id: 'CLASSIC', label: styleText.classic.label, desc: styleText.classic.desc },
    { id: 'PERFORMANCE', label: styleText.performance.label, desc: styleText.performance.desc },
    { id: 'GAUGE', label: styleText.gauge.label, desc: styleText.gauge.desc },
    { id: 'GRID', label: styleText.grid.label, desc: styleText.grid.desc },
  ];

  const activeStyle = styleDetails.find((style) => style.id === selectedStyle) ?? styleDetails[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[120] bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute inset-x-4 inset-y-3 overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950/95 shadow-2xl shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-full">
              <div className="flex h-full w-[258px] min-h-0 flex-col border-r border-white/8 bg-gradient-to-b from-white/[0.045] to-transparent p-4">
                <div className="mb-3 shrink-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-neutral-500">
                    {switcherText.preview}
                  </div>
                  <h3 className="mt-2 text-[18px] font-black italic tracking-tight text-white">
                    {switcherText.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    {switcherText.subtitle}
                  </p>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {styleDetails.map((style) => {
                    const Icon = styleIconMap[style.id];
                    const isSelected = style.id === selectedStyle;
                    const isCurrent = style.id === currentStyle;

                    return (
                      <button
                        key={style.id}
                        onClick={() => onSelect(style.id)}
                        className={`group relative w-full overflow-hidden rounded-2xl border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-blue-400/50 bg-blue-500/[0.08] shadow-lg shadow-blue-500/10'
                            : 'border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${styleAccentMap[style.id]}`} />
                        <div className="relative">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 ring-1 ring-white/10">
                              <Icon size={18} className="text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-black italic tracking-tight text-white">
                                {style.label}
                              </div>
                              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                                {style.id}
                              </div>
                            </div>
                            {isCurrent && (
                              <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-emerald-300">
                                {switcherText.current}
                              </span>
                            )}
                          </div>
                          <PreviewCard styleId={style.id} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-w-0 flex-1 p-4">
                <div className="flex h-full min-h-0 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-[0.35em] text-neutral-500">
                        {switcherText.details}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300">
                          {activeStyle.id}
                        </div>
                        {activeStyle.id === currentStyle && (
                          <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">
                            {switcherText.active}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-neutral-400 transition-colors hover:border-white/20 hover:text-white"
                      aria-label={switcherText.close}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
                    <div className="rounded-[24px] border border-white/8 bg-neutral-900/70 p-4">
                      <div className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-500">
                        {switcherText.livePreview}
                      </div>
                      <div className="h-[150px] overflow-hidden rounded-[22px] border border-white/10 bg-black shadow-[inset_0_0_80px_rgba(255,255,255,0.03)]">
                        <PreviewHeroCompact styleId={activeStyle.id} />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => onApply(activeStyle.id)}
                        className={`flex-1 rounded-2xl px-4 py-3 text-sm font-black italic transition-all ${
                          activeStyle.id === currentStyle
                            ? 'border border-white/10 bg-white/[0.04] text-neutral-300'
                            : 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500'
                        }`}
                      >
                        {activeStyle.id === currentStyle ? switcherText.active : switcherText.switchTo}
                      </button>
                      <button
                        onClick={onClose}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-neutral-300 transition-colors hover:border-white/20 hover:text-white"
                      >
                        {switcherText.close}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PreviewCard: React.FC<{ styleId: DashboardStyle }> = ({ styleId }) => {
  if (styleId === 'GAUGE') {
    return (
      <div className="flex h-20 items-center gap-3 rounded-xl border border-white/8 bg-black/45 p-3">
        <div className="relative h-14 w-14 rounded-full border-4 border-white/10">
          <div className="absolute left-1/2 top-2.5 h-7 w-1 -translate-x-1/2 rounded-full bg-white" />
          <div className="absolute inset-x-3 bottom-3 h-1 rounded-full bg-white/25" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-14 rounded-full bg-white/20" />
          <div className="h-5 w-20 rounded-lg bg-white/10" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-4 rounded bg-white/8" />
            <div className="h-4 rounded bg-white/8" />
          </div>
        </div>
      </div>
    );
  }

  if (styleId === 'GRID') {
    return (
      <div className="grid h-20 grid-cols-3 gap-2 rounded-xl border border-white/8 bg-black/45 p-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="rounded-md border border-white/8 bg-white/[0.05]" />
        ))}
      </div>
    );
  }

  if (styleId === 'PERFORMANCE') {
    return (
      <div className="flex h-20 items-center justify-between rounded-xl border border-white/8 bg-black/45 px-4">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded-full bg-white/15" />
          <div className="h-10 w-14 rounded-xl bg-white/10" />
        </div>
        <div className="h-12 w-px bg-white/10" />
        <div className="space-y-2 text-right">
          <div className="h-3 w-14 rounded-full bg-white/15" />
          <div className="h-4 w-20 rounded-lg bg-white/10" />
          <div className="h-4 w-16 rounded-lg bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-20 flex-col justify-between rounded-xl border border-white/8 bg-black/45 p-3">
      <div className="h-2.5 w-full rounded-full bg-white/15" />
      <div className="grid flex-1 grid-cols-[0.8fr_1.2fr_0.8fr] gap-2 pt-3">
        <div className="rounded-lg bg-white/[0.05]" />
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white/[0.04]">
          <div className="h-8 w-12 rounded-lg bg-white/10" />
          <div className="h-2 w-8 rounded-full bg-white/15" />
        </div>
        <div className="rounded-lg bg-white/[0.05]" />
      </div>
    </div>
  );
};

const PreviewHeroCompact: React.FC<{ styleId: DashboardStyle }> = ({ styleId }) => {
  if (styleId === 'GAUGE') {
    return (
      <div className="flex h-full items-center gap-5 px-5">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[8px] border-white/10 bg-neutral-950">
          <div className="absolute h-14 w-1 rounded-full bg-white" style={{ transform: 'rotate(35deg)', transformOrigin: 'bottom center' }} />
          <div className="h-4 w-4 rounded-full bg-white" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-3 w-20 rounded-full bg-white/20" />
          <div className="h-10 w-24 rounded-2xl bg-white/10" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-8 rounded-xl bg-white/[0.06]" />
            <div className="h-8 rounded-xl bg-white/[0.06]" />
            <div className="h-8 rounded-xl bg-white/[0.06]" />
            <div className="h-8 rounded-xl bg-white/[0.06]" />
          </div>
        </div>
      </div>
    );
  }

  if (styleId === 'GRID') {
    return (
      <div className="grid h-full grid-cols-3 gap-2.5 p-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-white/8 bg-white/[0.05]" />
        ))}
      </div>
    );
  }

  if (styleId === 'PERFORMANCE') {
    return (
      <div className="flex h-full items-center justify-between gap-4 px-5">
        <div className="w-28 space-y-3">
          <div className="h-3 w-20 rounded-full bg-white/15" />
          <div className="h-16 rounded-[20px] bg-white/[0.05]" />
        </div>
        <div className="text-[84px] font-black italic leading-none tracking-tighter text-white/90">3</div>
        <div className="w-24 space-y-3">
          <div className="h-14 rounded-[20px] bg-white/[0.05]" />
          <div className="h-10 rounded-[16px] bg-white/[0.05]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="h-3 w-full rounded-full bg-white/15" />
      <div className="grid flex-1 grid-cols-[0.9fr_1.1fr_0.9fr] gap-3">
        <div className="rounded-[18px] bg-white/[0.05]" />
        <div className="flex flex-col items-center justify-center rounded-[22px] bg-white/[0.04]">
          <div className="text-[56px] font-black italic leading-none tracking-tighter text-white">4</div>
          <div className="mt-1 h-2.5 w-12 rounded-full bg-white/15" />
        </div>
        <div className="space-y-3 rounded-[18px] bg-white/[0.05] p-3">
          <div className="h-14 rounded-[14px] bg-white/[0.06]" />
          <div className="h-9 rounded-[14px] bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSwitcher;
