
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';
import { CourtOrderType } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddHearingScreen() {
  const { caseId } = useLocalSearchParams<{ caseId?: string }>();
  const { cases, addHearing } = useCases();
  
  const [selectedCaseId, setSelectedCaseId] = useState(caseId || '');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [courtOrderType, setCourtOrderType] = useState<CourtOrderType>('Evidence');
  const [notes, setNotes] = useState('');
  const [previousComments, setPreviousComments] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [loading, setLoading] = useState(false);

  const orderTypes: CourtOrderType[] = ['Evidence', 'Cross', 'Adjournment', 'Arguments', 'Judgment'];

  const getOrderTypeColor = (orderType: CourtOrderType) => {
    switch (orderType) {
      case 'Evidence':
        return colors.info;
      case 'Cross':
        return colors.warning;
      case 'Adjournment':
        return colors.error;
      case 'Arguments':
        return colors.primary;
      case 'Judgment':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const handleSubmit = async () => {
    if (!selectedCaseId) {
      Alert.alert('Error', 'Please select a case');
      return;
    }

    if (!notes.trim()) {
      Alert.alert('Error', 'Please add hearing notes');
      return;
    }

    setLoading(true);

    try {
      const selectedCase = cases.find(c => c.id === selectedCaseId);
      if (!selectedCase) {
        throw new Error('Case not found');
      }

      const hearingNumber = selectedCase.hearings.length + 1;

      const newHearing = {
        id: Date.now().toString(),
        hearingNumber,
        date,
        courtOrderType,
        notes: notes.trim(),
        assignedLawyerId: selectedCase.assignedLawyerId,
        previousComments: previousComments.trim() || undefined,
        nextSteps: nextSteps.trim() || undefined,
        caseId: selectedCaseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addHearing(selectedCaseId, newHearing);
      
      Alert.alert(
        'Success',
        'Hearing added successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error adding hearing:', error);
      Alert.alert('Error', 'Failed to add hearing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={commonStyles.container}>
      <Header title="Add Hearing" showBack />
      
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

        {/* Date & Time */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          
          <Pressable style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
            <IconSymbol name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
            <IconSymbol name="clock" size={20} color={colors.primary} />
            <Text style={styles.dateTimeText}>{formatTime(date)}</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setDate(selectedTime);
                }
              }}
            />
          )}
        </View>

        {/* Court Order Type */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Court Order Type</Text>
          <View style={styles.orderTypesContainer}>
            {orderTypes.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.orderTypeButton,
                  courtOrderType === type && {
                    backgroundColor: getOrderTypeColor(type) + '20',
                    borderColor: getOrderTypeColor(type),
                  }
                ]}
                onPress={() => setCourtOrderType(type)}
              >
                <Text
                  style={[
                    styles.orderTypeText,
                    courtOrderType === type && {
                      color: getOrderTypeColor(type),
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

        {/* Notes */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Hearing Notes *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter hearing notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Previous Comments */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Previous Comments</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter previous comments (optional)..."
            value={previousComments}
            onChangeText={setPreviousComments}
            multiline
            numberOfLines={3}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Next Steps */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter next steps (optional)..."
            value={nextSteps}
            onChangeText={setNextSteps}
            multiline
            numberOfLines={3}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <Pressable
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.submitButtonText}>Adding Hearing...</Text>
            ) : (
              <>
                <IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Add Hearing</Text>
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
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    gap: 12,
  },
  dateTimeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  orderTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  orderTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    textAlignVertical: 'top',
    minHeight: 100,
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
