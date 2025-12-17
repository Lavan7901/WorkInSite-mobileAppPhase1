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
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../../components/CommonComponets/Header/Header';
import Loader from '../../../../components/Loader/Loader';
import { Input } from '../../../../components/CommonComponets';
import { Combo } from '../../../../components/CommonComponets/Combo/Combo';
import Textarea from '../../../../components/CommonComponets/Notes/Notes';
import DatePicker from '../../../../components/CommonComponets/DatePicker/DatePicker';
import Button from '../../../../components/CommonComponets/Button/Button';
import PaymentMethodSelector from '../PaymentMethodSelector/PaymentMethodSelector';
import { useClientTransactionEdit } from './useClientTransactionEdit';
import { useLanguage } from '../../../../context/LanguageContext';
import { usePermission } from '../../../../hook/usePermission';
import { numberRegex } from '../../../../utils/regex';
import commonStyle from '../../../../styles/commonStyle';
import ToastNotification from '../../../../components/CommonComponets/Toast/Toast';

const ClientTransactionEdit = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit('Client Transaction');

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
    clientId,
    fetchClients,
    clientDetails,
    setClientId,
    paymentMethod,
    error,
    loading,
    hasUnsavedChanges,
  } = useClientTransactionEdit({ navigation, id });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [hasUnsavedChanges, handleBackPress])
  );

  if (loading) return <Loader />;

  return (
    <View style={commonStyle.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t('Edit Client Transaction')} onBackPress={handleBackPress} />
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
              label={t('Client')}
              items={clientDetails}
              selectedValue={clientId}
              onValueChange={setClientId}
              onSearch={fetchClients}
              required
              errorMessage={error.clientId}
              isDisabled={!editable}
            />
            <DatePicker
              label={t('Date')}
              date={date}
              onDateChange={setDate}
              required
              errorMessage={error.date}
              disable={!editable}
            />
            <Input
              title={t('Amount')}
              placeholder={t('Enter Amount')}
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
              label={t('Remark')}
              placeholder={t('Enter Remark')}
              value={remark}
              onChange={setRemark}
              isDisabled={!editable}
            />
            <Button
              title={t('Submit')}
              onPress={handleSubmit}
              buttonStyle={{ marginVertical: 10 }}
              disable={!editable}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ClientTransactionEdit;

