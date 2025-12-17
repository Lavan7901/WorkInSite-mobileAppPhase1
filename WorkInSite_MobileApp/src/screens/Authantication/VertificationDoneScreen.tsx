

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { RegisterService } from '../../services/RegisterService';
import RouteName from '../../navigation/RouteName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../../utils/VectorIcons';
import commonStyle from '../../styles/commonStyle';
import { useTheme } from '../../context/ThemeContext';
import ToastNotification from '../../components/CommonComponets/Toast/Toast';

export default function VerificationDoneScreen({ navigation, route }: any) {
  const { phoneNumber } = route.params;
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const autoRegister = async () => {
      setLoading(true);
      try {
        const regDataStr = await AsyncStorage.getItem(`registrationData_${phoneNumber}`);
        if (!regDataStr) {
          Toast.show({ type: 'error', text1: 'Registration data missing' });
          navigation.reset({ index: 0, routes: [{ name: RouteName.LOGIN_SCREEN }] });
          return;
        }
        const { name, organisationName, password } = JSON.parse(regDataStr);

        const otpVerified = await AsyncStorage.getItem(`otpVerified_${phoneNumber}`);
        if (otpVerified !== 'true') {
          Toast.show({ type: 'error', text1: 'OTP not verified', text2: 'Cannot register.' });
          navigation.reset({
            index: 0,
            routes: [{ name: RouteName.VERIFY_OTP_SCREEN, params: { phoneNumber, name, organisationName, password } }],
          });
          return;
        }

        const response = await RegisterService.registerUser(name, phoneNumber, password, organisationName);

        if (response?.success) {
          Toast.show({ type: 'success', text1: 'Registered Successfully 🎉', text2: 'You can now log in.' });

          await AsyncStorage.setItem(`registrationComplete_${phoneNumber}`, 'true');
          await AsyncStorage.removeItem(`otpVerified_${phoneNumber}`);
          await AsyncStorage.removeItem(`otpVerifyTime_${phoneNumber}`);
          await AsyncStorage.removeItem('otpStartTime');
          await AsyncStorage.removeItem('attemptsCount');
          await AsyncStorage.removeItem(`otpTimestamps_${phoneNumber}`);
          navigation.reset({ index: 0, routes: [{ name: RouteName.LOGIN_SCREEN }] });
        } else {
          Toast.show({ type: 'error', text1: 'Registration failed', text2: response?.message || 'Try again.' });
        }
      } catch (err: any) {
        Toast.show({ type: 'error', text1: 'Something went wrong', text2: err?.message || 'Please try again later.' });
      } finally {
        setLoading(false);
      }
    };

    autoRegister();
  }, [phoneNumber, navigation]);

  return (
    <View style={[commonStyle.container, commonStyle.alignContent, commonStyle.inputfieldContainer]}>
      <Icon icon="Feather" name="check-circle" size={100} color={theme.primaryColor} />
      <Text style={commonStyle.titleStyle}>Verification Successful!</Text>
      <Text style={commonStyle.label}>Your phone number has been verified successfully.</Text>

      {loading && <Text style={{ marginTop: 20 }}>Registering your account...</Text>}

      <ToastNotification />
    </View>
  );
}
