import {
  BackHandler,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import React, { useCallback, useRef } from 'react';
import Header from '../../../components/CommonComponets/Header/Header';
import { useContactEdit } from './useContactEdit';
import { Input } from '../../../components/CommonComponets';
import { ContactTypes } from '../ContactTypes/ContactTypes';
import Button from '../../../components/CommonComponets/Button/Button';
import ContactCreateForm from '../ContactCreateForm/ContactCreateForm';
import { useFocusEffect } from '@react-navigation/native';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import commonStyle from '../../../styles/commonStyle';
import { nameRegex, numberRegex } from '../../../utils/regex';
import Loader from '../../../components/Loader/Loader';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { useLanguage } from '../../../context/LanguageContext';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import Divider from '../../../components/CommonComponets/Divider/Divider';
import ContactList from '../../../components/CommonComponets/ContactList/ContactList';
import { usePermission } from '../../../hook/usePermission';

const ContactEditScreen = ({ route, navigation }: any) => {
  const { contactId, redirect, id } = route.params;
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Contacts")

  const {
    name,
    setName,
    phone,
    setPhone,
    error,
    contactList,
    setContactList,
    handleBack,
    hasUnsavedChanges,
    handleSubmission,
    isAddDisabled,
    loading,
  } = useContactEdit(contactId as string, navigation, redirect, id);

  const bottomSheetRef = useRef<any>(null);
  const contactSheetRef = useRef<any>(null);

  const handleAdd = () => {
    bottomSheetRef.current.open();
  };

  const handleOpen = () => {
    contactSheetRef.current.open()
  }

  const handleSelectContact = (selectedName: string, selectedPhone: string) => {
    setName(selectedName);
    setPhone(selectedPhone);
    contactSheetRef.current?.close();
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
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Edit Contact")} onBackPress={handleBack} />
      <View style={commonStyle.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView enabled>
            <View style={commonStyle.inputfieldContainer}>
              {contactList.name && (
                <>
                  <FormActionButton
                    heading={t("Select Contact")}
                    iconType="contacts"
                    onClick={handleOpen}
                    isIconDisabled={!editable}

                  />
                  <Divider text={t("OR")} />
                  <Input
                    title={t("Name")}
                    value={name}
                    regex={nameRegex}
                    onChangeText={setName}
                    errorMessage={error.name}
                    required={true}
                    disabled={!editable}
                  />
                  <Input
                    title={t("Phone Number")}
                    value={phone}
                    onChangeText={setPhone}
                    regex={numberRegex}
                    placeholder={t("Enter phone number")}
                    required={true}
                    maxLength={10}
                    inputType='phone-pad'
                    errorMessage={error.phone}
                    disabled={!editable}
                  />
                </>
              )}
              <FormActionButton
                heading={t("Additional Details")}
                iconType="plus-circle"
                onClick={handleAdd}
                isIconDisabled={isAddDisabled || !editable}
              />
              <ContactTypes
                contactList={contactList}
                setContactList={setContactList}
              />
              <Button title={t("Save")} onPress={handleSubmission} disable={!editable} />
            </View>
            <CustomBottomSheet
              ref={bottomSheetRef}
              title={t("Additional Details")}
              onClose={() => bottomSheetRef.current?.close()}>
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
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </>
  );
};

export default ContactEditScreen;
