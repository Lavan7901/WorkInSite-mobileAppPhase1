import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Modal } from 'react-native';
import commonStyle from '../../../styles/commonStyle';
import Input from '../../../components/CommonComponets/Input/input';
import Button from '../../../components/CommonComponets/Button/Button';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import Select from '../../../components/CommonComponets/Select/Select';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import UploadButton from '../../../components/CommonComponets/UploadButton/UploadButton';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import CameraGalleryChooser from '../../../components/CommonComponets/CameraGalleryChooser/CameraGalleryChooser';
import DynamicCamera from '../../../components/CommonComponets/Camera/Camera';
import { useLanguage } from '../../../context/LanguageContext';
import { numberRegex } from '../../../utils/regex';
import { usePurchaseMaterialsEdit } from './usePurchaseMaterialsEdit';
import PurchasePhoto from '../PurchasePhoto/PurchasePhoto';
import { PurchaseMaterialCreationListProps, PurchaseMaterialUpdationListProps } from '../DTOs/PurchaseMaterialProps';

interface Props {
  newPurchaseMaterials: PurchaseMaterialCreationListProps[];
  setNewPurchaseMaterials: React.Dispatch<React.SetStateAction<PurchaseMaterialCreationListProps[]>>;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
  setUpdatedPurchaseMaterials?: React.Dispatch<React.SetStateAction<PurchaseMaterialUpdationListProps[]>>;
  selectedItem: {
    index: number;
    value: PurchaseMaterialCreationListProps | PurchaseMaterialUpdationListProps;
  };
  closeModal: () => void;
  removedPurchaseMaterialIds?: number[];
  setRemovedPurchaseMaterialIds?: React.Dispatch<React.SetStateAction<number[]>>;
}

const PurchaseMaterialsEditScreen = (props: Props) => {
  const { t } = useLanguage();

  const {
    materialId,
    setMaterialId,
    quantity,
    setQuantity,
    rate,
    setRate,
    additionalCharges,
    setAdditionalCharges,
    discount,
    setDiscount,
    receivedQuality,
    setReceivedQuality,
    receivedDate,
    setReceivedDate,
    receivedQuantity,
    setReceivedQuantity,
    notes,
    setNotes,
    materialDetails,
    fetchMaterials,
    ReceivedQualityItems,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    imageSheetRef,
    handleImageSheetOpen,
    handleImageSheetClose,
    showCamera,
    setShowCamera,
    handleSubmit,
    error,
    showImage,
    setShowImage,
    removedImages,
    setRemovedImages,
  } = usePurchaseMaterialsEdit(props);

  return (
    <>
      <Modal visible={showCamera} animationType="slide">
        <DynamicCamera
          onClose={() => setShowCamera(false)}
          onCapture={(metaList) =>
            setUploadedImages((prev) => [...prev, ...metaList])
          }
        />
      </Modal>
      <View style={commonStyle.container}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={commonStyle.customSheetInputfieldSpacer}>

              <Combo
                label={t("Material")}
                items={materialDetails}
                selectedValue={materialId}
                onValueChange={setMaterialId}
                onSearch={fetchMaterials}
                placeholder={t("Select Material")}
                required
                errorMessage={error.materialId}
              />

              <Input
                title={t("Quantity")}
                value={quantity}
                onChangeText={setQuantity}
                placeholder={t("Enter Quantity")}
                required
                regex={numberRegex}
                inputType='phone-pad'
                errorMessage={error.quantity}
              />

              <Input
                title={t("Rate (₹/Unit)")}
                value={rate}
                onChangeText={setRate}
                placeholder={t("Enter Rate")}
                required
                regex={numberRegex}
                inputType='phone-pad'
                errorMessage={error.rate}
              />

              <Input
                title={t("Additional Charges")}
                value={additionalCharges}
                onChangeText={setAdditionalCharges}
                placeholder={t("Enter Additional Charges")}
                regex={numberRegex}
                inputType='phone-pad'
              />

              <Input
                title={t("Discount")}
                value={discount}
                onChangeText={setDiscount}
                placeholder={t("Enter Discount")}
                regex={numberRegex}
                inputType='phone-pad'
              />

              <Select
                label={t("Received Quality")}
                items={ReceivedQualityItems}
                selectedValue={receivedQuality}
                onValueChange={setReceivedQuality}
                required
                errorMessage={error.receivedQuality}
              />

              <DatePicker
                date={receivedDate}
                onDateChange={setReceivedDate}
                label={t("Received Date")}
                required
                errorMessage={error.receivedDate}
              />

              <Input
                title={t("Received Quantity")}
                value={receivedQuantity}
                onChangeText={setReceivedQuantity}
                placeholder={t("Enter Received Quantity")}
                required
                regex={numberRegex}
                errorMessage={error.receivedQuantity}
                inputType='phone-pad'
              />
              <Textarea
                label={t("Notes")}
                // value={notes}
                value={notes && notes !== 'null' ? notes : ''}
                onChange={setNotes}
                placeholder={t("Enter your notes")}
              />
            
              <PurchasePhoto
                photo={uploadedImages}
                setPhoto={setUploadedImages}
                showImages={showImage}
                setShowImages={setShowImage}
                removeImages={removedImages}
                setRemoveImages={setRemovedImages}
              />
              <UploadButton text={t("Upload Images")} onPress={handleImageSheetOpen} />

              <CustomBottomSheet
                title={t("Images")}
                ref={imageSheetRef}
                onClose={handleImageSheetClose}
                height={150}
              >
                <CameraGalleryChooser
                  onCameraPress={() => {
                    handleImageSheetClose();
                    setTimeout(() => setShowCamera(true), 300);
                  }}
                  onGalleryPress={() => {
                    handleImageSheetClose();
                    handleImageUpload();
                  }}
                />

              </CustomBottomSheet>
              <Button title={t("Update")} onPress={handleSubmit} />

            </View>
          </ScrollView>
        
      </View>
    </>
  );
};

export default PurchaseMaterialsEditScreen;
