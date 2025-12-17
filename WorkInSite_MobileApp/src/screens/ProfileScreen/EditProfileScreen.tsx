import React from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { useUserProfile } from './useUserProfile';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../../components/CommonComponets/Button/Button';
import { Input } from '../../components/CommonComponets';
import Textarea from '../../components/CommonComponets/Notes/Notes';
import Switch from '../../components/CommonComponets/Switch/Switch';
import Header from '../../components/CommonComponets/Header/Header';
import commonStyle from '../../styles/commonStyle';
import { useLanguage } from '../../context/LanguageContext';
import { nameRegex, numberRegex } from '../../utils/regex';
import ToastNotification from '../../components/CommonComponets/Toast/Toast';

export default function EditProfileScreen({ navigation }: any) {
  const { t } = useLanguage();
  const {
    name,
    setName,
    phoneNumber,
    setPhoneNumber,
    error,
    isActive,
    setIsActive,
    notes,
    setNotes,
    user,
    handleSubmission,
    handleBackPress,
  } = useUserProfile(navigation);

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
    }, []),
  );

  return (
    <ScrollView
      style={commonStyle.container}
      keyboardShouldPersistTaps="handled">
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Edit Personal Details")} onBackPress={handleBackPress} />
      <View style={commonStyle.inputfieldContainer}>
        <Input
          title={t("Name")}
          placeholder={t("Enter your name")}
          value={name}
          onChangeText={setName}
          errorMessage={error.name}
          required={true}
          maxLength={30}
          regex={nameRegex}
        />
        <Input
          title={t("Phone Number")}
          placeholder={t("Enter your phone number")}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          errorMessage={error.phoneNumber}
          inputType="phone-pad"
          required={true}
          maxLength={10}
          regex={numberRegex}
        />
        <View>
          <Text style={commonStyle.label}>{t("Role")}</Text>
          <Text style={commonStyle.labelText}>{user?.role?.name}</Text>
        </View>
        <Switch
          label={t("Is Active")}
          onValueChange={() => setIsActive(true)}
          value={isActive}
          disabled={true}
        />
        <Textarea
          label={t("Notes")}
          onChange={setNotes}
          value={notes || ''}
          placeholder={t("Enter your notes")}
        />
        <Button onPress={handleSubmission} title={t("Save")} />
      </View>
    </ScrollView>
  );
}
