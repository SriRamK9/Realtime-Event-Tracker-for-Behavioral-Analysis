import { UserSession, UTMUrl } from '../types/analytics';

// Generate mock UTM URLs matching the actual database schema
export const generateMockUTMUrls = (): UTMUrl[] => {
  const utmUrls: UTMUrl[] = [
    {
      active: true,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Last 30 days
      phone_number: "9999999999",
      utm_campaign: "summer_loans",
      utm_medium: "cpc",
      utm_source: "google",
      utmid: "umvi-utm-155743"
    },
    {
      active: true,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      phone_number: "8888888888",
      utm_campaign: "quick_approval",
      utm_medium: "social",
      utm_source: "facebook",
      utmid: "umvi-utm-234567"
    },
    {
      active: true,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      phone_number: "7777777777",
      utm_campaign: "personal_finance",
      utm_medium: "email",
      utm_source: "newsletter",
      utmid: "umvi-utm-345678"
    },
    {
      active: true,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      phone_number: "6666666666",
      utm_campaign: "instant_loans",
      utm_medium: "social",
      utm_source: "instagram",
      utmid: "umvi-utm-456789"
    },
    {
      active: true,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      phone_number: "5555555555",
      utm_campaign: "business_loans",
      utm_medium: "display",
      utm_source: "linkedin",
      utmid: "umvi-utm-567890"
    },
    {
      active: true,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      phone_number: "4444444444",
      utm_campaign: "dey",
      utm_medium: "mail",
      utm_source: "facebook",
      utmid: "umvi-utm-678901"
    },
    {
      active: true,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      phone_number: "3333333333",
      utm_campaign: "home_loans",
      utm_medium: "search",
      utm_source: "bing",
      utmid: "umvi-utm-789012"
    },
    {
      active: true,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      phone_number: "2222222222",
      utm_campaign: "student_loans",
      utm_medium: "referral",
      utm_source: "partner",
      utmid: "umvi-utm-890123"
    }
  ];

  return utmUrls;
};

// Generate mock user sessions matching the actual database schema
export const generateMockSessions = (count: number, utmUrls: UTMUrl[]): UserSession[] => {
  const sessions: UserSession[] = [];
  const devices = ['desktop', 'mobile', 'tablet'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy'];
  const cities = ['New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Paris', 'Madrid', 'Rome'];
  const stages = ['landing', 'form_start', 'form_filled_without_login', 'user_application_under_review', 'application_paythrough_bank_payment_started', 'payment_succesfull'];

  for (let i = 0; i < count; i++) {
    const baseTime = Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000; // Last 7 days
    const landing = baseTime;
    
    // Simulate funnel drop-offs
    const completionRate = Math.random();
    const selectedUTM = Math.random() > 0.2 ? utmUrls[Math.floor(Math.random() * utmUrls.length)] : null;
    
    // Generate coordinates for location (lat,lng format)
    const lat = (Math.random() * 180 - 90).toFixed(3);
    const lng = (Math.random() * 360 - 180).toFixed(3);
    
    // Initialize timeline with landing
    const timeline: UserSession['timeline'] = {
      landing,
      updated_at: baseTime + Math.random() * 3600000, // Up to 1 hour later
    };

    let currentStage = 'landing';
    let currentTime = landing;

    // Simulate progressive funnel completion
    if (completionRate > 0.1) {
      currentTime += Math.random() * 300000; // 0-5 minutes
      timeline.form_start = currentTime;
      currentStage = 'form_start';
    }
    
    if (completionRate > 0.3) {
      currentTime += Math.random() * 900000; // 0-15 minutes
      timeline.form_filled_without_login = currentTime;
      currentStage = 'form_filled_without_login';
    }
    
    if (completionRate > 0.5) {
      currentTime += Math.random() * 1800000; // 0-30 minutes
      timeline.user_application_under_review = currentTime;
      currentStage = 'user_application_under_review';
    }
    
    if (completionRate > 0.7) {
      currentTime += Math.random() * 600000; // 0-10 minutes
      timeline.application_paythrough_bank_payment_started = currentTime;
      currentStage = 'application_paythrough_bank_payment_started';
    }
    
    if (completionRate > 0.8) {
      currentTime += Math.random() * 300000; // 0-5 minutes
      timeline.payment_succesfull = currentTime;
      currentStage = 'payment_succesfull';
    }

    const session: UserSession = {
      session_id: `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`,
      device_type: devices[Math.floor(Math.random() * devices.length)],
      form_filled_without_login: timeline.form_filled_without_login,
      form_start: timeline.form_start,
      ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      landing,
      stage: currentStage,
      location: `${lat},${lng}`,
      timeline,
      utmid: selectedUTM?.utmid,
      country: countries[Math.floor(Math.random() * countries.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
    };

    sessions.push(session);
  }

  return sessions;
};