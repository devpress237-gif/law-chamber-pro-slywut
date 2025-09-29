
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';

export default function ReportsScreen() {
  const { cases } = useCases();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const periods = [
    { key: 'week' as const, label: 'This Week' },
    { key: 'month' as const, label: 'This Month' },
    { key: 'quarter' as const, label: 'This Quarter' },
    { key: 'year' as const, label: 'This Year' },
  ];

  // Calculate statistics
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status === 'active').length;
  const pendingCases = cases.filter(c => c.status === 'pending').length;
  const disposedCases = cases.filter(c => c.status === 'disposed').length;
  const adjournedCases = cases.filter(c => c.status === 'adjourned').length;

  const totalHearings = cases.reduce((acc, c) => acc + c.hearings.length, 0);
  const totalDocuments = cases.reduce((acc, c) => acc + c.documents.length, 0);

  // Court-wise breakdown
  const courtWiseStats = cases.reduce((acc, caseItem) => {
    const court = caseItem.courtName;
    if (!acc[court]) {
      acc[court] = { total: 0, active: 0, disposed: 0 };
    }
    acc[court].total++;
    if (caseItem.status === 'active') acc[court].active++;
    if (caseItem.status === 'disposed') acc[court].disposed++;
    return acc;
  }, {} as Record<string, { total: number; active: number; disposed: number }>);

  // Document type breakdown
  const documentTypeStats = cases.reduce((acc, caseItem) => {
    caseItem.documents.forEach(doc => {
      if (!acc[doc.type]) acc[doc.type] = 0;
      acc[doc.type]++;
    });
    return acc;
  }, {} as Record<string, number>);

  const StatCard = ({ title, value, icon, color, subtitle }: {
    title: string;
    value: number;
    icon: string;
    color: string;
    subtitle?: string;
  }) => (
    <View style={[commonStyles.card, styles.statCard]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <Header title="Reports & Analytics" showBack />
      
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        {/* Period Selection */}
        <View style={styles.periodSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.periodContainer}>
              {periods.map((period) => (
                <Pressable
                  key={period.key}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period.key && styles.selectedPeriodButton
                  ]}
                  onPress={() => setSelectedPeriod(period.key)}
                >
                  <Text style={[
                    styles.periodText,
                    selectedPeriod === period.key && styles.selectedPeriodText
                  ]}>
                    {period.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Cases"
              value={totalCases}
              icon="folder.fill"
              color={colors.primary}
            />
            <StatCard
              title="Active Cases"
              value={activeCases}
              icon="checkmark.circle.fill"
              color={colors.success}
            />
            <StatCard
              title="Pending Cases"
              value={pendingCases}
              icon="clock.fill"
              color={colors.warning}
            />
            <StatCard
              title="Disposed Cases"
              value={disposedCases}
              icon="checkmark.seal.fill"
              color={colors.textSecondary}
            />
          </View>
        </View>

        {/* Activity Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Summary</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Hearings"
              value={totalHearings}
              icon="calendar.badge.clock"
              color={colors.info}
            />
            <StatCard
              title="Total Documents"
              value={totalDocuments}
              icon="doc.text.fill"
              color={colors.accent}
            />
            <StatCard
              title="Adjourned Cases"
              value={adjournedCases}
              icon="pause.circle.fill"
              color={colors.error}
            />
            <StatCard
              title="Avg. Hearings/Case"
              value={totalCases > 0 ? Math.round((totalHearings / totalCases) * 10) / 10 : 0}
              icon="chart.bar.fill"
              color={colors.secondary}
            />
          </View>
        </View>

        {/* Court-wise Breakdown */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Court-wise Breakdown</Text>
          {Object.entries(courtWiseStats).map(([court, stats]) => (
            <View key={court} style={styles.courtRow}>
              <View style={styles.courtInfo}>
                <Text style={styles.courtName}>{court}</Text>
                <Text style={styles.courtStats}>
                  {stats.total} cases • {stats.active} active • {stats.disposed} disposed
                </Text>
              </View>
              <View style={styles.courtProgress}>
                <View 
                  style={[
                    styles.progressBar,
                    { 
                      width: `${stats.total > 0 ? (stats.disposed / stats.total) * 100 : 0}%`,
                      backgroundColor: colors.success 
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Document Types */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Document Types</Text>
          {Object.entries(documentTypeStats).map(([type, count]) => (
            <View key={type} style={styles.documentTypeRow}>
              <Text style={styles.documentType}>{type}</Text>
              <Text style={styles.documentCount}>{count}</Text>
            </View>
          ))}
        </View>

        {/* Export Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Reports</Text>
          <View style={styles.exportButtons}>
            <Pressable style={styles.exportButton}>
              <IconSymbol name="doc.text" size={20} color={colors.primary} />
              <Text style={styles.exportButtonText}>Export as PDF</Text>
            </Pressable>
            <Pressable style={styles.exportButton}>
              <IconSymbol name="tablecells" size={20} color={colors.success} />
              <Text style={styles.exportButtonText}>Export as Excel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  periodSection: {
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 16,
  },
  periodContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedPeriodButton: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedPeriodText: {
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 0,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
  courtRow: {
    marginBottom: 16,
  },
  courtInfo: {
    marginBottom: 8,
  },
  courtName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  courtStats: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  courtProgress: {
    height: 4,
    backgroundColor: colors.grey,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  documentTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  documentType: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  documentCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
