import React from 'react';
import { FunnelStage } from '../types/analytics';

interface FunnelChartProps {
  stages: FunnelStage[];
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ stages }) => {
  const maxCount = Math.max(...stages.map(s => s.count));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">User Conversion Funnel</h3>
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.name} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{stage.name}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{stage.count.toLocaleString()} users</span>
                <span className="text-sm text-gray-500">{stage.percentage.toFixed(1)}%</span>
                {index > 0 && (
                  <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                    -{stage.dropOffRate.toFixed(1)}% drop-off
                  </span>
                )}
              </div>
            </div>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${
                  index === 0 ? 'bg-blue-500' :
                  index === 1 ? 'bg-indigo-500' :
                  index === 2 ? 'bg-purple-500' :
                  index === 3 ? 'bg-pink-500' :
                  index === 4 ? 'bg-red-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(stage.count / maxCount) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {stage.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};