# Google Login Setup Instructions

## Prerequisites

1. **Firebase Project Setup**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable Authentication in the Firebase console
   - Enable Google Sign-In provider in Authentication > Sign-in method

2. **Get Firebase Configuration**
   - In your Firebase project, go to Project Settings
   - Add a new app (Android/iOS)
   - Download the configuration file:
     - Android: `google-services.json`
     - iOS: `GoogleService-Info.plist`
   - Copy the configuration values and update `config/firebase.ts`

3. **Google Cloud Console Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your Firebase project
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 client IDs for:
     - Web application (for Firebase)
     - Android application (if building for Android)
     - iOS application (if building for iOS)

## Configuration Steps

### 1. Update Firebase Configuration

Replace the placeholder values in `config/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### 2. Update Google Sign-In Configuration

In `services/AuthService.ts`, replace the webClientId with your actual Web Client ID from Google Cloud Console:

```typescript
GoogleSignin.configure({
  webClientId: 'your-actual-web-client-id.apps.googleusercontent.com',
  offlineAccess: true,
});
```

### 3. Platform-Specific Setup

#### For Android:
1. Place `google-services.json` in `android/app/`
2. Add to `android/app/build.gradle`:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```
3. Add to `android/build.gradle`:
   ```gradle
   classpath 'com.google.gms:google-services:4.3.15'
   ```

#### For iOS:
1. Place `GoogleService-Info.plist` in the iOS project
2. Configure URL schemes in `ios/YourApp/Info.plist`

### 4. Additional Expo Configuration

Add to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "@react-native-google-signin/google-signin"
    ]
  }
}
```

## Testing

1. Run `npx expo run:android` or `npx expo run:ios`
2. The Google Sign-In button should work with actual authentication
3. Check that user data is properly stored and retrieved

## Notes

- This implementation requires a development build, not Expo Go
- Make sure all client IDs are correctly configured
- Enable proper domains in Firebase Authentication settings
- Test on actual devices for best results
