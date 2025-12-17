import {useCallback, useState} from 'react';
import {ContactListType} from '../DTOs/ContactList';
import {ContactTypes} from '../DTOs/ContactProps';
import {useContactValidate} from '../ContactValidate/ContactValidate';

const useContactCreateForm = (props: ContactListType) => {
  const {contactList, setContactList} = props;
  const [contactType, setContactType] = useState<ContactTypes | ''>('');
  const [input, setInput] = useState('');
  let {error, setError, initialError, validate, contactItems} =
    useContactValidate(input, contactType as ContactTypes);

  const getInputCount = (type: ContactTypes) =>
    contactList.contactDetails.filter(
      item => item.value && item.contactType === type,
    ).length;
  contactItems = contactItems.filter(
    (item: any) => getInputCount(item.value) !== 5,
  );

  const handleSelectChange = useCallback(
    (value: ContactTypes) => {
      setContactType(value);
      setError(initialError);
      setInput('');
    },
    [setContactType, setError, initialError],
  );

  const handleAdd = () => {
    if (validate() && setContactList) {
      const isDuplicate = contactList.contactDetails.some(
        detail =>
          detail.contactType === contactType &&
          detail.value.trim() === input.trim(),
      );
      if (isDuplicate) {
        setError(prev => ({
          ...prev,
          [contactType.toLowerCase() as keyof typeof prev]: `This ${contactType.toLowerCase()} already exists.`,
        }));
        return;
      }
      const newContactDetails = [
        ...contactList.contactDetails,
        {contactType: contactType as ContactTypes, value: input},
      ].sort((a, b) => {
        const order = [
          ContactTypes.PHONE,
          ContactTypes.EMAIL,
          ContactTypes.ADDRESS,
        ];
        return order.indexOf(a.contactType) - order.indexOf(b.contactType);
      });
      setContactList((prev: any) => ({
        ...prev,
        contactDetails: newContactDetails,
      }));
      props?.Ref?.current.close();
    }
  };

  return {
    contactType,
    contactItems,
    input,
    setInput,
    error,
    handleSelectChange,
    handleAdd,
  };
};

export {useContactCreateForm};
