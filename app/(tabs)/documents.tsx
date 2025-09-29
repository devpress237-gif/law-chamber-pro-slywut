
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { CaseFolderCard } from '@/components/CaseFolderCard';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { Case, DocumentType } from '@/types';

export default function DocumentsScreen() {
  const { cases } = useCases();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');

  const typeOptions: { key: DocumentType | 'all'; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: colors.textSecondary },
    { key: 'FIR', label: 'FIR', color: colors.error },
    { key: 'Petition', label: 'Petition', color: colors.primary },
    { key: 'Order', label: 'Order', color: colors.warning },
    { key: 'Judgment', label: 'Judgment', color: colors.success },
    { key: 'Evidence', label: 'Evidence', color: colors.info },
    { key: 'Other', label: 'Other', color: colors.textSecondary },
  ];

  const getFilteredCases = () => {
    return cases.filter(caseItem => {
      const matchesSearch = caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           caseItem.parties.plaintiffs.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           caseItem.parties.defendants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const hasDocuments = caseItem.documents.length > 0;
      
      const matchesType = selectedType === 'all' || 
                         caseItem.documents.some(doc => doc.type === selectedType);
      
      return matchesSearch && hasDocuments && matchesType;
    });
  };

  const filteredCases = getFilteredCases();

  const renderCaseFolder = ({ item }: { item: Case }) => {
    const documentsCount = selectedType === 'all' 
      ? item.documents.length 
      : item.documents.filter(doc => doc.type === selectedType).length;
      
    return (
      <CaseFolderCard
        case={item}
        type="documents"
        count={documentsCount}
        onPress={() => router.push(`/case-documents/${item.id}?type=${selectedType}`)}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search cases..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {typeOptions.map((item) => (
          <Pressable
            key={item.key}
            style={[
              styles.filterButton,
              selectedType === item.key && { 
                backgroundColor: item.color + '20', 
                borderColor: item.color 
              }
            ]}
            onPress={() => setSelectedType(item.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === item.key && { 
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
      <IconSymbol name="folder" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Cases with Documents</Text>
      <Text style={styles.emptyText}>
        {searchQuery ? 'Try adjusting your search criteria' : 'No cases have documents uploaded yet'}
      </Text>
      <Pressable 
        style={styles.addButton}
        onPress={() => router.push('/upload-document')}
      >
        <IconSymbol name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Upload Document</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <Header title="Documents" />
      
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
        onPress={() => router.push('/upload-document')}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
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
