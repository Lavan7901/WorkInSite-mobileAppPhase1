import React, { useCallback, useRef } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import { Input } from '../../../components/CommonComponets';
import { useContactCreation } from './useContactCreation';
import Header from '../../../components/CommonComponets/Header/Header';
import ContactCreateForm from '../ContactCreateForm/ContactCreateForm';
import Button from '../../../components/CommonComponets/Button/Button';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { ContactTypes } from '../ContactTypes/ContactTypes';
import { useFocusEffect } from '@react-navigation/native';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import commonStyle from '../../../styles/commonStyle';
import { nameRegex, numberRegex } from '../../../utils/regex';
import { useLanguage } from '../../../context/LanguageContext';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import Divider from '../../../components/CommonComponets/Divider/Divider';
import ContactList from '../../../components/CommonComponets/ContactList/ContactList';

const ContactCreationScreen = ({ navigation, route }: any) => {
  const { t } = useLanguage();
  const {
    name,
    setName,
    phone,
    setPhone,
    error,
    contactList,
    setContactList,
    handleSubmission,
    handleBack,
    hasUnsavedChanges,
    isAddDisabled,
  } = useContactCreation({ navigation, route });

  const bottomSheetRef = useRef<any>(null);
  const contactSheetRef = useRef<any>(null);

  const handleAdd = () => {
    bottomSheetRef.current.open();
  };

  const handleOpen = () => {
    contactSheetRef.current.open()
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBack();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );

  const handleSelectContact = (selectedName: string, selectedPhone: string) => {
    setName(selectedName);
    setPhone(selectedPhone);
    contactSheetRef.current?.close();
  };

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t('Create Contact')} onBackPress={handleBack} />
      <View style={commonStyle.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView enabled>
            <View style={commonStyle.inputfieldContainer}>
              <FormActionButton
                heading={t("Select Contact")}
                iconType="contacts"
                onClick={handleOpen}
              />
              <Divider text={t("OR")} />
              <Input
                title={t("Name")}
                value={name}
                onChangeText={setName}
                regex={nameRegex}
                placeholder={t("Enter name")}
                required={true}
                errorMessage={error.name}
              />
              <Input
                title={t("Phone Number")}
                value={phone}
                onChangeText={setPhone}
                regex={numberRegex}
                placeholder={t("Enter phone number")}
                required={true}
                maxLength={10}
                errorMessage={error.phone}
                inputType='phone-pad'
                containerStyle={{ flex: 1 }}
              />
              <FormActionButton
                heading={t("Additional Details")}
                iconType="plus-circle"
                onClick={handleAdd}
                isIconDisabled={isAddDisabled}
              />
              <ContactTypes
                contactList={contactList}
                setContactList={setContactList}
              />
              <Button title={t("Save")} onPress={handleSubmission} />
              <CustomBottomSheet
                ref={bottomSheetRef}
                title={t("Additional Details")}
                onClose={() => bottomSheetRef.current.close()}>
                <ContactCreateForm
                  contactList={contactList}
                  setContactList={setContactList}
                  Ref={bottomSheetRef}
                />
              </CustomBottomSheet>
              <CustomBottomSheet
                ref={contactSheetRef}
                title={t("Select Contact")}
                onClose={() => contactSheetRef.current.close()}
                height={900}
              >
                <ContactList onSelectContact={handleSelectContact}
                  onClose={() => contactSheetRef.current.close()}
                />
              </CustomBottomSheet>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View >
    </>
  );
};

export default ContactCreationScreen;

