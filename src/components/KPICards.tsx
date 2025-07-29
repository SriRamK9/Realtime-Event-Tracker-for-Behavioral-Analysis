import React from 'react';
import { TrendingUp, Users, Target, Clock } from 'lucide-react';

interface KPICardsProps {
  totalSessions: number;
  totalConversions: number;
  overallConversionRate: number;
  avgSessionTime: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalSessions,
  totalConversions,
  overallConversionRate,
  avgSessionTime,
}) => {
  const kpis = [
    {
      title: 'Total Sessions',
      value: totalSessions.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12.3%',
      positive: true,
    },
    {
      title: 'Conversions',
      value: totalConversions.toLocaleString(),
      icon: Target,
      color: 'bg-green-500',
      change: '+8.1%',
      positive: true,
    },
    {
      title: 'Conversion Rate',
      value: `${overallConversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+2.4%',
      positive: true,
    },
    {
      title: 'Avg Session Time',
      value: `${avgSessionTime.toFixed(1)}m`,
      icon: Clock,
      color: 'bg-orange-500',
      change: '-5.2%',
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi) => (
        <div key={kpi.title} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${kpi.color}`}>
              <kpi.icon className="w-6 h-6 text-white" />
            </div>
            <span className={`text-sm font-medium ${
              kpi.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.change}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</h3>
            <p className="text-sm text-gray-600">{kpi.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};