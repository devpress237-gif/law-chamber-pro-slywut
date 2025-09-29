
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { CaseFolderCard } from '@/components/CaseFolderCard';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { Case } from '@/types';

type HearingFilter = 'all' | 'today' | 'tomorrow' | 'upcoming' | 'past';

export default function HearingsScreen() {
  const { cases } = useCases();
  const [selectedFilter, setSelectedFilter] = useState<HearingFilter>('all');

  const filterOptions: { key: HearingFilter; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: colors.textSecondary },
    { key: 'today', label: 'Today', color: colors.error },
    { key: 'tomorrow', label: 'Tomorrow', color: colors.warning },
    { key: 'upcoming', label: 'Upcoming', color: colors.primary },
    { key: 'past', label: 'Past', color: colors.textSecondary },
  ];

  const getFilteredCases = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return cases.filter(caseItem => {
      const caseHearings = caseItem.hearings;
      
      switch (selectedFilter) {
        case 'today':
          return caseHearings.some(h => {
            const hearingDate = new Date(h.date);
            return hearingDate >= today && hearingDate < tomorrow;
          });
        case 'tomorrow':
          const dayAfterTomorrow = new Date(tomorrow);
          dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
          return caseHearings.some(h => {
            const hearingDate = new Date(h.date);
            return hearingDate >= tomorrow && hearingDate < dayAfterTomorrow;
          });
        case 'upcoming':
          return caseHearings.some(h => new Date(h.date) > tomorrow);
        case 'past':
          return caseHearings.some(h => new Date(h.date) < today);
        default:
          return caseHearings.length > 0;
      }
    });
  };

  const filteredCases = getFilteredCases();

  const renderCaseFolder = ({ item }: { item: Case }) => {
    const hearingsCount = item.hearings.length;
    return (
      <CaseFolderCard
        case={item}
        type="hearings"
        count={hearingsCount}
        onPress={() => router.push(`/case-hearings/${item.id}`)}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.filtersSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filterOptions.map((item) => (
          <Pressable
            key={item.key}
            style={[
              styles.filterButton,
              selectedFilter === item.key && { 
                backgroundColor: item.color + '20', 
                borderColor: item.color 
              }
            ]}
            onPress={() => setSelectedFilter(item.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === item.key && { 
                  color: item.color, 
                  fontWeight: '600' 
                }
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="calendar" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Cases with Hearings</Text>
      <Text style={styles.emptyText}>
        {selectedFilter === 'all' 
          ? 'No cases have hearings scheduled yet' 
          : `No cases have hearings for ${selectedFilter}`}
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
      <Header title="Hearings" />
      
      <FlatList
        data={filteredCases}
        renderItem={renderCaseFolder}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filteredCases.length === 0 ? styles.emptyList : undefined}
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
  filtersSection: {
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
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
