
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('Checking auth status...');
      
      // Try to get token from SecureStore
      let token = null;
      try {
        token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        console.log('Token from SecureStore:', token ? 'exists' : 'not found');
      } catch (secureStoreError) {
        console.log('SecureStore error, falling back to AsyncStorage:', secureStoreError);
        // Fallback to AsyncStorage if SecureStore fails
        token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        console.log('Token from AsyncStorage fallback:', token ? 'exists' : 'not found');
      }
      
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      console.log('User data:', userData ? 'exists' : 'not found');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user:', parsedUser.name, parsedUser.email);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (parseError) {
          console.log('Error parsing user data:', parseError);
          // Clear corrupted data
          await clearAuthData();
        }
      } else {
        console.log('No valid auth data found');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      console.log('Auth check completed');
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const clearAuthData = async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch (error) {
      console.log('Error clearing SecureStore:', error);
    }
    
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.log('Error clearing AsyncStorage:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      // Mock authentication - in real app, this would be an API call
      const foundUser = mockUsers.find(u => u.email === email);
      console.log('Found user:', foundUser ? foundUser.name : 'not found');
      
      if (foundUser && password === 'password123') {
        const token = 'mock_jwt_token_' + Date.now();
        console.log('Login successful, storing auth data');
        
        // Try SecureStore first, fallback to AsyncStorage
        try {
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
          console.log('Token stored in SecureStore');
        } catch (secureStoreError) {
          console.log('SecureStore failed, using AsyncStorage:', secureStoreError);
          await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
          console.log('Token stored in AsyncStorage');
        }
        
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(foundUser));
        console.log('User data stored');
        
        setUser(foundUser);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        console.log('Invalid credentials');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithBiometrics = async () => {
    try {
      console.log('Attempting biometric login');
      
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      console.log('Biometric hardware:', hasHardware, 'enrolled:', isEnrolled);
      
      if (!hasHardware || !isEnrolled) {
        return { success: false, error: 'Biometric authentication not available' };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your law practice',
        fallbackLabel: 'Use password instead',
      });

      console.log('Biometric result:', result.success);

      if (result.success) {
        // For demo, login as the first user
        const demoUser = mockUsers[0];
        const token = 'biometric_token_' + Date.now();
        
        console.log('Biometric login successful, storing auth data');
        
        try {
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
        } catch (secureStoreError) {
          console.log('SecureStore failed, using AsyncStorage:', secureStoreError);
          await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        }
        
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(demoUser));
        
        setUser(demoUser);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: 'Biometric authentication failed' };
      }
    } catch (error) {
      console.log('Biometric login error:', error);
      return { success: false, error: 'Biometric authentication failed' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      console.log('Logout completed');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithBiometrics,
    logout,
  };
};
