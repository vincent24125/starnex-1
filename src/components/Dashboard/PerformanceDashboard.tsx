import React, { useEffect, useRef, useState } from 'react';
import { VehicleData } from '../../types/vehicleData';

interface PerformanceDashboardProps {
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

const majorTicks = [96, 192, 288, 384, 480, 576, 672, 768];
const minorTicks = [48, 144, 240, 336, 432, 528, 624, 720];
const accent = '#77f1f6';
const borderAccent = '#39cfe2';
const displayFont = "'Montroc', 'Arial Black', Impact, sans-serif";
const condensedFont = "'Montroc Condensed', 'Montroc_Condensed', 'Montroc', 'Arial Black', Impact, sans-serif";
const sfFont = "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif";

const DataCard = ({
  label,
  value,
  decimals = 0,
  labelOnTop = true,
}: {
  label: string;
  value: number;
  decimals?: number;
  labelOnTop?: boolean;
}) => {
  const animated = useAnimatedValue(value, 500);

  return (
    <div className="relative flex h-[72px] min-w-px flex-[1_0_0] items-center justify-center rounded-[12px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-[-1.5px] rounded-[13.5px] border-[3px] border-solid border-[#39cfe2]" />
      <div className="relative flex shrink-0 flex-col items-center justify-center gap-[4px] whitespace-nowrap leading-none text-[#77f1f6]">
        {labelOnTop && (
          <p
            className="relative shrink-0 text-center text-[16px] font-semibold"
            style={{ fontFamily: sfFont, fontVariationSettings: "'wdth' 100" }}
          >
            {label}
          </p>
        )}
        <p
          className="relative shrink-0 text-[36px] leading-none"
          style={{ fontFamily: displayFont, textShadow: '2px 2px 0px black' }}
        >
          {animated.toFixed(decimals)}
        </p>
        {!labelOnTop && (
          <p
            className="relative shrink-0 text-center text-[16px] font-semibold"
            style={{ fontFamily: sfFont, fontVariationSettings: "'wdth' 100" }}
          >
            {label}
          </p>
        )}
      </div>
    </div>
  );
};

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ data, chromeHidden }) => {
  const rpmRatio = Math.min(Math.max(data.rpm / 8000, 0), 1);
  const rpmAnimated = useAnimatedValue(rpmRatio, 180);
  const gear = data.gear <= 0 ? 'N' : Math.min(Math.max(data.gear, 1), 7);
  const barWidth = rpmAnimated * 768;
  const scale = chromeHidden ? 1 : 0.9025;
  const yOffset = chromeHidden ? 0 : (480 - 480 * scale) / 2;

  const oilPressure = 2.1 + rpmRatio * 3.2;
  const oilTemp = Math.max(80, data.coolantTemp + 12);
  const boost = Math.max(0, (data.throttle - 20) / 80);
  const afr = 14.7 - rpmRatio * 2.4;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black">
      <div className="relative h-[480px] shrink-0 transition-[width] duration-300 ease-out" style={{ width: chromeHidden ? 800 : 722 }}>
        <div
          className="relative origin-top-left overflow-hidden bg-black transition-transform duration-300 ease-out"
          style={{ width: 800, height: 480, minWidth: 800, minHeight: 480, transform: `translateY(${yOffset}px) scale(${scale})` }}
        >
          <div className="absolute left-0 top-0 h-[60px] bg-[#77f1f6] transition-[width] duration-100 ease-linear" style={{ width: barWidth }} />

          <div className="absolute left-[-28px] top-[64px] h-0 w-[828px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 828 1">
                <line stroke={accent} x2="828" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>

          {majorTicks.map((x) => (
            <div key={`maj-${x}`} className="absolute top-[64px] flex h-[16px] w-0 items-center justify-center" style={{ left: x }}>
              <div className="flex-none rotate-90">
                <div className="relative h-0 w-[16px]">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 1">
                      <line stroke={accent} x2="16" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {minorTicks.map((x) => (
            <div key={`min-${x}`} className="absolute top-[64px] flex h-[8px] w-0 items-center justify-center" style={{ left: x }}>
              <div className="flex-none rotate-90">
                <div className="relative h-0 w-[8px]">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 1">
                      <line stroke={accent} x2="8" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <p
              key={n}
              className="absolute top-[84px] w-[48px] -translate-x-1/2 text-center text-[32px] leading-none text-[#77f1f6]"
              style={{ left: n * 96, fontFamily: displayFont, textShadow: '2px 2px 0px black' }}
            >
              {n}
            </p>
          ))}

          <div className="absolute left-[24px] top-[144px] flex w-[240px] items-center">
            <DataCard label="ECT" value={data.coolantTemp} />
          </div>
          <div className="absolute left-[24px] top-[228px] flex w-[240px] items-center">
            <DataCard label="OIL.T" value={oilTemp} />
          </div>
          <div className="absolute left-[24px] top-[312px] flex w-[240px] items-center">
            <DataCard label="OIL.P" value={oilPressure} decimals={1} />
          </div>
          <div className="absolute left-[24px] top-[396px] flex w-[240px] items-center">
            <DataCard label="IAT" value={data.intakeTemp} />
          </div>

          <div className="absolute left-[280px] top-[144px] flex w-[240px] items-center">
            <DataCard label="km/h" value={data.speed} labelOnTop={false} />
          </div>

          <div className="absolute left-[535px] top-[144px] flex w-[240px] items-center">
            <DataCard label="BOOST" value={boost} decimals={1} />
          </div>
          <div className="absolute left-[535px] top-[228px] flex w-[240px] items-center">
            <DataCard label="AFR" value={afr} decimals={1} />
          </div>
          <div className="absolute left-[535px] top-[312px] flex w-[240px] items-center">
            <DataCard label="FUEL" value={data.fuelLevel} />
          </div>
          <div className="absolute left-[535px] top-[396px] flex w-[240px] items-center">
            <DataCard label="VOLT" value={data.voltage} decimals={1} />
          </div>

          <div className="absolute left-1/2 top-[228px] flex size-[240px] -translate-x-1/2 items-center justify-center rounded-[12px] px-[32px] py-[40px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-[-1.5px] rounded-[13.5px] border-[3px] border-solid border-[#39cfe2]" />
            <p
              className="relative shrink-0 whitespace-nowrap text-center text-[176px] leading-none text-[#77f1f6]"
              style={{ fontFamily: condensedFont, textShadow: '2px 2px 0px black' }}
            >
              {gear}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
