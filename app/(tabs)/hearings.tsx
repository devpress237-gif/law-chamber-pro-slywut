
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { HearingCard } from '@/components/HearingCard';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { Hearing, Case } from '@/types';

type HearingFilter = 'all' | 'today' | 'tomorrow' | 'upcoming' | 'past';

export default function HearingsScreen() {
  const { cases, getTodayHearings, getTomorrowHearings } = useCases();
  const [selectedFilter, setSelectedFilter] = useState<HearingFilter>('all');

  const filterOptions: Array<{ key: HearingFilter; label: string; color: string }> = [
    { key: 'all', label: 'All', color: colors.textSecondary },
    { key: 'today', label: 'Today', color: colors.error },
    { key: 'tomorrow', label: 'Tomorrow', color: colors.warning },
    { key: 'upcoming', label: 'Upcoming', color: colors.primary },
    { key: 'past', label: 'Past', color: colors.textSecondary },
  ];

  const getAllHearings = (): Array<Hearing & { case: Case }> => {
    return cases.flatMap(caseItem => 
      caseItem.hearings.map(hearing => ({ ...hearing, case: caseItem }))
    );
  };

  const getFilteredHearings = () => {
    const allHearings = getAllHearings();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (selectedFilter) {
      case 'today':
        return getTodayHearings();
      case 'tomorrow':
        return getTomorrowHearings();
      case 'upcoming':
        return allHearings.filter(h => new Date(h.date) > tomorrow);
      case 'past':
        return allHearings.filter(h => new Date(h.date) < today);
      default:
        return allHearings;
    }
  };

  const filteredHearings = getFilteredHearings().sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const renderHearing = ({ item }: { item: Hearing & { case: Case } }) => (
    <HearingCard
      hearing={item}
      showCaseInfo={true}
      onPress={() => router.push(`/hearing/${item.id}`)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filterOptions}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.filtersContainer}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.filterButton,
              selectedFilter === item.key && { backgroundColor: item.color + '20', borderColor: item.color }
            ]}
            onPress={() => setSelectedFilter(item.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === item.key && { color: item.color, fontWeight: '600' }
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="calendar" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Hearings Found</Text>
      <Text style={styles.emptyText}>
        {selectedFilter === 'all' 
          ? 'No hearings scheduled yet' 
          : `No hearings for ${selectedFilter}`}
      </Text>
      <Pressable 
        style={styles.addButton}
        onPress={() => router.push('/add-hearing')}
      >
        <IconSymbol name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Hearing</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <FlatList
        data={filteredHearings}
        renderItem={renderHearing}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filteredHearings.length === 0 ? styles.emptyList : undefined}
        showsVerticalScrollIndicator={false}
      />
      
      <Pressable 
        style={styles.fab}
        onPress={() => router.push('/add-hearing')}
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
  filtersContainer: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
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
});
