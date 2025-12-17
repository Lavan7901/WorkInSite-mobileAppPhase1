import React from 'react';
import { View, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useChangePin from './useChangePin';
import PinForm from '../../components/CommonComponets/PinForm/PinForm';
import Header from '../../components/CommonComponets/Header/Header';
import commonStyle from '../../styles/commonStyle';
import { useLanguage } from '../../context/LanguageContext';
import ToastNotification from '../../components/CommonComponets/Toast/Toast';

export default function ChangePinScreen({ navigation }: any) {
  const { t } = useLanguage();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation]),
  );
  const {
    pin,
    otpKey,
    setPin,
    confirmPin,
    setConfirmPin,
    error,
    handleOnSave,
    handleBackPress,
  } = useChangePin(navigation);

  return (
    <View style={commonStyle.container}>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Change PIN")} onBackPress={handleBackPress} />
      <View style={commonStyle.inputfieldContainer}>
        <PinForm
          keyProp={otpKey} // force remount
          pin={pin}
          setPin={setPin}
          confirmPin={confirmPin}
          setConfirmPin={setConfirmPin}
          error={error}
          onSave={handleOnSave}
        />
      </View>
    </View>
  );
}
