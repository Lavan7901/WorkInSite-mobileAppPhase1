import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  BackHandler,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import PinInput from '../../../components/CommonComponets/Pin/Pin';
import Input from '../../../components/CommonComponets/Input/input';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import Button from '../../../components/CommonComponets/Button/Button';
import images from '../../../images';
import { useLogin } from './useLogin';
import commonStyle from '../../../styles/commonStyle';
import Styles from '../../../styles/LoginScreenStyle';
import { numberRegex } from '../../../utils/regex';
import Loader from '../../../components/Loader/Loader';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import RouteName from '../../../navigation/RouteName';
import Footer from '../../../components/Footer/Footer';

const { width, height } = Dimensions.get('window');
const containerHeight = height / 2.8;
const LoginScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const {
    pin,
    otpKey,
    phoneNumber,
    error,
    handleSubmission,
    setPhoneNumber,
    setPin,
    loading,
  } = useLogin({ navigation });
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp();
        return true;
      },
    );
    return () => {
      backHandler.remove();
    };
  }, []);
  return (
    <View style={commonStyle.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={Styles.scrollviewstyles}>
        <KeyboardAvoidingView enabled>
          <Svg
            height={containerHeight}
            width={width}
            style={Styles.gradientBackground}>
            <Polygon
              points={`0,0 ${width},0 ${width},${containerHeight} ${0},${containerHeight}`}
              fill={theme.primaryColor}
            />
            <Polygon
              points={`${0},${containerHeight} ${width},0 ${width},${containerHeight} ${0},${containerHeight}`}
              fill="white"
            />
          </Svg>
          <View style={Styles.loginScreen}>
            <View style={Styles.imageContainer}>
              <Image source={images.sign_in} style={Styles.topImage} />
              <Image source={images.logo} style={Styles.loginLogo} />
            </View>
            <View style={commonStyle.inputfieldContainer}>
              <Input
                title={t("Phone Number")}
                placeholder={t("Enter phone number")}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                inputType="numeric"
                maxLength={10}
                errorMessage={error.phoneNumber}
                required={true}
                regex={numberRegex}
              />
              <PinInput
                label={t("Pin")}
                keyProp={otpKey}
                value={pin}
                pinLength={4}
                secureTextEntry={true}
                onPinChange={setPin}
                errorMessage={error.pin}
                isRequired={true}
              />
              <View style={{ alignItems: 'flex-end' }}>
                <Text onPress={() =>
                  navigation.navigate(RouteName.FORGOT_PIN_SCREEN)
                } style={[Styles.text, { color: theme.secondaryColor }]}>{t("Forgot your PIN?")}</Text>
              </View>
              <View>
                {loading && !error.pin && !error.phoneNumber ? (
                  <Loader />
                ) : (
                  <Button onPress={handleSubmission} title={t("Sign in")} />
                )}
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={Styles.loginLink}
                onPress={() =>
                  navigation.navigate(RouteName.REGISTER_SCREEN)
                }
              >
                {t("Create new account?")}
                <Text
                  style={{
                    color: theme.secondaryColor,
                    fontWeight: '500',
                    textDecorationLine: 'underline',
                  }}>
                  {t("Sign up")}
                </Text>
              </Text>
            </View>
          </View>
          <Footer />
        </KeyboardAvoidingView>
      </ScrollView>
      <ToastNotification />
    </View>
  );
};
export default LoginScreen;
