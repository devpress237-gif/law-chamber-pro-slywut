
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { HearingCard } from '@/components/HearingCard';
import { StatsCard } from '@/components/StatsCard';
import { CaseCard } from '@/components/CaseCard';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { useAuth } from '@/hooks/useAuth';
import { DashboardStats } from '@/types';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { cases, getTodayHearings, getTomorrowHearings } = useCases();
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
    const totalCases = cases.length;
    const activeCases = cases.filter(c => c.status === 'active').length;
    const todayHearings = getTodayHearings().length;
    const tomorrowHearings = getTomorrowHearings().length;
    const pendingApprovals = cases.filter(c => c.status === 'pending').length;
    const recentDocuments = cases.reduce((acc, c) => acc + c.documents.length, 0);

    setStats({
      totalCases,
      activeCases,
      todayHearings,
      tomorrowHearings,
      pendingApprovals,
      recentDocuments,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      calculateStats();
      setRefreshing(false);
    }, 1000);
  };

  const todayHearings = getTodayHearings().slice(0, 3);
  const recentCases = cases.slice(0, 3);

  return (
    <View style={commonStyles.container}>
      <Header title={`Welcome, ${user?.name?.split(' ')[0] || 'User'}`} />
      
      <ScrollView
        style={commonStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Total Cases"
              value={stats.totalCases}
              icon="folder.fill"
              color={colors.primary}
              onPress={() => router.push('/(tabs)/cases')}
            />
            <StatsCard
              title="Active Cases"
              value={stats.activeCases}
              icon="checkmark.circle.fill"
              color={colors.success}
              onPress={() => router.push('/(tabs)/cases')}
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard
              title="Today's Hearings"
              value={stats.todayHearings}
              icon="calendar.badge.clock"
              color={stats.todayHearings > 0 ? colors.error : colors.textSecondary}
              onPress={() => router.push('/(tabs)/hearings')}
            />
            <StatsCard
              title="Tomorrow's Hearings"
              value={stats.tomorrowHearings}
              icon="calendar"
              color={stats.tomorrowHearings > 0 ? colors.warning : colors.textSecondary}
              onPress={() => router.push('/(tabs)/hearings')}
            />
          </View>
        </View>

        {/* Today's Hearings */}
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

        {/* Recent Cases */}
        {recentCases.length > 0 && (
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
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <Pressable 
              style={styles.quickActionCard}
              onPress={() => router.push('/add-case')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Add Case</Text>
            </Pressable>
            
            <Pressable 
              style={styles.quickActionCard}
              onPress={() => router.push('/add-hearing')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.warning + '20' }]}>
                <IconSymbol name="calendar.badge.plus" size={24} color={colors.warning} />
              </View>
              <Text style={styles.quickActionText}>Add Hearing</Text>
            </Pressable>
            
            <Pressable 
              style={styles.quickActionCard}
              onPress={() => router.push('/upload-document')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.info + '20' }]}>
                <IconSymbol name="doc.badge.plus" size={24} color={colors.info} />
              </View>
              <Text style={styles.quickActionText}>Upload Doc</Text>
            </Pressable>
            
            <Pressable 
              style={styles.quickActionCard}
              onPress={() => router.push('/reports')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.success + '20' }]}>
                <IconSymbol name="chart.bar.fill" size={24} color={colors.success} />
              </View>
              <Text style={styles.quickActionText}>Reports</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: {
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
