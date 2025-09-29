
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { Case } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';

interface CaseFolderCardProps {
  case: Case;
  onPress: () => void;
  type: 'hearings' | 'documents';
  count: number;
}

export const CaseFolderCard: React.FC<CaseFolderCardProps> = ({ 
  case: caseItem, 
  onPress, 
  type,
  count 
}) => {
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

  const getFolderIcon = () => {
    return type === 'hearings' ? 'calendar.badge.clock' : 'folder.fill';
  };

  const getFolderColor = () => {
    return type === 'hearings' ? colors.primary : colors.info;
  };

  return (
    <Pressable style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.folderIcon, { backgroundColor: getFolderColor() + '20' }]}>
          <IconSymbol 
            name={getFolderIcon()} 
            size={24} 
            color={getFolderColor()} 
          />
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(caseItem.status) }]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.caseNumber} numberOfLines={1}>
          {caseItem.caseNumber}
        </Text>
        <Text style={styles.courtName} numberOfLines={1}>
          {caseItem.courtName}
        </Text>
        
        <View style={styles.partiesContainer}>
          <Text style={styles.partiesText} numberOfLines={1}>
            {caseItem.parties.plaintiffs[0]?.name} vs {caseItem.parties.defendants[0]?.name}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.countContainer}>
          <Text style={styles.countNumber}>{count}</Text>
          <Text style={styles.countLabel}>
            {type === 'hearings' ? 'Hearings' : 'Documents'}
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    minHeight: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  folderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    marginBottom: 12,
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  courtName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  partiesContainer: {
    marginTop: 4,
  },
  partiesText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countContainer: {
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  countLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
