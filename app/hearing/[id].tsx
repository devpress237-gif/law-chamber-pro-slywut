
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCases } from '@/hooks/useCases';

export default function HearingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cases } = useCases();

  // Find the hearing and its case
  let hearing = null;
  let caseItem = null;

  for (const c of cases) {
    const h = c.hearings.find(h => h.id === id);
    if (h) {
      hearing = h;
      caseItem = c;
      break;
    }
  }

  if (!hearing || !caseItem) {
    return (
      <View style={commonStyles.container}>
        <Header title="Hearing Not Found" showBack />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={colors.error} />
          <Text style={styles.errorText}>Hearing not found</Text>
        </View>
      </View>
    );
  }

  const getOrderTypeColor = (orderType: string) => {
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

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = () => {
    router.push(`/edit-hearing/${hearing.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Hearing',
      'Are you sure you want to delete this hearing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete functionality
            console.log('Delete hearing:', hearing.id);
            router.back();
          }
        },
      ]
    );
  };

  return (
    <View style={commonStyles.container}>
      <Header title="Hearing Details" showBack />
      
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
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

        {/* Hearing Information */}
        <View style={[commonStyles.card, styles.section]}>
          <View style={styles.hearingHeader}>
            <Text style={styles.sectionTitle}>Hearing #{hearing.hearingNumber}</Text>
            <View style={[styles.orderTypeBadge, { backgroundColor: getOrderTypeColor(hearing.courtOrderType) }]}>
              <Text style={styles.orderTypeText}>{hearing.courtOrderType}</Text>
            </View>
          </View>
          
          <View style={styles.dateTimeContainer}>
            <IconSymbol name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateTimeText}>{formatDateTime(hearing.date)}</Text>
          </View>
        </View>

        {/* Notes */}
        {hearing.notes && (
          <View style={[commonStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{hearing.notes}</Text>
          </View>
        )}

        {/* Previous Comments */}
        {hearing.previousComments && (
          <View style={[commonStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>Previous Comments</Text>
            <Text style={styles.commentsText}>{hearing.previousComments}</Text>
          </View>
        )}

        {/* Next Steps */}
        {hearing.nextSteps && (
          <View style={[commonStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>Next Steps</Text>
            <View style={styles.nextStepsContainer}>
              <IconSymbol name="arrow.right.circle" size={16} color={colors.primary} />
              <Text style={styles.nextStepsText}>{hearing.nextSteps}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Pressable style={[styles.actionButton, styles.editButton]} onPress={handleEdit}>
            <IconSymbol name="pencil" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Edit Hearing</Text>
          </Pressable>
          
          <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
            <IconSymbol name="trash" size={20} color={colors.error} />
            <Text style={[styles.actionButtonText, { color: colors.error }]}>Delete Hearing</Text>
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
  hearingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  orderTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
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
  notesText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  commentsText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  nextStepsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  nextStepsText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 24,
    flex: 1,
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
    borderWidth: 1,
    gap: 8,
  },
  editButton: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary + '30',
  },
  deleteButton: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
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
