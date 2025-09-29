
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { DocumentType } from '@/types';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cases } = useCases();

  // Find the document and its case
  let document = null;
  let caseItem = null;

  for (const c of cases) {
    const d = c.documents.find(d => d.id === id);
    if (d) {
      document = d;
      caseItem = c;
      break;
    }
  }

  if (!document || !caseItem) {
    return (
      <View style={commonStyles.container}>
        <Header title="Document Not Found" showBack />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={colors.error} />
          <Text style={styles.errorText}>Document not found</Text>
        </View>
      </View>
    );
  }

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

  const getDocumentColor = (type: DocumentType) => {
    switch (type) {
      case 'FIR':
        return colors.error;
      case 'Petition':
        return colors.primary;
      case 'Order':
        return colors.warning;
      case 'Judgment':
        return colors.success;
      case 'Evidence':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleView = () => {
    // TODO: Implement document viewing functionality
    console.log('View document:', document.uri);
    Alert.alert('View Document', 'Document viewing functionality will be implemented here.');
  };

  const handleDownload = () => {
    // TODO: Implement document download functionality
    console.log('Download document:', document.uri);
    Alert.alert('Download Document', 'Document download functionality will be implemented here.');
  };

  const handleShare = () => {
    // TODO: Implement document sharing functionality
    console.log('Share document:', document.uri);
    Alert.alert('Share Document', 'Document sharing functionality will be implemented here.');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete functionality
            console.log('Delete document:', document.id);
            router.back();
          }
        },
      ]
    );
  };

  return (
    <View style={commonStyles.container}>
      <Header title="Document Details" showBack />
      
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        {/* Document Preview */}
        <View style={[commonStyles.card, styles.section]}>
          <View style={styles.documentPreview}>
            <View style={[styles.documentIcon, { backgroundColor: getDocumentColor(document.type) + '20' }]}>
              <IconSymbol 
                name={getDocumentIcon(document.type)} 
                size={48} 
                color={getDocumentColor(document.type)} 
              />
            </View>
            <Text style={styles.documentName}>{document.name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: getDocumentColor(document.type) }]}>
              <Text style={styles.typeText}>{document.type}</Text>
            </View>
          </View>
        </View>

        {/* Case Information */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Case Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Case Number:</Text>
            <Text style={styles.value}>{caseItem.caseNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Court:</Text>
            <Text style={styles.value}>{caseItem.courtName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Parties:</Text>
            <Text style={styles.value}>
              {caseItem.parties.plaintiffs[0]?.name} vs {caseItem.parties.defendants[0]?.name}
            </Text>
          </View>
        </View>

        {/* Document Information */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Document Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>File Size:</Text>
            <Text style={styles.value}>{formatFileSize(document.size)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>File Type:</Text>
            <Text style={styles.value}>{document.mimeType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Uploaded:</Text>
            <Text style={styles.value}>
              {new Date(document.uploadedAt).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* Tags */}
        {document.tags.length > 0 && (
          <View style={[commonStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {document.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={handleView}>
            <IconSymbol name="eye" size={20} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>View Document</Text>
          </Pressable>
          
          <View style={styles.secondaryActions}>
            <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={handleDownload}>
              <IconSymbol name="arrow.down.circle" size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Download</Text>
            </Pressable>
            
            <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={handleShare}>
              <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Share</Text>
            </Pressable>
          </View>
          
          <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
            <IconSymbol name="trash" size={20} color={colors.error} />
            <Text style={[styles.actionButtonText, { color: colors.error }]}>Delete Document</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  documentPreview: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  documentIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 100,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.grey,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  actionsSection: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '30',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: colors.error + '10',
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
