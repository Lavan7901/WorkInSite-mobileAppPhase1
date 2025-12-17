import React, { useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import Header from '../../../components/CommonComponets/Header/Header';
import Button from '../../../components/CommonComponets/Button/Button';
import Input from '../../../components/CommonComponets/Input/input';
import { useClientEdit } from './useClientEdit';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import { ContactsEditForm } from '../ContactsEditForm/ContactsEditForm';
import { useFocusEffect } from '@react-navigation/native';
import commonStyle from '../../../styles/commonStyle';
import { ContactDetailForm } from '../../../components/CommonComponets/ContactDetailForm/ContactDetailForm';
import { KycTypes } from '../../../components/CommonComponets/Kyc/KycTypes/KycTypes';
import { KycCreateForm } from '../../../components/CommonComponets/Kyc/KycCreateForm/KycCreateForm';
import { nameRegex } from '../../../utils/regex';
import Loader from '../../../components/Loader/Loader';
import { useLanguage } from '../../../context/LanguageContext';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import { usePermission } from '../../../hook/usePermission';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const ClientEditScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Clients")
  const {
    name,
    setName,
    notes,
    setNotes,
    clientDetails,
    setClientDetails,
    error,
    handleContactEdit,
    handleSubmission,
    isAddDisabled,
    contactDetails,
    contactId,
    setContactId,
    handleContactCreate,
    fetchContacts,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    loading,
    handleBackPress,
    hasUnsavedChanges,
  } = useClientEdit(id, { navigation });

  const kycSheetRef = useRef<any>(null);
  const contactSheetRef = useRef<any>(null);
  const handleMoreDetails = () => {
    contactSheetRef.current?.open();
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );

  if (loading) return <Loader />

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Edit Client")} onBackPress={handleBackPress} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled style={{ flex: 1 }}>
          <ScrollView
            keyboardShouldPersistTaps="handled">
            <View style={commonStyle.inputfieldContainer}>
              {clientDetails?.name && (
                <Input
                  title={t("Name")}
                  value={name}
                  onChangeText={setName}
                  required
                  errorMessage={error.name}
                  regex={nameRegex}
                  disabled={!editable}
                />
              )}
              {contactId && (
                <Combo
                  label={t("Contact")}
                  showCreateButton
                  items={contactDetails}
                  selectedValue={contactId}
                  onCreate={handleContactCreate}
                  onValueChange={setContactId}
                  onSearch={fetchContacts}
                  required
                  errorMessage={error.contact}
                  isDisabled={!editable}
                />
              )}
              {contactId && (
                <ContactDetailForm
                  handleContactEdit={handleContactEdit}
                  primaryContactDetails={primaryContactDetails}
                  hasMoreDetails={hasMoreDetails}
                  handleMoreDetails={handleMoreDetails}
                  permissionKey={"Clients"}
                />
              )}
              <FormActionButton
                heading={t("KYC")}
                iconType="plus-circle"
                onClick={() => kycSheetRef.current?.open()}
                isIconDisabled={isAddDisabled || !editable}
              />
              <KycTypes details={clientDetails} setDetails={setClientDetails} permissionKey='Clients' />
              {notes !== undefined && (
                <Textarea
                  label={t("Notes")}
                  value={notes}
                  onChange={setNotes}
                  placeholder={t("Enter your notes")}
                  isDisabled={!editable}
                />
              )}
              <Button title={t("Save")} onPress={handleSubmission} disable={!editable} />
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
                  permissionKey='Clients'
                // Ref={contactSheetRef}  //note
                />
              </CustomBottomSheet>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default ClientEditScreen;
