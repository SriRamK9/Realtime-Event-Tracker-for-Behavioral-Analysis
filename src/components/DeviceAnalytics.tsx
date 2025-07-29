import React from 'react';
import { DeviceMetrics } from '../types/analytics';

interface DeviceAnalyticsProps {
  deviceMetrics: DeviceMetrics[];
}

export const DeviceAnalytics: React.FC<DeviceAnalyticsProps> = ({ deviceMetrics }) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Device Distribution</h4>
          <div className="space-y-3">
            {deviceMetrics.map((device, index) => (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
                  <span className="text-sm font-medium text-gray-700">{device.device}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">{device.count}</div>
                  <div className="text-xs text-gray-500">{device.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Rates */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Conversion Rates by Device</h4>
          <div className="space-y-3">
            {deviceMetrics.map((device, index) => (
              <div key={device.device} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{device.device}</span>
                  <span className="font-medium">{device.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors[index % colors.length]} transition-all duration-700`}
                    style={{ width: `${device.conversionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};