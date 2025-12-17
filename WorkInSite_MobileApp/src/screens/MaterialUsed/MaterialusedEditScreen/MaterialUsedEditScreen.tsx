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
import Loader from '../../../components/Loader/Loader';
import { useMaterialUsedEdit } from './useMaterialUsedEdit';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import { useLanguage } from '../../../context/LanguageContext';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import { usePermission } from '../../../hook/usePermission';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

export const MaterialUsedEditScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Material Used")
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
    materialUsedDetails,
    error,
    materialDetails,
    siteDetails,
    workModeDetails,
    loading,
    workModeId,
    setWorkModeId,
    fetchSites,
    fetchMaterials,
    fetchWorkModes,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges,
  } = useMaterialUsedEdit(id, { navigation });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges]),
  );


  if (loading) return <Loader />;

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Edit Material Used")} onBackPress={handleBackPress} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled>
          <ScrollView keyboardShouldPersistTaps="handled">
            {materialUsedDetails && (
              <View style={commonStyle.inputfieldContainer}>
                <DatePicker
                  date={date}
                  onDateChange={setDate}
                  label={t("Date")}
                  required
                  errorMessage={error.date}
                  disable={!editable}
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
                  label={t("Material")}
                  items={materialDetails}
                  selectedValue={materialId}
                  onValueChange={setMaterialId}
                  onSearch={fetchMaterials}
                  placeholder={t("Select Material")}
                  required={true}
                  errorMessage={error.materialId}
                  isDisabled={!editable}
                />
                <Input
                  title={t("Quantity")}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder={t("Enter Quantity")}
                  required={true}
                  errorMessage={error.quantity}
                  disabled={!editable}
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
                  isDisabled={!editable}
                />
                <Textarea
                  label={t("Notes")}
                  value={notes}
                  onChange={setNotes}
                  placeholder={t("Enter your notes")}
                  isDisabled={!editable}
                />
                <Button title={t("Save")} onPress={handleSubmission} disable={!editable} />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};
