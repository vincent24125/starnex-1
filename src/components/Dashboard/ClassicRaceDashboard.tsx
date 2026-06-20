/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { VehicleData } from '../../types/vehicleData';

interface ClassicRaceDashboardProps {
  data: VehicleData;
  chromeHidden: boolean;
}

function useAnimatedValue(target: number, duration = 600) {
  const [value, setValue] = useState(target);
  const previous = useRef(target);

  useEffect(() => {
    const start = previous.current;
    const startTime = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      setValue(current);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        previous.current = target;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

const gearConfigs = [
  { barFrom: '#4ce27a', barTo: '#d4f495', bottomBg: '#0042ff', bottomBorder: '#4eceeb', fillMax: 0.68 },
  { barFrom: '#0042ff', barTo: '#39cfe2', bottomBg: '#0042ff', bottomBorder: '#4eceeb', fillMax: 0.78 },
  { barFrom: '#1a6bff', barTo: '#5bc0de', bottomBg: '#0042ff', bottomBorder: '#4eceeb', fillMax: 0.84 },
  { barFrom: '#ff9900', barTo: '#ffcc00', bottomBg: '#ff9900', bottomBorder: '#ffd401', fillMax: 0.84 },
  { barFrom: '#ff0200', barTo: '#ff730d', bottomBg: '#ff2e00', bottomBorder: '#ffd401', fillMax: 0.84 },
  { barFrom: '#8c0100', barTo: '#ff0200', bottomBg: '#bd0100', bottomBorder: '#ffd401', fillMax: 0.9 },
];

const displayFont = "'Arial Black', Impact, sans-serif";
const textFont = "'SF Pro Display', 'SF Pro Text', Arial, sans-serif";
const numberStyle: React.CSSProperties = {
  fontFamily: displayFont,
  fontStyle: 'italic',
  letterSpacing: '-0.04em',
  transform: 'skewX(-8deg)',
};

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  bw?: number;
  children?: React.ReactNode;
}

const Box: React.FC<BoxProps> = ({
  x,
  y,
  w,
  h,
  color,
  bw = 3,
  children,
}) => {
  return (
    <div className="absolute flex items-center justify-center" style={{ left: x, top: y, width: w, height: h }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px] border-solid"
        style={{
          borderColor: color,
          borderWidth: bw,
          margin: bw === 4 ? -2 : -1.5,
          borderRadius: bw === 4 ? 14 : 13.5,
        }}
      />
      {children}
    </div>
  );
};

const RaceNumber = ({
  children,
  size,
  className = '',
}: {
  children: React.ReactNode;
  size: number;
  className?: string;
}) => (
  <p className={`text-white ${className}`} style={{ ...numberStyle, fontSize: size, lineHeight: 1 }}>
    {children}
  </p>
);

const Label = ({
  children,
  size = 16,
  className = '',
}: {
  children: React.ReactNode;
  size?: number;
  className?: string;
}) => (
  <p className={`font-semibold text-white ${className}`} style={{ fontFamily: textFont, fontSize: size, lineHeight: 1.12 }}>
    {children}
  </p>
);

const PlainValue = ({
  children,
  size = 36,
  className = '',
}: {
  children: React.ReactNode;
  size?: number;
  className?: string;
}) => (
  <p className={`font-normal text-white ${className}`} style={{ fontFamily: textFont, fontSize: size, lineHeight: 1.05 }}>
    {children}
  </p>
);

const ClassicRaceDashboard: React.FC<ClassicRaceDashboardProps> = ({ data, chromeHidden }) => {
  const derivedGear = data.gear <= 0 ? 1 : Math.min(Math.max(data.gear, 1), 6);
  const gearIndex = derivedGear - 1;
  const config = gearConfigs[gearIndex];
  const rpmFill = Math.min(Math.max(data.rpm / 8000, 0.08), 1);
  const fillTarget = Math.max(config.fillMax * 0.35, Math.min(rpmFill, config.fillMax));
  const fillAnimated = useAnimatedValue(fillTarget, 420);
  const speedAnimated = useAnimatedValue(data.speed, 450);
  const brakeBiasAnimated = useAnimatedValue(126 + gearIndex + Math.round(data.brake / 20), 500);
  const absAnimated = useAnimatedValue(4 + gearIndex, 400);
  const tcAnimated = useAnimatedValue(3 + gearIndex, 400);
  const mapAnimated = useAnimatedValue(2 + Math.min(gearIndex, 4), 400);
  const airAnimated = useAnimatedValue(data.intakeTemp, 800);
  const trackAnimated = useAnimatedValue(data.coolantTemp * 0.45, 800);
  const barHeight = 348;
  const fillHeight = barHeight * fillAnimated;
  const clock = useMemo(() => new Date(), []);
  const timeLabel = `${String(clock.getHours()).padStart(2, '0')}:${String(clock.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black">
      <div className="relative shrink-0 transition-[width,height] duration-300 ease-out" style={{ width: chromeHidden ? 800 : 722, height: chromeHidden ? 480 : 433.2 }}>
        <div
          className="relative origin-top-left bg-black transition-transform duration-300 ease-out"
          style={{
            width: 800,
            height: 480,
            transform: chromeHidden ? 'scale(1)' : 'scale(0.9025)',
          }}
        >
        <div className="absolute left-1/2 top-[19px] w-[96px] -translate-x-1/2 overflow-hidden rounded-[12px]" style={{ height: barHeight }}>
          <div
            className="absolute bottom-0 w-full"
            style={{
              height: fillHeight,
              background: `linear-gradient(to top, ${config.barFrom}, ${config.barTo})`,
              borderRadius: fillHeight >= barHeight ? 12 : '0 0 12px 12px',
              transition: 'height 100ms linear',
            }}
          />
        </div>

        <div className="absolute left-1/2 top-[19px] h-[348px] w-[96px] -translate-x-1/2">
          <div aria-hidden className="pointer-events-none absolute inset-[-2px] rounded-[14px] border-4 border-[#ffd401] border-solid" />
        </div>

        <div className="absolute left-1/2 top-[19px] flex h-[348px] w-[96px] -translate-x-1/2 items-end justify-center pb-[16px]">
          <RaceNumber size={64} className="text-center drop-shadow-[2px_2px_4px_rgba(0,0,0,0.85)]">
            {derivedGear}
          </RaceNumber>
        </div>

        <Box x={20} y={19} w={152} h={72} color="#ff34ad">
          <RaceNumber size={32}>{timeLabel}</RaceNumber>
        </Box>

        <Box x={184} y={19} w={152} h={72} color="#ff34ad">
          <div className="flex items-center gap-[16px] text-white">
            <div className="flex flex-col items-center gap-1">
              <Label size={14}>AIR</Label>
              <PlainValue size={32}>{Math.round(airAnimated)}°</PlainValue>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Label size={14}>TRACK</Label>
              <PlainValue size={32}>{Math.round(trackAnimated)}°</PlainValue>
            </div>
          </div>
        </Box>

        <Box x={464} y={19} w={152} h={72} color="#ff34ad">
          <div className="flex items-center gap-[12px] text-white">
            <Label size={24}>POS</Label>
            <RaceNumber size={44}>2</RaceNumber>
          </div>
        </Box>

        <Box x={628} y={19} w={152} h={72} color="#ff34ad">
          <div className="flex items-center gap-[12px] text-white">
            <Label size={24}>Lap</Label>
            <RaceNumber size={44}>4</RaceNumber>
          </div>
        </Box>

        <Box x={20} y={99} w={152} h={80} color="#0042ff">
          <div className="flex flex-col items-center gap-1 text-white">
            <Label size={14}>Brake Bias</Label>
            <RaceNumber size={36}>{Math.round(brakeBiasAnimated)}</RaceNumber>
          </div>
        </Box>

        <Box x={184} y={99} w={152} h={80} color="#0042ff">
          <div className="flex items-center gap-[12px] text-white">
            <Label size={24}>ABS</Label>
            <RaceNumber size={44}>{Math.round(absAnimated)}</RaceNumber>
          </div>
        </Box>

        <Box x={464} y={103} w={152} h={72} color="#0042ff">
          <div className="flex items-center gap-[12px] text-white">
            <Label size={24}>TC</Label>
            <RaceNumber size={44}>{Math.round(tcAnimated)}</RaceNumber>
          </div>
        </Box>

        <Box x={628} y={103} w={152} h={72} color="#0042ff">
          <div className="flex items-center gap-[12px] text-white">
            <Label size={24}>Map</Label>
            <RaceNumber size={44}>{Math.round(mapAnimated)}</RaceNumber>
          </div>
        </Box>

        <Box x={20} y={187} w={316} h={96} color="#ffd401">
          <div className="flex w-[280px] flex-col gap-[8px] text-white">
            {['Curent', 'Predicted'].map((label) => (
              <div key={label} className="flex items-center justify-between">
                <Label size={14}>{label}</Label>
                <RaceNumber size={22}>--:--:---</RaceNumber>
              </div>
            ))}
          </div>
        </Box>

        <Box x={464} y={187} w={316} h={96} color="#ffd401">
          <div className="flex w-[280px] flex-col gap-[8px] text-white">
            {['Curent', 'Predicted'].map((label) => (
              <div key={label} className="flex items-center justify-between">
                <Label size={14}>{label}</Label>
                <RaceNumber size={22}>--:--:---</RaceNumber>
              </div>
            ))}
          </div>
        </Box>

        {([
          ['FL', 20],
          ['FR', 184],
          ['RL', 464],
          ['RR', 628],
        ] as const).map(([position, x]) => (
          <Box key={position} x={x} y={295} w={152} h={72} color="#0042ff">
            <div className="flex items-center gap-[10px] text-white">
              <div className="text-center">
                <Label size={16}>{position}</Label>
                <Label size={16}>Temp</Label>
              </div>
              <PlainValue size={32}>N/A</PlainValue>
            </div>
          </Box>
        ))}

        <Box x={20} y={383} w={140} h={80} color="#39cfe2">
          <div className="flex flex-col items-center gap-1 text-white">
            <Label size={13}>Remaining Fuel</Label>
            <PlainValue size={32}>{data.fuelLevel > 0 ? `${Math.round(data.fuelLevel)}%` : 'N/A'}</PlainValue>
          </div>
        </Box>

        <Box x={172} y={383} w={140} h={80} color="#39cfe2">
          <div className="flex flex-col items-center gap-1 text-white">
            <Label size={13}>Avg,Ful per LAP</Label>
            <PlainValue size={32}>N/A</PlainValue>
          </div>
        </Box>

        <div
          className="absolute flex items-center justify-center rounded-[12px]"
          style={{
            left: 322,
            top: 383,
            width: 156,
            height: 80,
            backgroundColor: config.bottomBg,
            transition: 'background-color 500ms',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[-2px] rounded-[14px] border-4 border-solid"
            style={{ borderColor: config.bottomBorder, transition: 'border-color 500ms' }}
          />
          <div className="flex flex-col items-center text-white">
            <RaceNumber size={40}>{Math.round(speedAnimated)}</RaceNumber>
            <Label size={14} className="mt-[2px]">
              km / h
            </Label>
          </div>
        </div>

        <Box x={496} y={383} w={136} h={80} color="#39cfe2">
          <div className="flex flex-col items-center gap-1 text-white">
            <Label size={13}>Driver Ahead</Label>
            <PlainValue size={32}>N/A</PlainValue>
          </div>
        </Box>

        <Box x={644} y={383} w={136} h={80} color="#39cfe2">
          <div className="flex flex-col items-center gap-1 text-white">
            <Label size={13}>Driver Behind</Label>
            <PlainValue size={32}>N/A</PlainValue>
          </div>
        </Box>
        </div>
      </div>
    </div>
  );
};

export default ClassicRaceDashboard;
