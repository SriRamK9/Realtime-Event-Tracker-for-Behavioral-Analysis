export interface UserSession {
  session_id: string;
  device_type: string;
  form_filled_without_login?: number;
  form_start?: number;
  ip_address: string;
  landing: number;
  stage: string;
  location: string;
  timeline: {
    application_paythrough_bank_payment_started?: number;
    form_filled_without_login?: number;
    form_start?: number;
    landing: number;
    payment_succesfull?: number;
    user_application_under_review?: number;
    updated_at: number;
  };
  utmid?: string;
  country?: string;
  city?: string;
}

export interface UTMUrl {
  active: boolean;
  createdAt: number;
  phone_number: string;
  utm_campaign: string;
  utm_medium: string;
  utm_source: string;
  utmid: string;
}
export interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  dropOffRate: number;
}

export interface TimeMetrics {
  timeOnForm: number;
  timeReviewUnderway: number;
  timeToPayment: number;
  sessionDuration: number;
}

export interface DeviceMetrics {
  device: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

export interface UTMMetrics {
  campaign: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
}

export interface GeoMetrics {
  country: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
}

export interface CampaignURL {
  url: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
  avgSessionTime: number;
  bounceRate: number;
}

export interface UserBehavior {
  session: UserSession;
  stageTimings: {
    stage: string;
    timestamp: number;
    duration?: number;
  }[];
  totalDuration: number;
  completionRate: number;
  deviceInfo: {
    type: string;
    location: string;
  };
}