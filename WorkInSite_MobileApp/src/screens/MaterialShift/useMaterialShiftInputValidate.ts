import {useState} from 'react';

interface MaterialShiftedInputProps {
  date: Date | null | any;
  materialId: string;
  sourceSiteId: string;
  targetSiteId: string;
  quantity: string;
}

export const useMaterialShiftInputValidate = (
  props: MaterialShiftedInputProps,
) => {
  const {date, materialId, sourceSiteId, targetSiteId, quantity} = props;

  const initialError = {
    date: '',
    materialId: '',
    sourceSiteId: '',
    targetSiteId: '',
    quantity: '',
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

    if (!date) updateError('date', 'Please select a date');
    if (!materialId.trim())
      updateError('materialId', 'Please select a material');
    if (!sourceSiteId.trim())
      updateError('sourceSiteId', 'Please select a source site');
    if (!targetSiteId.trim())
      updateError('targetSiteId', 'Please select a target site');
    if (
      !quantity.trim() ||
      isNaN(parseFloat(quantity)) ||
      parseFloat(quantity) <= 0
    ) {
      updateError('quantity', 'Quantity is required');
    }
    return isValid;
  };

  return {error, validate, setError, initialError};
};
