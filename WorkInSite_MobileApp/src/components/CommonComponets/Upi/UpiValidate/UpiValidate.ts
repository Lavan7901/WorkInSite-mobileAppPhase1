import {useState} from 'react';
import { UpiTypes } from '../DTOs/DTOs';

const useUpiValidate = (input: string, UpiType: UpiTypes) => {
  const initialError = {gpay: '', phonepe: '', upi_id: '', select: ''};
  const [error, setError] = useState(initialError);

  const upiItems = [
    {label: 'GPAY', value: UpiTypes.GPAY},
    {label: 'PHONEPE', value: UpiTypes.PHONEPE},
    {label: 'UPI ID', value: UpiTypes.UPI_ID},
  ];

  const validate = () => {
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError(prev => ({...prev, [field]: message}));
      isValid = false;
    };

    const isValidPhoneNumber = (number: string) => /^[6-9]\d{9}$/.test(number);

    switch (UpiType) {
      case UpiTypes.GPAY:
        if (!input) updateError('gpay', 'Please enter Gpay number');
        else if (input.length < 10) updateError('gpay', 'Invalid Gpay number');
        else if (!isValidPhoneNumber(input))
          updateError('gpay', 'Invalid GPay number');
        break;

      case UpiTypes.PHONEPE:
        if (!input) updateError('phonepe', 'Please enter Phonepe number');
        else if (input.length < 10)
          updateError('phonepe', 'Invalid Phonepe number');
        else if (!isValidPhoneNumber(input))
          updateError('gpay', 'Invalid GPay number');
        break;

      case UpiTypes.UPI_ID:
        if (!input) updateError('upi_id', 'Please enter Upi id');
        else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(input))
          updateError('upi_id', 'Invalid Upi id');
        break;

      default:
        setError(prev => ({...prev, select: 'Select Upi type'}));
        isValid = false;
        break;
    }

    return isValid;
  };

  return {error, setError, initialError, validate, upiItems};
};

export {useUpiValidate};
