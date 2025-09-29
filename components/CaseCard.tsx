
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { Case } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';

interface CaseCardProps {
  case: Case;
  onPress: () => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ case: caseItem, onPress }) => {
  const getStatusColor = (status: Case['status']) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'disposed':
        return colors.textSecondary;
      case 'adjourned':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: Case['status']) => {
    switch (status) {
      case 'active':
        return 'checkmark.circle.fill';
      case 'pending':
        return 'clock.fill';
      case 'disposed':
        return 'checkmark.seal.fill';
      case 'adjourned':
        return 'pause.circle.fill';
      default:
        return 'circle.fill';
    }
  };

  const nextHearing = caseItem.hearings
    .filter(h => new Date(h.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <Pressable style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.caseNumber}>{caseItem.caseNumber}</Text>
          <Text style={styles.courtName}>{caseItem.courtName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(caseItem.status) }]}>
          <IconSymbol 
            name={getStatusIcon(caseItem.status)} 
            size={12} 
            color="#FFFFFF" 
          />
          <Text style={styles.statusText}>{caseItem.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.partiesContainer}>
        <Text style={styles.partiesLabel}>Plaintiff:</Text>
        <Text style={styles.partiesText}>
          {caseItem.parties.plaintiffs.map(p => p.name).join(', ')}
        </Text>
      </View>

      <View style={styles.partiesContainer}>
        <Text style={styles.partiesLabel}>Defendant:</Text>
        <Text style={styles.partiesText}>
          {caseItem.parties.defendants.map(p => p.name).join(', ')}
        </Text>
      </View>

      {nextHearing && (
        <View style={styles.hearingContainer}>
          <IconSymbol name="calendar" size={16} color={colors.primary} />
          <Text style={styles.hearingText}>
            Next Hearing: {new Date(nextHearing.date).toLocaleDateString('en-GB')}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.sectionsContainer}>
          {caseItem.legalSections.slice(0, 3).map((section, index) => (
            <View key={index} style={styles.sectionBadge}>
              <Text style={styles.sectionText}>{section}</Text>
            </View>
          ))}
          {caseItem.legalSections.length > 3 && (
            <Text style={styles.moreText}>+{caseItem.legalSections.length - 3}</Text>
          )}
        </View>
        
        <View style={styles.countsContainer}>
          <View style={styles.countItem}>
            <IconSymbol name="doc.text" size={14} color={colors.textSecondary} />
            <Text style={styles.countText}>{caseItem.documents.length}</Text>
          </View>
          <View style={styles.countItem}>
            <IconSymbol name="calendar.badge.clock" size={14} color={colors.textSecondary} />
            <Text style={styles.countText}>{caseItem.hearings.length}</Text>
          </View>
        </View>
      </View>
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
  titleContainer: {
    flex: 1,
  },
  caseNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  courtName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  partiesContainer: {
    marginBottom: 8,
  },
  partiesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  partiesText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  hearingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 12,
  },
  hearingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: colors.grey,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sectionText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  moreText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  countsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
