import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserSession, UTMUrl } from '../types/analytics';

export class AnalyticsService {
  
  /**
   * Fetch UTM URLs from the 'utmurl' collection
   */
  static async fetchUTMUrls(): Promise<UTMUrl[]> {
    try {
      const utmUrlsRef = collection(db, 'utmurl');
      const q = query(
        utmUrlsRef,
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const utmUrls: UTMUrl[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        utmUrls.push({
          active: data.active,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt,
          phone_number: data.phone_number,
          utm_campaign: data.utm_campaign,
          utm_medium: data.utm_medium,
          utm_source: data.utm_source,
          utmid: data.utmid
        });
      });
      
      return utmUrls;
    } catch (error) {
      console.error('Error fetching UTM URLs:', error);
      throw new Error('Failed to fetch UTM URLs');
    }
  }

  /**
   * Fetch user sessions from the 'user_tracking' collection
   */
  static async fetchUserSessions(daysBack: number = 7): Promise<UserSession[]> {
    try {
      const userTrackingRef = collection(db, 'user_tracking');
      const cutoffDate = Date.now() - (daysBack * 24 * 60 * 60 * 1000);
      
      const q = query(
        userTrackingRef,
        where('landing', '>=', cutoffDate),
        orderBy('landing', 'desc'),
        limit(1000) // Limit to prevent excessive data loading
      );
      
      const querySnapshot = await getDocs(q);
      const sessions: UserSession[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Parse location coordinates
        let country = 'Unknown';
        let city = 'Unknown';
        if (data.location) {
          // You might want to use a geocoding service to convert coordinates to location names
          // For now, we'll use placeholder logic
          const [lat, lng] = data.location.split(',').map((coord: string) => parseFloat(coord));
          country = this.getCountryFromCoordinates(lat, lng);
          city = this.getCityFromCoordinates(lat, lng);
        }
        
        sessions.push({
          session_id: data.session_id,
          device_type: data.device_type,
          form_filled_without_login: data.form_filled_without_login,
          form_start: data.form_start,
          ip_address: data.ip_address,
          landing: data.landing,
          stage: data.stage,
          location: data.location,
          timeline: {
            application_paythrough_bank_payment_started: data.timeline?.application_paythrough_bank_payment_started,
            form_filled_without_login: data.timeline?.form_filled_without_login,
            form_start: data.timeline?.form_start,
            landing: data.timeline?.landing || data.landing,
            payment_succesfull: data.timeline?.payment_succesfull,
            user_application_under_review: data.timeline?.user_application_under_review,
            updated_at: data.timeline?.updated_at || Date.now()
          },
          utmid: data.utmid,
          country,
          city
        });
      });
      
      return sessions;
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw new Error('Failed to fetch user sessions');
    }
  }

  /**
   * Fetch sessions for a specific UTM campaign
   */
  static async fetchSessionsByUTMId(utmid: string): Promise<UserSession[]> {
    try {
      const userTrackingRef = collection(db, 'user_tracking');
      const q = query(
        userTrackingRef,
        where('utmid', '==', utmid),
        orderBy('landing', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const sessions: UserSession[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          session_id: data.session_id,
          device_type: data.device_type,
          form_filled_without_login: data.form_filled_without_login,
          form_start: data.form_start,
          ip_address: data.ip_address,
          landing: data.landing,
          stage: data.stage,
          location: data.location,
          timeline: data.timeline,
          utmid: data.utmid,
          country: this.getCountryFromCoordinates(...data.location.split(',').map((c: string) => parseFloat(c))),
          city: this.getCityFromCoordinates(...data.location.split(',').map((c: string) => parseFloat(c)))
        });
      });
      
      return sessions;
    } catch (error) {
      console.error('Error fetching sessions by UTM ID:', error);
      throw new Error('Failed to fetch sessions by UTM ID');
    }
  }

  /**
   * Fetch sessions by date range
   */
  static async fetchSessionsByDateRange(startDate: Date, endDate: Date): Promise<UserSession[]> {
    try {
      const userTrackingRef = collection(db, 'user_tracking');
      const q = query(
        userTrackingRef,
        where('landing', '>=', startDate.getTime()),
        where('landing', '<=', endDate.getTime()),
        orderBy('landing', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const sessions: UserSession[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          session_id: data.session_id,
          device_type: data.device_type,
          form_filled_without_login: data.form_filled_without_login,
          form_start: data.form_start,
          ip_address: data.ip_address,
          landing: data.landing,
          stage: data.stage,
          location: data.location,
          timeline: data.timeline,
          utmid: data.utmid,
          country: this.getCountryFromCoordinates(...data.location.split(',').map((c: string) => parseFloat(c))),
          city: this.getCityFromCoordinates(...data.location.split(',').map((c: string) => parseFloat(c)))
        });
      });
      
      return sessions;
    } catch (error) {
      console.error('Error fetching sessions by date range:', error);
      throw new Error('Failed to fetch sessions by date range');
    }
  }

  /**
   * Get analytics data for dashboard
   */
  static async getAnalyticsData(daysBack: number = 7) {
    try {
      const [utmUrls, sessions] = await Promise.all([
        this.fetchUTMUrls(),
        this.fetchUserSessions(daysBack)
      ]);

      return {
        utmUrls,
        sessions,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw new Error('Failed to fetch analytics data');
    }
  }

  /**
   * Helper function to get country from coordinates
   * You should replace this with a proper geocoding service
   */
  private static getCountryFromCoordinates(lat: number, lng: number): string {
    // Placeholder logic - replace with actual geocoding service
    if (lat >= 8.4 && lat <= 37.6 && lng >= 68.7 && lng <= 97.25) return 'India';
    if (lat >= 24.396308 && lat <= 49.384358 && lng >= -125.0 && lng <= -66.93457) return 'United States';
    if (lat >= 49.162090 && lat <= 60.847059 && lng >= -141.003 && lng <= -52.6480987209) return 'Canada';
    if (lat >= 35.0 && lat <= 71.0 && lng >= -10.0 && lng <= 40.0) return 'Europe';
    return 'Unknown';
  }

  /**
   * Helper function to get city from coordinates
   * You should replace this with a proper geocoding service
   */
  private static getCityFromCoordinates(lat: number, lng: number): string {
    // Placeholder logic - replace with actual geocoding service
    if (lat >= 28.4 && lat <= 28.9 && lng >= 77.0 && lng <= 77.4) return 'New Delhi';
    if (lat >= 19.0 && lat <= 19.3 && lng >= 72.7 && lng <= 73.0) return 'Mumbai';
    if (lat >= 40.6 && lat <= 40.9 && lng >= -74.1 && lng <= -73.9) return 'New York';
    if (lat >= 51.4 && lat <= 51.6 && lng >= -0.2 && lng <= 0.1) return 'London';
    return 'Unknown';
  }
}