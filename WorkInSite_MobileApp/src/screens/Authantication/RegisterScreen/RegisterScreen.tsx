

import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import commonStyle from '../../../styles/commonStyle';
import { useRegister } from './useRegister';
import images from '../../../images';
import Input from '../../../components/CommonComponets/Input/input';
import PinInput from '../../../components/CommonComponets/Pin/Pin';
import Button from '../../../components/CommonComponets/Button/Button';
import Loader from '../../../components/Loader/Loader';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import RouteName from '../../../navigation/RouteName';
import { numberRegex } from '../../../utils/regex';
import Styles from '../../../styles/LoginScreenStyle';

const { width, height } = Dimensions.get('window');
const containerHeight = height / 2.8;

const RegisterScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const {
    loading,
    name,
    setName,
    organisationName,
    setOrganisationName,
    phoneNumber,
    setPhoneNumber,
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    error,
    handleSubmission,
  } = useRegister({ navigation });

  return (
    <View style={commonStyle.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={Styles.scrollviewstyles}>
        <KeyboardAvoidingView enabled>
          <View style={Styles.loginScreen}>
            <View style={Styles.imageContainer}>
              <Image source={images.logo} style={Styles.loginLogo} />
            </View>

            <View style={commonStyle.inputfieldContainer}>
            
              <Input
                title={t('Name')}
                placeholder={t('Enter your name')}
                value={name}
                onChangeText={setName}
                errorMessage={error.name}
                required
              />
             
              <Input
                title={t('Phone Number')}
                placeholder={t('Enter phone number')}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                inputType="phone-pad"
                maxLength={10}
                regex={numberRegex}
                errorMessage={error.phoneNumber}
                required
              />
               <Input
                title={t('Organisation Name')}
                placeholder={t('Enter organisation name')}
                value={organisationName}
                onChangeText={setOrganisationName}
                errorMessage={error.organisationName}
                required
              />

              <PinInput
                label={t('PIN')}
                value={pin}
                pinLength={4}
                secureTextEntry
                onPinChange={setPin}
                errorMessage={error.pin}
                isRequired keyProp={0}              
              />

              <PinInput
                label={t('Confirm PIN')}
                value={confirmPin}
                pinLength={4}
                secureTextEntry
                onPinChange={setConfirmPin}
                errorMessage={error.confirmPin}
                isRequired 
                keyProp={0}             
              />

              {loading ? (
                <Loader />
              ) : (
                <Button onPress={handleSubmission} title={t('Continue')} />
              )}
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text
                style={Styles.loginLink}
                onPress={() => navigation.navigate(RouteName.LOGIN_SCREEN)}>
                {t('Already have an account?')}{" "}
                <Text
                  style={{
                    color: theme.secondaryColor,
                    fontWeight: '500',
                    textDecorationLine: 'underline',
                  }}>
                  {t('Sign in')}
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <ToastNotification />
    </View>
  );
};

export default RegisterScreen;
