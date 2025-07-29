import React from 'react';
import { TimeMetrics } from '../types/analytics';

interface TimeAnalysisChartProps {
  timeMetrics: TimeMetrics[];
}

export const TimeAnalysisChart: React.FC<TimeAnalysisChartProps> = ({ timeMetrics }) => {
  if (timeMetrics.length === 0) return null;

  const averages = {
    timeOnForm: timeMetrics.reduce((sum, m) => sum + m.timeOnForm, 0) / timeMetrics.length,
    timeReviewUnderway: timeMetrics.reduce((sum, m) => sum + m.timeReviewUnderway, 0) / timeMetrics.length,
    timeToPayment: timeMetrics.reduce((sum, m) => sum + m.timeToPayment, 0) / timeMetrics.length,
    sessionDuration: timeMetrics.reduce((sum, m) => sum + m.sessionDuration, 0) / timeMetrics.length,
  };

  const maxTime = Math.max(...Object.values(averages));

  const timeData = [
    { label: 'Time on Form', value: averages.timeOnForm, color: 'bg-blue-500' },
    { label: 'Review Time', value: averages.timeReviewUnderway, color: 'bg-green-500' },
    { label: 'Payment Time', value: averages.timeToPayment, color: 'bg-yellow-500' },
    { label: 'Session Duration', value: averages.sessionDuration, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Time Spent Analysis</h3>
      <div className="space-y-4">
        {timeData.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 w-32">{item.label}</span>
            <div className="flex-1 mx-4">
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-700`}
                  style={{ width: `${(item.value / maxTime) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-gray-600 w-20 text-right">
              {item.value.toFixed(1)} min
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};