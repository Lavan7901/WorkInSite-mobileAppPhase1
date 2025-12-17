import {useState} from 'react';
import {useUpiValidate} from '../UpiValidate/UpiValidate';
import {UpiDetails, UpiEditFormProps} from './DTOs';

const useUpiEditForm = <T extends {upiDetails: UpiDetails[]}>(
  props: UpiEditFormProps<T>,
) => {
  const {details, setDetails, selectedItem} = props;
  const upiType = selectedItem.type;
  const [input, setInput] = useState(selectedItem.value);
  const {error, validate, upiItems} = useUpiValidate(input, upiType);

  const handleUpdate = () => {
    if (validate()) {
      const updatedUpiDetails = details.upiDetails.map((item, index) =>
        index === selectedItem.id ? {upiType, value: input} : item,
      );
      setDetails(prev => ({...prev, upiDetails: updatedUpiDetails}));
      props.Ref?.current.close();
    }
  };

  return {upiType, upiItems, input, setInput, error, handleUpdate};
};

export {useUpiEditForm};
