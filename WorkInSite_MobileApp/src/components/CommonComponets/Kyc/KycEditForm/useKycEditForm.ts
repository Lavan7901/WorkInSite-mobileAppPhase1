import { useKycValidate } from '../KycValidate/KycValidate';
import { KycEditFormProps } from './DTOs';
import { useState } from 'react';

const useKycEditForm = (props: KycEditFormProps) => {
  const { details, setDetails, selectedItem } = props;

  const kycType = selectedItem.type;

  const [input, setInput] = useState(selectedItem.value);
  const { error, validate, kycItems } = useKycValidate(input, kycType);

  const handleUpdate = () => {
      if (validate()) {
        // Dynamically update kycDetails based on the passed details
        const updatedKycDetails = details.kycDetails.map((item, index) =>
          index === selectedItem.id ? { ...item, kycType, value: input } : item
        );
        setDetails(prev => ({ ...prev, kycDetails: [...updatedKycDetails] }));
        props.Ref?.current?.close();
      }
    };

  return { kycType, kycItems, input, setInput, error, handleUpdate };
};

export { useKycEditForm };
