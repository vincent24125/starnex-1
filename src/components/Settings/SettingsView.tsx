/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Monitor, 
  Database,
  Globe,
  Layout,
  Bell,
  Info,
  CloudCog,
  ShieldCheck
} from 'lucide-react';
import { DashboardStyle, VehicleData } from '../../types/vehicleData';
import StatusView from '../Status/StatusView';
import { Language, uiText } from '../../i18n';
import LanguageToggle from '../LanguageToggle';

interface SettingsViewProps {
  currentStyle: DashboardStyle;
  onStyleChange: (style: DashboardStyle) => void;
  vehicleData: VehicleData;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

type SettingsTab = 'VISUAL' | 'ALARM' | 'SENSOR' | 'SYSTEM' | 'VERSION';

const SettingsView: React.FC<SettingsViewProps> = ({
  currentStyle,
  onStyleChange,
  vehicleData,
  language,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('VISUAL');
  const [isMetric, setIsMetric] = useState(true);
  const text = uiText[language].settings;

  const styles: { id: DashboardStyle; label: string; desc: string; inactiveColor: string }[] = [
    { id: 'CLASSIC', label: text.visual.styles.classic.label, desc: text.visual.styles.classic.desc, inactiveColor: 'bg-blue-600' },
    { id: 'GAUGE', label: text.visual.styles.gauge.label, desc: text.visual.styles.gauge.desc, inactiveColor: 'bg-neutral-300' },
    { id: 'GRID', label: text.visual.styles.grid.label, desc: text.visual.styles.grid.desc, inactiveColor: 'bg-neutral-500' },
    { id: 'PERFORMANCE', label: text.visual.styles.performance.label, desc: text.visual.styles.performance.desc, inactiveColor: 'bg-neutral-700' },
  ];

  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* Settings Sub-Sidebar */}
      <div className="w-40 bg-neutral-900/70 border-r border-white/5 p-4 flex flex-col gap-2">
         {[
           { id: 'VISUAL', icon: Layout, label: text.tabs.visual },
           { id: 'ALARM', icon: Bell, label: text.tabs.alarm },
           { id: 'SENSOR', icon: Database, label: text.tabs.sensor },
           { id: 'SYSTEM', icon: Globe, label: text.tabs.system },
           { id: 'VERSION', icon: Info, label: text.tabs.version }
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as SettingsTab)}
             className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
               activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]'
             }`}
           >
             <tab.icon size={16} />
             <span className="text-[10px] font-black tracking-widest">{tab.label}</span>
           </button>
         ))}
         <div className="mt-auto pt-6">
           <LanguageToggle language={language} onChange={onLanguageChange} label={text.language} />
         </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 px-6 py-5 overflow-y-auto no-scrollbar">
        {activeTab === 'VISUAL' && (
          <div className="space-y-8">
             {/* Visual content ... */}
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold italic tracking-tighter">{text.visual.title}</h3>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-neutral-500 font-bold uppercase tracking-widest">{text.visual.tag}</span>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                {styles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => onStyleChange(style.id)}
                    className={`group relative flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left ${
                      currentStyle === style.id 
                        ? 'bg-blue-500/[0.05] border-blue-500/80 shadow-xl shadow-blue-600/10' 
                        : 'bg-neutral-900/40 border-white/5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                     <div
                       className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                         currentStyle === style.id ? 'bg-blue-600' : style.inactiveColor
                       }`}
                     >
                        <Layout className="text-white" size={32} />
                     </div>
                     <div className="flex-1">
                        <div className="text-lg font-black italic tracking-tight">{style.label}</div>
                        <div className="text-xs text-neutral-500 font-medium">{style.desc}</div>
                     </div>
                     {currentStyle === style.id && (
                       <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black italic">{text.visual.active}</div>
                     )}
                  </button>
                ))}
             </div>

          </div>
        )}

        {activeTab === 'ALARM' && (
          <div className="space-y-6">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold italic tracking-tighter">{text.alarm.title}</h3>
                <span className="text-[10px] bg-white/5 text-white px-2 py-1 rounded font-bold">{text.alarm.enabled}</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
               {[
                 { label: text.alarm.speed, val: '120', unit: 'km/h' },
                 { label: text.alarm.rpm, val: '7500', unit: 'rpm' },
                 { label: text.alarm.water, val: '105', unit: '°C' },
                 { label: text.alarm.throttle, val: '95', unit: '%' },
                 { label: text.alarm.fuel, val: '15', unit: '%' },
                 { label: text.alarm.volt, val: '11.5', unit: 'V' },
               ].map((alarm, i) => (
                 <div key={i} className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                   <div className="text-[10px] text-neutral-400 font-bold uppercase">{alarm.label}</div>
                   <div className="flex items-center gap-2">
                     <input type="text" defaultValue={alarm.val} className="w-12 bg-neutral-800 border border-white/10 rounded px-1 py-0.5 text-xs text-right font-mono" />
                     <span className="text-[8px] text-neutral-600 font-bold">{alarm.unit}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'SENSOR' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold italic tracking-tighter mb-6">{text.sensor.title}</h3>
            
            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-sm font-black italic">{text.sensor.profileName}: <span className="text-white">USERPID_1.INI</span></div>
                  <div className="text-[10px] text-neutral-500">{text.sensor.reading}</div>
                </div>
                <div className="flex gap-2">
                   <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] font-bold border border-white/10">{text.sensor.readEcu}</button>
                   <button className="px-3 py-1 bg-blue-600 text-white rounded text-[10px] font-bold shadow-lg shadow-blue-600/20">{text.sensor.write}</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div className="p-3 bg-neutral-800 rounded-lg border-l-4 border-blue-500">
                      <div className="text-[8px] text-neutral-400 font-bold tracking-widest mb-1 uppercase">CAN ID (Address)</div>
                      <div className="text-lg font-mono font-bold tracking-tighter">18DA 10F1</div>
                   </div>
                   <div className="p-3 bg-neutral-800 rounded-lg">
                      <div className="text-[8px] text-neutral-400 font-bold tracking-widest mb-1 uppercase">DATA TYPE</div>
                      <div className="text-sm font-bold">{text.sensor.dataType}</div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-neutral-800 rounded-lg">
                         <div className="text-[8px] text-neutral-400 font-bold mb-1 uppercase">SCALE x</div>
                         <div className="text-sm font-mono font-bold">0.01</div>
                      </div>
                      <div className="p-3 bg-neutral-800 rounded-lg">
                         <div className="text-[8px] text-neutral-400 font-bold mb-1 uppercase">OFFSET +</div>
                         <div className="text-sm font-mono font-bold"> -1.0</div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg">
                      <div className="text-[8px] text-neutral-500 font-bold mb-2 uppercase">{text.sensor.calculation}</div>
                      <div className="text-[10px] font-mono p-2 bg-black rounded mb-2 text-white">VALUE = DATA * A / B</div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px]"><span>{text.sensor.paramA}</span> <span className="font-mono">100.00</span></div>
                         <div className="flex justify-between text-[10px]"><span>{text.sensor.paramB}</span> <span className="font-mono">128.00</span></div>
                         <div className="flex justify-between text-[10px] text-neutral-600"><span>{text.sensor.paramC}</span> <span>{text.sensor.invalid}</span></div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SYSTEM' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold italic tracking-tighter mb-6">{text.system.title}</h3>

            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-sm font-black italic">{text.system.profileName}: <span className="text-white">SYSTEM_CONFIG_T</span></div>
                  <div className="text-[10px] text-neutral-500">{text.system.desc}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-800 rounded-lg border-l-4 border-blue-500">
                    <div className="text-[8px] text-neutral-400 font-bold tracking-widest mb-2 uppercase">{text.system.unitMode}</div>
                    <div className="bg-neutral-900 p-1 rounded-lg flex gap-1 w-fit">
                      <button
                        onClick={() => setIsMetric(true)}
                        className={`px-4 py-1.5 text-[10px] font-bold rounded ${isMetric ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}
                      >
                        {text.system.metric}
                      </button>
                      <button
                        onClick={() => setIsMetric(false)}
                        className={`px-4 py-1.5 text-[10px] font-bold rounded ${!isMetric ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}
                      >
                        {text.system.imperial}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-800 rounded-lg">
                    <div className="text-[8px] text-neutral-400 font-bold tracking-widest mb-2 uppercase">OTA</div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold">{text.system.ota}</div>
                        <div className="text-[10px] text-neutral-500">{text.system.otaDesc}</div>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-blue-600/20 p-1 shrink-0">
                        <div className="ml-auto h-4 w-4 rounded-full bg-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: text.system.telemetryRate, value: '1 Hz', detail: 'MQTT 1-5Hz' },
                    { label: text.system.voiceEnable, value: 'ON', detail: 'TTS/Keyword' },
                    { label: text.system.voiceVolume, value: '70%', detail: '60-90dB' },
                    { label: text.system.backlight, value: '68%', detail: 'LCD PWM' },
                    { label: text.system.logFormat, value: 'CSV/BIN', detail: 'TF Card' },
                    { label: text.system.rollback, value: text.system.enabled, detail: 'Bootloader' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-white/5 bg-neutral-800 p-3">
                      <div className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">{item.label}</div>
                      <div className="mt-1 text-base font-black text-white">{item.value}</div>
                      <div className="text-[10px] font-medium text-neutral-500">{item.detail}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-white/5 bg-neutral-900 p-4">
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      <CloudCog size={14} className="text-blue-400" />
                      {text.system.cloudTitle}
                    </div>
                    <div className="space-y-2 text-[11px] font-medium text-neutral-300">
                      <div className="flex justify-between"><span>Broker</span><span className="font-mono text-white">MQTT V3.1.1</span></div>
                      <div className="flex justify-between"><span>Telemetry</span><span className="font-mono text-white">ais/{'{sn}'}/telemetry</span></div>
                      <div className="flex justify-between"><span>OTA</span><span className="font-mono text-white">ais/{'{sn}'}/ota</span></div>
                      <div className="flex justify-between"><span>TLS</span><span className="font-mono text-white">1.2</span></div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/5 bg-neutral-900 p-4">
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      {text.system.otaTitle}
                    </div>
                    <div className="space-y-2 text-[11px] font-medium text-neutral-300">
                      <div className="flex justify-between"><span>{text.system.packageSize}</span><span className="font-mono text-white">4KB</span></div>
                      <div className="flex justify-between"><span>{text.system.hashCheck}</span><span className="font-mono text-white">SHA256</span></div>
                      <div className="flex justify-between"><span>{text.system.downloadSpeed}</span><span className="font-mono text-white">&gt;=20KB/s</span></div>
                      <div className="flex justify-between"><span>{text.system.recovery}</span><span className="font-mono text-white">{text.system.rollback}</span></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg">
                  <StatusView data={vehicleData} embedded language={language} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'VERSION' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold italic tracking-tighter">{text.version.title}</h3>
              <span className="rounded bg-white/5 px-2 py-1 text-[10px] font-bold text-white">{text.version.tag}</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-neutral-900/50 p-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: text.version.docNo, value: 'AIS-RD-REQ-001' },
                  { label: text.version.reqVersion, value: 'V1.0' },
                  { label: text.version.releaseDate, value: '2024-04' },
                  { label: text.version.department, value: text.version.departmentValue },
                  { label: text.version.standard, value: 'GB/T 8567-2020' },
                  { label: text.version.ieee, value: 'IEEE 830-1998' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/5 bg-neutral-950/90 px-5 py-4">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">{item.label}</div>
                    <div className="mt-2 text-sm font-black text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-neutral-950/90 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Monitor size={18} className="text-blue-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase text-neutral-400">{text.version.product}</div>
                    <div className="mt-1 text-sm font-bold text-white">AI Racing Dashboard System</div>
                    <div className="text-[10px] text-neutral-500">STM32F407VGT6 / NEO-M9N / MPU6050 / 5" TFT 800x480</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;
