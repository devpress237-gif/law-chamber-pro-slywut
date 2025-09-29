
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('IndexScreen - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('User is authenticated, redirecting to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('User is not authenticated, redirecting to login');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={[commonStyles.container, styles.loadingContainer]}>
        <View style={styles.logoContainer}>
          <IconSymbol name="scale.3d" size={64} color={colors.primary} />
        </View>
        <Text style={styles.title}>Law Practice Manager</Text>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
