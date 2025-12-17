import {useEffect, useState} from 'react';
import RouteName from '../../../../navigation/RouteName';
import {Alert} from 'react-native';
import {formatDateToString} from '../../../../utils/functions';
import {PaymentMethodEnum} from '../../ClientTransaction/DTOs/ClientTransaction';
import {useInputValidate} from '../../ClientTransaction/InputValidate/InputValidate';
import {useWorkerService} from '../../../../services/WorkerService';
import {useWorkerTransactionService} from '../../../../services/WorkerTransactionService';
import {Worker} from '../../../Workers/DTOs/WorkerProps';
import {useLanguage} from '../../../../context/LanguageContext';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const useWorkerTransactionCreation = ({navigation}: any) => {
  const workerService = useWorkerService();
  const workerTransactionService = useWorkerTransactionService();
  const {t} = useLanguage();
  const isFocused = useIsFocused();

  const [workerId, setWorkerId] = useState('');
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.CASH);

  const {error, validate, setError, initialError} = useInputValidate({
    clientId: workerId,
    date,
    amount,
    paymentMethod,
  });

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setWorkerId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

  useEffect(() => {
    if (!isFocused) {
      resetFormFields();
    }
  }, [isFocused]);

  const fetchWorkers = async (WorkerName: string = '') => {
    if (WorkerName) {
      const workers = await workerService.getWorkers({WorkerName});
      if (workers.items) setWorkerList(workers.items.slice(0, 3));
    }
  };

  const workerDetails = workerList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleSelect = (id: string) => {
    setPaymentMethod(id as PaymentMethodEnum);
  };

  const today = new Date();
  const formatted = formatDateToString(today);
  const hasUnsavedChanges =
    amount.trim() !== '' ||
    remark.trim() !== '' ||
    workerId !== '' ||
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
              navigation.navigate(RouteName.WORKER_TRANSACTION_LIST_SCEEN);
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.WORKER_TRANSACTION_LIST_SCEEN);
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const transaction = {
          workerId,
          date: date.trim(),
          amount: amount.trim(),
          paymentMethod,
          remark: remark.trim(),
        };
        await workerTransactionService.createWorkerTransaction(transaction);
        navigation.navigate(RouteName.WORKER_TRANSACTION_LIST_SCEEN);
        resetFormFields();
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.[0]?.message ||
          'Failed to Create Worker Transaction';
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
    workerId,
    fetchWorkers,
    workerDetails,
    setWorkerId,
    paymentMethod,
    error,
    hasUnsavedChanges,
  };
};

export {useWorkerTransactionCreation};
