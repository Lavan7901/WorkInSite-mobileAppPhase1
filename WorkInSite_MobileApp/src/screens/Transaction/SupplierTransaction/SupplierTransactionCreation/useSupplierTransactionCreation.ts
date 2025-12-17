import {useEffect, useState} from 'react';
import RouteName from '../../../../navigation/RouteName';
import {Alert} from 'react-native';
import {formatDateToString} from '../../../../utils/functions';
import {PaymentMethodEnum} from '../../ClientTransaction/DTOs/ClientTransaction';
import {useInputValidate} from '../../ClientTransaction/InputValidate/InputValidate';
import {useSupplierService} from '../../../../services/SupplierService';
import {useSupplierTransactionService} from '../../../../services/SupplierTransactionService';
import {Supplier} from '../../../Suppliers/DTOs/SupplierProps';
import {useLanguage} from '../../../../context/LanguageContext';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const useSupplierTransactionCreation = ({navigation}: any) => {
  const supplierService = useSupplierService();
  const supplierTransactionService = useSupplierTransactionService();
  const {t} = useLanguage();
  const isFocused = useIsFocused();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.CASH);

  const {error, validate, setError, initialError} = useInputValidate({
    clientId: supplierId,
    date,
    amount,
    paymentMethod,
  });

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setSupplierId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

  useEffect(() => {
    if (!isFocused) {
      resetFormFields();
    }
  }, [isFocused]);

  const fetchSuppliers = async (searchString: string = '') => {
    if (searchString) {
      const suppliers = await supplierService.getSuppliers(searchString);
      if (suppliers) setSupplierList(suppliers.slice(0, 3));
    }
  };

  const supplierDetails = supplierList.map(item => ({
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
    supplierId !== '' ||
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
              navigation.navigate(RouteName.SUPPLIER_TRANSACTION_LIST_SCEEN);
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.SUPPLIER_TRANSACTION_LIST_SCEEN);
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const transaction = {
          supplierId,
          date: date.trim(),
          amount: amount.trim(),
          paymentMethod,
          remark: remark.trim(),
        };
        await supplierTransactionService.createSupplierTransaction(transaction);
        navigation.navigate(RouteName.SUPPLIER_TRANSACTION_LIST_SCEEN);
        resetFormFields();
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.[0]?.message ||
          'Failed to Create Supplier Transaction';
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
    supplierId,
    fetchSuppliers,
    supplierDetails,
    setSupplierId,
    paymentMethod,
    error,
    hasUnsavedChanges,
  };
};

export {useSupplierTransactionCreation};
