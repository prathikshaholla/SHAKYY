# SHAKY - Emergency SOS System

An emergency SOS system that sends WhatsApp alerts with location, medical information, and shake intensity data.

## Features

### 🚨 Core SOS Functionality
- **Shake Detection**: Automatically triggers SOS when phone is shaken
- **Manual SOS**: Button to manually trigger emergency alerts
- **Location Sharing**: Automatically sends GPS coordinates via Google Maps link
- **WhatsApp Integration**: Opens WhatsApp with pre-filled emergency message

### 📞 Emergency Contacts
- **Default Contacts**: Pre-configured emergency contacts (Mom, Dad)
- **Custom Emergency Contacts**: Add additional contacts on the login page
- **Add/Remove Contacts**: Manage emergency contacts easily
- **Unified Contact List**: All contacts (default + custom) receive SOS alerts

### 🔐 User Login & Profile
- **Login Page**: Enter user details (optional, not saved)
- **Custom Emergency Contacts**: Add additional emergency contacts on login
- **User Profile**: Store medical information, blood type, and emergency notes

### 📊 Shake Intensity Logging
- **Continuous Monitoring**: Tracks shake intensity on any device
- **Real-time Logging**: Updates `shake_intensity_log.json` file constantly
- **Acceleration Data**: Records X, Y, Z acceleration values
- **Timestamp**: Each entry includes precise timestamp
- **Shared Log File**: Multiple phones update the same log file

### 📁 Data Storage
- **SOS Logs**: `sos_log.json` - Records all SOS alerts
- **Shake Intensity Logs**: `shake_intensity_log.json` - Continuous motion data
- **Server Endpoints**:
  - `POST /sos` - Log SOS alerts
  - `POST /shake-intensity` - Log shake intensity data
  - `GET /download-sos` - Download SOS logs
  - `GET /download-shake-intensity` - Download shake intensity logs

## How to Use

1. **Start the Server**:
   ```bash
   node server.js
   ```

2. **Open the App**:
   Navigate to `http://localhost:3000` in your browser

3. **Login Page**:
   - Optionally enter your name and phone (not saved)
   - Add custom emergency contacts
   - Click "Continue to SOS System"

4. **Configure Profile**:
   - Enter your full name
   - Add blood type (optional)
   - Add medical conditions (optional)
   - Add emergency notes (optional)
   - Click "Save Profile"

5. **Manage Contacts**:
   - Default contacts are pre-loaded
   - Add additional contacts on login page
   - Add/remove contacts in the main interface

6. **Emergency Trigger**:
   - **Automatic**: Shake your phone to trigger SOS
   - **Manual**: Click "Send SOS Manually" button
   - Countdown appears (3 seconds to cancel)
   - SOS sends to all emergency contacts

## Technical Details

### Shake Detection
- **Threshold**: Acceleration > 15 m/s²
- **Motion Sensors**: Uses device motion events
- **Permissions**: Requires motion sensor permission (iOS/Android)
- **Continuous Logging**: Logs intensity > 5 m/s²

### Data Flow
1. Shake detected → Intensity calculated
2. Intensity logged to server → `shake_intensity_log.json`
3. If intensity > threshold → SOS trigger
4. Location fetched → GPS coordinates
5. Message built → User profile + location + intensity
6. WhatsApp opened → For each emergency contact
7. Server log created → `sos_log.json`

### Custom Emergency Contacts
- Added on login page
- Stored in browser localStorage
- Combined with default contacts during SOS
- Can be added/removed anytime

### Shake Intensity Logging
- Logs all significant movement (intensity > 5)
- Updates shared file continuously
- Prevents file bloat (keeps last 1000 entries)
- Works across multiple devices simultaneously

## Files Structure
```
├── index.html          # Main application UI
├── shake.js           # Shake detection & intensity logging
├── sos.js             # SOS functionality & contact management
├── server.js          # Express server for data logging
├── contacts-config.js # Default contacts & settings
├── sos_log.json       # Generated: SOS alert logs
└── shake_intensity_log.json  # Generated: Continuous shake data
```

## Notes
- User details entered on login page are NOT saved (as requested)
- Only custom emergency contacts are stored
- Shake intensity is logged constantly for monitoring
- All contacts (default + custom) receive SOS messages