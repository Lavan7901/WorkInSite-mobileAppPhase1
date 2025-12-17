import React, { useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import { useClientCreation } from './useClientCreation';
import Header from '../../../components/CommonComponets/Header/Header';
import Input from '../../../components/CommonComponets/Input/input';
import Button from '../../../components/CommonComponets/Button/Button';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import { ContactsEditForm } from '../ContactsEditForm/ContactsEditForm';
import { useFocusEffect } from '@react-navigation/native';
import commonStyle from '../../../styles/commonStyle';
import { ContactDetailForm } from '../../../components/CommonComponets/ContactDetailForm/ContactDetailForm';
import { KycTypes } from '../../../components/CommonComponets/Kyc/KycTypes/KycTypes';
import { KycCreateForm } from '../../../components/CommonComponets/Kyc/KycCreateForm/KycCreateForm';
import { nameRegex } from '../../../utils/regex';
import { useLanguage } from '../../../context/LanguageContext';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const ClientCreationScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const {
    name,
    setName,
    notes,
    setNotes,
    clientDetails,
    setClientDetails,
    error,
    handleSubmission,
    isAddDisabled,
    contactDetails,
    contactId,
    handleContactCreate,
    setContactId,
    fetchContacts,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
    handleBackPress,
    hasUnsavedChanges,
    resetFormFields
  } = useClientCreation({ navigation });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );

  const kycSheetRef = useRef<any>(null);
  const contactSheetRef = useRef<any>(null);

  const handleAdd = () => {
    kycSheetRef.current?.open();
  };

  const handleMoreDetails = () => {
    contactSheetRef.current?.open();
  };

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Create Client")} onBackPress={handleBackPress} handleReset={resetFormFields} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={commonStyle.inputfieldContainer}>
              <Input
                title={t("Name")}
                value={name}
                onChangeText={setName}
                placeholder={t("Enter name")}
                required={true}
                errorMessage={error.name}
                regex={nameRegex}
              />
              <Combo
                label={t("Contact")}
                showCreateButton={true}
                items={contactDetails}
                selectedValue={contactId}
                onCreate={handleContactCreate}
                onValueChange={setContactId}
                onSearch={fetchContacts}
                required={true}
                errorMessage={error.contact}
              />
              {contactId && (
                <ContactDetailForm
                  handleContactEdit={handleContactEdit}
                  primaryContactDetails={primaryContactDetails}
                  hasMoreDetails={hasMoreDetails}
                  handleMoreDetails={handleMoreDetails}
                />
              )}
              <FormActionButton
                heading={t("KYC")}
                iconType="plus-circle"
                onClick={handleAdd}
                isIconDisabled={isAddDisabled}
              />
              <KycTypes details={clientDetails} setDetails={setClientDetails} />
              <Textarea
                label={t("Notes")}
                value={notes}
                onChange={setNotes}
                placeholder={t("Enter your notes")}
              />
              <Button title={t("Save")} onPress={handleSubmission} />
              <CustomBottomSheet
                ref={kycSheetRef}
                title={t("KYC Type")}
                onClose={() => kycSheetRef.current.close()}>
                <KycCreateForm
                  details={clientDetails}
                  setDetails={setClientDetails}
                  Ref={kycSheetRef}
                />
              </CustomBottomSheet>
              <CustomBottomSheet
                ref={contactSheetRef}
                title={t("Contacts")}
                onClose={() => contactSheetRef.current.close()}
                scrollview={true}>
                <ContactsEditForm
                  contact={contact}
                  onEdit={handleContactEdit}
                />
              </CustomBottomSheet>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export { ClientCreationScreen };
