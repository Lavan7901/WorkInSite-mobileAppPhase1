import PinForm from '../../../components/CommonComponets/PinForm/PinForm';
import { useUserEditPinForm } from './useUserEditPinForm';

const UserEditPinForm = (props: { userId: string; navigation: any }) => {
  const { pin, setPin, otpKey, confirmPin, setConfirmPin, error, handleOnSave } =
    useUserEditPinForm(props.userId, props.navigation);
  return (
    <PinForm
      keyProp={otpKey}
      pin={pin}
      setPin={setPin}
      confirmPin={confirmPin}
      setConfirmPin={setConfirmPin}
      error={error}
      onSave={handleOnSave}
    />
  );
};

export { UserEditPinForm };
