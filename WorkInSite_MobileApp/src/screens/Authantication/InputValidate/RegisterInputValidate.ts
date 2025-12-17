
import { InputValidateProps } from './DTOs';
import { useState } from 'react';

const useRegisterInputValidate = (props: InputValidateProps) => {
  const { name, phoneNumber, organisationName, pin, confirmPin } = props;

  const initialError = {
    name: '',
    phoneNumber: '',
    organisationName: '',
    pin: '',
    confirmPin: '',
  };

  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError(prev => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (!name || name.length === 0) {
      updateError('name', 'Please enter name');
    } else if (name.length < 2 || !/^[a-zA-Z]+ ?[a-zA-Z]* ?[a-zA-Z]*$/.test(name)) {
      updateError('name', 'Invalid name');
    }

    if (!phoneNumber || phoneNumber.length === 0) {
      updateError('phoneNumber', 'Please enter phone number');
    } else if (phoneNumber.length !== 10) {
      updateError('phoneNumber', 'Phone number must be 10 digits');
    }

    if (!organisationName || organisationName.length === 0) {
      updateError('organisationName', 'Please enter organisation name');
    }

    if (!pin || pin.length === 0) {
      updateError('pin', 'Please enter pin');
    } else if (pin.length !== 4) {
      updateError('pin', 'Pin must be 4 digits');
    }

    if (!confirmPin || confirmPin.length === 0) {
      updateError('confirmPin', 'Please enter confirm pin');
    } else if (confirmPin.length !== 4) {
      updateError('confirmPin', 'Confirm pin must be 4 digits');
    } else if (pin && confirmPin && pin !== confirmPin) {
      updateError('confirmPin', 'PIN and Confirm PIN do not match');
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { useRegisterInputValidate };
