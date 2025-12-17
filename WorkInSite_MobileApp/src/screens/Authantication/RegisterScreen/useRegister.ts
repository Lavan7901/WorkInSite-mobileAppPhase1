

import { useState } from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterService } from '../../../services/RegisterService';
import RouteName from '../../../navigation/RouteName';
import { useRegisterInputValidate } from './../InputValidate/RegisterInputValidate';

export const OTP_VALIDITY_MS = 10 * 60 * 1000;
export const MAX_OTP_PER_HOUR = 4;
export const RESEND_WINDOW_MS = 60 * 60 * 1000;

export const useRegister = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const { error, validate } = useRegisterInputValidate({ name, organisationName, phoneNumber, pin, confirmPin });

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  const handleSubmission = async () => {
    if (!validate()) {
      Toast.show({ type: 'error', text1: 'Please fill all fields correctly.' });
      return;
    }
    if (pin !== confirmPin) {
      Toast.show({ type: 'error', text1: 'PIN and Confirm PIN do not match.' });
      return;
    }

    setLoading(true);
    try {
      const trimmedPhone = phoneNumber.trim();
      const now = Date.now();

      // 1️ Check if phone already exists
      const phoneExists = await RegisterService.checkUserExists(trimmedPhone);
      if (phoneExists) {
        Toast.show({
          type: 'info',
          text1: 'Phone already registered',
          text2: 'Please login instead of registering',
        });
        return;
      }

      //  Check resend limits
      const resendWindowStart = await AsyncStorage.getItem('resendWindowStart');
      const resendCount = await AsyncStorage.getItem('resendCount');
      const parsedWindowStart = resendWindowStart ? parseInt(resendWindowStart, 10) : now;
      const parsedCount = resendCount ? parseInt(resendCount, 10) : 0;
      const withinHour = now - parsedWindowStart < RESEND_WINDOW_MS;

      if (withinHour && parsedCount >= MAX_OTP_PER_HOUR) {
        const remaining = RESEND_WINDOW_MS - (now - parsedWindowStart);
        Toast.show({ type: 'error', text1: 'OTP limit reached!', text2: `Try again in ${formatTime(remaining)}` });
        return;
      }

      //  Save registration data temporarily
      await AsyncStorage.setItem(`registrationData_${trimmedPhone}`, JSON.stringify({
        name: name.trim(),
        organisationName: organisationName.trim(),
        password: pin.trim()
      }));

      //  Send OTP
      await RegisterService.sendOtp({ phone: trimmedPhone, purpose: 'register' });
      await AsyncStorage.setItem('otpStartTime', now.toString());
      await AsyncStorage.setItem('otpPhone', trimmedPhone);
      await AsyncStorage.setItem('attemptsCount', '0');

      //  Update resend tracking
      if (!withinHour) {
        await AsyncStorage.setItem('resendWindowStart', now.toString());
        await AsyncStorage.setItem('resendCount', '1');
      } else {
        await AsyncStorage.setItem('resendCount', (parsedCount + 1).toString());
      }

      Toast.show({ type: 'success', text1: 'OTP sent successfully!', text2: 'Valid for 10 minutes.' });
      navigation.navigate(RouteName.VERIFY_OTP_SCREEN, { phoneNumber: trimmedPhone });

    } catch (error: any) {
      Toast.show({ type: 'error', text1:'Error',text2: error.message || 'Failed to send Otp' });
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    organisationName, setOrganisationName,
    phoneNumber, setPhoneNumber,
    pin, setPin,
    confirmPin, setConfirmPin,
    loading,
    handleSubmission,
    error
  };
};
