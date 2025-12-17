import {useEffect, useState} from 'react';
import {useInputValidate} from '../Authantication/InputValidate/InputValidate';
import {useUserService} from '../../services/UserService';
import {useIsFocused} from '@react-navigation/native';
import RouteName from '../../navigation/RouteName';
import Toast from 'react-native-toast-message';

export default function usePasswordPin(navigation: any) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const isFocused = useIsFocused();
  const [otpKey, setOtpKey] = useState(Date.now()); // unique key

  const {error, validate, setError, initialError} = useInputValidate({
    pin,
    confirmPin,
  });

  const userService = useUserService();
  useEffect(() => {
    if (!isFocused) {
      setOtpKey(Date.now());
      setConfirmPin('');
      setError(initialError);
      setPin('');
    }
  }, [isFocused]);

  const handleOnSave = async () => {
    if (validate()) {
      try {
        await userService.updateProfilePin(pin);
        navigation.navigate(RouteName.PROFILE_SCREEN);
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0].message || 'Failed to Update Pin';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  const handleBackPress = () => {
    navigation.navigate(RouteName.PROFILE_SCREEN);
  };

  return {
    pin,
    setPin,
    otpKey,
    confirmPin,
    setConfirmPin,
    error,
    handleOnSave,
    handleBackPress,
  };
}
