import {useCallback, useState} from 'react';
import {Client} from '../../../Clients/DTOs/ClientProps';
import {useClientService} from '../../../../services/ClientService';
import RouteName from '../../../../navigation/RouteName';
import {useInputValidate} from '../InputValidate/InputValidate';
import {useClientTransactionService} from '../../../../services/ClientTransactionService';
import {
  ClientTransactionProps,
  PaymentMethodEnum,
} from '../DTOs/ClientTransaction';
import {Alert} from 'react-native';
import {formatDateToString} from '../../../../utils/functions';
import {useFocusEffect} from '@react-navigation/native';
import {useLanguage} from '../../../../context/LanguageContext';
import Toast from 'react-native-toast-message';

const useClientTransactionEdit = ({navigation, id}: any) => {
  const clientService = useClientService();
  const clientTransactionService = useClientTransactionService();
  const {t} = useLanguage();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientList, setClientList] = useState<Client[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.CASH);
  const [clientTransaction, setClientTransaction] =
    useState<ClientTransactionProps>();
  const [loading, setLoading] = useState(true);

  const {error, validate, setError, initialError} = useInputValidate({
    clientId,
    date,
    amount,
    paymentMethod,
  });

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

  const today = new Date();
  const formatted = formatDateToString(today);

  const hasUnsavedChanges =
    amount.trim() !== clientTransaction?.amount ||
    remark.trim() !== clientTransaction?.remark ||
    clientId.trim() !== clientTransaction?.client.id.toString() ||
    date !== clientTransaction.date ||
    paymentMethod !== clientTransaction.paymentMethod;

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setClientId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

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
      try {
        const ClientTransaction = {
          clientId,
          date: date.trim(),
          amount: amount.trim(),
          paymentMethod,
          remark: remark.trim(),
        };

        await clientTransactionService.updateClientTransaction(
          parseInt(id),
          ClientTransaction,
        );
        navigation.navigate(RouteName.CLIENT_TRANSACTION_LIST_SCEEN);
        resetFormFields();
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.[0]?.message ||
          'Failed to Edit Client Transaction';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  const fetchClientTransaction = async () => {
    setLoading(true);
    try {
      const clientTransaction: ClientTransactionProps =
        await clientTransactionService.getClientTransaction(parseInt(id));
      setAmount(clientTransaction.amount);
      setDate(clientTransaction.date);
      setClientId(clientTransaction.client.id.toString());
      setPaymentMethod(clientTransaction.paymentMethod);
      setRemark(clientTransaction.remark);
      setClientList([clientTransaction.client]);
      setClientTransaction(clientTransaction);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchClientTransaction();
    }, [id]),
  );

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
    loading,
    hasUnsavedChanges,
  };
};

export {useClientTransactionEdit};
