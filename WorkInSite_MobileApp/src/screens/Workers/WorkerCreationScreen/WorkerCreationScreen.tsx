import { BackHandler, ScrollView, Text, View } from 'react-native';
import React, { useCallback, useRef } from 'react';
import { useWorkerCreation } from './useWorkerCreation';
import Header from '../../../components/CommonComponets/Header/Header';
import { Input } from '../../../components/CommonComponets';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import { ContactsEditForm } from '../../Clients/ContactsEditForm/ContactsEditForm';
import Button from '../../../components/CommonComponets/Button/Button';
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
import { useLanguage } from '../../../context/LanguageContext';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';

const WorkerCreationScreen = ({ navigation, route }: any) => {
  const { t } = useLanguage();
  const {
    name,
    setName,
    dateOfBirth,
    setDateOfBirth,
    genderItems,
    gender,
    setGender,
    notes,
    setNotes,
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
    handleWorkerCategoryCreate,
    handleWorkerCategoryEdit,
    handleContactCreate,
    handleContactEdit,
    handleContactChange,
    handleWorkerCategoryChange,
    fetchContacts,
    fetchWorkerCategories,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    handleBackPress,
    hasUnsavedChanges,
    resetForm
  } = useWorkerCreation({ navigation, route });

  const kycSheetRef = useRef<any>(null);
  const bankAccountSheetRef = useRef<any>(null);
  const upiSheetRef = useRef<any>(null);
  const contactSheetRef = useRef<any>(null);

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

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Create Worker")} onBackPress={handleBackPress} handleReset={resetForm} />
      <ScrollView
        style={commonStyle.container}
        keyboardShouldPersistTaps="handled">
        <View style={commonStyle.inputfieldContainer}>
          <Input
            title={t("Name")}
            placeholder={t("Enter worker name")}
            value={name}
            onChangeText={setName}
            errorMessage={error.name}
            required
            regex={nameRegex}
          />
          <DatePicker
            date={dateOfBirth}
            onDateChange={setDateOfBirth}
            label={t("Date of Birth")}
            required
            errorMessage={error.dateOfBirth}
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
          />
          {contactId && (
            <ContactDetailForm
              handleContactEdit={handleContactEdit}
              primaryContactDetails={primaryContactDetails}
              hasMoreDetails={hasMoreDetails}
              handleMoreDetails={handleMoreDetails}
            />
          )}
          <Combo
            label={t("Worker Category")}
            showCreateButton={true}
            items={workerCategoryDetails}
            selectedValue={workerCategoryId}
            onCreate={handleWorkerCategoryCreate}
            onValueChange={handleWorkerCategoryChange}
            onSearch={fetchWorkerCategories}
            required={true}
            errorMessage={error.workerCategoryId}
          />
          <RadioButtonGroup
            label={t("Gender")}
            items={genderItems}
            selectedValue={gender}
            onValueChange={setGender}
            errorMessage={error.gender}
            required={true}
          />
          <FormActionButton
            heading={t("KYC")}
            iconType="plus-circle"
            onClick={() => kycSheetRef.current?.open()}
            isIconDisabled={isKycAddDisabled}
          />
          <KycTypes details={workerDetails} setDetails={setWorkerDetails} />
          <FormActionButton
            heading={t("Bank Accounts")}
            iconType="plus-circle"
            onClick={() => bankAccountSheetRef.current?.open()}
            isIconDisabled={isBankAccountsAddDisabled}
          />
          <BankAccounts
            details={workerDetails}
            setDetails={setWorkerDetails}
          />
          <FormActionButton
            heading={t("UPIs")}
            iconType="plus-circle"
            onClick={() => upiSheetRef.current?.open()}
            isIconDisabled={isUpiAddDisabled}
          />
          <UpiTypes details={workerDetails} setDetails={setWorkerDetails} />
          <Textarea
            label={t("Notes")}
            placeholder={t("Enter your notes")}
            value={notes}
            onChange={setNotes}
          />
          <Button
            buttonStyle={{ marginTop: 10 }}
            title={t("Save")}
            onPress={handleSubmission}
          />
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
            scrollview={true}>
            <ContactsEditForm contact={contact} onEdit={handleContactEdit} />
          </CustomBottomSheet>
        </View>
      </ScrollView>
    </>
  );
};

export default WorkerCreationScreen;
