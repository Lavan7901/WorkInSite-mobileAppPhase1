import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Input from '../../../components/CommonComponets/Input/input';
import Button from '../../../components/CommonComponets/Button/Button';
import Header from '../../../components/CommonComponets/Header/Header';
import { SupervisorAddForm } from '../SupervisorAddForm/SupervisorAddForm';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { SupervisorListForm } from '../SupervisorListForm/SupervisorListForm';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import { ContactsEditForm } from '../../Clients/ContactsEditForm/ContactsEditForm';
import RouteName from '../../../navigation/RouteName';
import { useSiteCreation } from './useSiteCreation';
import commonStyle from '../../../styles/commonStyle';
import { ContactDetailForm } from '../../../components/CommonComponets/ContactDetailForm/ContactDetailForm';
import { nameRegex } from '../../../utils/regex';
import { useLanguage } from '../../../context/LanguageContext';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import RadioButtonGroup from '../../../components/CommonComponets/RadioButtonGroup/RadioButtonGroup';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';

const SiteCreationScreen = ({ navigation, route }: any) => {
  const { t } = useLanguage();
  const {
    name,
    setName,
    clientDetails,
    clientId,
    setClientId,
    handleClientCreate,
    fetchClients,
    googleLocation,
    setGoogleLocation,
    notes,
    setNotes,
    contactDetails,
    contact,
    contactId,
    setContactId,
    fetchContacts,
    handleContactCreate,
    handleContactEdit,
    primaryContactDetails,
    hasMoreDetails,
    error,
    handleSubmission,
    supervisors,
    setSupervisors,
    handleBackPress,
    hasUnsavedChanges,
    status,
    setStatus,
    siteStatus,
    resetFormFields
  } = useSiteCreation({ navigation });

  const supervisorBottomSheetRef = useRef<any>(null);
  const contactBottomSheetRef = useRef<any>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      supervisorBottomSheetRef.current?.close();
      contactBottomSheetRef.current?.close();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && route.params?.newSupervisor) {
      const newSupervisor = route.params.newSupervisor;

      setSupervisors(prev => [
        ...prev,
        {
          ...newSupervisor,
          role: {
            id: newSupervisor.roleId,
            name: newSupervisor.roleName,
          },
        },
      ]);
    }
  }, [isFocused, route.params?.newSupervisor]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );

  const handleSupervisorsAdd = () => {
    supervisorBottomSheetRef.current?.open();
  };

  const handleMoreDetails = () => {
    contactBottomSheetRef.current?.open();
  };

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Create Site")} onBackPress={handleBackPress} handleReset={resetFormFields} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled>
          <ScrollView
            keyboardShouldPersistTaps="handled">
            <View style={commonStyle.inputfieldContainer}>
              <Input
                title={t("Name")}
                value={name}
                onChangeText={setName}
                placeholder={t("Enter site name")}
                required
                errorMessage={error.name}
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
              />
              <Textarea
                label={t("Google Location")}
                placeholder={t("Enter google location")}
                required
                showLocationLink
                value={googleLocation}
                onChange={setGoogleLocation}
                errorMessage={error.googleLocation}
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
                heading={t("Supervisors")}
                iconType="plus-circle"
                onClick={handleSupervisorsAdd}
              />
              {supervisors.length !== 0 && (
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
              />
              <Textarea
                label={t("Notes")}
                value={notes}
                onChange={setNotes}
                placeholder={t("Enter notes")}
              />
              <Button title={t("Save")} onPress={handleSubmission} />
            </View>
            <CustomBottomSheet
              ref={supervisorBottomSheetRef}
              title={t("Add Supervisors")}
              onClose={() => supervisorBottomSheetRef.current.close()}>
              <SupervisorAddForm
                supervisors={supervisors}
                setSupervisors={setSupervisors}
                redirectUrl={RouteName.SITE_CREATION_SCREEN}
                Ref={supervisorBottomSheetRef}
                navigation={navigation}
              />
            </CustomBottomSheet>
            <CustomBottomSheet
              ref={contactBottomSheetRef}
              title={t("Contacts")}
              onClose={() => contactBottomSheetRef.current.close()}
              scrollview>
              <ContactsEditForm contact={contact} onEdit={handleContactEdit} />
            </CustomBottomSheet>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export { SiteCreationScreen };
