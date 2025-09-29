
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { Document, DocumentType } from '@/types';

export default function DocumentsScreen() {
  const { cases } = useCases();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');

  const typeOptions: Array<{ key: DocumentType | 'all'; label: string; color: string }> = [
    { key: 'all', label: 'All', color: colors.textSecondary },
    { key: 'FIR', label: 'FIR', color: colors.error },
    { key: 'Petition', label: 'Petition', color: colors.primary },
    { key: 'Order', label: 'Order', color: colors.warning },
    { key: 'Judgment', label: 'Judgment', color: colors.success },
    { key: 'Evidence', label: 'Evidence', color: colors.info },
    { key: 'Other', label: 'Other', color: colors.textSecondary },
  ];

  const getAllDocuments = (): Array<Document & { case: any }> => {
    return cases.flatMap(caseItem => 
      caseItem.documents.map(doc => ({ ...doc, case: caseItem }))
    );
  };

  const filteredDocuments = getAllDocuments().filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.case.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case 'FIR':
        return 'exclamationmark.triangle.fill';
      case 'Petition':
        return 'doc.text.fill';
      case 'Order':
        return 'hammer.fill';
      case 'Judgment':
        return 'checkmark.seal.fill';
      case 'Evidence':
        return 'eye.fill';
      default:
        return 'doc.fill';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderDocument = ({ item }: { item: Document & { case: any } }) => (
    <Pressable 
      style={[commonStyles.card, styles.documentCard]}
      onPress={() => router.push(`/document/${item.id}`)}
    >
      <View style={styles.documentHeader}>
        <View style={[styles.documentIcon, { backgroundColor: typeOptions.find(t => t.key === item.type)?.color + '20' }]}>
          <IconSymbol 
            name={getDocumentIcon(item.type)} 
            size={20} 
            color={typeOptions.find(t => t.key === item.type)?.color || colors.textSecondary} 
          />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.caseNumber}>{item.case.caseNumber}</Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: typeOptions.find(t => t.key === item.type)?.color }]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>
      
      <View style={styles.documentFooter}>
        <Text style={styles.documentSize}>{formatFileSize(item.size)}</Text>
        <Text style={styles.uploadDate}>
          {new Date(item.uploadedAt).toLocaleDateString('en-GB')}
        </Text>
      </View>
      
      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
          )}
        </View>
      )}
    </Pressable>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search documents..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={typeOptions}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.filtersContainer}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.filterButton,
              selectedType === item.key && { backgroundColor: item.color + '20', borderColor: item.color }
            ]}
            onPress={() => setSelectedType(item.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === item.key && { color: item.color, fontWeight: '600' }
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
      <IconSymbol name="doc.text" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Documents Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery ? 'Try adjusting your search criteria' : 'Start by uploading your first document'}
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
      <FlatList
        data={filteredDocuments}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filteredDocuments.length === 0 ? styles.emptyList : undefined}
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
  documentCard: {
    marginHorizontal: 16,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  caseNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentSize: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  uploadDate: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tag: {
    backgroundColor: colors.grey,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  moreTagsText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
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
