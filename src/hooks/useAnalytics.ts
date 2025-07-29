import { useMemo } from 'react';
import { UserSession, UTMUrl, FunnelStage, TimeMetrics, DeviceMetrics, UTMMetrics, GeoMetrics, CampaignURL, UserBehavior } from '../types/analytics';

export const useAnalytics = (sessions: UserSession[], utmUrls: UTMUrl[]) => {
  const analytics = useMemo(() => {
    // Funnel Analysis
    const funnelStages: FunnelStage[] = [
      { name: 'Landing', count: 0, percentage: 0, dropOffRate: 0 },
      { name: 'Form Start', count: 0, percentage: 0, dropOffRate: 0 },
      { name: 'Form Filled', count: 0, percentage: 0, dropOffRate: 0 },
      { name: 'Under Review', count: 0, percentage: 0, dropOffRate: 0 },
      { name: 'Payment Started', count: 0, percentage: 0, dropOffRate: 0 },
      { name: 'Payment Success', count: 0, percentage: 0, dropOffRate: 0 },
    ];

    sessions.forEach(session => {
      funnelStages[0].count++;
      if (session.timeline.form_start) funnelStages[1].count++;
      if (session.timeline.form_filled_without_login) funnelStages[2].count++;
      if (session.timeline.user_application_under_review) funnelStages[3].count++;
      if (session.timeline.application_paythrough_bank_payment_started) funnelStages[4].count++;
      if (session.timeline.payment_succesfull) funnelStages[5].count++;
    });

    // Calculate percentages and drop-off rates
    const totalSessions = sessions.length;
    funnelStages.forEach((stage, index) => {
      stage.percentage = (stage.count / totalSessions) * 100;
      if (index > 0) {
        stage.dropOffRate = ((funnelStages[index - 1].count - stage.count) / funnelStages[index - 1].count) * 100;
      }
    });

    // Time Metrics
    const timeMetrics: TimeMetrics[] = [];
    sessions.forEach(session => {
      if (session.timeline.form_start && session.timeline.form_filled_without_login && session.timeline.user_application_under_review && session.timeline.payment_succesfull) {
        timeMetrics.push({
          timeOnForm: (session.timeline.form_filled_without_login - session.timeline.form_start) / 1000 / 60, // minutes
          timeReviewUnderway: (session.timeline.user_application_under_review - session.timeline.form_filled_without_login) / 1000 / 60,
          timeToPayment: session.timeline.application_paythrough_bank_payment_started 
            ? (session.timeline.payment_succesfull - session.timeline.application_paythrough_bank_payment_started) / 1000 / 60 
            : 0,
          sessionDuration: (session.timeline.updated_at - session.timeline.landing) / 1000 / 60,
        });
      }
    });

    // Device Metrics
    const deviceCounts: { [key: string]: { total: number; conversions: number } } = {};
    sessions.forEach(session => {
      if (!deviceCounts[session.device_type]) {
        deviceCounts[session.device_type] = { total: 0, conversions: 0 };
      }
      deviceCounts[session.device_type].total++;
      if (session.timeline.payment_succesfull) {
        deviceCounts[session.device_type].conversions++;
      }
    });

    const deviceMetrics: DeviceMetrics[] = Object.entries(deviceCounts).map(([device, data]) => ({
      device,
      count: data.total,
      percentage: (data.total / totalSessions) * 100,
      conversionRate: (data.conversions / data.total) * 100,
    }));

    // UTM Metrics
    const utmCounts: { [key: string]: { total: number; conversions: number } } = {};
    sessions.forEach(session => {
      const utmData = utmUrls.find(utm => utm.utmid === session.utmid);
      const campaign = utmData 
        ? `${utmData.utm_source} - ${utmData.utm_campaign}` 
        : 'Direct';
      if (!utmCounts[campaign]) {
        utmCounts[campaign] = { total: 0, conversions: 0 };
      }
      utmCounts[campaign].total++;
      if (session.timeline.payment_succesfull) {
        utmCounts[campaign].conversions++;
      }
    });

    const utmMetrics: UTMMetrics[] = Object.entries(utmCounts).map(([campaign, data]) => ({
      campaign,
      sessions: data.total,
      conversions: data.conversions,
      conversionRate: (data.conversions / data.total) * 100,
    }));

    // Geo Metrics
    const geoCounts: { [key: string]: { total: number; conversions: number } } = {};
    sessions.forEach(session => {
      const country = session.country || 'Unknown';
      if (!geoCounts[country]) {
        geoCounts[country] = { total: 0, conversions: 0 };
      }
      geoCounts[country].total++;
      if (session.timeline.payment_succesfull) {
        geoCounts[country].conversions++;
      }
    });

    const geoMetrics: GeoMetrics[] = Object.entries(geoCounts).map(([country, data]) => ({
      country,
      sessions: data.total,
      conversions: data.conversions,
      conversionRate: (data.conversions / data.total) * 100,
    }));

    // Campaign URL Analytics
    const getCampaignUrls = (campaign: string): CampaignURL[] => {
      // Extract UTM ID from campaign name or use direct
      const utmData = utmUrls.find(utm => 
        campaign.includes(utm.utm_source) && campaign.includes(utm.utm_campaign)
      );
      
      const campaignSessions = sessions.filter(s => 
        utmData ? s.utmid === utmData.utmid : !s.utmid
      );
      
      const urlGroups: { [key: string]: UserSession[] } = {};
      
      campaignSessions.forEach(session => {
        const utmInfo = utmUrls.find(utm => utm.utmid === session.utmid);
        const url = utmInfo 
          ? `${utmInfo.utm_source}.com/${utmInfo.utm_campaign}-${utmInfo.utm_medium}`
          : 'Direct Traffic';
        if (!urlGroups[url]) urlGroups[url] = [];
        urlGroups[url].push(session);
      });

      return Object.entries(urlGroups).map(([url, sessions]) => {
        const conversions = sessions.filter(s => s.timeline.payment_succesfull).length;
        const totalTime = sessions.reduce((sum, s) => sum + (s.timeline.updated_at - s.timeline.landing), 0);
        const bounces = sessions.filter(s => !s.timeline.form_start).length;
        
        return {
          url,
          sessions: sessions.length,
          conversions,
          conversionRate: (conversions / sessions.length) * 100,
          avgSessionTime: totalTime / sessions.length / 1000 / 60, // minutes
          bounceRate: (bounces / sessions.length) * 100,
        };
      });
    };

    // User Behavior Analysis
    const getUserBehavior = (sessionId: string): UserBehavior | null => {
      const session = sessions.find(s => s.session_id === sessionId);
      if (!session) return null;

      const stageTimings = [
        { stage: 'Landing', timestamp: session.timeline.landing },
        ...(session.timeline.form_start ? [{ stage: 'Form Start', timestamp: session.timeline.form_start }] : []),
        ...(session.timeline.form_filled_without_login ? [{ stage: 'Form Filled', timestamp: session.timeline.form_filled_without_login }] : []),
        ...(session.timeline.user_application_under_review ? [{ stage: 'Under Review', timestamp: session.timeline.user_application_under_review }] : []),
        ...(session.timeline.application_paythrough_bank_payment_started ? [{ stage: 'Payment Started', timestamp: session.timeline.application_paythrough_bank_payment_started }] : []),
        ...(session.timeline.payment_succesfull ? [{ stage: 'Payment Success', timestamp: session.timeline.payment_succesfull }] : []),
      ];

      // Calculate durations
      stageTimings.forEach((timing, index) => {
        if (index < stageTimings.length - 1) {
          timing.duration = (stageTimings[index + 1].timestamp - timing.timestamp) / 1000 / 60; // minutes
        }
      });

      return {
        session,
        stageTimings,
        totalDuration: (session.timeline.updated_at - session.timeline.landing) / 1000 / 60,
        completionRate: stageTimings.length / 6 * 100, // 6 total stages
        deviceInfo: {
          type: session.device_type,
          location: `${session.city}, ${session.country}`,
        },
      };
    };

    return {
      funnelStages,
      timeMetrics,
      deviceMetrics,
      utmMetrics,
      geoMetrics,
      totalSessions,
      totalConversions: funnelStages[5].count,
      overallConversionRate: (funnelStages[5].count / totalSessions) * 100,
      getCampaignUrls,
      getUserBehavior,
    };
  }, [sessions, utmUrls]);

  return analytics;
};