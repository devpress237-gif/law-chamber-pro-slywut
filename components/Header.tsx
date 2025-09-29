
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import { router } from 'expo-router';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotifications?: boolean;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBack = false, 
  showNotifications = true,
  onBackPress 
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack ? (
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
        ) : (
          <View style={styles.logoContainer}>
            <IconSymbol name="scale.3d" size={24} color={colors.primary} />
            <Text style={styles.logoText}>LawPro</Text>
          </View>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        {showNotifications && (
          <Pressable 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <IconSymbol name="bell" size={22} color={colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 60,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  notificationButton: {
    padding: 8,
    marginRight: -8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
