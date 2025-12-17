import {useState} from 'react';
import {useUserService} from '../../../services/UserService';
import {useInputValidate} from '../../Authantication/InputValidate/InputValidate';
import RouteName from '../../../navigation/RouteName';

const useUserEditPinForm = (userId: string, navigation: any) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otpKey, setOtpKey] = useState(Date.now()); // unique key

  const {error, validate} = useInputValidate({pin, confirmPin});
  const userService = useUserService();

  const handleOnSave = async () => {
    if (validate()) {
      await userService.updatePin(parseInt(userId), pin);
      navigation.navigate(RouteName.USER_LIST_SCREEN);
      setOtpKey(Date.now());
    }
  };

  return {pin, setPin,otpKey, confirmPin, setConfirmPin, error, handleOnSave};
};

export {useUserEditPinForm};
