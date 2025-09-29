
import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('TabLayout - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated in tabs, redirecting to login');
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading]);

  // Show nothing while loading or if not authenticated
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.backgroundAlt,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: colors.backgroundAlt,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="house.fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          title: 'Cases',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="folder.fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hearings"
        options={{
          title: 'Hearings',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="doc.text.fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="person.fill" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
