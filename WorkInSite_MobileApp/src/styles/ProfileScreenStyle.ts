import {StyleSheet} from 'react-native';
import {Colors, SF, SH, widthPercent} from '../utils';
import {Theme} from '../context/ThemeContext';

export const getProfileScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },

    profileHeader: {
      width: widthPercent(100),
      height: widthPercent(20),
      backgroundColor: theme.primaryColor,
      flexDirection: 'row',
    },

    profileSection: {
      alignSelf: 'center',
      elevation: 20,
      width: widthPercent(82),
      height: widthPercent(50),
      backgroundColor: Colors.white,
      borderRadius: 12,
      margin: SH(20),
      marginTop: SH(180),
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileText: {
      color: theme.secondaryColor,
      fontSize: SF(20),
      paddingTop: SH(10),
      fontWeight: 'bold',
    },
  menuContainer: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },

  sectionTitle: {
      fontSize: SF(16),
      fontWeight: '600',
      color: Colors.black,
      marginVertical: 10,
      marginLeft: 4,
    },

  menuCard: {
      backgroundColor: Colors.white,
      borderRadius: 12,
      marginBottom: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },

  optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      minHeight: 56,
    },

  optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },

  iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      backgroundColor: '#F0F0F0',
    },

  menuText: {
      fontSize: 16,
      color: Colors.grayColor,
      fontWeight: '500',
      flex: 1,
    },

    separator: {
      height: 1,
      backgroundColor: '#E5E5E5',
      marginHorizontal: 25,
    },

    badge: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.dangerColor,
    },

    footer: {
      alignItems: 'center',
      paddingVertical: 20,
      paddingBottom: 40,
    },

    versionText: {
      fontSize: SF(12),
      color: Colors.grayColor,
      fontStyle: 'italic',
    },
    backButton: {
      position: 'absolute',
      left: 35,
      top: 40,
      zIndex: 10,
      padding: 8,
      backgroundColor: Colors.lightGray,
      borderRadius: 10,
    },
  });
