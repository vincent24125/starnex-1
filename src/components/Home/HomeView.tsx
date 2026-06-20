/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Play,
  Car,
  Cpu,
  LocateFixed,
  Thermometer,
  Battery,
  Fuel,
  ClipboardCheck,
  Activity,
  Zap
} from 'lucide-react';
import { VehicleData } from '../../types/vehicleData';
import { Language, replaceText, uiText } from '../../i18n';

interface HomeViewProps {
  data: VehicleData;
  onStart: () => void;
  language: Language;
}

type Tone = {
  cardClass: string;
  valueClass: string;
  iconClass: string;
};

const tones = {
  success: {
    cardClass: 'bg-emerald-500/[0.08] border-emerald-500/20',
    valueClass: 'text-emerald-300',
    iconClass: 'text-emerald-400',
  },
  info: {
    cardClass: 'bg-blue-500/[0.08] border-blue-500/20',
    valueClass: 'text-blue-300',
    iconClass: 'text-blue-400',
  },
  caution: {
    cardClass: 'bg-amber-500/[0.08] border-amber-500/20',
    valueClass: 'text-amber-300',
    iconClass: 'text-amber-400',
  },
  danger: {
    cardClass: 'bg-red-500/[0.08] border-red-500/20',
    valueClass: 'text-red-300',
    iconClass: 'text-red-400',
  },
} as const satisfies Record<string, Tone>;

const HomeView: React.FC<HomeViewProps> = ({ data, onStart, language }) => {
  const text = uiText[language].home;

  const obdTone =
    data.obdStatus === 'connected'
      ? tones.success
      : data.obdStatus === 'latency-high'
        ? tones.caution
        : tones.danger;
  const gpsTone =
    data.gpsHealth === 'optimal'
      ? tones.info
      : data.gpsHealth === 'locked'
        ? tones.success
        : tones.caution;
  const satelliteTone =
    data.gpsSats >= 10
      ? tones.info
      : data.gpsSats >= 7
        ? tones.success
        : data.gpsSats >= 5
          ? tones.caution
          : tones.danger;
  const coolantTone =
    data.coolantTemp < 96
      ? tones.success
      : data.coolantTemp < 105
        ? tones.caution
        : tones.danger;
  const fuelTone =
    data.fuelLevel > 35
      ? tones.success
      : data.fuelLevel > 15
        ? tones.caution
        : tones.danger;
  const voltageTone =
    data.voltage >= 12.4
      ? tones.success
      : data.voltage >= 12.0
        ? tones.caution
        : tones.danger;

  const obdLabel =
    data.obdStatus === 'connected'
      ? text.connected
      : data.obdStatus === 'latency-high'
        ? text.latencyHigh
        : text.disconnected;

  const gpsLabel =
    data.gpsHealth === 'optimal'
      ? text.gpsOptimal
      : data.gpsHealth === 'locked'
        ? text.gpsLocked
        : text.gpsSearching;

  const readinessRows = [
    { label: text.metrics.obd, value: obdLabel, tone: obdTone },
    { label: text.metrics.gps, value: gpsLabel, tone: gpsTone },
    { label: text.metrics.satellites, value: replaceText(text.satellites, { count: data.gpsSats }), tone: satelliteTone },
  ];

  const inspectionItems = [
    { icon: Cpu, label: text.metrics.obd, value: obdLabel, tone: obdTone },
    { icon: LocateFixed, label: text.metrics.gps, value: gpsLabel, tone: gpsTone },
    { icon: Activity, label: text.metrics.satellites, value: replaceText(text.satellites, { count: data.gpsSats }), tone: satelliteTone },
    { icon: Thermometer, label: text.metrics.coolant, value: `${data.coolantTemp.toFixed(0)}°C`, tone: coolantTone },
    { icon: Fuel, label: text.metrics.fuel, value: `${data.fuelLevel.toFixed(0)}%`, tone: fuelTone },
    { icon: Battery, label: text.metrics.voltage, value: `${data.voltage.toFixed(1)}V`, tone: voltageTone },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden px-6 py-5">
      <div className="mb-2 flex items-center">
        <div className="min-w-0">
          <h1 className="text-3xl font-black italic tracking-tighter leading-none">StarNex</h1>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 content-start grid-cols-12 grid-rows-[268px_118px] gap-x-4 gap-y-2.5">
        <section className="col-span-7 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(36,36,36,0.96)_0%,rgba(12,12,12,0.98)_64%,rgba(10,10,10,1)_100%)] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.45)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_46%,rgba(255,255,255,0.06),transparent_24%),linear-gradient(135deg,transparent_0%,transparent_80%,rgba(255,255,255,0.03)_80%,rgba(255,255,255,0.03)_84%,transparent_84%,transparent_100%)]" />
          <div className="relative h-full flex flex-col justify-between">
            <div>
              <div className="text-[38px] font-black italic leading-none tracking-tight text-white">{text.startDriving}</div>
              <div className="mt-3 max-w-[360px] text-[14px] font-bold leading-6 text-neutral-400">{text.startSummary}</div>
            </div>

            <div className="flex items-end justify-end gap-4">
              <button
                onClick={onStart}
                className="flex min-h-[92px] items-center gap-3 rounded-3xl border border-white/10 bg-white/6 px-6 py-4 shadow-[0_10px_24px_rgba(255,255,255,0.04)] transition-all hover:bg-white/10"
              >
                <div className="text-left">
                  <div className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-500">{text.enterDash}</div>
                  <div className="mt-1.5 text-[17px] font-black text-white whitespace-nowrap">{text.pressToStart}</div>
                </div>
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/90">
                  <Play size={26} fill="currentColor" />
                </span>
              </button>
            </div>
          </div>
        </section>

        <aside className="col-span-5 rounded-2xl border border-white/5 bg-neutral-900/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] flex flex-col">
          <div className="flex items-center gap-3">
            <Car size={17} className="text-white" />
            <div className="flex-1 min-w-0">
              <div className="text-[8px] text-neutral-500 uppercase font-bold">{text.currentVehicle}</div>
              <div className="mt-1 text-sm font-black truncate">{text.vehicleName}</div>
            </div>
            <div className="px-2 py-1 rounded-md border border-white/10 bg-white/5 text-[8px] font-bold text-white uppercase">GT3</div>
          </div>

          <div className="mt-4 border-t border-white/5 pt-3 flex-1">
            <div className="mb-3 flex items-center gap-2 text-[9px] text-neutral-500 uppercase font-black tracking-widest">
              <Zap size={12} className="text-white" />
              {text.systemReady}
            </div>
            <div className="space-y-2">
              {readinessRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-3">
                  <div className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-500">{row.label}</div>
                  <div className={`text-[13px] font-black ${row.tone.valueClass}`}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="col-span-12 rounded-2xl bg-neutral-900/80 p-3">
          <div className="mb-3 flex items-center gap-2 text-[9px] text-neutral-500 uppercase font-black tracking-widest">
            <ClipboardCheck size={13} className="text-white" />
            {text.inspection}
          </div>
          <div className="grid grid-cols-6 gap-2.5">
            {inspectionItems.map((item) => (
              <div key={item.label} className="flex min-w-0 flex-col justify-between rounded-xl bg-black/30 px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-[8px] text-neutral-500 font-bold uppercase">
                  <item.icon size={11} className="shrink-0 text-white" />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="mt-2 text-[12px] font-black whitespace-nowrap truncate text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeView;
