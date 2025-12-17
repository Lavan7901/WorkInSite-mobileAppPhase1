import {useContactValidate} from '../ContactValidate/ContactValidate';
import {ContactTypes} from '../DTOs/ContactProps';
import {ContactEditFormProps} from './DTOs';
import {useState} from 'react';

const useContactEditForm = (props: ContactEditFormProps) => {
  const {contactList, setContactList, selectedItem} = props;

  const contactType = selectedItem.type;
  const [input, setInput] = useState(selectedItem.value);
  let {error, validate, contactItems, setError} = useContactValidate(
    input,
    contactType,
  );
  
  const handleUpdate = () => {
    if (!contactType || !input) return;

    const isDuplicate = contactList.contactDetails.some(
      (item, index) =>
        index !== selectedItem.id && 
        item.contactType === contactType &&
        item.value.trim().toLowerCase() === input.trim().toLowerCase(),
    );

    if (isDuplicate) {
      setError(prev => ({
        ...prev,
        [contactType.toLowerCase() as keyof typeof prev]: `This ${contactType.toLowerCase()} already exists.`,
      }));
      return;
    }

    if (validate()) {
      const updatedContactDetails = contactList.contactDetails
        .map((item, index) =>
          index === selectedItem.id ? {contactType, value: input} : item,
        )
        .sort((a, b) => {
          const order = [
            ContactTypes.PHONE,
            ContactTypes.EMAIL,
            ContactTypes.ADDRESS,
          ];
          return order.indexOf(a.contactType) - order.indexOf(b.contactType);
        });

      setContactList &&
        setContactList(prev => ({
          ...prev,
          contactDetails: updatedContactDetails,
        }));

      props?.Ref?.current.close();
    }
  };

  return {contactType, contactItems, input, setInput, error, handleUpdate};
};

export {useContactEditForm};
