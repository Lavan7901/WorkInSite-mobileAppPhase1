import {useCallback, useState} from 'react';
import RouteName from '../../../../navigation/RouteName';
import {Alert} from 'react-native';
import {formatDateToString} from '../../../../utils/functions';
import {useFocusEffect} from '@react-navigation/native';
import {PaymentMethodEnum} from '../../ClientTransaction/DTOs/ClientTransaction';
import {useInputValidate} from '../../ClientTransaction/InputValidate/InputValidate';
import {WorkerTransactionProps} from '../DTOs/WorkerTransaction';
import {useWorkerService} from '../../../../services/WorkerService';
import {useWorkerTransactionService} from '../../../../services/WorkerTransactionService';
import {Worker} from '../../../Workers/DTOs/WorkerProps';
import {useLanguage} from '../../../../context/LanguageContext';
import Toast from 'react-native-toast-message';

const useWorkerTransactionEdit = ({navigation, id}: any) => {
  const workerService = useWorkerService();
  const workerTransactionService = useWorkerTransactionService();
  const {t} = useLanguage();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.CASH);
  const [workerTransaction, setWorkerTransaction] =
    useState<WorkerTransactionProps>();
  const [loading, setLoading] = useState(true);

  const {error, validate, setError, initialError} = useInputValidate({
    clientId: workerId,
    date,
    amount,
    paymentMethod,
  });

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
    amount.trim() !== workerTransaction?.amount ||
    remark.trim() !== workerTransaction?.remark ||
    workerId.trim() !== workerTransaction?.worker.id.toString() ||
    date !== workerTransaction.date ||
    paymentMethod !== workerTransaction.paymentMethod;

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setWorkerId('');
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
        const worker = {
          workerId,
          date: date.trim(),
          amount: amount.trim(),
          paymentMethod,
          remark: remark.trim(),
        };
        await workerTransactionService.updateWorkerTransaction(
          parseInt(id),
          worker,
        );
        navigation.navigate(RouteName.WORKER_TRANSACTION_LIST_SCEEN);
        resetFormFields();
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.[0]?.message ||
          'Failed to Edit Worker Transaction';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  const fetchWokrerTransaction = async () => {
    setLoading(true);
    try {
      const workerTransaction: WorkerTransactionProps =
        await workerTransactionService.getWorkerTransaction(parseInt(id));
      setAmount(workerTransaction.amount);
      setDate(workerTransaction.date);
      setWorkerId(workerTransaction.worker.id.toString());
      setPaymentMethod(workerTransaction.paymentMethod);
      setRemark(workerTransaction.remark);
      setWorkerList([workerTransaction.worker]);
      setWorkerTransaction(workerTransaction);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWokrerTransaction();
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
    workerId,
    fetchWorkers,
    workerDetails,
    setWorkerId,
    paymentMethod,
    error,
    loading,
    hasUnsavedChanges,
  };
};

export {useWorkerTransactionEdit};
