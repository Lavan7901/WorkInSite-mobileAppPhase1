import {Alert} from 'react-native';
import {KycEditDeleteButtonsProp} from './DTOs';
import { useLanguage } from '../../../../context/LanguageContext';

const useKycEditDeleteButtons = ({
  details,
  setDetails,
}: KycEditDeleteButtonsProp) => {
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
      {cancelable: true},
    );
  };

  const handleDelete = (id: number) => {
    // Filter out the deleted item based on its id.
    const filteredKycDetails = details.kycDetails.filter(
      (_, index) => index !== id,
    );

    // Update the state with the filtered list.
    setDetails(prev => ({...prev, kycDetails: filteredKycDetails}));
  };

  return {confirmDelete};
};

export {useKycEditDeleteButtons};
