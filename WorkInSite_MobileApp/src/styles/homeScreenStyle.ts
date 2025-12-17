import {Platform, StyleSheet} from 'react-native';
import {Theme} from '../context/ThemeContext';
import Colors from '../utils/color';

export const getHomeScreenStyle = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#f0f4f8',
      flex: 1,
      paddingBottom: 10,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.secondaryColor,
      marginVertical: 20,
      textAlign: 'center',
    },
    noDataText: {
      textAlign: 'center',
      color: Colors.grayColor,
      marginVertical: 20,
    },
    chartCard: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 14,
      borderRadius: 12,
      shadowColor: '#bbb',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 4,
      marginBottom: 20,
    },
    centerLabel: {
      fontSize: 14,
      textAlign: 'center',
      fontWeight: 'bold',
      color: Colors.black,
    },
    centerValue: {
      fontSize: 16,
      textAlign: 'center',
      color: Colors.grayColor,
    },
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '80%',
    },
    legendColumn: {
      flex: 1,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    legendText: {
      fontSize: 14,
      color: Colors.grayColor,
    },
    filterRow: {
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
      flexWrap: 'wrap',
    },
    searchIconWrapper: {
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 2,
    },
    searchInput: {
      flex: 2,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      height: 45,
      backgroundColor: '#fff',
      color: Colors.black,
    },
    pickerWrapper: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#fff',
      height: Platform.OS === 'android' ? 45 : undefined,
      justifyContent: 'center',
    },
    picker: {
      height: Platform.OS === 'android' ? 45 : undefined,
      width: '100%',
      color: Colors.black,
    },
    addButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
    },
    addButtonText: {
      color: Colors.white,
      fontWeight: '600',
    },

    //new

    welcomeCard: {
      marginTop: 40,
      padding: 20,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      marginHorizontal: 20,
      elevation: 4, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: {width: 0, height: 3},
    },

    welcomeImage: {
      width: 200,
      height: 200,
    },

    welcomeTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937',
      textAlign: 'center',
      marginBottom: 6,
    },

    welcomeDescription: {
      fontSize: 15,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 18,
      paddingHorizontal: 10,
    },
  });
