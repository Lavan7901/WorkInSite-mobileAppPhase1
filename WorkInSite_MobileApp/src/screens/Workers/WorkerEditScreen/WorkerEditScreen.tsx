import React, { useCallback, useRef } from 'react';
import { View, ScrollView, BackHandler } from 'react-native';
import { Input } from '../../../components/CommonComponets';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import Header from '../../../components/CommonComponets/Header/Header';
import { ContactsEditForm } from '../../Clients/ContactsEditForm/ContactsEditForm';
import Switch from '../../../components/CommonComponets/Switch/Switch';
import Button from '../../../components/CommonComponets/Button/Button';
import { useWorkerEdit } from './useWorkerEdit';
import { useFocusEffect } from '@react-navigation/native';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import RadioButtonGroup from '../../../components/CommonComponets/RadioButtonGroup/RadioButtonGroup';
import commonStyle from '../../../styles/commonStyle';
import { ContactDetailForm } from '../../../components/CommonComponets/ContactDetailForm/ContactDetailForm';
import { KycTypes } from '../../../components/CommonComponets/Kyc/KycTypes/KycTypes';
import { BankAccounts } from '../../../components/CommonComponets/BankAccount/BankAccounts/BankAccounts';
import { UpiTypes } from '../../../components/CommonComponets/Upi/UpiTypes/UpiTypes';
import { KycCreateForm } from '../../../components/CommonComponets/Kyc/KycCreateForm/KycCreateForm';
import { BankAccountCreateForm } from '../../../components/CommonComponets/BankAccount/BankAccountCreateForm/BankAccountCreateForm';
import { UpiCreateForm } from '../../../components/CommonComponets/Upi/UpiCreateForm/UpiCreateForm';
import { nameRegex } from '../../../utils/regex';
import Loader from '../../../components/Loader/Loader';
import { useLanguage } from '../../../context/LanguageContext';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import { usePermission } from '../../../hook/usePermission';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const WorkerEditScreen = ({ route, navigation }: any) => {
  const { t } = useLanguage();
  const { id } = route.params;
  const {
    name,
    setName,
    dateOfBirth,
    gender,
    setDateOfBirth,
    genderItems,
    setGender,
    notes,
    setNotes,
    isActive,
    setIsActive,
    workerDetails,
    setWorkerDetails,
    error,
    handleSubmission,
    isKycAddDisabled,
    isBankAccountsAddDisabled,
    isUpiAddDisabled,
    contactDetails,
    workerCategoryDetails,
    contactId,
    workerCategoryId,
    handleContactCreate,
    handleContactEdit,
    handleContactChange,
    handleWorkerCategoryChange,
    fetchContacts,
    fetchWorkerCategories,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    loading,
    handleBackPress,
    hasUnsavedChanges,
    workerRoleCost,
    handleWorkerRoleCostEdit
  } = useWorkerEdit(id as string, navigation, route);

  const kycSheetRef = useRef<any>(null);
  const bankAccountSheetRef = useRef<any>(null);
  const upiSheetRef = useRef<any>(null);
  const contactSheetRef = useRef<any>(null);
  const { canEdit } = usePermission()
  const editable = canEdit("Worker")

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );
  const handleMoreDetails = () => {
    contactSheetRef.current?.open();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Edit Worker")} onBackPress={handleBackPress} />
      <ScrollView
        style={commonStyle.container}
        keyboardShouldPersistTaps="handled">
        <View style={commonStyle.inputfieldContainer}>
          {workerDetails.name && (
            <Input
              title={t("Name")}
              placeholder={t("Enter worker name")}
              value={name}
              onChangeText={setName}
              errorMessage={error.name}
              required
              regex={nameRegex}
              disabled={!editable}
            />
          )}
          <DatePicker
            date={dateOfBirth}
            onDateChange={setDateOfBirth}
            label={t("Date of Birth")}
            required
            errorMessage={error.dateOfBirth}
            disable={!editable}
            minDate={new Date(1900, 0, 1)}
          />
          <Combo
            label={t("Contact")}
            showCreateButton={true}
            items={contactDetails}
            selectedValue={contactId}
            onCreate={handleContactCreate}
            onValueChange={handleContactChange}
            onSearch={fetchContacts}
            required={true}
            errorMessage={error.contact}
            isDisabled={!editable}
          />
          {contactId && (
            <ContactDetailForm
              handleContactEdit={handleContactEdit}
              primaryContactDetails={primaryContactDetails}
              hasMoreDetails={hasMoreDetails}
              handleMoreDetails={handleMoreDetails}
              permissionKey='Worker'
            />
          )}
          <Combo
            label={t("Worker Category")}
            items={workerCategoryDetails}
            selectedValue={workerCategoryId}
            onValueChange={handleWorkerCategoryChange}
            onSearch={fetchWorkerCategories}
            required={true}
            isDisabled
          />
          {workerRoleCost && (
            <FormActionButton
              heading={t("Worker Role Cost")}
              iconType="edit"
              onClick={handleWorkerRoleCostEdit}
            // isIconDisabled={!editable}
            />
          )}
          <RadioButtonGroup
            label={t("Gender")}
            items={genderItems}
            selectedValue={gender}
            onValueChange={setGender}
            errorMessage={error.gender}
            required={true}
            isDisabled={!editable}
          />
          <FormActionButton
            heading={t("KYC")}
            iconType="plus-circle"
            onClick={() => kycSheetRef.current?.open()}
            isIconDisabled={isKycAddDisabled || !editable}
          />
          <KycTypes details={workerDetails} setDetails={setWorkerDetails} permissionKey='Worker' />
          <FormActionButton
            heading={t("Bank Accounts")}
            iconType="plus-circle"
            onClick={() => bankAccountSheetRef.current?.open()}
            isIconDisabled={isBankAccountsAddDisabled || !editable}
          />
          <BankAccounts
            details={workerDetails}
            setDetails={setWorkerDetails}
            permissionKey='Worker'
          />
          <FormActionButton
            heading={t("UPIs")}
            iconType="plus-circle"
            onClick={() => upiSheetRef.current?.open()}
            isIconDisabled={isUpiAddDisabled || !editable}
          />
          <UpiTypes details={workerDetails} setDetails={setWorkerDetails} permissionKey='Worker' />
          <Switch
            label={t("Is Active")}
            value={isActive}
            onValueChange={setIsActive}
            disabled={!editable}
          />
          {notes !== undefined && (
            <Textarea
              label={t("Notes")}
              placeholder={t("Enter your notes")}
              value={`${notes ? notes : ''}`}
              onChange={setNotes}
              isDisabled={!editable}
            />
          )}
          <Button title={t("Save")} onPress={handleSubmission} disable={!editable} />
          <CustomBottomSheet
            ref={kycSheetRef}
            title={t("KYC Type")}
            onClose={() => kycSheetRef.current.close()}>
            <KycCreateForm
              details={workerDetails}
              setDetails={setWorkerDetails}
              Ref={kycSheetRef}
            />
          </CustomBottomSheet>
          <CustomBottomSheet
            ref={bankAccountSheetRef}
            title={t("Bank Account")}
            onClose={() => bankAccountSheetRef.current.close()}>
            <BankAccountCreateForm
              details={workerDetails}
              setDetails={setWorkerDetails}
              Ref={bankAccountSheetRef}
            />
          </CustomBottomSheet>
          <CustomBottomSheet
            ref={upiSheetRef}
            title={t("UPI Type")}
            onClose={() => upiSheetRef.current.close()}>
            <UpiCreateForm
              details={workerDetails}
              setDetails={setWorkerDetails}
              Ref={upiSheetRef}
            />
          </CustomBottomSheet>
          <CustomBottomSheet
            ref={contactSheetRef}
            title={t("Contacts")}
            onClose={() => contactSheetRef.current.close()}
            scrollview={true}
          >
            <ContactsEditForm contact={contact} onEdit={handleContactEdit} permissionKey='Worker' />
          </CustomBottomSheet>
        </View>
      </ScrollView>
    </>
  );
};

export default WorkerEditScreen;