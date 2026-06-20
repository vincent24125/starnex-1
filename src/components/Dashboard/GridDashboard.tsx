/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VehicleData } from '../../types/vehicleData';
import { Compass } from 'lucide-react';
import { Language, uiText } from '../../i18n';

interface GridDashboardProps {
  data: VehicleData;
  language: Language;
}

const GridDashboard: React.FC<GridDashboardProps> = ({ data, language }) => {
  const text = uiText[language].grid;
  const gridCells = [
    { label: text.gMeter, value: data.gForce.x.toFixed(2), unit: 'g', color: 'text-white' },
    { label: text.roll, value: data.roll.toFixed(1), unit: 'deg', color: 'text-white' },
    { label: text.pitch, value: data.pitch.toFixed(1), unit: 'deg', color: 'text-white' },
    { label: text.rpm, value: data.rpm.toFixed(0), unit: 'r/min', color: 'text-white' },
    { label: text.volt, value: data.voltage.toFixed(1), unit: 'V', color: 'text-white' },
    { label: text.throttle, value: data.throttle.toFixed(0), unit: '%', color: 'text-white' },
    { label: text.course, value: data.course.toFixed(1), unit: 'deg', color: 'text-white', isCourse: true },
    { label: text.waterTemp, value: data.coolantTemp.toFixed(0), unit: '°C', color: 'text-white' },
    { label: text.speed, value: data.speed.toFixed(0), unit: 'km/h', color: 'text-white' },
  ];

  return (
    <div className="w-full h-full bg-black p-2 font-mono">
      <div className="grid grid-cols-3 grid-rows-3 gap-1 h-full">
        {gridCells.map((cell, i) => (
          <div 
            key={i} 
            className="flex flex-col border border-white/10 p-2 relative overflow-hidden"
          >
            {/* Cell Label (Top Left) */}
            <div className="flex items-center gap-1">
               {cell.isCourse && <Compass size={10} className="text-white" />}
               <span className="text-[10px] text-neutral-500 font-black tracking-tighter italic">
                 {cell.label}
               </span>
               <span className="ml-auto text-[8px] text-neutral-600 italic">
                 {cell.unit}
               </span>
            </div>

            {/* Cell Value (Center) */}
            <div className="flex-1 flex items-center justify-center">
               {cell.isCourse ? (
                 <div className="flex items-center gap-2">
                    <Compass 
                       className="text-white transition-transform duration-500" 
                       size={24} 
                       style={{ transform: `rotate(${cell.value}deg)` }}
                    />
                    <span className={`text-3xl font-black italic tracking-tighter ${cell.color}`}>
                      {cell.value}
                    </span>
                 </div>
               ) : (
                 <span className={`text-4xl font-black italic tracking-tighter ${cell.color}`}>
                   {cell.value}
                 </span>
               )}
            </div>

            {/* Lat/Lon Overlay for the bottom left cell area (GPS Style) */}
            {i === 6 && (
               <div className="absolute bottom-1 left-2 text-[7px] text-neutral-500 leading-tight">
                  LAT. LON. WGS<br />
                  <span className="text-white">N 27.570293</span><br />
                  <span className="text-white">E 120.406384</span>
               </div>
            )}
            
            {/* Fuel Info for bottom center */}
            {i === 7 && (
               <div className="absolute bottom-1 right-2 flex items-baseline gap-1">
                  <span className="text-[7px] text-neutral-500">{text.fuel}</span>
                  <span className="text-[10px] text-white font-bold">{data.fuelLevel.toFixed(0)}</span>
                  <span className="text-[6px] text-neutral-600">%</span>
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Brand Footer */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-neutral-800 font-black tracking-[0.5em]">
         {text.dualSystem}
      </div>
    </div>
  );
};

export default GridDashboard;
