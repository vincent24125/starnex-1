/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { VehicleData } from '../types/vehicleData';

const INITIAL_DATA: VehicleData = {
  rpm: 800,
  speed: 0,
  gear: 0,
  throttle: 0,
  brake: 0,
  gForce: { x: 0, y: 0, z: 0 },
  coolantTemp: 85,
  voltage: 13.8,
  intakeTemp: 35,
  fuelLevel: 100,
  altitude: 45,
  course: 120,
  roll: 0,
  pitch: 0,
  gpsSats: 12,
  gpsHealth: 'optimal',
  obdStatus: 'connected',
};

export function useVehicleData() {
  const [data, setData] = useState<VehicleData>(INITIAL_DATA);
  const frameId = useRef<number>(0);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const update = () => {
      const time = (Date.now() - startTime.current) / 1000;
      
      setData(prev => {
        // Simple simulation of a car driving
        const rpm = 2000 + Math.abs(Math.sin(time * 0.5)) * 6000;
        const gear = Math.floor(rpm / 1500) + 1;
        const speed = (rpm / 8000) * 240 * (gear / 6);
        const throttle = (Math.sin(time * 2) + 1) * 50;
        const brake = (Math.cos(time * 2) + 1) * 20;

        // Slow updates (1Hz behavior)
        const isSlowTick = Math.floor(time) !== Math.floor(time - 0.05);
        
        return {
          ...prev,
          rpm,
          speed,
          gear,
          throttle,
          brake,
          gForce: {
            x: Math.sin(time * 3) * 1.2,
            y: Math.cos(time * 2) * 2.1,
            z: 1.0 + Math.sin(time * 5) * 0.1
          },
          ...(isSlowTick && {
            coolantTemp: 85 + Math.sin(time * 0.01) * 5,
            voltage: 13.5 + Math.random() * 0.4,
            intakeTemp: 30 + Math.sin(time * 0.05) * 10,
            fuelLevel: Math.max(0, 100 - (time / 60)),
            altitude: 45 + Math.sin(time * 0.02) * 10,
            course: (120 + time * 5) % 360,
            roll: Math.sin(time * 1.5) * 15,
            pitch: Math.cos(time * 2) * 8,
            gpsSats: 10 + Math.floor(Math.random() * 5),
          })
        };
      });

      frameId.current = requestAnimationFrame(update);
    };

    frameId.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId.current);
  }, []);

  return data;
}
