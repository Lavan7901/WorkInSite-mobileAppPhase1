import {useEffect, useState} from 'react';
import {Client} from '../../../Clients/DTOs/ClientProps';
import {useClientService} from '../../../../services/ClientService';
import RouteName from '../../../../navigation/RouteName';
import {useInputValidate} from '../InputValidate/InputValidate'; // path as per your structure
import {useClientTransactionService} from '../../../../services/ClientTransactionService';
import {PaymentMethodEnum} from '../DTOs/ClientTransaction';
import {Alert} from 'react-native';
import {formatDateToString} from '../../../../utils/functions';
import {useLanguage} from '../../../../context/LanguageContext';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const useClientTransactionCreation = ({navigation}: any) => {
  const clientService = useClientService();
  const clientTransactionService = useClientTransactionService();
  const {t} = useLanguage();
  const isFocused = useIsFocused();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientList, setClientList] = useState<Client[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.CASH);

  const {error, validate, setError, initialError} = useInputValidate({
    clientId,
    date,
    amount,
    paymentMethod,
  });

  const today = new Date();
  const formatted = formatDateToString(today);
  
  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setClientId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

  useEffect(() => {
    if (!isFocused) {
      resetFormFields();
    }
  }, [isFocused]);

  const fetchClients = async (searchString: string = '') => {
    if (searchString) {
      const clients = await clientService.getClients(searchString, false);
      if (clients) setClientList(clients.slice(0, 3));
    }
  };

  const clientDetails = clientList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleSelect = (id: string) => {
    setPaymentMethod(id as PaymentMethodEnum);
  };

  const hasUnsavedChanges =
    amount.trim() !== '' ||
    remark.trim() !== '' ||
    clientId !== '' ||
    date !== formatted ||
    paymentMethod !== PaymentMethodEnum.CASH;

  const handleBackPress = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
        [
          {text: 'Cancel', style: 'cancel'},
          {text: t('Save'), onPress: () => handleSubmit()},
          {
            text: t('Exit Without Save'),
            onPress: () => {
              resetFormFields();
              navigation.navigate(RouteName.CLIENT_TRANSACTION_LIST_SCEEN);
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.CLIENT_TRANSACTION_LIST_SCEEN);
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const transaction = {
        clientId,
        date: date.trim(),
        amount: amount.trim(),
        paymentMethod,
        remark: remark.trim(),
      };
      try {
        await clientTransactionService.createClientTransaction(transaction);
        navigation.navigate(RouteName.CLIENT_TRANSACTION_LIST_SCEEN);
        resetFormFields();
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.[0]?.message ||
          'Failed to Create Client Transaction';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  return {
    handleBackPress,
    handleSelect,
    handleSubmit,
    amount,
    setAmount,
    remark,
    setRemark,
    date,
    setDate,
    clientId,
    fetchClients,
    clientDetails,
    setClientId,
    paymentMethod,
    error,
    hasUnsavedChanges,
  };
};

export {useClientTransactionCreation};
