import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import { SupervisorAddForm } from '../SupervisorAddForm/SupervisorAddForm';
import { SupervisorListForm } from '../SupervisorListForm/SupervisorListForm';
import { useSiteEdit } from './UseSiteEdit';
import Button from '../../../components/CommonComponets/Button/Button';
import Header from '../../../components/CommonComponets/Header/Header';
import Input from '../../../components/CommonComponets/Input/input';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import RadioButtonGroup from '../../../components/CommonComponets/RadioButtonGroup/RadioButtonGroup';
import { ContactsEditForm } from '../../Clients/ContactsEditForm/ContactsEditForm';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { ContactDetailForm } from '../../../components/CommonComponets/ContactDetailForm/ContactDetailForm';
import commonStyle from '../../../styles/commonStyle';
import Loader from '../../../components/Loader/Loader';
import { useLanguage } from '../../../context/LanguageContext';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import { usePermission } from '../../../hook/usePermission';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const SiteEditScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const isFocused = useIsFocused();
  const { canEdit } = usePermission()
  const editable = canEdit("Sites")

  const { t } = useLanguage();
  const {
    name,
    setName,
    clientDetails,
    clientId,
    handleClientCreate,
    setClientId,
    fetchClients,
    googleLocation,
    setGoogleLocation,
    notes,
    setNotes,
    contact,
    contactId,
    setContactId,
    contactDetails,
    fetchContacts,
    handleContactCreate,
    handleContactEdit,
    primaryContactDetails,
    hasMoreDetails,
    error,
    handleSubmission,
    supervisors,
    setSupervisors,
    status,
    setStatus,
    siteStatus,
    siteDetails,
    loading,
    handleBackPress,
    hasUnsavedChanges,
  } = useSiteEdit(id, { navigation });

  const supervisorSheetRef = useRef<any>(null);
  const contactSheetRef = useRef<any>(null);

  const handleSupervisorsAdd = () => {
    supervisorSheetRef.current?.open();
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
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Edit Site")} onBackPress={handleBackPress} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled>
          <ScrollView
            keyboardShouldPersistTaps="handled">
            {siteDetails && (
              <View style={commonStyle.inputfieldContainer}>
                <Input
                  title={t("Name")}
                  value={name}
                  onChangeText={setName}
                  placeholder={t("Enter name")}
                  required
                  errorMessage={error.name}
                  disabled={!editable}
                />
                <Combo
                  label={t("Client")}
                  showCreateButton
                  items={clientDetails}
                  selectedValue={clientId}
                  onCreate={handleClientCreate}
                  onValueChange={setClientId}
                  onSearch={fetchClients}
                  required
                  errorMessage={error.client}
                  isDisabled={!editable}
                />
                <Textarea
                  label={t("Google Location")}
                  placeholder={t("Enter google location")}
                  required
                  showLocationLink
                  value={googleLocation}
                  onChange={setGoogleLocation}
                  errorMessage={error.googleLocation}
                  isDisabled={!editable}
                />
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
                {contactId && (
                  <>
                    <ContactDetailForm
                      handleContactEdit={handleContactEdit}
                      primaryContactDetails={primaryContactDetails}
                      hasMoreDetails={hasMoreDetails}
                      handleMoreDetails={() => contactSheetRef.current?.open()}
                      permissionKey='Sites'
                    />
                  </>
                )}
                <FormActionButton
                  heading={t("Supervisors")}
                  iconType="plus-circle"
                  onClick={handleSupervisorsAdd}
                  isIconDisabled={!editable}
                />
                {supervisors?.length !== 0 && (
                  <SupervisorListForm
                    supervisors={supervisors}
                    setSupervisors={setSupervisors}
                  />
                )}
                <RadioButtonGroup
                  label={t("Status")}
                  items={siteStatus}
                  selectedValue={status}
                  onValueChange={setStatus}
                  isDisabled={!editable}
                />
                <Textarea
                  label={t("Notes")}
                  value={notes}
                  onChange={setNotes}
                  placeholder={t("Enter notes")}
                  isDisabled={!editable}
                />
                <Button title={t("Save")} onPress={handleSubmission} disable={!editable} />
                <CustomBottomSheet
                  ref={contactSheetRef}
                  title={t("Contacts")}
                  scrollview={true}
                  onClose={() => contactSheetRef.current.close()}>
                  <ContactsEditForm
                    contact={contact} onEdit={handleContactEdit} />
                </CustomBottomSheet>
                <CustomBottomSheet
                  ref={supervisorSheetRef}
                  title={t("Add Supervisors")}
                  onClose={() => supervisorSheetRef.current.close()}>
                  <SupervisorAddForm
                    siteId={id}
                    // supervisors={supervisors}
                    supervisors={supervisors ?? []}
                    setSupervisors={setSupervisors}
                    redirectUrl={"SiteEditScreen"}
                    Ref={supervisorSheetRef}
                    navigation={navigation}
                  />
                </CustomBottomSheet>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default SiteEditScreen;
