import React, { useCallback } from 'react';
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
import { useMaterialShiftCreation } from './useMaterialShiftCreation';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import { useLanguage } from '../../../context/LanguageContext';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const MaterialShiftCreationScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const {
    date,
    setDate,
    materialId,
    setMaterialId,
    sourceSiteId,
    setSourceSiteId,
    targetSiteId,
    setTargetSiteId,
    quantity,
    setQuantity,
    notes,
    setNotes,
    siteDetails,
    materialDetails,
    fetchSites,
    fetchMaterials,
    error,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges
  } = useMaterialShiftCreation({ navigation });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Create Material Shift")} onBackPress={handleBackPress} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={commonStyle.inputfieldContainer}>
              <DatePicker
                date={date}
                onDateChange={setDate}
                label={t("Date")}
                required
                defaultDate={true}
                errorMessage={error.date}
              />
              <Combo
                label={t("Material")}
                items={materialDetails}
                selectedValue={materialId}
                onValueChange={setMaterialId}
                onSearch={fetchMaterials}
                placeholder={t("Select Material")}
                required={true}
                errorMessage={error.materialId}
              />
              <Combo
                label={t("Source Site")}
                items={siteDetails}
                selectedValue={sourceSiteId}
                onValueChange={setSourceSiteId}
                onSearch={fetchSites}
                placeholder={t("Select Source Site")}
                required={true}
                errorMessage={error.sourceSiteId}
              />
              <Combo
                label={t("Target Site")}
                items={siteDetails}
                selectedValue={targetSiteId}
                onValueChange={setTargetSiteId}
                onSearch={fetchSites}
                placeholder={t("Select Target Site")}
                required={true}
                errorMessage={error.targetSiteId}
              />

              <Input
                title={t("Quantity")}
                value={quantity}
                onChangeText={setQuantity}
                placeholder={t("Enter Quantity")}
                required={true}
                errorMessage={error.quantity}
              />
              <Textarea
                label={t("Notes")}
                value={notes}
                onChange={setNotes}
                placeholder={t("Enter your notes")}
              />
              <Button title={t("Save")} onPress={handleSubmission} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export { MaterialShiftCreationScreen };