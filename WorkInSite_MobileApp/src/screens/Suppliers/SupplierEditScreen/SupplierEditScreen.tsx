import React, { useCallback, useRef } from 'react';
import { View, ScrollView, BackHandler } from 'react-native';
import { Input } from '../../../components/CommonComponets';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import Header from '../../../components/CommonComponets/Header/Header';
import { useSupplierEdit } from './useSupplierEdit';
import { ContactsEditForm } from '../../Clients/ContactsEditForm/ContactsEditForm';
import Switch from '../../../components/CommonComponets/Switch/Switch';
import Button from '../../../components/CommonComponets/Button/Button';
import { useFocusEffect } from '@react-navigation/native';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
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
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import { usePermission } from '../../../hook/usePermission';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const SupplierEditScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Suppliers")

  const {
    name,
    setName,
    notes,
    setNotes,
    isActive,
    setIsActive,
    supplierDetails,
    setSupplierDetails,
    error,
    handleSubmission,
    isKycAddDisabled,
    isBankAccountsAddDisabled,
    isUpiAddDisabled,
    contactDetails,
    contactId,
    handleContactCreate,
    handleContactChange,
    fetchContacts,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
    loading,
    handleBackPress,
    hasChanges,
  } = useSupplierEdit(id as string, navigation, route);

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
    }, [hasChanges]),
  );

  if (loading) {
    return <Loader />;
  }
  const handleMoreDetails = () => {
    contactSheetRef.current?.open();
  };

  return (
    <>
      <Header title={t("Edit Supplier")} onBackPress={handleBackPress} />
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <ScrollView
        style={commonStyle.container}
        keyboardShouldPersistTaps="handled">
        <View style={commonStyle.inputfieldContainer}>
          {supplierDetails.name && (
            <Input
              title={t("Name")}
              placeholder={t("Enter supplier name")}
              value={name}
              onChangeText={setName}
              errorMessage={error.name}
              required
              regex={nameRegex}
              disabled={!editable}
            />
          )}
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
              permissionKey='Suppliers'
            />
          )}
          <View>
            <FormActionButton
              heading={t("KYC")}
              iconType="plus-circle"
              onClick={() => kycSheetRef.current?.open()}
              isIconDisabled={isKycAddDisabled || !editable}
            />
            <KycTypes
              details={supplierDetails}
              setDetails={setSupplierDetails}
              permissionKey='Suppliers'
            />
          </View>
          <View>
            <FormActionButton
              heading={t("Bank Accounts")}
              iconType="plus-circle"
              onClick={() => bankAccountSheetRef.current?.open()}
              isIconDisabled={isBankAccountsAddDisabled || !editable}
            />
            <BankAccounts
              details={supplierDetails}
              setDetails={setSupplierDetails}
              permissionKey='Suppliers'
            />
          </View>
          <View>
            <FormActionButton
              heading={t("UPIs")}
              iconType="plus-circle"
              onClick={() => upiSheetRef.current?.open()}
              isIconDisabled={isUpiAddDisabled || !editable}
            />
            <UpiTypes
              details={supplierDetails}
              setDetails={setSupplierDetails}
              permissionKey='Suppliers'
            />
          </View>
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
            title={("KYC Type")}
            onClose={() => kycSheetRef.current.close()}>
            <KycCreateForm
              details={supplierDetails}
              setDetails={setSupplierDetails}
              Ref={kycSheetRef}
            />
          </CustomBottomSheet>
          <CustomBottomSheet
            ref={bankAccountSheetRef}
            title={t("Bank Account")}
            onClose={() => bankAccountSheetRef.current.close()}>
            <BankAccountCreateForm
              details={supplierDetails}
              setDetails={setSupplierDetails}
              Ref={bankAccountSheetRef}
            />
          </CustomBottomSheet>
          <CustomBottomSheet
            ref={upiSheetRef}
            title={t("UPI Type")}
            onClose={() => upiSheetRef.current.close()}>
            <UpiCreateForm
              details={supplierDetails}
              setDetails={setSupplierDetails}
              Ref={upiSheetRef}
            />
          </CustomBottomSheet>
          <CustomBottomSheet
            ref={contactSheetRef}
            title={t("Contacts")}
            scrollview={true}
            onClose={() => contactSheetRef.current.close()}>
            <ContactsEditForm contact={contact} onEdit={handleContactEdit} permissionKey='Suppliers' />
          </CustomBottomSheet>
        </View>
      </ScrollView>
    </>
  );
};

export default SupplierEditScreen;
