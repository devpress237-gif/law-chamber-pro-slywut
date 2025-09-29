
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { DocumentType } from '@/types';
import * as DocumentPicker from 'expo-document-picker';

export default function UploadDocumentScreen() {
  const { caseId } = useLocalSearchParams<{ caseId?: string }>();
  const { cases, addDocument } = useCases();
  
  const [selectedCaseId, setSelectedCaseId] = useState(caseId || '');
  const [documentType, setDocumentType] = useState<DocumentType>('Other');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  const documentTypes: DocumentType[] = ['FIR', 'Petition', 'Order', 'Judgment', 'Evidence', 'Other'];
  
  const commonTags = [
    'CNIC', 'B-Form', 'Passport', 'Affidavit', 'Statement', 'Receipt', 
    'Contract', 'Agreement', 'Notice', 'Application', 'Certificate'
  ];

  const getDocumentTypeColor = (type: DocumentType) => {
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

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'text/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!selectedCaseId) {
      Alert.alert('Error', 'Please select a case');
      return;
    }

    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    setLoading(true);

    try {
      const newDocument = {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: documentType,
        uri: selectedFile.uri,
        size: selectedFile.size || 0,
        mimeType: selectedFile.mimeType || 'application/octet-stream',
        caseId: selectedCaseId,
        uploadedBy: 'current-user-id', // TODO: Get from auth context
        uploadedAt: new Date(),
        tags,
      };

      await addDocument(selectedCaseId, newDocument);
      
      Alert.alert(
        'Success',
        'Document uploaded successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={commonStyles.container}>
      <Header title="Upload Document" showBack />
      
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        {/* Case Selection */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Select Case</Text>
          {!caseId ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.caseSelection}>
                {cases.map((caseItem) => (
                  <Pressable
                    key={caseItem.id}
                    style={[
                      styles.caseOption,
                      selectedCaseId === caseItem.id && styles.selectedCaseOption
                    ]}
                    onPress={() => setSelectedCaseId(caseItem.id)}
                  >
                    <Text style={[
                      styles.caseOptionText,
                      selectedCaseId === caseItem.id && styles.selectedCaseOptionText
                    ]}>
                      {caseItem.caseNumber}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.selectedCase}>
              <Text style={styles.selectedCaseText}>
                {cases.find(c => c.id === caseId)?.caseNumber}
              </Text>
            </View>
          )}
        </View>

        {/* File Selection */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Select File</Text>
          
          {selectedFile ? (
            <View style={styles.selectedFile}>
              <View style={styles.fileInfo}>
                <IconSymbol name="doc.fill" size={24} color={colors.primary} />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{selectedFile.name}</Text>
                  <Text style={styles.fileSize}>{formatFileSize(selectedFile.size || 0)}</Text>
                </View>
              </View>
              <Pressable style={styles.changeFileButton} onPress={handleFilePicker}>
                <Text style={styles.changeFileText}>Change</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.filePickerButton} onPress={handleFilePicker}>
              <IconSymbol name="plus.circle" size={32} color={colors.primary} />
              <Text style={styles.filePickerText}>Select Document</Text>
              <Text style={styles.filePickerSubtext}>PDF, Images, or Text files</Text>
            </Pressable>
          )}
        </View>

        {/* Document Type */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Document Type</Text>
          <View style={styles.documentTypesContainer}>
            {documentTypes.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.documentTypeButton,
                  documentType === type && {
                    backgroundColor: getDocumentTypeColor(type) + '20',
                    borderColor: getDocumentTypeColor(type),
                  }
                ]}
                onPress={() => setDocumentType(type)}
              >
                <Text
                  style={[
                    styles.documentTypeText,
                    documentType === type && {
                      color: getDocumentTypeColor(type),
                      fontWeight: '600',
                    }
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tags */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Tags</Text>
          
          {/* Current Tags */}
          {tags.length > 0 && (
            <View style={styles.currentTags}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <Pressable onPress={() => removeTag(tag)}>
                    <IconSymbol name="xmark.circle.fill" size={16} color={colors.textSecondary} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Add Custom Tag */}
          <View style={styles.addTagContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add custom tag..."
              value={newTag}
              onChangeText={setNewTag}
              placeholderTextColor={colors.textSecondary}
              onSubmitEditing={() => addTag(newTag)}
            />
            <Pressable 
              style={styles.addTagButton}
              onPress={() => addTag(newTag)}
              disabled={!newTag.trim()}
            >
              <IconSymbol name="plus" size={16} color={colors.primary} />
            </Pressable>
          </View>

          {/* Common Tags */}
          <Text style={styles.commonTagsTitle}>Common Tags:</Text>
          <View style={styles.commonTags}>
            {commonTags.map((tag) => (
              <Pressable
                key={tag}
                style={[
                  styles.commonTag,
                  tags.includes(tag) && styles.selectedCommonTag
                ]}
                onPress={() => tags.includes(tag) ? removeTag(tag) : addTag(tag)}
              >
                <Text style={[
                  styles.commonTagText,
                  tags.includes(tag) && styles.selectedCommonTagText
                ]}>
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <Pressable
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.submitButtonText}>Uploading...</Text>
            ) : (
              <>
                <IconSymbol name="arrow.up.circle.fill" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Upload Document</Text>
              </>
            )}
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  caseSelection: {
    flexDirection: 'row',
    gap: 8,
  },
  caseOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCaseOption: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  caseOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedCaseOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  selectedCase: {
    padding: 12,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  selectedCaseText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  filePickerButton: {
    alignItems: 'center',
    padding: 32,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  filePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  filePickerSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: 4,
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  fileSize: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  changeFileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
  },
  changeFileText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  documentTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  documentTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  currentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
  },
  addTagButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonTagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  commonTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  commonTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCommonTag: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  commonTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  selectedCommonTagText: {
    color: colors.primary,
    fontWeight: '600',
  },
  submitSection: {
    padding: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
