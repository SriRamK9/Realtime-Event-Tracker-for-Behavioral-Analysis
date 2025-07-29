import React from 'react';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { FunnelChart } from './components/FunnelChart';
import { TimeAnalysisChart } from './components/TimeAnalysisChart';
import { DeviceAnalytics } from './components/DeviceAnalytics';
import { UTMAnalytics } from './components/UTMAnalytics';
import { GeoAnalytics } from './components/GeoAnalytics';
import { useAnalytics } from './hooks/useAnalytics';
import { generateMockUTMUrls, generateMockSessions } from './data/mockData';

function App() {
  // Generate dummy data
  const utmUrls = generateMockUTMUrls();
  const sessions = generateMockSessions(150, utmUrls);
  
  const analytics = useAnalytics(sessions, utmUrls);
  
  const avgSessionTime = analytics.timeMetrics.length > 0 
    ? analytics.timeMetrics.reduce((sum, m) => sum + m.sessionDuration, 0) / analytics.timeMetrics.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KPICards
          totalSessions={analytics.totalSessions}
          totalConversions={analytics.totalConversions}
          overallConversionRate={analytics.overallConversionRate}
          avgSessionTime={avgSessionTime}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DeviceAnalytics deviceMetrics={analytics.deviceMetrics} />
          <TimeAnalysisChart timeMetrics={analytics.timeMetrics} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FunnelChart stages={analytics.funnelStages} />
          <UTMAnalytics 
            utmMetrics={analytics.utmMetrics}
            utmUrls={utmUrls}
            getCampaignUrls={analytics.getCampaignUrls}
            getUserBehavior={analytics.getUserBehavior}
            sessions={sessions}
          />
        </div>
        
        <GeoAnalytics geoMetrics={analytics.geoMetrics} />
      </main>
    </div>
  );
}

export default App;