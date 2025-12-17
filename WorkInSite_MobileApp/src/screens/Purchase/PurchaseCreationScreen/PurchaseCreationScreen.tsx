
import React, { useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import { usePurchaseCreation } from './usePurchaseCreation';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/CommonComponets/Header/Header';
import commonStyle from '../../../styles/commonStyle';
import Input from '../../../components/CommonComponets/Input/input';
import Button from '../../../components/CommonComponets/Button/Button';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import { numberRegex } from '../../../utils/regex';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import { useLanguage } from '../../../context/LanguageContext';
import UploadButton from '../../../components/CommonComponets/UploadButton/UploadButton';
import CameraGalleryChooser from '../../../components/CommonComponets/CameraGalleryChooser/CameraGalleryChooser';
import DynamicCamera from '../../../components/CommonComponets/Camera/Camera';
import PurchaseMaterialsCreationScreen from '../PurchaseMaterialsCreation/PurchaseMaterialsCreationScreen';
import PurchaseMaterialsList from '../PurchaseMaterialsList/PurchaseMaterialsList';
import PurchasePhoto from '../PurchasePhoto/PurchasePhoto';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';

export const PurchaseCreationScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
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
    fetchSites,
    fetchSuppliers,
    supplierDetails,
    error,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges,
    purchaseMaterials,
    setPurchaseMaterials,
    addPurchaseMaterial,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    imageSheetRef,
    handleImageSheetOpen,
    handleImageSheetClose,
    showCamera,
    setShowCamera,
  } = usePurchaseCreation({ navigation });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );

  const bottomSheetRef = useRef<any>();

  const handleAdd = () => {
    bottomSheetRef.current?.open();
  };


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
          <Header title={t("Create Purchase")} onBackPress={handleBackPress} />
          <View style={commonStyle.container}>
            <KeyboardAvoidingView enabled>
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={commonStyle.inputfieldContainer}>
                  <Input
                    title={t("Bill Number")}
                    value={billNumber}
                    onChangeText={setBillNumber}
                    placeholder={t("Enter bill number")}
                    required={true}
                    errorMessage={error.billNumber}
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
                  />

                  <DatePicker
                    date={date}
                    onDateChange={setDate}
                    label={t("Date")}
                    errorMessage={error.date}
                    defaultDate={true}
                    required
                  />

                  <Button
                    title={t("Add Purchase Material")}
                    onPress={handleAdd}
                    variant="secondary"
                    rightIcon="plus-circle"
                  />

                  <PurchaseMaterialsList
                    newPurchaseMaterials={purchaseMaterials}
                    setNewPurchaseMaterials={setPurchaseMaterials}
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
                    />
                  </View>
                  <Input
                    title={t("GST")}
                    value={gst}
                    onChangeText={setGst}
                    placeholder={t("Enter GST")}
                    required
                    errorMessage={error.gst}
                  />
                  <View style={commonStyle.pointerDisableInput}>
                    <Input
                      title={t("Additional Charges")}
                      value={additionalCharges}
                      onChangeText={setAdditionalCharges}
                      placeholder={t("Enter additional charges")}
                      regex={numberRegex}
                    />
                  </View>
                  <View style={commonStyle.pointerDisableInput}>
                    <Input
                      title={t("Discount")}
                      value={discount}
                      onChangeText={setDiscount}
                      placeholder={t("Enter discount")}
                    />
                  </View>
                  <Textarea
                    label={t("Notes")}
                    value={notes}
                    onChange={setNotes}
                    placeholder={t("Enter your notes")}
                  />
                  <PurchasePhoto
                    photo={uploadedImages}
                    setPhoto={setUploadedImages}
                  />
                  <UploadButton text="Upload Images" onPress={handleImageSheetOpen} />
                  <CustomBottomSheet title='Image' ref={imageSheetRef} onClose={handleImageSheetClose} height={100}>
                    <CameraGalleryChooser
                      onCameraPress={() => setShowCamera(true)}
                      onGalleryPress={handleImageUpload}
                    />
                  </CustomBottomSheet>
                  <Button title={t("Save")} onPress={handleSubmission} />
                </View>
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
              purchaseMaterials={purchaseMaterials}
              setPurchaseMaterials={setPurchaseMaterials}
              Ref={bottomSheetRef}
              addPurchaseMaterial={addPurchaseMaterial}
            />
          </CustomBottomSheet>
        </>
      )}
    </>

  );
};

