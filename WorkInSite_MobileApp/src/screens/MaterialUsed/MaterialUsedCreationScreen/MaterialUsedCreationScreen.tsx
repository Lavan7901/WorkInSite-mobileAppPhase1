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
import { useMaterialUsedCreation } from './useMaterialUsedCreation';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import { useLanguage } from '../../../context/LanguageContext';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const MaterialUsedCreationScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const {
    siteId,
    setSiteId,
    materialId,
    setMaterialId,
    quantity,
    setQuantity,
    notes,
    setNotes,
    date,
    setDate,
    workModeId,
    setWorkModeId,
    siteDetails,
    materialDetails,
    workModeDetails,
    error,
    fetchWorkModes,
    hasUnsavedChanges,
    fetchSites,
    fetchMaterials,
    handleSubmission,
    handleBackPress,
  } = useMaterialUsedCreation({ navigation });

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
      <Header title={t("Create Material Used")} onBackPress={handleBackPress} />
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
                label={t("Material")}
                items={materialDetails}
                selectedValue={materialId}
                onValueChange={setMaterialId}
                onSearch={fetchMaterials}
                placeholder={t("Select Material")}
                required={true}
                errorMessage={error.materialId}
              />
              <Input
                title={t("Quantity")}
                value={quantity}
                onChangeText={setQuantity}
                placeholder={t("Enter Quantity")}
                required={true}
                errorMessage={error.quantity}
              />
              <Combo
                label={t("Work Mode")}
                items={workModeDetails}
                selectedValue={workModeId}
                onValueChange={setWorkModeId}
                onSearch={fetchWorkModes}
                placeholder={t("Select Work Mode")}
                required={true}
                errorMessage={error.workModeId}
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

export { MaterialUsedCreationScreen };

