import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Input from '../../../components/CommonComponets/Input/input';
import Header from '../../../components/CommonComponets/Header/Header';
import Button from '../../../components/CommonComponets/Button/Button';
import { useUserEdit } from './useUserEdit';
import { UserEditPinForm } from '../UserEditPinForm/UserEditPinForm';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import Switch from '../../../components/CommonComponets/Switch/Switch';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { useFocusEffect } from '@react-navigation/native';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import commonStyle from '../../../styles/commonStyle';
import { nameRegex, numberRegex } from '../../../utils/regex';
import Loader from '../../../components/Loader/Loader';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getCreateAndEditScreenStyles } from '../../../styles/CreateAndEditScreenStyle';
import RoleSelect from '../../../components/CommonComponets/RoleSelect/RoleSelect';

const UserEditScreen = ({ route, navigation }: any) => {
  const { urlName } = route.params;
  const { t } = useLanguage();

  const {
    setName,
    setPhoneNumber,
    setRole,
    isActive,
    setIsActive,
    setNotes,
    name,
    phoneNumber,
    role,
    notes,
    error,
    user,
    loading,
    handleSubmission,
    roleList,
    handleBack,
    hasUnsavedChanges,
  } = useUserEdit(urlName as string, navigation);
  const { theme } = useTheme()
  const Style = getCreateAndEditScreenStyles(theme)
  const bottomSheetRef = useRef<any>(null);

  const handleChangePin = () => {
    bottomSheetRef.current?.open();
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBack();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header title={t("Edit User")} onBackPress={handleBack} />
      <View style={commonStyle.container}>
        <View style={commonStyle.toast}>
          <ToastNotification />
        </View>
        {user && (
          <KeyboardAvoidingView enabled={true} behavior="padding">
            <ScrollView keyboardShouldPersistTaps="handled">

              <View style={commonStyle.inputfieldContainer}>
                <View style={Style.PinConatiner}>
                  <TouchableOpacity
                    style={Style.PinButton}
                    onPress={handleChangePin}>
                    <Text style={Style.PinLabel}>{t("Change PIN")}</Text>
                  </TouchableOpacity>
                </View>
                <Input
                  title={t("Name")}
                  placeholder={t("Enter name")}
                  value={name}
                  onChangeText={setName}
                  errorMessage={error.name}
                  required={true}
                  inputContainerStyle={{ height: 50 }}
                  regex={nameRegex}
                />
                <Input
                  title={("Phone Number")}
                  placeholder={t("Enter phone number")}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  inputType="phone-pad"
                  errorMessage={error.phoneNumber}
                  required={true}
                  maxLength={10}
                  inputContainerStyle={{ height: 50 }}
                  regex={numberRegex}
                />
                <RoleSelect
                  label={t("Role")}
                  items={roleList}
                  selectedValue={role}
                  onValueChange={setRole}
                  required={true}
                  errorMessage={error.role}
                />
                <Switch
                  label={t("Is Active")}
                  onValueChange={setIsActive}
                  value={isActive}
                />
                <Textarea
                  label={t("Notes")}
                  onChange={setNotes}
                  value={`${notes === null ? '' : notes}`}
                  placeholder={t("Enter your notes")}
                />
                <Button title={t("Save")} onPress={handleSubmission} />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}

        <CustomBottomSheet
          ref={bottomSheetRef}
          title={t("Change PIN")}
          onClose={() => bottomSheetRef.current.close()}>
          <UserEditPinForm userId={urlName} navigation={navigation} />
        </CustomBottomSheet>
      </View>
    </>
  );
};

export default UserEditScreen;
