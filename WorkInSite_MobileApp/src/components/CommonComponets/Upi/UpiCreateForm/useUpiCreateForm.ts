import {useState, useCallback} from 'react';
import {UpiTypes} from '../DTOs/DTOs';
import {useUpiValidate} from '../UpiValidate/UpiValidate';

export const useUpiCreateForm = <
  T extends {upiDetails: {upiType: UpiTypes; value: string}[]},
>(
  details: T,
  setDetails: React.Dispatch<React.SetStateAction<T>>,
  Ref?: React.RefObject<{close: () => void}>,
) => {
  const [upiType, setUpiType] = useState<UpiTypes | ''>('');
  const [input, setInput] = useState('');
  const {error, setError, initialError, validate, upiItems} = useUpiValidate(
    input,
    upiType as UpiTypes,
  );

  const getInputCount = useCallback(
    (type: UpiTypes) =>
      details.upiDetails.filter(item => item.value && item.upiType === type)
        .length,
    [details],
  );

  const filteredUpiItems = upiItems.filter(
    item => getInputCount(item.value) === 0,
  );

  const handleSelectChange = useCallback(
    (value: UpiTypes) => {
      setUpiType(value);
      setError(initialError);
      setInput('');
    },
    [setUpiType, setError, setInput, initialError],
  );

  const handleAdd = () => {
    if (validate()) {
      setDetails(prev => ({
        ...prev,
        upiDetails: [
          ...prev.upiDetails,
          {upiType: upiType as UpiTypes, value: input},
        ],
      }));
      Ref?.current?.close();
    }
  };

  return {
    upiType,
    upiItems: filteredUpiItems,
    input,
    setInput,
    error,
    handleSelectChange,
    handleAdd,
  };
};
