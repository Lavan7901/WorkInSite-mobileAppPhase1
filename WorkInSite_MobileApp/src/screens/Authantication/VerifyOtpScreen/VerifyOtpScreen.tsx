
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useVerifyOtp } from './useVerifyOtp';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import PinInput from '../../../components/CommonComponets/Pin/Pin';
import Button from '../../../components/CommonComponets/Button/Button';
import commonStyle from '../../../styles/commonStyle';
import { getVerificationScreenStyles } from '../../../styles/VertificationCodeStyle';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import Icon from '../../../utils/VectorIcons';
import { Colors } from '../../../utils';

interface VerifyOtpScreenProps {
  navigation: any;
  route: {
    params: {
      phoneNumber: string;
      name?: string;
      organisationName?: string;
      password?: string;
    };
  };
}

const VerifyOtpScreen = ({ route, navigation }: VerifyOtpScreenProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const Style = getVerificationScreenStyles(theme);

  // Get params safely
  const {
    phoneNumber,
    name = '',
    organisationName = '',
    password = '',
  } = route.params || {};

  const {
    otp,
    setOtp,
    keyProp,
    loading,
    resending,
    error,
    handleVerify,
    handleResend,
    canResend,
    resendLabel,
  } = useVerifyOtp({ navigation, phoneNumber, name, organisationName, password });

  return (
    <>
      <View style={Style.headerContainer}>
        <View style={Style.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={Style.iconButton}>
            <Icon icon="Feather" name="arrow-left-circle" size={28} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[commonStyle.container, { paddingTop: 30 }]}>
        <KeyboardAvoidingView enabled>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={[commonStyle.alignContent, commonStyle.spaceBelow]}>
              <Text style={Style.headerLabel}>OTP Verification</Text>
            </View>

            <View style={commonStyle.inputfieldContainer}>
              <Text style={[Style.subtext, commonStyle.alignContent]}>
                {t('Verification code sent to')}
              </Text>
              <Text style={[Style.numtext, commonStyle.alignContent, commonStyle.spaceBelow]}>
                +91 {phoneNumber}
              </Text>

              <PinInput
                key={keyProp}
                value={otp}
                pinLength={6}
                secureTextEntry={false}
                onPinChange={setOtp}
                errorMessage={error.otp}
                boxSize={48} keyProp={0} />

              <View style={[Style.resendRow, commonStyle.spaceBelow]}>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resending || !canResend}
                >
                  <Text style={[Style.resendLink, { opacity: (resending || !canResend) ? 0.5 : 1 }]}>
                    {resendLabel}
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                title={t('Verify')}
                onPress={handleVerify}
                disable={loading || otp.length !== 6}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <ToastNotification />
    </>
  );
}

export default VerifyOtpScreen;