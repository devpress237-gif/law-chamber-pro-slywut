
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { useAuth } from '@/hooks/useAuth';
import { CourtName, LegalSection, courtNames, legalSections } from '@/data/mockData';

export default function AddCaseScreen() {
  const { addCase } = useCases();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    caseNumber: '',
    courtName: courtNames[0] as CourtName,
    plaintiffName: '',
    plaintiffCnic: '',
    plaintiffMobile: '',
    plaintiffEmail: '',
    plaintiffAddress: '',
    defendantName: '',
    defendantCnic: '',
    defendantMobile: '',
    defendantEmail: '',
    defendantAddress: '',
    opponentLawyers: '',
    legalSections: [] as LegalSection[],
  });

  const handleSubmit = async () => {
    if (!formData.caseNumber || !formData.plaintiffName || !formData.defendantName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const newCase = await addCase({
        caseNumber: formData.caseNumber,
        courtName: formData.courtName,
        parties: {
          plaintiffs: [{
            id: 'p_' + Date.now(),
            name: formData.plaintiffName,
            cnic: formData.plaintiffCnic,
            mobile: formData.plaintiffMobile,
            email: formData.plaintiffEmail,
            address: formData.plaintiffAddress,
          }],
          defendants: [{
            id: 'd_' + Date.now(),
            name: formData.defendantName,
            cnic: formData.defendantCnic,
            mobile: formData.defendantMobile,
            email: formData.defendantEmail,
            address: formData.defendantAddress,
          }],
        },
        opponentLawyers: formData.opponentLawyers.split(',').map(l => l.trim()).filter(l => l),
        legalSections: formData.legalSections,
        hearings: [],
        documents: [],
        assignedLawyerId: user?.id || '',
        status: 'active',
        createdBy: user?.id || '',
        teamId: user?.teamId || '',
      });

      Alert.alert('Success', 'Case added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log('Error adding case:', error);
      Alert.alert('Error', 'Failed to add case');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLegalSection = (section: LegalSection) => {
    setFormData(prev => ({
      ...prev,
      legalSections: prev.legalSections.includes(section)
        ? prev.legalSections.filter(s => s !== section)
        : [...prev.legalSections, section]
    }));
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Case Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.caseNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, caseNumber: text }))}
              placeholder="e.g., CIV/2024/001"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Court Name</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {courtNames.map((court) => (
                  <Pressable
                    key={court}
                    style={[
                      styles.optionButton,
                      formData.courtName === court && styles.selectedOption
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, courtName: court }))}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.courtName === court && styles.selectedOptionText
                    ]}>
                      {court}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plaintiff Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.plaintiffName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, plaintiffName: text }))}
              placeholder="Enter plaintiff name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>CNIC</Text>
              <TextInput
                style={styles.input}
                value={formData.plaintiffCnic}
                onChangeText={(text) => setFormData(prev => ({ ...prev, plaintiffCnic: text }))}
                placeholder="42101-1234567-1"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={styles.input}
                value={formData.plaintiffMobile}
                onChangeText={(text) => setFormData(prev => ({ ...prev, plaintiffMobile: text }))}
                placeholder="+92-300-1234567"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.plaintiffEmail}
              onChangeText={(text) => setFormData(prev => ({ ...prev, plaintiffEmail: text }))}
              placeholder="email@example.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.plaintiffAddress}
              onChangeText={(text) => setFormData(prev => ({ ...prev, plaintiffAddress: text }))}
              placeholder="Enter address"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Defendant Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.defendantName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, defendantName: text }))}
              placeholder="Enter defendant name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>CNIC</Text>
              <TextInput
                style={styles.input}
                value={formData.defendantCnic}
                onChangeText={(text) => setFormData(prev => ({ ...prev, defendantCnic: text }))}
                placeholder="42101-1234567-1"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={styles.input}
                value={formData.defendantMobile}
                onChangeText={(text) => setFormData(prev => ({ ...prev, defendantMobile: text }))}
                placeholder="+92-300-1234567"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.defendantEmail}
              onChangeText={(text) => setFormData(prev => ({ ...prev, defendantEmail: text }))}
              placeholder="email@example.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.defendantAddress}
              onChangeText={(text) => setFormData(prev => ({ ...prev, defendantAddress: text }))}
              placeholder="Enter address"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Opponent Lawyers</Text>
            <TextInput
              style={styles.input}
              value={formData.opponentLawyers}
              onChangeText={(text) => setFormData(prev => ({ ...prev, opponentLawyers: text }))}
              placeholder="Enter names separated by commas"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Legal Sections</Text>
            <View style={styles.sectionsGrid}>
              {legalSections.map((section) => (
                <Pressable
                  key={section}
                  style={[
                    styles.sectionButton,
                    formData.legalSections.includes(section) && styles.selectedSection
                  ]}
                  onPress={() => toggleLegalSection(section)}
                >
                  <Text style={[
                    styles.sectionButtonText,
                    formData.legalSections.includes(section) && styles.selectedSectionText
                  ]}>
                    {section}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <Pressable 
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Adding Case...' : 'Add Case'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: colors.backgroundAlt,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  sectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSection: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  sectionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedSectionText: {
    color: '#FFFFFF',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
