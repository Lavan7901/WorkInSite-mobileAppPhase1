import {useEffect, useState, useCallback} from 'react';
import {AuthHelper} from '../../helpers/AuthHelper';
import {useUserService} from '../../services/UserService';
import {useInputValidate} from '../Authantication/InputValidate/InputValidate';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import RouteName from '../../navigation/RouteName';

const useUserProfile = (navigation: any) => {
  const userService = useUserService();
  const isFocused = useIsFocused();

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const {error, validate, setError, initialError} = useInputValidate({
    name,
    phoneNumber,
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await AuthHelper.getUserProfile();
      if (profile) {
        setUser(profile);
        setName(profile.name);
        setPhoneNumber(profile.phone);
        setNotes(profile.note || '');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch profile',
      });
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchUserProfile(); // Refresh user profile when the screen is focused
    }
  }, [isFocused, fetchUserProfile]);

  const handleSubmission = async () => {
    if (validate()) {
      const userData = {
        name: name.trim(),
        phone: phoneNumber.trim(),
        note: notes.trim(),
      };
      try {
        await userService.updateProfile(userData);
        const updatedProfile = await userService.getProfile();
        AuthHelper.setUserProfile(updatedProfile);
        navigation.navigate(RouteName.PROFILE_SCREEN);
      } catch (error: any) {
        error.response.data.map((i: any) =>
          Toast.show({
            type: 'error',
            text1: i.message,
            text2: 'Invalid Request',
          }),
        );
      }
    }
  };

  const handleBackPress = () => {
    navigation.navigate(RouteName.PROFILE_SCREEN);
    setError(initialError);
  };

  return {
    name,
    setName,
    phoneNumber,
    setPhoneNumber,
    error,
    isActive,
    setIsActive,
    notes,
    setNotes,
    user,
    handleSubmission,
    fetchUserProfile,
    handleBackPress,
  };
};

export {useUserProfile};
