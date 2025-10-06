# Google Maps API Configuration

## Setup Instructions

To enable Google Maps tracking for orders, you need to:

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Geocoding API (optional, for address-to-coordinates conversion)
   - Create credentials (API Key)
   - Restrict the API key (recommended):
     - HTTP referrers: `http://localhost:3000/*`, `https://yourdomain.com/*`
     - API restrictions: Enable only Maps JavaScript API

2. **Add the API Key to the project:**
   
   **Option 1: Environment Variable (Recommended)**
   - Create a `.env` file in `frontend` folder if not exists
   - Add: `REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here`
   - Update `OrderMap.js` line 12 to:
     ```javascript
     const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
     ```
   
   **Option 2: Direct in Code (Not Recommended for Production)**
   - Open `frontend/src/components/Order/OrderMap.js`
   - Replace line 12: `const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';`
   - With: `const GOOGLE_MAPS_API_KEY = 'your_actual_api_key';`

3. **Restart the Frontend:**
   ```
   cd c:\Delivery\frontend
   npm start
   ```

## Features

### Map View Includes:
- 📍 **Interactive Markers**: Each order shows as a pin on the map
- 🎨 **Color-Coded Status**:
  - 🔴 Red: Pending orders
  - 🟡 Yellow: Driver assigned
  - 🔵 Blue: In transit (with bouncing animation)
  - 🟢 Green: Delivered
  - ⚫ Grey: Cancelled
- 📋 **Info Windows**: Click any marker to see order details
- 🗺️ **Sri Lanka Coverage**: Automatically centered on Sri Lanka
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop

### Current City Coordinates:
- Colombo: 6.9271, 79.8612
- Kandy: 7.2906, 80.6337
- Negombo: 7.2094, 79.8358
- Galle: 6.0535, 80.2210
- Matara: 5.9549, 80.5550
- Gampaha: 7.0840, 79.9990
- And more...

## Usage

1. Go to Orders page
2. Click **"Map View"** button at the top
3. See all orders on the map
4. Click any marker to view order details
5. In-transit orders will have a bouncing animation
6. Switch back to **"Card View"** anytime

## Future Enhancements

Possible additions:
- Real-time driver location tracking
- Route optimization
- Traffic conditions
- Estimated arrival time
- Delivery radius visualization
- Custom markers with order numbers
- Clustering for multiple orders in same area
- Directions API integration
- Street view for delivery locations

## Cost Considerations

Google Maps pricing (as of 2024):
- Maps JavaScript API: $7 per 1,000 loads (first 28,000 loads free per month)
- For low to medium traffic, the free tier should be sufficient
- Monitor usage in Google Cloud Console

## Alternative: Free Map Option

If you want a free alternative, consider:
- OpenStreetMap with Leaflet library
- Mapbox (generous free tier)
- Here Maps (free tier available)

To switch to Leaflet (free):
```bash
npm install react-leaflet leaflet
```

Then replace the Google Maps component with Leaflet component.

---

**Note**: The map will show a development warning until you add a valid API key.
