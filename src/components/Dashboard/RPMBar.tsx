/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface RPMBarProps {
  rpm: number;
  maxRpm: number;
}

const RPMBar: React.FC<RPMBarProps> = ({ rpm, maxRpm }) => {
  const percentage = (rpm / maxRpm) * 100;
  const isRedline = rpm > 7500;

  // Split the bar into segments for a "mechanical" look
  const segments = Array(20).fill(0);

  return (
    <div className="w-full relative">
      {/* Background Track */}
      <div className="h-10 bg-neutral-900 rounded-lg overflow-hidden border border-white/10 flex gap-0.5 p-0.5 relative">
        {segments.map((_, i) => {
          const segmentVal = (i / segments.length) * 100;
          const isActive = percentage > segmentVal;
          
          let color = 'bg-white';
          if (segmentVal > 60) color = 'bg-neutral-300';
          if (segmentVal > 85) color = 'bg-neutral-500';

          return (
            <div 
              key={i}
              className={`flex-1 h-full rounded-sm transition-all duration-75 ${
                isActive ? color : 'bg-neutral-800'
              }`}
            />
          );
        })}

        {/* Predictive Redline Flash Overlay */}
        {isRedline && (
          <motion.div 
            animate={{ opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="absolute inset-0 bg-red-600/40 pointer-events-none"
          />
        )}
      </div>
      
      {/* Digital RPM Counter */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-mono text-lg font-bold drop-shadow-md">
        {Math.floor(rpm)}
      </div>
    </div>
  );
};

export default RPMBar;
