import React, { useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/CommonComponets/Header/Header';
import commonStyle from '../../../styles/commonStyle';
import Input from '../../../components/CommonComponets/Input/input';
import Button from '../../../components/CommonComponets/Button/Button';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import { usePurchaseEdit } from './usePurchaseEdit';
import Loader from '../../../components/Loader/Loader';
import { numberRegex } from '../../../utils/regex';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import { useLanguage } from '../../../context/LanguageContext';
import CameraGalleryChooser from '../../../components/CommonComponets/CameraGalleryChooser/CameraGalleryChooser';
import UploadButton from '../../../components/CommonComponets/UploadButton/UploadButton';
import DynamicCamera from '../../../components/CommonComponets/Camera/Camera';
import PurchaseMaterialsCreationScreen from '../PurchaseMaterialsCreation/PurchaseMaterialsCreationScreen';
import PurchaseMaterialsList from '../PurchaseMaterialsList/PurchaseMaterialsList';
import PurchasePhoto from '../PurchasePhoto/PurchasePhoto';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { usePermission } from '../../../hook/usePermission';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';

export const PurchaseEditScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { canEdit } = usePermission()
  const editable = canEdit("Purchase")
  const {
    billNumber,
    setBillNumber,
    supplierId,
    setSupplierId,
    siteDetails,
    siteId,
    setSiteId,
    date,
    setDate,
    totalAmount,
    setTotalAmount,
    gst,
    setGst,
    additionalCharges,
    setAdditionalCharges,
    discount,
    setDiscount,
    notes,
    setNotes,
    purchaseDetails,
    fetchSites,
    fetchSuppliers,
    supplierDetails,
    error,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges,
    loading,
    addPurchaseMaterial,
    newPurchaseMaterials,
    setNewPurchaseMaterials,
    updatedPurchaseMaterials,
    setUpdatedPurchaseMaterials,
    removedPurchaseMaterialIds,
    setRemovedPurchaseMaterialIds,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    imageSheetRef,
    handleImageSheetOpen,
    handleImageSheetClose,
    showCamera,
    setShowCamera,
    showImage,
    setShowImage,
    removedImages,
    setRemovedImages,
  } = usePurchaseEdit(id, { navigation });

  const bottomSheetRef = useRef<any>();

  const handleAdd = () => {
    bottomSheetRef.current?.open();
  };

  const { t } = useLanguage();

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
      {showCamera ? (
        <DynamicCamera
          onClose={() => setShowCamera(false)}
          onCapture={(metaList) => setUploadedImages((prev) => [...prev, ...metaList])}
        />
      ) : (
        <>
          <View style={{ zIndex: 9 }}>
            <ToastNotification />
          </View>
          <Header title={t("Edit Purchase")} onBackPress={handleBackPress} />
          <View style={commonStyle.container}>
            <KeyboardAvoidingView enabled>
              <ScrollView keyboardShouldPersistTaps="handled">
                {purchaseDetails && (
                  <View style={commonStyle.inputfieldContainer}>
                    <Input
                      title={t("Bill Number")}
                      value={billNumber}
                      onChangeText={setBillNumber}
                      placeholder={t("Enter bill number")}
                      required={true}
                      errorMessage={error.billNumber}
                      disabled={!editable}
                    />
                    <Combo
                      label={t("Site")}
                      items={siteDetails}
                      selectedValue={siteId}
                      onValueChange={setSiteId}
                      onSearch={fetchSites}
                      placeholder={t("Select Site")}
                      required={true}
                      errorMessage={error.siteId}
                      isDisabled={!editable}
                    />
                    <Combo
                      label={t("Supplier")}
                      items={supplierDetails}
                      selectedValue={supplierId}
                      onValueChange={setSupplierId}
                      onSearch={fetchSuppliers}
                      placeholder={t("Select Supplier")}
                      required={true}
                      errorMessage={error.supplierId}
                      isDisabled={!editable}
                    />
                    <DatePicker
                      date={date}
                      onDateChange={setDate}
                      label={t("Date")}
                      required
                      errorMessage={error.date}
                      disable={!editable}
                    />
                    <Button
                      title={t("Add Purchase Material")}
                      onPress={handleAdd}
                      variant="secondary"
                      rightIcon="plus-circle"
                      disable={!editable}
                    />
                    <PurchaseMaterialsList
                      newPurchaseMaterials={newPurchaseMaterials}
                      setNewPurchaseMaterials={setNewPurchaseMaterials}
                      updatedPurchaseMaterials={updatedPurchaseMaterials}
                      setUpdatedPurchaseMaterials={setUpdatedPurchaseMaterials}
                      removedPurchaseMaterialIds={removedPurchaseMaterialIds}
                      setRemovedPurchaseMaterialIds={setRemovedPurchaseMaterialIds}
                    />
                    <View style={commonStyle.pointerDisableInput}>
                      <Input
                        title={t("Total Amount")}
                        value={totalAmount}
                        onChangeText={setTotalAmount}
                        placeholder={t("Enter total amount")}
                        required={true}
                        regex={numberRegex}
                        errorMessage={error.totalAmount}
                        disabled={!editable}
                      />
                    </View>
                    <Input
                      title={t("GST")}
                      value={gst}
                      onChangeText={setGst}
                      placeholder={t("Enter GST")}
                      errorMessage={error.gst}
                      required
                      disabled={!editable}
                    />
                    <View style={commonStyle.pointerDisableInput}>
                      <Input
                        title={t("Additional Charges")}
                        value={additionalCharges}
                        onChangeText={setAdditionalCharges}
                        placeholder={t("Enter additional charges")}
                        regex={numberRegex}
                        disabled={!editable}
                      />
                    </View>
                    <View style={commonStyle.pointerDisableInput}>
                      <Input
                        title={t("Discount")}
                        value={discount}
                        onChangeText={setDiscount}
                        placeholder={t("Enter discount")}
                        regex={numberRegex}
                        disabled={!editable}
                      />
                    </View>
                    <Textarea
                      label={t("Notes")}
                      value={notes}
                      onChange={setNotes}
                      placeholder={t("Enter your notes")}
                      isDisabled={!editable}
                    />
                    <PurchasePhoto
                      photo={uploadedImages}
                      setPhoto={setUploadedImages}
                      showImages={showImage}
                      setShowImages={setShowImage}
                      removeImages={removedImages}
                      setRemoveImages={setRemovedImages}
                      permissionKey='Purchase'
                    />
                    <UploadButton text="Upload Images" onPress={handleImageSheetOpen} disabled={!editable} />
                    <CustomBottomSheet title='Image' ref={imageSheetRef} onClose={handleImageSheetClose} height={100}>
                      <CameraGalleryChooser
                        onCameraPress={() => setShowCamera(true)}
                        onGalleryPress={handleImageUpload}
                      />
                    </CustomBottomSheet>
                    <Button title={t("Save")} onPress={handleSubmission} disable={!editable} />
                  </View>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
          <CustomBottomSheet
            ref={bottomSheetRef}
            height={750}
            title={t("Add Purchase Material")}
            scrollview={true}
            onClose={() => bottomSheetRef.current.close()}
          >
            <PurchaseMaterialsCreationScreen
              purchaseMaterials={newPurchaseMaterials}
              setPurchaseMaterials={setNewPurchaseMaterials}
              Ref={bottomSheetRef}
              addPurchaseMaterial={addPurchaseMaterial}
              updatedPurchaseMaterials={updatedPurchaseMaterials}

            />
          </CustomBottomSheet>
        </>
      )}
    </>
  );
};

