import { useState } from 'react';

interface PurchaseMaterialInputProps {
  materialId: any;
  quantity: string;
  rate: string;
  receivedQuality: string;
  receivedDate?: string;
  receivedQuantity: string;
}

const usePurchaseMaterialInputValidate = (
  props: PurchaseMaterialInputProps,
) => {
  const {
    materialId,
    quantity,
    rate,
    receivedQuality,
    receivedDate,
    receivedQuantity,
  } = props;

  const initialError = {
    materialId: '',
    quantity: '',
    rate: '',
    receivedQuality: '',
    receivedDate: '',
    receivedQuantity: '',
    unitId: '',
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

    if (!materialId.trim()) updateError('materialId', 'Please select a material');
    if (
      !quantity.trim() ||
      isNaN(parseFloat(quantity)) ||
      parseFloat(quantity) <= 0
    ) {
      updateError('quantity', 'Quantity is required');
    }

    if (!rate.trim() || isNaN(parseFloat(rate)) || parseFloat(rate) <= 0) {
      updateError('rate', 'Rate is required');
    }
    if (!receivedQuality.trim())
      updateError('receivedQuality', 'Received Quality is required');
    if (!(receivedDate))
      updateError('receivedDate', 'Received Date is required');
    if (
      !receivedQuantity.trim() ||
      isNaN(parseFloat(receivedQuantity)) ||
      parseFloat(receivedQuantity) <= 0
    ) {
      updateError('receivedQuantity', 'Received quantity is required');
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { usePurchaseMaterialInputValidate };

