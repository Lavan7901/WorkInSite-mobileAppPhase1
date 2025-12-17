


import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import images from '../../images/index';
import RouteName from '../../navigation/RouteName';
import { AuthHelper } from '../../helpers/AuthHelper';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { getSplashScreenStyles } from '../../styles/SplashScreenStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const Styles = getSplashScreenStyles(theme);
  StatusBar.setBackgroundColor(theme.primaryColor);

  useEffect(() => {
    const checkFlow = async () => {
      try {
        //  Logged-in user
        const profile = await AuthHelper.getUserProfile();
        if (profile) {
          navigation.reset({ index: 0, routes: [{ name: RouteName.Home_SCREEN }] });
          return;
        }

        //  OTP / Registration flow
        const otpPhone = await AsyncStorage.getItem('otpPhone');
        const otpVerified = otpPhone ? await AsyncStorage.getItem(`otpVerified_${otpPhone}`) : null;
        const registrationComplete = otpPhone ? await AsyncStorage.getItem(`registrationComplete_${otpPhone}`) : null;
        const regDataStr = otpPhone ? await AsyncStorage.getItem(`registrationData_${otpPhone}`) : null;

        if (otpPhone && regDataStr) {
          const { name, organisationName, password } = JSON.parse(regDataStr);

          if (registrationComplete === 'true') {
            // Already registered → go to Login (not Home)
            navigation.reset({ index: 0, routes: [{ name: RouteName.LOGIN_SCREEN }] });
            return;
          } else if (otpVerified === 'true') {
            // OTP verified → go to VerificationDoneScreen (auto-register)
            navigation.reset({
              index: 0,
              routes: [{
                name: RouteName.VERIFICATION_DONE_SCREEN,
                params: { phoneNumber: otpPhone, name, organisationName, password }
              }],
            });
            return;
          } else {
            // OTP not verified → go to Verify OTP screen
            navigation.reset({
              index: 0,
              routes: [{
                name: RouteName.VERIFY_OTP_SCREEN,
                params: { phoneNumber: otpPhone, name, organisationName, password }
              }],
            });
            return;
          }
        }

        //  Fallback: Welcome or Login
        const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
          navigation.reset({ index: 0, routes: [{ name: RouteName.WELCOME_SCREEN }] });
          return;
        }

        // Default: Login screen
        navigation.reset({ index: 0, routes: [{ name: RouteName.LOGIN_SCREEN }] });
      } catch (err) {
        navigation.reset({ index: 0, routes: [{ name: RouteName.LOGIN_SCREEN }] });
      }
    };

    setTimeout(checkFlow, 1500);
  }, [navigation, isFocused]);

  return (
    <View style={Styles.splashContainer}>
      <StatusBar barStyle="light-content" />
      <View style={Styles.splashLogoContainer}>
        <Animatable.Image
          animation="bounceIn"
          duration={2000}
          source={images.logo}
          style={Styles.splashLogo}
          resizeMode="contain"
        />
        <Animatable.Text animation="fadeInUp" delay={500} duration={1000} style={Styles.appName}>
          WorkInSite
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={1000} duration={1200} style={Styles.tagline}>
          Simplifying Construction Management
        </Animatable.Text>
      </View>
    </View>
  );
};

export default SplashScreen;
