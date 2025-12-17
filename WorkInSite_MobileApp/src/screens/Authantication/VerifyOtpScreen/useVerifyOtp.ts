

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { RegisterService } from '../../../services/RegisterService';
import RouteName from '../../../navigation/RouteName';

export const OTP_VALIDITY_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_VERIFICATION_ATTEMPTS = 4;
export const MAX_OTP_PER_HOUR = 4;
export const RESEND_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface VerifyOtpProps {
  navigation: any;
  phoneNumber: string;
  name?: string;
  organisationName?: string;
  password?: string;
}

export const useVerifyOtp = ({
  navigation,
  phoneNumber,
  name = '',
  organisationName = '',
  password = '',
}: VerifyOtpProps) => {
  const [otp, setOtp] = useState('');
  const [keyProp, setKeyProp] = useState(0); // for re-rendering OTP input
  const [error, setError] = useState({ otp: '' });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [otpStartTime, setOtpStartTime] = useState<number | null>(null);
  const [otpTimestamps, setOtpTimestamps] = useState<number[]>([]);

  // Initialize OTP state from AsyncStorage
  useEffect(() => {
    const init = async () => {
      try {
        const storedStart = await AsyncStorage.getItem('otpStartTime');
        const storedAttempts = await AsyncStorage.getItem('attemptsCount');
        const storedTimestamps = await AsyncStorage.getItem(`otpTimestamps_${phoneNumber}`);

        setAttempts(storedAttempts ? parseInt(storedAttempts, 10) : 0);
        setOtpTimestamps(storedTimestamps ? JSON.parse(storedTimestamps) : []);

        if (storedStart) {
          const startTime = parseInt(storedStart, 10);
          setOtpStartTime(startTime);
          setTimeLeft(Math.max(OTP_VALIDITY_MS - (Date.now() - startTime), 0));
        }
      } catch (err) {
      }
    };
    init();
  }, [phoneNumber]);

  // OTP countdown timer
  useEffect(() => {
    if (!otpStartTime) return;
    const interval = setInterval(() => {
      const remaining = Math.max(OTP_VALIDITY_MS - (Date.now() - otpStartTime), 0);
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpStartTime]);

  // Format milliseconds to MM:SS
  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Verify OTP
  const handleVerify = async () => {
    if (!otp) return Toast.show({ type: 'error', text1: 'Enter OTP' });
    if (otp.length !== 6) return setError({ otp: 'Enter 6-digit OTP' });
    if (attempts >= MAX_VERIFICATION_ATTEMPTS)
      return Toast.show({ type: 'error', text1: 'Max verification attempts reached' });

    setLoading(true);
    try {
      const response = await RegisterService.verifyOtp(phoneNumber, otp);

      if (!response.success) {
        const nextAttempt = attempts + 1;
        setAttempts(nextAttempt);
        await AsyncStorage.setItem('attemptsCount', nextAttempt.toString());
        setOtp('');
        setKeyProp(prev => prev + 1);

        const left = MAX_VERIFICATION_ATTEMPTS - nextAttempt;
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP',
          text2: left > 0 ? `${left} attempts left.` : 'Wait until OTP expires.',
        });
        return;
      }

      // OTP success → mark verified
      const now = Date.now();
      await AsyncStorage.setItem(`otpVerified_${phoneNumber}`, 'true');
      await AsyncStorage.setItem(`otpVerifyTime_${phoneNumber}`, now.toString());

      // Store registration data if not already present
      const regDataStr = await AsyncStorage.getItem(`registrationData_${phoneNumber}`);
      if (!regDataStr) {
        await AsyncStorage.setItem(
          `registrationData_${phoneNumber}`,
          JSON.stringify({ name, organisationName, password })
        );
      }

      // Clear temporary OTP state
      await AsyncStorage.removeItem('otpStartTime');
      await AsyncStorage.removeItem('attemptsCount');
      await AsyncStorage.removeItem(`otpTimestamps_${phoneNumber}`);

      Toast.show({ type: 'success', text1: 'OTP verified successfully!' });
      navigation.navigate(RouteName.VERIFICATION_DONE_SCREEN, { phoneNumber });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Verification failed', text2: err.message || 'Try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    const now = Date.now();
    const recent = otpTimestamps.filter(ts => now - ts < RESEND_WINDOW_MS);
    if (recent.length >= MAX_OTP_PER_HOUR) {
      const remaining = RESEND_WINDOW_MS - (now - recent[0]);
      return Toast.show({ type: 'error', text1: 'OTP limit reached', text2: `Try again in ${formatTime(remaining)}` });
    }

    setResending(true);
    try {
      await RegisterService.sendOtp({ phone: phoneNumber.trim(), purpose: 'register' });
      const updatedTimestamps = [...recent, now];
      setOtpTimestamps(updatedTimestamps);
      await AsyncStorage.setItem(`otpTimestamps_${phoneNumber}`, JSON.stringify(updatedTimestamps));

      await AsyncStorage.setItem('otpStartTime', now.toString());
      setOtpStartTime(now);
      await AsyncStorage.setItem('attemptsCount', '0');
      setAttempts(0);

      Toast.show({ type: 'success', text1: 'OTP sent successfully!' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to send OTP' });
    } finally {
      setResending(false);
    }
  };

  // Derived states
  const canResend = otpTimestamps.filter(ts => Date.now() - ts < RESEND_WINDOW_MS).length < MAX_OTP_PER_HOUR;
  const resendLabel = timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : 'Resend OTP';

  return {
    otp,
    setOtp,
    keyProp,
    error,
    loading,
    resending,
    timeLeft,
    attempts,
    canResend,
    resendLabel,
    handleVerify,
    handleResend,
  };
};
