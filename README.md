# Analytics Dashboard

A comprehensive analytics dashboard for tracking user journeys and campaign performance.

## Setup Instructions

### 1. Firebase Configuration

1. Create a `.env` file in the root directory
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your actual Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

### 2. Firebase Collections

The dashboard expects two collections in your Firestore database:

#### `user_tracking` Collection
```javascript
{
  session_id: "string",
  device_type: "desktop|mobile|tablet",
  form_filled_without_login: number, // timestamp
  form_start: number, // timestamp
  ip_address: "string",
  landing: number, // timestamp
  stage: "string",
  location: "lat,lng", // coordinates
  timeline: {
    application_paythrough_bank_payment_started: number,
    form_filled_without_login: number,
    form_start: number,
    landing: number,
    payment_succesfull: number,
    user_application_under_review: number,
    updated_at: number
  },
  utmid: "string" // optional
}
```

#### `utmurl` Collection
```javascript
{
  active: boolean,
  createdAt: timestamp,
  phone_number: "string",
  utm_campaign: "string",
  utm_medium: "string",
  utm_source: "string",
  utmid: "string"
}
```

### 3. Running the Application

```bash
npm install
npm run dev
```

## Features

- **User Funnel Analysis**: Track conversion through all stages
- **Campaign Performance**: UTM-based campaign analytics
- **Device Analytics**: Performance by device type
- **Geographic Analysis**: Location-based insights
- **Time Analysis**: Duration spent at each stage
- **Drill-down Capabilities**: Click through campaigns → URLs → individual users

## API Functions

The `AnalyticsService` class provides these methods:

- `fetchUTMUrls()`: Get all active UTM URLs
- `fetchUserSessions(daysBack)`: Get user sessions for specified days
- `fetchSessionsByUTMId(utmid)`: Get sessions for specific campaign
- `fetchSessionsByDateRange(start, end)`: Get sessions in date range
- `getAnalyticsData(daysBack)`: Get complete analytics dataset

## Geocoding

The current implementation includes placeholder geocoding logic. For production, integrate with a proper geocoding service like:

- Google Maps Geocoding API
- Mapbox Geocoding API
- OpenStreetMap Nominatim

Replace the `getCountryFromCoordinates` and `getCityFromCoordinates` methods in `AnalyticsService`.