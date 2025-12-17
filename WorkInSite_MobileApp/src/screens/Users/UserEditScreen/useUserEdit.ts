import {useState, useEffect} from 'react';
import {useInputValidate} from '../../Authantication/InputValidate/InputValidate';
import {User} from '../DTOs/User';
import {useUserService} from '../../../services/UserService';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import {useLanguage} from '../../../context/LanguageContext';
import {useRoleService} from '../../../services/RoleService';

const useUserEdit = (id: string, navigation: any) => {
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [roleList, setRoleList] = useState<any[]>([]);

  const {t} = useLanguage();
  const {error, validate, setError, initialError} = useInputValidate({
    name,
    phoneNumber,
    role,
  });
  const userService = useUserService();
  const roleService = useRoleService();
  const isFocused = useIsFocused();

  // 🧠 Fetch user details
  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUser(parseInt(id));
      if (userData) {
        setName(userData.name);
        setPhoneNumber(userData.phone);
        setNotes(userData.note);
        setUser(userData);
        setRole(userData.role.id.toString());
        setIsActive(userData.isActive);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUser();
      fetchRoles();
    }
  }, [isFocused]);

  // 🧠 Fetch roles — for display (not editing)
  const fetchRoles = async () => {
    try {
      const data = await roleService.getRoles({ignorePagination: true});
      const rolesData = data?.items || [];

      const formattedRoles = rolesData.map((item: any) => ({
        label: item.name,
        value: item.id.toString(),
      }));

      if (
        user?.role &&
        !formattedRoles.some(
          (r: {value: string}) => r.value === user.role.id.toString(),
        )
      ) {
        formattedRoles.push({
          label: user.role.name,
          value: user.role.id.toString(),
        });
      }

      setRoleList(formattedRoles);
    } catch {
      setRoleList([]);
    }
  };

  const handleSubmission = async () => {
    const userData = {
      name: name?.trim(),
      phone: phoneNumber?.trim(),
      roleId: Number(role),
      isActive: isActive,
      note: notes?.trim() || '',
    };
    if (validate()) {
      try {
        await userService.updateUser(parseInt(id), userData);
        navigation.navigate(RouteName.USER_LIST_SCREEN);
      } catch (error: any) {
        error.response.data.map((i: any) =>
          Toast.show({
            type: 'error',
            text1: 'Invalid Request',
            text2: i.message || 'Failed to Edit User',
          }),
        );
      }
    }
  };

  const hasUnsavedChanges =
    name.trim() !== user?.name ||
    phoneNumber.trim() !== user?.phone ||
    Number(role) !== user?.role?.id ||
    isActive !== user?.isActive ||
    notes !== user?.note;

  const handleBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save before exiting?'),
        [
          {
            text: t('Save'),
            onPress: () => {
              handleSubmission();
            },
          },
          {
            text: t('Exit Without Saving'),
            onPress: () => {
              navigation.navigate(RouteName.USER_LIST_SCREEN);
              setError(initialError);
            },
          },
          {
            text: t('Cancel'),
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      navigation.navigate(RouteName.USER_LIST_SCREEN);
    }
    return true;
  };

  return {
    setName,
    setPhoneNumber,
    setRole,
    isActive,
    setIsActive,
    setNotes,
    error,
    user,
    name,
    phoneNumber,
    role,
    notes,
    handleSubmission,
    setLoading,
    roleList,
    loading,
    hasUnsavedChanges,
    handleBack,
  };
};

export {useUserEdit};
