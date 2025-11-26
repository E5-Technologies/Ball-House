# Ball House - iOS Build Instructions

This guide will help you create a production build of Ball House for iOS using Expo Application Services (EAS).

## ✅ Configuration Complete

Your Ball House app is now fully configured with:

**Apple Developer Details:**
- Apple ID: choona.tech@gmail.com
- ASC App ID: 6755755781
- Team ID: 9DVMM7U798
- Bundle ID: com.ballhouse.app

**API Keys Configured:**
- Google Maps API: ✅ Configured
- OpenWeather API: ✅ Configured
- YouTube API: ✅ Configured

## Prerequisites

1. **Apple Developer Account**
   - ✅ Active account: choona.tech@gmail.com
   - Team ID: 9DVMM7U798

2. **EAS CLI Installation**
   ```bash
   npm install -g eas-cli
   ```

3. **Expo Account**
   - Sign up at https://expo.dev if you don't have one

## Build Configuration Files

### eas.json (Updated ✅)
- Preview builds configured for TestFlight
- Production builds configured for App Store
- Automatic build number increment enabled
- Apple Developer details integrated

### app.json (Updated ✅)
- Google Maps API key configured
- Location permissions configured
- iOS-specific settings ready
- Bundle identifier: com.ballhouse.app

## Step-by-Step Build Process

### Step 1: Install EAS CLI & Login
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Navigate to frontend directory
cd /app/frontend

# Login to your Expo account
eas login
```

### Step 2: Create a Preview Build for iPhone Testing
```bash
# Build for TestFlight distribution
eas build --platform ios --profile preview
```

**What happens:**
- Code is uploaded to EAS servers
- App is compiled on Expo's infrastructure
- IPA file is generated (download link provided)
- Build takes ~15-20 minutes

**To test on your iPhone:**
1. Download the IPA from the build completion page
2. Upload to TestFlight via App Store Connect
3. Install on your iPhone via TestFlight app

### Step 3: Verify Map Functionality
Once installed on your iPhone:
1. Open the app and login
2. Navigate to "Find Courts" tab
3. **Verify:**
   - ✅ Map view displays (iOS only)
   - ✅ Court markers appear with heat map colors
   - ✅ Your current location is shown
   - ✅ Recommended court badge displays correctly
   - ✅ Clicking courts opens details

### Step 4: Create Production Build for App Store
```bash
# Production build for App Store submission
eas build --platform ios --profile production
```

This creates the final build for App Store submission with:
- Release optimization
- Production credentials
- Auto-incrementing build numbers

### Step 5: Submit to App Store

**Option A: Automatic Submission (Recommended)**
```bash
eas submit --platform ios --profile production
```

EAS will automatically:
1. Upload build to App Store Connect
2. Link to your ASC App ID (6755755781)
3. Configure basic metadata

**Option B: Manual Submission**
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Sign in with choona.tech@gmail.com
3. Navigate to your app (ASC ID: 6755755781)
4. Upload IPA using Transporter or Web interface
5. Complete app metadata and screenshots
6. Submit for Apple review

## Required for App Store Submission

### App Metadata
- **App Name**: Ball House
- **Subtitle**: Find Basketball Courts & Players
- **Description**: See BUILD_INSTRUCTIONS.md for full description
- **Keywords**: basketball, courts, pickup games, hoops, players
- **Category**: Sports
- **Age Rating**: 4+

### Screenshots Required
You'll need screenshots for:
- 6.7" Display (iPhone 14 Pro Max)
- 6.5" Display (iPhone 11 Pro Max)
- 5.5" Display (iPhone 8 Plus)

**Suggested Screenshots:**
1. Login screen with logo
2. Find Courts map view
3. Court details page
4. Media/videos feed
5. User profile

### App Privacy
- Location: Used to show nearby courts
- Camera: For profile pictures
- Photos: For profile selection

## Testing Checklist Before Submission

### Core Features:
- [ ] Login/Registration works
- [ ] Map view displays courts (iOS)
- [ ] Court details load correctly
- [ ] Profile editing functions
- [ ] Video playback works
- [ ] Recommended court badge visible
- [ ] Share videos feature works

### iOS-Specific:
- [ ] Location permissions requested properly
- [ ] Map loads with Google Maps
- [ ] App doesn't crash on background/foreground
- [ ] Status bar displays correctly
- [ ] Safe area insets work on all iPhone models

## Next Steps: Automatic Check-in Feature

After App Store submission, implement:

1. **Background Location Tracking**
   - Geofencing for court proximity (1 meter radius)
   - Automatic check-in when near court
   - Background location updates

2. **Implementation:**
   ```bash
   # Install required packages
   yarn add expo-task-manager expo-background-fetch
   ```

3. **Backend Updates:**
   - Add geofencing logic
   - Auto check-in/check-out based on location
   - Update court player counts automatically

## Troubleshooting

### Build Fails
- Check logs at https://expo.dev/accounts/[your-account]/projects/ball-house/builds
- Verify all API keys are correct
- Ensure bundle identifier matches Apple Developer Portal

### App Store Rejection
- Review [Apple Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Common issues: Privacy policy, data collection disclosure, copyright

### Map Not Showing
- Verify Google Maps API key is enabled for iOS
- Check API key restrictions in Google Cloud Console
- Ensure location permissions are granted

## Support Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Expo Forums**: https://forums.expo.dev/
- **Apple Developer Support**: https://developer.apple.com/contact/

---

## Summary

Your Ball House app is **ready for building**! 

✅ All API keys configured
✅ Apple Developer details integrated  
✅ Build configuration complete
✅ Ready for preview testing
✅ Ready for App Store submission

Run `eas build --platform ios --profile preview` to start!
