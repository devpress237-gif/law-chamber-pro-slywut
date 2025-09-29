
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { Hearing, Case } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';

interface HearingCardProps {
  hearing: Hearing & { case?: Case };
  onPress: () => void;
  showCaseInfo?: boolean;
}

export const HearingCard: React.FC<HearingCardProps> = ({ 
  hearing, 
  onPress, 
  showCaseInfo = false 
}) => {
  const getOrderTypeColor = (orderType: Hearing['courtOrderType']) => {
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return new Date(date).toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(date).toDateString() === tomorrow.toDateString();
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return formatDate(date);
  };

  return (
    <Pressable style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>{getDateLabel(hearing.date)}</Text>
          <Text style={styles.timeText}>{formatTime(hearing.date)}</Text>
        </View>
        <View style={[styles.orderTypeBadge, { backgroundColor: getOrderTypeColor(hearing.courtOrderType) }]}>
          <Text style={styles.orderTypeText}>{hearing.courtOrderType}</Text>
        </View>
      </View>

      {showCaseInfo && hearing.case && (
        <View style={styles.caseInfo}>
          <Text style={styles.caseNumber}>{hearing.case.caseNumber}</Text>
          <Text style={styles.courtName}>{hearing.case.courtName}</Text>
        </View>
      )}

      <View style={styles.hearingInfo}>
        <Text style={styles.hearingNumber}>Hearing #{hearing.hearingNumber}</Text>
        {hearing.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {hearing.notes}
          </Text>
        )}
      </View>

      {hearing.nextSteps && (
        <View style={styles.nextStepsContainer}>
          <IconSymbol name="arrow.right.circle" size={14} color={colors.primary} />
          <Text style={styles.nextSteps} numberOfLines={1}>
            {hearing.nextSteps}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  orderTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  caseInfo: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  caseNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  courtName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  hearingInfo: {
    marginBottom: 8,
  },
  hearingNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 20,
  },
  nextStepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextSteps: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    flex: 1,
  },
});
