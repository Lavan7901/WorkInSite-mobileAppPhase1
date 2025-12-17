import {useState} from 'react';
import {AttendanceSplitInputProps} from '../DTOs/AttendanceSplitInputProps';

export const useAttendanceSplitInputValidate = (
  props: AttendanceSplitInputProps,
) => {
  const {workerRoleId, shiftId, noOfPersons} = props;

  const initialError = {
    workerRoleId: '',
    noOfPersons: '',
    shiftId: '',
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
    if (!workerRoleId) updateError('workerRoleId', 'Please select a work type');
    if (!shiftId) updateError('shiftId', 'Please select a Shift');
    if (!noOfPersons || isNaN(Number(noOfPersons)))
      updateError('noOfPersons', 'Enter a valid worked quantity');

    return isValid;
  };

  return {error, validate, setError, resetErrors, initialError};
};
