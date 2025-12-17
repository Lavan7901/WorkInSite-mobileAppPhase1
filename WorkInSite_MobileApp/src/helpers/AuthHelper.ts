import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../screens/ProfileScreen/profile';

const AuthHelper = {
  setAccessToken: async (token: string) => {
    try {
      await AsyncStorage.setItem('_at', token);
    } catch (error) {
      console.error('Error saving access token', error);
    }
  },

  getAccessToken: async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem('_at');
      return token;
    } catch (error) {
      console.error('Error getting access token', error);
      return null;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('_at');
      await AsyncStorage.removeItem('userProfile');
    } catch (error) {
      console.error('Error during logout', error);
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AuthHelper.getAccessToken();
      return token !== null;
    } catch (error) {
      console.error('Error checking authentication', error);
      return false;
    }
  },

  setUserProfile: async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile', error);
    }
  },

  getUserProfile: async (): Promise<UserProfile | null> => {
    try {
      const profileString = await AsyncStorage.getItem('userProfile');
      return profileString ? JSON.parse(profileString) : null;
    } catch (error) {
      console.error('Error getting user profile', error);
      return null;
    }
  },
};

export {AuthHelper};
