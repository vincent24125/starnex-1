/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Signal, Database, Cpu, Wifi } from 'lucide-react';
import { VehicleData } from '../../types/vehicleData';
import { Language, replaceText, uiText } from '../../i18n';

interface StatusViewProps {
  data: VehicleData;
  embedded?: boolean;
  language: Language;
}

const StatusView: React.FC<StatusViewProps> = ({ data, embedded = false, language }) => {
  const text = uiText[language].status;
  const gpsAccent =
    data.gpsHealth === 'optimal'
      ? 'text-blue-400'
      : data.gpsHealth === 'locked'
        ? 'text-emerald-400'
        : 'text-amber-400';
  const gpsDotClass =
    data.gpsHealth === 'optimal'
      ? 'bg-blue-400 border-blue-200 shadow-[0_0_8px_rgba(96,165,250,0.45)]'
      : data.gpsHealth === 'locked'
        ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_rgba(52,211,153,0.45)]'
        : 'bg-amber-400 border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.45)]';
  const obdAccent =
    data.obdStatus === 'connected'
      ? 'text-emerald-400'
      : data.obdStatus === 'latency-high'
        ? 'text-amber-400'
        : 'text-red-400';
  const obdDotClass =
    data.obdStatus === 'connected'
      ? 'bg-emerald-400'
      : data.obdStatus === 'latency-high'
        ? 'bg-amber-400'
        : 'bg-red-400';
  // Mock satellite positions for the "Balloon" visualizer
  const sats = Array(data.gpsSats).fill(0).map((_, i) => ({
    id: i,
    val: 30 + Math.random() * 40,
    locked: i % 3 !== 0,
    angle: (i / data.gpsSats) * 360
  }));

  if (embedded) {
    return (
      <section className="w-full space-y-2">
        <div className="flex items-center gap-2">
          <Signal size={14} className={gpsAccent} />
          <h2 className="text-[11px] font-black tracking-widest text-neutral-400 uppercase">{text.title}</h2>
        </div>

        <div className="grid grid-cols-[0.86fr_1.14fr] gap-2">
          <div className="bg-neutral-900/80 border border-white/5 rounded-xl p-3">
            <div className="text-[8px] text-neutral-500 uppercase font-black tracking-widest">
              {text.skyview}
            </div>

            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="relative w-[88px] h-[88px] border border-white/10 rounded-full flex items-center justify-center shrink-0">
                <div className="absolute inset-4 border border-white/5 rounded-full" />
                <div className="absolute inset-8 border border-white/5 rounded-full" />

                {sats.map((sat) => {
                  const r = 14 + ((100 - sat.val) / 100) * 34;
                  const rad = (sat.angle * Math.PI) / 180;
                  const x = Math.cos(rad) * r;
                  const y = Math.sin(rad) * r;

                  return (
                    <div
                      key={sat.id}
                      className={`absolute w-2 h-2 rounded-full border ${sat.locked ? gpsDotClass : 'bg-neutral-500 border-neutral-300 opacity-60'}`}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    />
                  );
                })}

                <div className="text-[9px] font-bold text-white z-10">{replaceText(text.satellites, { count: data.gpsSats })}</div>
              </div>

              <div className="grid grid-cols-1 gap-2 shrink-0">
                <div>
                  <div className="text-[8px] text-neutral-500 uppercase font-bold">{text.hdop}</div>
                  <div className={`text-base font-mono ${gpsAccent}`}>0.82</div>
                </div>
                <div>
                  <div className="text-[8px] text-neutral-500 uppercase font-bold">{text.pdop}</div>
                  <div className={`text-base font-mono ${gpsAccent}`}>1.15</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="bg-neutral-900/80 border border-white/5 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database size={15} className="text-neutral-500" />
                  <span className="text-[10px] text-neutral-300 uppercase font-bold">{text.obdLink}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${obdDotClass}`} />
                  <span className={`text-[9px] font-bold uppercase ${obdAccent}`}>{text.liveStream}</span>
                </div>
              </div>
              <div className="text-[9px] text-neutral-400 font-mono space-y-0.5">
                <div>{text.protocol}: ISO 15765-4 (CAN 11/500)</div>
                <div>{text.latency}: 12ms ({text.average}) · {text.channels}: 14 {text.active}</div>
              </div>
            </div>

            <div className="grid grid-cols-[0.82fr_1.18fr] gap-2">
              <div className="grid min-h-[98px] grid-rows-[auto_1fr_auto] rounded-xl border border-white/5 bg-neutral-900/80 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Wifi size={14} className="shrink-0 text-neutral-500" />
                    <span className="truncate text-[9px] font-bold uppercase text-neutral-300">{text.peripheral}</span>
                  </div>
                </div>
                <div className="self-center text-[8px] font-bold uppercase text-neutral-500">{text.gopro}</div>
                <div className="text-xs font-bold">{text.disconnected}</div>
              </div>

              <div className="grid min-h-[98px] grid-rows-[auto_1fr_auto] rounded-xl border border-white/5 bg-neutral-900/80 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Cpu size={14} className="shrink-0 text-neutral-500" />
                    <span className="truncate text-[9px] font-bold uppercase text-neutral-300">{text.cpuLoad}</span>
                  </div>
                  <div className="text-base font-mono text-white">14%</div>
                </div>
                <div className="self-center text-[8px] font-bold uppercase text-neutral-500">{text.logStorage}</div>
                <div className="text-xs font-bold whitespace-nowrap">{replaceText(text.remaining, { value: '124.2 GB' })}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className={embedded ? 'w-full min-h-full flex flex-col gap-4' : 'w-full h-full p-8 flex flex-col gap-6'}>
      <div className="flex items-center gap-2 mb-2">
         <Signal size={20} className={gpsAccent} />
         <h2 className={embedded ? 'text-lg font-bold tracking-tight' : 'text-xl font-bold tracking-tight'}>{text.title}</h2>
      </div>

      <div className={embedded ? 'grid grid-cols-1 gap-4' : 'flex-1 grid grid-cols-2 gap-8'}>
        {/* Left: GPS Satellite Topology */}
        <div className={embedded ? 'bg-neutral-900 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden' : 'bg-neutral-900 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden'}>
           <div className="absolute top-4 left-6 text-[10px] text-neutral-500 uppercase font-black tracking-widest">
              {text.skyview}
           </div>
           
           <div className={embedded ? 'relative w-36 h-36 mt-7 border border-white/10 rounded-full flex items-center justify-center' : 'relative w-48 h-48 border border-white/10 rounded-full flex items-center justify-center'}>
              <div className="absolute inset-4 border border-white/5 rounded-full" />
              <div className={embedded ? 'absolute inset-12 border border-white/5 rounded-full' : 'absolute inset-16 border border-white/5 rounded-full'} />
              
              {/* Satellite Balloons */}
              {sats.map((sat) => {
                const r = embedded ? 18 + ((100 - sat.val) / 100) * 52 : 24 + ((100 - sat.val) / 100) * 72;
                const rad = (sat.angle * Math.PI) / 180;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                
                return (
                  <div 
                    key={sat.id}
                    className={`absolute w-3 h-3 rounded-full border-2 ${sat.locked ? gpsDotClass : 'bg-neutral-500 border-neutral-300 opacity-50'}`}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  />
                );
              })}

              <div className="text-xs font-bold text-white z-10">{replaceText(text.satellites, { count: data.gpsSats })}</div>
           </div>

           <div className={embedded ? 'mt-5 grid grid-cols-2 gap-6 w-full text-center' : 'mt-8 grid grid-cols-2 gap-12 w-full text-center'}>
              <div>
                <div className="text-[8px] text-neutral-500 uppercase font-bold mb-1">{text.hdop}</div>
                <div className={`${embedded ? 'text-lg' : 'text-xl'} font-mono ${gpsAccent}`}>0.82</div>
              </div>
              <div>
                <div className="text-[8px] text-neutral-500 uppercase font-bold mb-1">{text.pdop}</div>
                <div className={`${embedded ? 'text-lg' : 'text-xl'} font-mono ${gpsAccent}`}>1.15</div>
              </div>
           </div>
        </div>

        {/* Right: Hardware & Connection */}
        <div className={embedded ? 'grid grid-cols-1 gap-4' : 'flex flex-col gap-6'}>
           <div className={embedded ? 'bg-neutral-900 border border-white/5 rounded-2xl p-4' : 'bg-neutral-900 border border-white/5 rounded-3xl p-6 flex-1'}>
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <Database size={16} className="text-neutral-500" />
                    <span className="text-[10px] text-neutral-300 uppercase font-bold">{text.obdLink}</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${obdDotClass}`} />
                    <span className={`text-[10px] font-bold uppercase ${obdAccent}`}>{text.liveStream}</span>
                 </div>
              </div>
              <div className="text-xs text-neutral-400 font-mono space-y-1">
                 <div>{text.protocol}: ISO 15765-4 (CAN 11/500)</div>
                 <div>{text.latency}: 12ms ({text.average})</div>
                 <div>{text.channels}: 14 {text.active}</div>
              </div>
           </div>

           <div className={embedded ? 'bg-neutral-900 border border-white/5 rounded-2xl p-4' : 'bg-neutral-900 border border-white/5 rounded-3xl p-6 flex-1'}>
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <Wifi size={16} className="text-neutral-500" />
                    <span className="text-[10px] text-neutral-300 uppercase font-bold">{text.peripheral}</span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="opacity-50 grayscale">
                    <div className="text-[8px] text-neutral-500 uppercase font-bold">{text.gopro}</div>
                    <div className="text-xs font-bold">{text.disconnected}</div>
                 </div>
                 <div>
                    <div className="text-[8px] text-neutral-500 uppercase font-bold">{text.logStorage}</div>
                    <div className="text-xs font-bold">{replaceText(text.remaining, { value: '124.2 GB' })}</div>
                 </div>
              </div>
           </div>

           <div className={embedded ? 'bg-neutral-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between' : 'bg-neutral-900 border border-white/5 rounded-3xl p-6 flex-1 flex items-center justify-between'}>
              <div className="flex items-center gap-3">
                 <Cpu size={16} className="text-neutral-500" />
                 <span className="text-[10px] text-neutral-300 uppercase font-bold">{text.cpuLoad}</span>
              </div>
              <div className="text-lg font-mono text-white">14%</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StatusView;
