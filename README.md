# One Shepherd's Channel – Mobile (Expo)

Native Android (and iOS) app for One Shepherd's Channel.

## Permanent Rules
- Completely free forever
- Zero ads / zero sales
- Mandatory contactability for posters
- Practical next steps required for notification status
- We fear only God's wrath

## Current Status
Fully working prototype using local storage (AsyncStorage):
- Feed
- New Message (with mandatory contact + filter)
- Message Detail
- About

## How to Run on Your Android Phone

### Requirements
- Node.js installed on a computer
- Expo Go app installed on your Android phone (from Play Store)

### Steps
1. On your computer:
   ```bash
   cd one-shepherds-channel-mobile
   npm install
   npx expo start
   ```
2. A QR code will appear in the terminal / browser.
3. Open the **Expo Go** app on your Android phone and scan the QR code.
4. The app will load on your phone.

You can post messages immediately. They are stored on the device.

## Later
- Connect to Supabase for multi-device / multi-user support
- Add push notifications
- Publish to Google Play (when ready)
