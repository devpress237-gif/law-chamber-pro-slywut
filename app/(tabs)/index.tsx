
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
import { StatsCard } from '@/components/StatsCard';
import { HearingCard } from '@/components/HearingCard';
import { CaseCard } from '@/components/CaseCard';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { useAuth } from '@/hooks/useAuth';
import { DashboardStats } from '@/types';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { cases, getTodayHearings, getTomorrowHearings, getCasesByStatus } = useCases();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalCases: 0,
    activeCases: 0,
    todayHearings: 0,
    tomorrowHearings: 0,
    pendingApprovals: 0,
    recentDocuments: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [cases]);

  const calculateStats = () => {
    const todayHearings = getTodayHearings();
    const tomorrowHearings = getTomorrowHearings();
    const activeCases = getCasesByStatus('active');
    
    setStats({
      totalCases: cases.length,
      activeCases: activeCases.length,
      todayHearings: todayHearings.length,
      tomorrowHearings: tomorrowHearings.length,
      pendingApprovals: user?.role === 'senior_lawyer' ? 3 : 0, // Mock data
      recentDocuments: cases.reduce((acc, c) => acc + c.documents.length, 0),
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      calculateStats();
      setRefreshing(false);
    }, 1000);
  };

  const todayHearings = getTodayHearings().slice(0, 3);
  const recentCases = cases.slice(0, 2);

  return (
    <ScrollView 
      style={commonStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}
        </Text>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userRole}>{user?.role?.replace('_', ' ').toUpperCase()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatsCard
            title="Total Cases"
            value={stats.totalCases}
            icon="folder.fill"
            color={colors.primary}
          />
          <StatsCard
            title="Active Cases"
            value={stats.activeCases}
            icon="checkmark.circle.fill"
            color={colors.success}
          />
        </View>
        <View style={styles.statsRow}>
          <StatsCard
            title="Today's Hearings"
            value={stats.todayHearings}
            icon="calendar.badge.clock"
            color={colors.warning}
          />
          <StatsCard
            title="Tomorrow's Hearings"
            value={stats.tomorrowHearings}
            icon="calendar"
            color={colors.info}
          />
        </View>
        {user?.role === 'senior_lawyer' && (
          <View style={styles.statsRow}>
            <StatsCard
              title="Pending Approvals"
              value={stats.pendingApprovals}
              icon="exclamationmark.triangle.fill"
              color={colors.error}
            />
            <StatsCard
              title="Documents"
              value={stats.recentDocuments}
              icon="doc.text.fill"
              color={colors.textSecondary}
            />
          </View>
        )}
      </View>

      {todayHearings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Hearings</Text>
            <Pressable onPress={() => router.push('/(tabs)/hearings')}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          {todayHearings.map((hearing) => (
            <HearingCard
              key={hearing.id}
              hearing={hearing}
              showCaseInfo={true}
              onPress={() => router.push(`/hearing/${hearing.id}`)}
            />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Cases</Text>
          <Pressable onPress={() => router.push('/(tabs)/cases')}>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>
        {recentCases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            case={caseItem}
            onPress={() => router.push(`/case/${caseItem.id}`)}
          />
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push('/add-case')}
          >
            <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Add Case</Text>
          </Pressable>
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push('/add-hearing')}
          >
            <IconSymbol name="calendar.badge.plus" size={24} color={colors.success} />
            <Text style={styles.actionText}>Add Hearing</Text>
          </Pressable>
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push('/upload-document')}
          >
            <IconSymbol name="doc.badge.plus" size={24} color={colors.warning} />
            <Text style={styles.actionText}>Upload Doc</Text>
          </Pressable>
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push('/reports')}
          >
            <IconSymbol name="chart.bar.fill" size={24} color={colors.info} />
            <Text style={styles.actionText}>Reports</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  userRole: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  statsContainer: {
    padding: 16,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  quickActions: {
    padding: 16,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});
