import {useState} from 'react';

type InputProps = {
  name: string;
  phone: string;
};

const useInputValidate = (props: InputProps) => {
  const {name, phone} = props;

  const initialError = {
    name: '',
    phone: '',
  };

  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError(prev => ({...prev, [field]: message}));
      isValid = false;
    };

    if (name.length === 0) {
      updateError('name', 'Please enter name');
    } else if (
      name.length < 2 ||
      !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(name)
    ) {
      updateError('name', 'Invalid name');
    }

    if (phone.length === 0) {
      updateError('phone', 'Please enter phone number');
    } else if (!/^\d{10}$/.test(phone)) {
      updateError('phone', 'Invalid phone number');
    }

    return isValid;
  };

  return {error, validate, setError, initialError};
};

export {useInputValidate};
