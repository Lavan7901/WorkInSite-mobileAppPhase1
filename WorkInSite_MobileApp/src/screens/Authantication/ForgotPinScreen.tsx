import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Toast from 'react-native-toast-message';
import Header from '../../components/CommonComponets/Header/Header';
import Button from '../../components/CommonComponets/Button/Button';
import { numberRegex } from '../../utils/regex';
import Input from '../../components/CommonComponets/Input/input';
import commonStyle from '../../styles/commonStyle';

export default function ForgotPinScreen({ navigation }: any) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBackPress = () => {
    navigation.navigate("LoginScreen");
  };

  const handleRequestReset = async () => {
    if (!phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your phone number.',
      });
      return;
    }

    setLoading(true);
    try {
      // Call your API here to send OTP
      // await AuthService.requestResetPin(phoneNumber);
      Toast.show({
        type: 'success',
        text1: 'A reset link/code has been sent to your phone.',
      });
      navigation.navigate('VerifyOtpScreen', { phoneNumber });
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Failed to send reset PIN.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header
        title={t('Forgot PIN')}
        onBackPress={handleBackPress}
      />

      <View style={[commonStyle.container]}>
        <KeyboardAvoidingView enabled>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={[commonStyle.content,commonStyle.inputfieldContainer]}>
              <Text style={[commonStyle.title,commonStyle.spaceBelow, ,commonStyle.alignContent ,{ color: theme.secondaryColor }]}>
                {t('Reset your PIN')}
              </Text>

              <Text style={[commonStyle.description,commonStyle.spaceBelow,commonStyle.alignContent]}>
                {t(
                  'Enter your registered phone number. We will send you a code to reset your PIN.'
                )}
              </Text>

              <Input
                 title={t("Phone Number")}
                 placeholder={t("Enter phone number")}
                 value={phoneNumber}
                 onChangeText={setPhoneNumber}
                 inputType="phone-pad"
                 maxLength={10}
                 regex={numberRegex}
              />

              <Button
                title={loading ? t('Sending...') : t('Send Reset Code')}
                buttonStyle={{
                  marginTop: 30
                }}
                onPress={handleRequestReset}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

