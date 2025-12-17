import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from 'react-native';
import Header from '../../../../components/CommonComponets/Header/Header';
import { useLanguage } from '../../../../context/LanguageContext';
import { Input } from '../../../../components/CommonComponets';
import { numberRegex } from '../../../../utils/regex';
import Textarea from '../../../../components/CommonComponets/Notes/Notes';
import DatePicker from '../../../../components/CommonComponets/DatePicker/DatePicker';
import Button from '../../../../components/CommonComponets/Button/Button';
import Loader from '../../../../components/Loader/Loader';
import PaymentMethodSelector from '../../ClientTransaction/PaymentMethodSelector/PaymentMethodSelector';
import { useSupplierTransactionEdit } from './useSupplierTransactionEdit';
import { useFocusEffect } from '@react-navigation/native';
import commonStyle from '../../../../styles/commonStyle';
import { Combo } from '../../../../components/CommonComponets/Combo/Combo';
import { usePermission } from '../../../../hook/usePermission';
import ToastNotification from '../../../../components/CommonComponets/Toast/Toast';

const SupplierTransactionEdit = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit('Supplier Transaction');

  const {
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
    hasUnsavedChanges
  } = useSupplierTransactionEdit({ navigation, id });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );


  if (loading) return <Loader />

  return (
    <View style={commonStyle.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title="Edit Supplier Transaction" onBackPress={handleBackPress} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={commonStyle.flex}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={commonStyle.inputfieldContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Combo
              label={t('Supplier')}
              items={supplierDetails}
              selectedValue={supplierId}
              onValueChange={setSupplierId}
              onSearch={fetchSuppliers}
              required
              errorMessage={error.clientId}
              isDisabled={!editable}
            />
            <DatePicker
              date={date}
              onDateChange={setDate}
              label="Date"
              required
              errorMessage={error.date}
              disable={!editable}
            />
            <Input
              title="Amount"
              placeholder="Enter Amount"
              value={amount}
              onChangeText={setAmount}
              required
              regex={numberRegex}
              maxLength={10}
              errorMessage={error.amount}
              disabled={!editable}
            />
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelect={handleSelect}
              required
              errorMessage={error.paymentMethod}
              disable={!editable}
            />
            <Textarea
              label="Remark"
              placeholder="Enter Remark"
              value={remark}
              onChange={setRemark}
              isDisabled={!editable}
            />
            <Button buttonStyle={{ marginVertical: 10 }} title="Submit" onPress={handleSubmit} disable={!editable} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SupplierTransactionEdit;


