import {Alert} from 'react-native';
import { useLanguage } from '../../../../context/LanguageContext';

const useBankAccountEditDeleteButtons = <T,>(
  props: BankAccountEditDeleteButtonsProp<T>,
) => {
  const {details, setDetails} = props;
  const { t } = useLanguage();

  const confirmDelete = (id: number) => {
    Alert.alert(
      t('Confirm Delete'),
      t('Are you sure you want to delete this Detail?'),
      [
        {text: t('Cancel'), style: 'cancel'},
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
    const filteredBankAccounts = details.bankAccounts.filter(
      (_, index) => index !== id,
    );
    setDetails(prev => ({...prev, bankAccounts: filteredBankAccounts}));
  };

  return {confirmDelete};
};

export {useBankAccountEditDeleteButtons};
