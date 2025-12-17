import { Alert } from 'react-native';
import {ContactEditDeleteButtonsProps} from './DTOs';
import { useLanguage } from '../../../context/LanguageContext';

const useContactEditDeleteButtons = (props: ContactEditDeleteButtonsProps) => {
  const {contactList, setContactList} = props;
  const { t } = useLanguage();

   const confirmDelete = (id: number) => {
      Alert.alert(
        t('Confirm Delete'),
        t('Are you sure you want to delete this Detail?'),
        [
          {
            text: t('Cancel'),
            style: 'cancel',
          },
          {
            text: t('Delete'),
            style: 'destructive',
            onPress: () => handleDelete(id),
          },
        ],
        {cancelable: true}, // Allows dismissal by tapping outside
      );
    };

  const handleDelete = (id: number) => {
    const filteredContactDetails = contactList.contactDetails.filter(
      (_, index: any) => index !== id,
    );
    setContactList &&
      setContactList((prev: any) => ({
        ...prev,
        contactDetails: filteredContactDetails,
      }));
  };

  return {confirmDelete};
};

export {useContactEditDeleteButtons};
