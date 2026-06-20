/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Language, uiText } from '../../i18n';

interface GForceRadarProps {
  gForce: { x: number; y: number };
  language: Language;
}

const GForceRadar: React.FC<GForceRadarProps> = ({ gForce, language }) => {
  const text = uiText[language].dashboard;
  const maxSize = 80;
  const radius = maxSize / 2;
  const scale = 15; // Pixels per G

  const dotX = radius + (gForce.x * scale);
  const dotY = radius + (gForce.y * scale);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div 
        className="relative rounded-full border border-white/20 bg-black/40"
        style={{ width: maxSize, height: maxSize }}
      >
        {/* Axes */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10" />
        
        {/* Circles for scale */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full border border-white/5" />
        
        {/* The G-Dot */}
        <motion.div
          animate={{ x: dotX - 4, y: dotY - 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        />
      </div>
      
      <div className="mt-2 flex gap-4 text-[10px] font-mono font-bold text-neutral-400">
        <div>{text.lateral} <span className="text-white">{gForce.x.toFixed(1)}</span></div>
        <div>{text.longitudinal} <span className="text-white">{gForce.y.toFixed(1)}</span></div>
      </div>
    </div>
  );
};

export default GForceRadar;
