// import { StyleSheet } from 'react-native';
// import { Theme } from '../context/ThemeContext'; // Your theme type

// export const getSplashScreenStyles = (theme: Theme) =>
//   StyleSheet.create({
//     splashContainer: {
//       flex: 1,
//       backgroundColor: theme.primaryColor,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     splashLogoContainer: {
//       width: 150,
//       height: 100,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     splashLogo: {
//       width: '100%',
//       height: '100%',
//     },
//   });

//2

import {StyleSheet} from 'react-native';

export const getSplashScreenStyles = (theme: any) =>
  StyleSheet.create({
    splashContainer: {
      flex: 1,
      backgroundColor: theme.primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    splashLogoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    splashLogo: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    appName: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
      marginTop: 10,
    },
    tagline: {
      fontSize: 16,
      color: '#fff',
      marginTop: 5,
      fontStyle: 'italic',
      opacity: 0.9,
    },
  });
