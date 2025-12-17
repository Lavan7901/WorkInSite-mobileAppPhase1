import {MutableRefObject, useEffect, useState} from 'react';
import {useUserService} from '../../../services/UserService';
import {useInputValidate} from '../../Authantication/InputValidate/InputValidate';
import {UserBase} from '../DTOs/UserBase';
import RouteName from '../../../navigation/RouteName';
import Toast from 'react-native-toast-message';
import {useRoleService} from '../../../services/RoleService';
import {useRoute} from '@react-navigation/native';

const useUserCreationPinForm = (
  userDetail: UserBase,
  navigation?: any,
  redirect?: string,
  bottomSheetRef?: MutableRefObject<any>,
) => {
  const route = useRoute<any>();
  const siteId = route.params?.siteId;
  const userService = useUserService();
  const {name, phone, roleId, roleName} = userDetail; // ✅ include roleName too

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const {error, validate} = useInputValidate({pin, confirmPin});
  const [otpKey, setOtpKey] = useState(Date.now());
  const [roleList, setRoleList] = useState<any[]>([]);
  const roleService = useRoleService();

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

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOnSave = async () => {
    if (!validate()) {
      return;
    }
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        roleId,
        password: pin.trim(),
        language: 'en',
      };
      const response = await userService.createUser(payload);
      setOtpKey(Date.now());
      if (redirect) {
        const selectedRole =
          roleList.find(r => r.value.toString() === roleId?.toString())
            ?.label ||
          roleName ||
          '';

        const newSupervisor = {
          id: response.id,
          name,
          phone,
          roleId: Number(roleId),
          roleName: selectedRole,
        };
        navigation.navigate({
          name: redirect,
          params: {newSupervisor},
          merge: true,
        });
        bottomSheetRef?.current?.close?.();
        return;
      }

      navigation.navigate(RouteName.USER_LIST_SCREEN);
    } catch (error: any) {
      bottomSheetRef?.current?.close?.();
      error?.response?.data?.forEach((i: any) =>
        Toast.show({
          type: 'error',
          text1: 'Invalid Request',
          text2: i.message,
        }),
      );
    }
  };

  return {
    pin,
    setPin,
    otpKey,
    setOtpKey,
    confirmPin,
    setConfirmPin,
    error,
    handleOnSave,
  };
};

export {useUserCreationPinForm};
