import React from 'react';
import { View, Text } from 'react-native';
import PinInput from '../Pin/Pin';
import { PinFormProps } from './DTOs';
import Button from '../Button/Button';
import { useLanguage } from '../../../context/LanguageContext';
import commonStyle from '../../../styles/commonStyle';

const PinForm = ({
  pin,
  setPin,
  confirmPin,
  setConfirmPin,
  error,
  onSave,
  keyProp
}: PinFormProps) => {
  const { t } = useLanguage();
  return (
    <View style={commonStyle.gapContainer}>
      <PinInput
        label='New Pin'
        keyProp={keyProp}
        value={pin}
        onPinChange={setPin}
        secureTextEntry={true}
        errorMessage={error.pin}
      />
      <PinInput
        label='Confirm Pin'
        keyProp={keyProp}
        value={confirmPin}
        onPinChange={setConfirmPin}
        secureTextEntry={true}
        errorMessage={error.confirmPin}
      />
      <View>
        <Button title={t("Save")} onPress={onSave} />
      </View>
    </View>
  );
};


export default PinForm;