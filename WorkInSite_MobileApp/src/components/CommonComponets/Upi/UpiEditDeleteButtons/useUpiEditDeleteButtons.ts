import {Alert} from 'react-native';
import { useLanguage } from '../../../../context/LanguageContext';

export const useUpiEditDeleteButtons = <T extends { upiDetails: any[] }>(
  details: T,
  setDetails: React.Dispatch<React.SetStateAction<T>>
) => {
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
      { cancelable: true }
    );
  };

  const handleDelete = (id: number) => {
    const filteredDetails = details.upiDetails.filter(
      (_, index) => index !== id
    );
    setDetails(prev => ({ ...prev, upiDetails: filteredDetails }));
  };

  return { confirmDelete };
};
