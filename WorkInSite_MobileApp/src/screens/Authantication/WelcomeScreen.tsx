// // WelcomeScreen.tsx

// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import images from '../../../images';
// import RouteName from '../../../navigation/RouteName';

// const WelcomeScreen = ({ navigation }: any) => {
//   return (
//     <View style={styles.container}>
//       {/* Logo at the top */}
//        <Image source={images.logo} style={styles.logo} resizeMode="contain" />

//       {/* Illustration */}
//       <Image
//         source={images.sign_in}
//         style={styles.illustration}
//         resizeMode="contain"
//       />

//       {/* Welcome text */}
//       <Text style={styles.title}>Welcome!</Text>
//       <Text style={styles.subtitle}>
//         Thank you for choosing us. Let’s start your journey of relaxation and connection.
//       </Text>

//       {/* Buttons */}
//       <TouchableOpacity
//         style={styles.buttonPrimary}
//         onPress={() => navigation.navigate(RouteName.REGISTER_SCREEN)}
//       >
//         <Text style={styles.buttonTextPrimary}>Sign Up</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.buttonSecondary}
//         onPress={() => navigation.navigate(RouteName.LOGIN_SCREEN)}
//       >
//         <Text style={styles.buttonTextSecondary}>Log In</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default WelcomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 30,
//   },
//   logo: {
//   width: 60,
//   height: 60,
//   marginBottom: 30,
// },

//   illustration: {
//     width: 220,
//     height: 220,
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#F4B400', // Yellow shade
//     marginBottom: 10,
//   },
//   subtitle: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 40,
//   },
//   buttonPrimary: {
//     width: '100%',
//     backgroundColor: '#F4B400',
//     paddingVertical: 15,
//     borderRadius: 8,
//     marginBottom: 15,
//     alignItems: 'center',
//   },
//   buttonTextPrimary: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   buttonSecondary: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#F4B400',
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonTextSecondary: {
//     color: '#F4B400',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });




















// import React from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';
// import images from '../../images';
// import RouteName from '../../navigation/RouteName';
// import Button from '../../components/CommonComponets/Button/Button';
// import commonStyle from '../../styles/commonStyle';
// import { useTheme } from '../../context/ThemeContext';

// const WelcomeScreen = ({ navigation }: any) => {
//   const { theme} = useTheme();
//   return (
//     <View style={[commonStyle.container,commonStyle.inputfieldContainer,{alignItems: 'center', justifyContent: 'center'}]}>
//       {/* Logo at the top */}
//        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
//        <Text style={{ fontSize: 20, fontWeight: 'bold', color:theme.secondaryColor, marginBottom: 20 }}>
//         WorkInSite </Text>
//       {/* Illustration */}
//       <Image
//         source={images.sign_up}
//         style={styles.illustration}
//         resizeMode="contain"
//       />

//       {/* Welcome text */}
//       <Text style={styles.title}>Welcome!</Text>
//       <Text style={styles.subtitle}>
//         Thank you for choosing us. Let’s start your journey of relaxation and connection.
//       </Text>

//      <View style={{ width: '100%' }}>
//   <Button 
//     title="Sign Up"
//     onPress={() => navigation.navigate(RouteName.REGISTER_SCREEN)} />
//   <View style={{ height: 15 }} />
//   <Button 
//     variant="secondary"
//     title="Log In"
//     onPress={() => navigation.navigate(RouteName.LOGIN_SCREEN)} />
// </View>

//     </View>
//   );
// };

// export default WelcomeScreen;

// const styles = StyleSheet.create({
//   logo: {
//   width: 100,
//   height: 100,
// },

//   illustration: {
//     width: 300,
//     height: 200,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#F4B400', // Yellow shade
//     marginBottom: 10,
//   },
//   subtitle: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 40,
//   },
// });






// WelcomeScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import images from '../../images';
import RouteName from '../../navigation/RouteName';
import Button from '../../components/CommonComponets/Button/Button';
import commonStyle from '../../styles/commonStyle';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from '../../styles/imageStyle';

const WelcomeScreen = ({ navigation}: any) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        commonStyle.container,
        commonStyle.inputfieldContainer,
        { alignItems: 'center', justifyContent: 'center' },
      ]}>
      <Image source={images.logo} style={Style.logo} resizeMode="contain" />

      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: theme.secondaryColor,
          marginBottom: 20,
        }}>
        WorkInSite
      </Text>

      <Image
        source={images.sign_up}
        style={Style.illustration}
        resizeMode="contain"
      />

      <Text style={[commonStyle.titleStyle,commonStyle.spaceBelow,{color: theme.primaryColor}]}>Welcome!</Text>
      <Text style={[commonStyle.label,commonStyle.spaceBelow,commonStyle.alignContent]}>
       Thank you for choosing us for your construction needs.
      Whether you’re planning, managing, or building, we’re here to support you every step of the way.
      </Text>

      <View style={{ width: '100%' }}>
        <Button
        variant='secondary'
  title="Sign Up"
  onPress={async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    navigation.navigate(RouteName.REGISTER_SCREEN);
  }}
/>

        <View style={{ height: 15 }} />
        <Button
  title="Log In"
  onPress={async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    navigation.navigate(RouteName.LOGIN_SCREEN);
  }}
/>
      </View>
    </View>
  );
};

export default WelcomeScreen;
