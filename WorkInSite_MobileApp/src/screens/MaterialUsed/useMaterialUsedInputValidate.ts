import {useState} from 'react';

interface MaterialUsedInputProps {
  siteId: string;
  materialId: string;
  quantity: string;
  workModeId: string;
  date: string;
}

const useMaterialUsedInputValidate = (props: MaterialUsedInputProps) => {
  const {siteId, materialId, workModeId, quantity, date} = props;

  const initialError = {
    siteId: '',
    materialId: '',
    workModeId: '',
    quantity: '',
    date: '',
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
    if (!siteId.trim()) updateError('siteId', 'Please select a site');
    if (!materialId.trim())
      updateError('materialId', 'Please select a material');
    if (!workModeId) updateError('workModeId', 'Please select a work mode');
    if (
      !quantity.trim() ||
      isNaN(parseFloat(quantity)) ||
      parseFloat(quantity) <= 0
    ) {
      updateError('quantity', 'Quantity is required');
    }

    if (!date) {
      updateError('date', 'Date is required');
    }

    return isValid;
  };

  return {error, validate, setError, initialError};
};

export {useMaterialUsedInputValidate};
