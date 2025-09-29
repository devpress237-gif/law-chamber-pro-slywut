
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { HearingCard } from '@/components/HearingCard';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { Hearing } from '@/types';

export default function CaseHearingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cases } = useCases();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const caseItem = cases.find(c => c.id === id);

  if (!caseItem) {
    return (
      <View style={commonStyles.container}>
        <Header title="Case Not Found" showBack />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={colors.error} />
          <Text style={styles.errorText}>Case not found</Text>
        </View>
      </View>
    );
  }

  const sortedHearings = [...caseItem.hearings].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const renderHearing = ({ item }: { item: Hearing }) => (
    <HearingCard
      hearing={{ ...item, case: caseItem }}
      onPress={() => router.push(`/hearing/${item.id}`)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.caseInfo}>
        <Text style={styles.caseNumber}>{caseItem.caseNumber}</Text>
        <Text style={styles.courtName}>{caseItem.courtName}</Text>
        <Text style={styles.partiesText}>
          {caseItem.parties.plaintiffs[0]?.name} vs {caseItem.parties.defendants[0]?.name}
        </Text>
      </View>
      
      <View style={styles.controls}>
        <Text style={styles.hearingsCount}>
          {caseItem.hearings.length} Hearing{caseItem.hearings.length !== 1 ? 's' : ''}
        </Text>
        <Pressable 
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <IconSymbol 
            name={sortOrder === 'asc' ? 'arrow.up' : 'arrow.down'} 
            size={16} 
            color={colors.primary} 
          />
          <Text style={styles.sortText}>
            {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="calendar" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Hearings Scheduled</Text>
      <Text style={styles.emptyText}>
        This case doesn't have any hearings scheduled yet.
      </Text>
      <Pressable 
        style={styles.addButton}
        onPress={() => router.push(`/add-hearing?caseId=${caseItem.id}`)}
      >
        <IconSymbol name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Hearing</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <Header title="Case Hearings" showBack />
      
      <FlatList
        data={sortedHearings}
        renderItem={renderHearing}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={sortedHearings.length === 0 ? styles.emptyList : undefined}
        showsVerticalScrollIndicator={false}
      />
      
      <Pressable 
        style={styles.fab}
        onPress={() => router.push(`/add-hearing?caseId=${caseItem.id}`)}
      >
        <IconSymbol name="plus" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  caseInfo: {
    marginBottom: 16,
  },
  caseNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  courtName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  partiesText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hearingsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.error,
    marginTop: 16,
  },
});
