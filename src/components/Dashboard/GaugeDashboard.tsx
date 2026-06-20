/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { VehicleData } from '../../types/vehicleData';
import bottomNormal from '../../assets/gauge/bottom-normal.png';
import bottomRed from '../../assets/gauge/bottom-red.png';
import topNormal from '../../assets/gauge/top-normal.png';
import topRed from '../../assets/gauge/top-red.png';
import figmaBottom from '../../assets/gauge/figma/rectangle-418.png';
import figmaTop from '../../assets/gauge/figma/rectangle-419.png';
import figmaGlow from '../../assets/gauge/figma/ellipse-125.svg';
import figmaBlackBase from '../../assets/gauge/figma/ellipse-124.svg';
import figmaInnerGradient from '../../assets/gauge/figma/ellipse-123.svg';

interface GaugeDashboardProps {
  data: VehicleData;
  chromeHidden: boolean;
}

function useAnimatedValue(target: number, duration = 600) {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  const targetRef = useRef(target);
  const durationRef = useRef(duration);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    targetRef.current = target;

    if (frameRef.current !== null) {
      return;
    }

    const tick = (now: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = now;
      }

      const deltaMs = Math.min(now - lastTimeRef.current, 48);
      lastTimeRef.current = now;
      const responseMs = Math.max(durationRef.current / 4, 36);
      const alpha = 1 - Math.exp(-deltaMs / responseMs);
      const delta = targetRef.current - valueRef.current;
      const epsilon = Math.max(Math.abs(targetRef.current) * 0.0002, 0.0005);

      if (Math.abs(delta) <= epsilon) {
        valueRef.current = targetRef.current;
        setValue(targetRef.current);
        frameRef.current = null;
        lastTimeRef.current = 0;
      } else {
        valueRef.current += delta * alpha;
        setValue(valueRef.current);
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [target]);

  useEffect(() => () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  return value;
}

const displayFont = "'Montroc', 'Arial Black', Impact, sans-serif";
const italicDisplayFont = "'Montroc Super-Italic', 'Montroc_Super-Italic', 'Montroc', 'Arial Black', Impact, sans-serif";
const labelFont = "'Sprintura Demo', 'Sprintura_Demo', 'Arial Black', Impact, sans-serif";
const numberFont = "'Montroc', 'Arial Black', Impact, sans-serif";

const outerRingPath =
  'M375.468 383.883C390.819 369.334 404.079 352.6 414.75 334.178C433.552 301.72 444.315 264.024 444.315 223.815C444.315 102.036 345.593 3.3147 223.815 3.3147C102.036 3.3147 3.3147 102.036 3.3147 223.815C3.3147 286.845 29.7605 343.698 72.1614 383.883';
const outerRingPathReversed =
  'M72.1614 383.883C29.7605 343.698 3.3147 286.845 3.3147 223.815C3.3147 102.036 102.036 3.3147 223.815 3.3147C345.593 3.3147 444.315 102.036 444.315 223.815C444.315 264.024 433.552 301.72 414.75 334.178C404.079 352.6 390.819 369.334 375.468 383.883';

const gearScaleRatios = [0.05, 0.2, 0.35, 0.5, 0.6, 0.72, 0.85, 0.95];

function getGearForGaugeRatio(ratio: number) {
  let closestGear = 1;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let gear = 1; gear < gearScaleRatios.length; gear += 1) {
    const distance = Math.abs(ratio - gearScaleRatios[gear]);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestGear = gear;
    }
  }

  return closestGear;
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, sweepDeg: number) {
  if (sweepDeg <= 0) return '';

  const start = ((startDeg - 90) * Math.PI) / 180;
  const end = ((startDeg + sweepDeg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);

  return `M ${x1} ${y1} A ${r} ${r} 0 ${sweepDeg > 180 ? 1 : 0} 1 ${x2} ${y2}`;
}

const DataLabel = ({ label }: { label: string }) => (
  <div className="flex w-full shrink-0 flex-col items-start gap-[2px]">
    <p
      className="min-w-full shrink-0 text-[19px] font-black uppercase leading-none text-white"
      style={{
        fontFamily: labelFont,
        fontStyle: 'normal',
        letterSpacing: '0',
        transform: 'none',
        transformOrigin: 'left center',
      }}
    >
      {label}
    </p>
    <div className="h-[2px] w-[120px] shrink-0 bg-gradient-to-r from-[#bc0201] to-black" />
  </div>
);

interface DataItemProps {
  label: string;
  value: number;
  decimals?: number;
}

const DataItem: React.FC<DataItemProps> = ({
  label,
  value,
  decimals = 0,
}) => {
  const animated = useAnimatedValue(value, 600);

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
      <DataLabel label={label} />
      <p
        className="shrink-0 whitespace-nowrap text-[39px] font-black leading-none text-white"
        style={{
          fontFamily: numberFont,
          fontStyle: 'normal',
          letterSpacing: '0',
          transform: 'none',
          transformOrigin: 'left center',
        }}
      >
        {Math.abs(animated) < 0.05 ? (0).toFixed(decimals) : animated.toFixed(decimals)}
      </p>
    </div>
  );
};

const Tick = ({
  left,
  top,
  width,
  height,
  rotate,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}) => (
  <div className="absolute flex items-center justify-center" style={{ left, top, width, height }}>
    <div className="flex-none" style={{ transform: `rotate(${rotate}deg)` }}>
      <div className="h-[22px] w-[3.114px] bg-gradient-to-b from-white from-[40.865%] to-[rgba(255,255,255,0.1)]" />
    </div>
  </div>
);

const GaugeDashboard: React.FC<GaugeDashboardProps> = ({ data, chromeHidden }) => {
  const chromeScale = chromeHidden ? 1 : 0.9025;
  const visibleChromeYOffset = (480 - 480 * chromeScale) / 2;
  const rpmRatio = Math.min(Math.max(data.rpm / 8000, 0.02), 0.98);
  const speedAnimated = useAnimatedValue(data.speed, 600);
  const gaugeRatio = Math.min(Math.max(rpmRatio, gearScaleRatios[0]), gearScaleRatios[7]);
  const gaugeAnimated = useAnimatedValue(gaugeRatio, 180);
  const displayGear = getGearForGaugeRatio(gaugeAnimated);
  const derivedGear = data.gear <= 0 && gaugeAnimated < 0.13 ? 'N' : displayGear;
  const isRedline = displayGear >= 6 || gaugeAnimated > 0.82;
  const startAngle = 225;
  const totalSweep = 270;
  const currentSweep = totalSweep * gaugeAnimated;
  const gaugeCx = 399.5;
  const gaugeCy = 241;

  const leftItems = [
    { label: 'ECT', value: data.coolantTemp },
    { label: 'OIL.T', value: Math.max(80, data.coolantTemp + 12) },
    { label: 'OIL.P', value: 2.1 + rpmRatio * 3.2, decimals: 1 },
    { label: 'IAT', value: data.intakeTemp },
  ];
  const rightItems = [
    { label: 'BOOST', value: Math.max(0, (data.throttle - 20) / 80), decimals: 1 },
    { label: 'AFR', value: 14.7 - rpmRatio * 2.4, decimals: 1 },
    { label: 'FUEL', value: data.fuelLevel },
    { label: 'VOLT', value: data.voltage, decimals: 1 },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black">
      <div className="relative h-[480px] shrink-0 transition-[width] duration-300 ease-out" style={{ width: chromeHidden ? 800 : 722 }}>
        <div
          className="relative origin-top-left overflow-hidden bg-black transition-transform duration-300 ease-out"
          style={{ width: 800, height: 480, minWidth: 800, minHeight: 480, transform: chromeHidden ? 'scale(1)' : `translateY(${visibleChromeYOffset}px) scale(${chromeScale})` }}
        >
          <div className="absolute left-[20px] top-1/2 flex w-[163px] -translate-y-1/2 flex-col items-start gap-[36px]">
            {leftItems.map((item) => (
              <DataItem key={item.label} label={item.label} value={item.value} decimals={item.decimals} />
            ))}
          </div>

          <div className="absolute left-[674px] top-1/2 flex w-[120px] -translate-y-1/2 flex-col items-start gap-[36px]">
            {rightItems.map((item) => (
              <DataItem key={item.label} label={item.label} value={item.value} decimals={item.decimals} />
            ))}
          </div>

          <div className="absolute left-0 top-[467px] h-[13px] w-[800px]">
            <img alt="" className={`pointer-events-none absolute inset-0 size-full max-w-none object-cover transition-opacity duration-500 ${isRedline ? 'opacity-0' : 'opacity-100'}`} src={figmaBottom || bottomNormal} />
            <img alt="" className={`pointer-events-none absolute inset-0 size-full max-w-none object-cover transition-opacity duration-500 ${isRedline ? 'animate-redline-pulse opacity-100' : 'opacity-0'}`} src={bottomRed} />
          </div>

          <div className="absolute left-0 top-0 flex h-[15px] w-[800px] items-center justify-center">
            <div className="flex-none rotate-180">
              <div className="relative h-[15px] w-[800px]">
                <img alt="" className={`pointer-events-none absolute inset-0 size-full max-w-none object-cover transition-opacity duration-500 ${isRedline ? 'opacity-0' : 'opacity-100'}`} src={figmaTop || topNormal} />
                <img alt="" className={`pointer-events-none absolute inset-0 size-full max-w-none object-cover transition-opacity duration-500 ${isRedline ? 'animate-redline-pulse opacity-100' : 'opacity-0'}`} src={topRed} />
              </div>
            </div>
          </div>

          <div
            className={`pointer-events-none absolute left-0 top-0 h-[105px] w-full blur-[22px] transition-opacity duration-500 ${isRedline ? 'animate-redline-pulse opacity-100' : 'opacity-0'}`}
            style={{ background: 'radial-gradient(ellipse at top, rgba(189, 1, 0, 0.58) 0%, rgba(189, 1, 0, 0.22) 36%, transparent 72%)' }}
          />
          <div
            className={`pointer-events-none absolute bottom-0 left-0 h-[105px] w-full blur-[22px] transition-opacity duration-500 ${isRedline ? 'animate-redline-pulse opacity-100' : 'opacity-0'}`}
            style={{ background: 'radial-gradient(ellipse at bottom, rgba(189, 1, 0, 0.58) 0%, rgba(189, 1, 0, 0.22) 36%, transparent 72%)' }}
          />

          <div className={`absolute left-[calc(50%+0.5px)] top-[calc(50%+1px)] h-[428px] w-[429px] -translate-x-1/2 -translate-y-1/2 ${isRedline ? 'animate-redline-pulse' : ''}`}>
            <div className="absolute inset-[-9.35%_-9.32%]">
              <img alt="" className="block size-full max-w-none" src={figmaGlow} />
            </div>
          </div>

          <div className="absolute left-[179px] top-[26px] h-[437px] w-[441px]">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={figmaBlackBase} />
          </div>

          <div className="absolute left-[274px] top-[117px] size-[252px]">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={figmaInnerGradient} />
          </div>

          <svg
            className={`pointer-events-none absolute inset-0 h-[480px] w-[800px] ${isRedline ? 'animate-redline-pulse' : ''}`}
            fill="none"
            viewBox="0 0 800 480"
          >
            {currentSweep > 0.1 && (
              <path
                d={describeArc(gaugeCx, gaugeCy, 167, startAngle, currentSweep)}
                fill="none"
                stroke="#bd0100"
                strokeLinecap="butt"
                strokeWidth="82"
              />
            )}
          </svg>

          <div className={`pointer-events-none absolute left-[179px] top-[24px] h-[380.569px] w-[441px] ${isRedline ? 'animate-redline-pulse' : ''}`}>
            <div className="absolute inset-[-0.87%_-0.75%_-1.23%_-0.75%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 447.629 388.569">
                <path
                  d={outerRingPath}
                  stroke="#3C3E3B"
                  strokeLinecap="square"
                  strokeWidth="6.6294"
                />
                {currentSweep > 0.1 && (
                  <path
                    d={outerRingPathReversed}
                    pathLength={1}
                    stroke="#BD0100"
                    strokeDasharray={`${gaugeAnimated} 1`}
                    strokeDashoffset={0}
                    strokeLinecap="square"
                    strokeWidth="6.6294"
                  />
                )}
              </svg>
            </div>
          </div>

          <div className="absolute left-[397px] top-[36.5px] h-[22px] w-[3px] bg-gradient-to-b from-white from-[40.865%] to-[rgba(255,255,255,0.1)]" />
          <Tick left={502.53} top={71.34} width={14.812} height={20.022} rotate={33.75} />
          <Tick left={253.93} top={377.43} width={17.758} height={17.758} rotate={-135} />
          <Tick left={570.65} top={163.08} width={21.517} height={11.296} rotate={67.5} />
          <Tick left={196} top={283.49} width={22.185} height={7.346} rotate={-101.25} />
          <Tick left={580.81} top={282.76} width={22.185} height={7.346} rotate={101.25} />
          <Tick left={206.26} top={163.87} width={21.517} height={11.296} rotate={-67.5} />
          <Tick left={527.63} top={376.92} width={17.758} height={17.758} rotate={135} />
          <Tick left={280.91} top={71.7} width={14.812} height={20.022} rotate={-33.75} />

          {[
            ['0', 273.49, 344.76, false],
            ['8', 502.75, 344.76, false],
            ['7', 552.42, 262.7, false],
            ['6', 537.93, 161.2, false],
            ['5', 477.45, 92.44, false],
            ['3', 294.73, 92.44, false],
            ['4', 386.04, 63.13, false],
            ['2', 236.42, 161.2, false],
            ['1', 225, 263.7, true],
          ].map(([label, left, top, italic]) => (
            <p
              key={label as string}
              className="absolute whitespace-nowrap text-[24px] font-black leading-none text-white"
              style={{
                left: left as number,
                top: top as number,
                fontFamily: italic ? italicDisplayFont : displayFont,
                fontStyle: 'normal',
                letterSpacing: '0',
                transform: 'none',
              }}
            >
              {label}
            </p>
          ))}

          <div className="absolute left-1/2 top-[calc(50%+11.5px)] flex w-[230px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[20px] overflow-visible leading-none">
            <p
              className={`w-[230px] shrink-0 overflow-visible bg-gradient-to-b from-white to-[#c4c4c4] bg-clip-text text-center text-[132px] font-black text-transparent transition-all duration-300 ${isRedline ? 'animate-redline-text drop-shadow-[0_0_20px_rgba(189,1,0,0.8)]' : ''}`}
              style={{
                fontFamily: labelFont,
                fontStyle: 'normal',
                letterSpacing: '0',
                transform: 'none',
              }}
            >
              {derivedGear}
            </p>
            <p
              className="shrink-0 whitespace-nowrap text-center text-[24px] font-black text-white"
              style={{
                fontFamily: labelFont,
                fontStyle: 'normal',
                letterSpacing: '0',
                transform: 'none',
              }}
            >
              RACE
            </p>
          </div>

          <div className={`absolute left-[360px] top-[382px] flex w-[77px] flex-col items-center pb-[4px] leading-none text-white ${isRedline ? 'animate-redline-pulse' : ''}`}>
            <p
              className="shrink-0 whitespace-nowrap text-[44px] font-black"
              style={{
                fontFamily: italicDisplayFont,
                fontStyle: 'normal',
                letterSpacing: '0',
                transform: 'none',
              }}
            >
              {Math.round(speedAnimated)}
            </p>
            <p className="min-w-full shrink-0 text-center text-[16px] font-medium" style={{ fontFamily: "'SF Pro Display', Arial, sans-serif" }}>
              km / h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaugeDashboard;
