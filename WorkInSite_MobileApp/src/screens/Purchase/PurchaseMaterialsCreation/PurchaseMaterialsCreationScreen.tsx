import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Modal } from "react-native";
import commonStyle from "../../../styles/commonStyle";
import Input from "../../../components/CommonComponets/Input/input";
import Button from "../../../components/CommonComponets/Button/Button";
import { Combo } from "../../../components/CommonComponets/Combo/Combo";
import Textarea from "../../../components/CommonComponets/Notes/Notes";
import Select from "../../../components/CommonComponets/Select/Select";
import DatePicker from "../../../components/CommonComponets/DatePicker/DatePicker";
import UploadButton from "../../../components/CommonComponets/UploadButton/UploadButton";
import CustomBottomSheet from "../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet";
import CameraGalleryChooser from "../../../components/CommonComponets/CameraGalleryChooser/CameraGalleryChooser";
import DynamicCamera from "../../../components/CommonComponets/Camera/Camera";
import { useLanguage } from "../../../context/LanguageContext";
import { numberRegex } from "../../../utils/regex";
import { usePurchaseMaterialsCreation } from "./usePurchaseMaterialsCreation";
import PurchasePhoto from "../PurchasePhoto/PurchasePhoto";
import { PurchaseMaterialCreationListProps, PurchaseMaterialUpdationListProps } from "../DTOs/PurchaseMaterialProps";

interface PurchaseMaterialsProps {
  purchaseMaterials: PurchaseMaterialCreationListProps[];
  setPurchaseMaterials: (value: PurchaseMaterialCreationListProps[]) => void;
  Ref?: any;
  addPurchaseMaterial: (item: PurchaseMaterialCreationListProps) => void;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
}

const PurchaseMaterialsCreationScreen: React.FC<PurchaseMaterialsProps> = ({ purchaseMaterials, setPurchaseMaterials, Ref, addPurchaseMaterial, updatedPurchaseMaterials }) => {
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
    handleAddPurchaseItem,
    error,
  } = usePurchaseMaterialsCreation({ purchaseMaterials, setPurchaseMaterials, Ref, addPurchaseMaterial, updatedPurchaseMaterials });

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
                inputType='phone-pad'
                placeholder={t("Enter Additional Charges")}
                regex={numberRegex}
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
                defaultDate={true}
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
                value={notes}
                onChange={setNotes}
                placeholder={t("Enter your notes")}
              />

              <PurchasePhoto photo={uploadedImages} setPhoto={setUploadedImages} />
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


              <Button title={t("Add")} onPress={handleAddPurchaseItem} />

            </View>
          </ScrollView>
      </View>
    </>
  );
};

export default PurchaseMaterialsCreationScreen;
