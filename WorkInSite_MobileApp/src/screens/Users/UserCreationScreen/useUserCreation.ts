import {useEffect, useState, useCallback} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useLanguage} from '../../../context/LanguageContext';
import {useRoleService} from '../../../services/RoleService';
import RouteName from '../../../navigation/RouteName';
import {useInputValidate} from '../../Authantication/InputValidate/InputValidate';

export const useUserCreation = (
  redirect: string,
  navigation: any,
  handleSave: () => void,
) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [roleList, setRoleList] = useState<any[]>([]);
  const isFocused = useIsFocused();

  const {t} = useLanguage();

  const {error, validate, setError, initialError} = useInputValidate({
    name,
    phoneNumber,
    role,
  });

  const roleService = useRoleService();

  const userDetail = {
    name,
    phone: phoneNumber,
    roleId: Number(role),
  };

  const fetchRoles = async () => {
    try {
      const data = await roleService.getRoles({ignorePagination: true});
      const rolesData = data?.items || data || [];

      const formattedRoles = rolesData.map((item: any) => ({
        label: item.name,
        value: item.id.toString(),
      }));

      setRoleList(formattedRoles);
    } catch (error) {
      setRoleList([]);
    }
  };
  
  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setRole('');
    setError(initialError);
  };

  useEffect(() => {
    if (isFocused) {
      fetchRoles();
    } else {
      resetForm();
    }
  }, [isFocused]);

  const hasUnsavedChanges =
    name.trim() !== '' || phoneNumber.trim() !== '' || role !== '';

  const handleBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save before exiting?'),
        [
          {text: t('Save'), onPress: () => handleSave()},
          {
            text: t('Exit Without Saving'),
            onPress: () => {
              resetForm();
              navigation.navigate(redirect || RouteName.USER_LIST_SCREEN);
            },
          },
          {text: t('Cancel'), style: 'cancel'},
        ],
        {cancelable: true},
      );
    } else {
      resetForm();
      navigation.navigate(redirect || RouteName.USER_LIST_SCREEN);
    }
    return true;
  };

  return {
    name,
    setName,
    phoneNumber,
    setPhoneNumber,
    role,
    setRole,
    roleList,
    error,
    validate,
    userDetail,
    handleBack,
    hasUnsavedChanges,
  };
};
