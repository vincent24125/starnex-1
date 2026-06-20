/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VehicleData {
  // Fast Channels (10-20Hz)
  rpm: number;
  speed: number;
  gear: number;
  throttle: number;
  brake: number;
  gForce: { x: number; y: number; z: number };
  
  // Slow Channels (1Hz)
  coolantTemp: number;
  voltage: number; // 电瓶电压
  intakeTemp: number; // 进气温度
  fuelLevel: number;

  // IMU & GPS
  altitude: number; // 海拔
  course: number; // 航向
  roll: number; // 横滚
  pitch: number; // 俯仰
  
  // Status
  gpsSats: number;
  gpsHealth: 'optimal' | 'locked' | 'searching';
  obdStatus: 'connected' | 'disconnected' | 'latency-high';
}

export type ScreenMode = 'HOME' | 'DASHBOARD' | 'SETTINGS';
export type DashboardStyle = 'CLASSIC' | 'PERFORMANCE' | 'GAUGE' | 'GRID';
