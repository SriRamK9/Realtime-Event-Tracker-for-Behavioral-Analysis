import React from 'react';
import { GeoMetrics } from '../types/analytics';

interface GeoAnalyticsProps {
  geoMetrics: GeoMetrics[];
}

export const GeoAnalytics: React.FC<GeoAnalyticsProps> = ({ geoMetrics }) => {
  const sortedMetrics = [...geoMetrics].sort((a, b) => b.sessions - a.sessions).slice(0, 8);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedMetrics.map((metric) => (
          <div key={metric.country} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800">{metric.country}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                metric.conversionRate > 15 ? 'bg-green-100 text-green-800' :
                metric.conversionRate > 10 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {metric.conversionRate.toFixed(1)}%
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sessions</span>
                <span className="font-medium">{metric.sessions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Conversions</span>
                <span className="font-medium">{metric.conversions.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-blue-500 transition-all duration-700"
                  style={{ width: `${metric.conversionRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};