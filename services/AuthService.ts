import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithCredential, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'your-web-client-id.apps.googleusercontent.com', // Replace with your actual web client ID
  offlineAccess: true,
});

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  async signInWithGoogle(): Promise<User | null> {
    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      
      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(userInfo.data?.idToken);
      
      // Sign in with Firebase
      const result = await signInWithCredential(auth, googleCredential);
      
      const user: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      
      // Store user data locally
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      // Handle specific error codes
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google authentication is not enabled for this project');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid Google credentials');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('Account already exists with different credentials');
      } else {
        throw new Error('Failed to sign in with Google');
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      // Sign out from Google
      await GoogleSignin.signOut();
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear local storage
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      console.error('Error checking sign in status:', error);
      return false;
    }
  }
}

export default new AuthService();
