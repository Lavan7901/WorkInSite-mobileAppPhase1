import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { Colors } from '../utils';
 
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      borderRadius: 12,
      padding: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      gap: 8,
    },
    emptyContainer: {
      padding: 16,
    },
    emptyText: {
      textAlign: 'center',
      color: Colors.grayColor,
      fontStyle: 'italic',
      fontSize: 16,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: 14,
      backgroundColor: '#F9F9FB',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.secondaryColor,
      marginBottom: 2,
    },
    materialInfo: {
      flex: 1,
      gap: 5,
    },
    materialName: {
      fontWeight: '700',
      fontSize: 16,
      color: theme.secondaryColor,
    },
    materialDetails: {
      fontSize: 14,
      color: Colors.grayColor,
      fontWeight: '500',
    },
    materialTotal: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.grayColor,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
  });
 