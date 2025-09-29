
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Team Management',
      subtitle: 'Manage your team members',
      icon: 'person.3.fill',
      onPress: () => router.push('/team'),
      show: user?.role === 'senior_lawyer',
    },
    {
      title: 'Reports & Analytics',
      subtitle: 'View case reports and statistics',
      icon: 'chart.bar.fill',
      onPress: () => router.push('/reports'),
      show: true,
    },
    {
      title: 'Notifications',
      subtitle: 'Manage notification settings',
      icon: 'bell.fill',
      onPress: () => router.push('/notifications'),
      show: true,
    },
    {
      title: 'Settings',
      subtitle: 'App preferences and security',
      icon: 'gear',
      onPress: () => router.push('/settings'),
      show: true,
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'questionmark.circle.fill',
      onPress: () => router.push('/help'),
      show: true,
    },
    {
      title: 'About',
      subtitle: 'App version and legal information',
      icon: 'info.circle.fill',
      onPress: () => router.push('/about'),
      show: true,
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'senior_lawyer':
        return colors.primary;
      case 'junior_lawyer':
        return colors.success;
      case 'clerk':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'senior_lawyer':
        return 'star.fill';
      case 'junior_lawyer':
        return 'person.fill';
      case 'clerk':
        return 'person.crop.circle.fill';
      default:
        return 'person.fill';
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: getRoleColor(user?.role || '') + '20' }]}>
          <IconSymbol 
            name={getRoleIcon(user?.role || '')} 
            size={32} 
            color={getRoleColor(user?.role || '')} 
          />
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role || '') }]}>
          <Text style={styles.roleText}>
            {user?.role?.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={commonStyles.card}>
          {user?.mobile && (
            <View style={styles.infoRow}>
              <IconSymbol name="phone.fill" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{user.mobile}</Text>
            </View>
          )}
          {user?.cnic && (
            <View style={styles.infoRow}>
              <IconSymbol name="creditcard.fill" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{user.cnic}</Text>
            </View>
          )}
          {user?.address && (
            <View style={styles.infoRow}>
              <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{user.address}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuItems.filter(item => item.show).map((item, index) => (
          <Pressable 
            key={index}
            style={[commonStyles.card, styles.menuItem]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <IconSymbol name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <Pressable 
          style={[commonStyles.card, styles.logoutButton]}
          onPress={handleLogout}
        >
          <IconSymbol name="arrow.right.square.fill" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Law Practice Manager v1.0.0</Text>
        <Text style={styles.footerText}>Made for Pakistani Law Chambers</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  menuSection: {
    padding: 16,
    gap: 8,
  },
  menuItem: {
    marginBottom: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  logoutSection: {
    padding: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
