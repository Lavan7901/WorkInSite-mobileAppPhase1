import {useCallback, useState} from 'react';
import RouteName from '../../../../navigation/RouteName';
import {Alert} from 'react-native';
import {formatDateToString} from '../../../../utils/functions';
import {useFocusEffect} from '@react-navigation/native';
import {PaymentMethodEnum} from '../../ClientTransaction/DTOs/ClientTransaction';
import {SupplierTransactionProps} from '../DTOs/SupplierTransaction';
import {useSupplierService} from '../../../../services/SupplierService';
import {useSupplierTransactionService} from '../../../../services/SupplierTransactionService';
import {useInputValidate} from '../../ClientTransaction/InputValidate/InputValidate';
import {Supplier} from '../../../Suppliers/DTOs/SupplierProps';
import {useLanguage} from '../../../../context/LanguageContext';
import Toast from 'react-native-toast-message';

const useSupplierTransactionEdit = ({navigation, id}: any) => {
  const supplierService = useSupplierService();
  const supplierTransactionService = useSupplierTransactionService();
  const {t} = useLanguage();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.CASH);
  const [supplierTransaction, setSupplierTransaction] =
    useState<SupplierTransactionProps>();
  const [loading, setLoading] = useState(true);

  const {error, validate, setError, initialError} = useInputValidate({
    clientId: supplierId,
    date,
    amount,
    paymentMethod,
  });

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
    amount.trim() !== supplierTransaction?.amount ||
    remark.trim() !== supplierTransaction?.remark ||
    supplierId.trim() !== supplierTransaction?.supplier.id.toString() ||
    date !== supplierTransaction.date ||
    paymentMethod !== supplierTransaction.paymentMethod;

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setSupplierId('');
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

  const fetchSupplierTransaction = async () => {
    setLoading(true);
    try {
      const supplierTransaction: SupplierTransactionProps =
        await supplierTransactionService.getSupplierTransaction(parseInt(id));
      setAmount(supplierTransaction.amount);
      setDate(supplierTransaction.date);
      setSupplierId(supplierTransaction.supplier.id.toString());
      setPaymentMethod(supplierTransaction.paymentMethod);
      setRemark(supplierTransaction.remark);
      setSupplierList([supplierTransaction.supplier]);
      setSupplierTransaction(supplierTransaction);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSupplierTransaction();
    }, [id]),
  );

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const supplier = {
          supplierId,
          date: date.trim(),
          amount: amount.trim(),
          paymentMethod,
          remark: remark.trim(),
        };
        await supplierTransactionService.updateSupplierTransaction(
          parseInt(id),
          supplier,
        );
        navigation.navigate(RouteName.SUPPLIER_TRANSACTION_LIST_SCEEN);
        resetFormFields();
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.[0]?.message ||
          'Failed to Edit Supplier Transaction';
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
    loading,
    hasUnsavedChanges,
  };
};

export {useSupplierTransactionEdit};
