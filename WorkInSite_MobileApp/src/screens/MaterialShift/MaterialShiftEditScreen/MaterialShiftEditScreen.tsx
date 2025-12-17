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
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import { useMaterialShiftEdit } from './useMaterialShiftEdit';
import Loader from '../../../components/Loader/Loader';
import DatePicker from '../../../components/CommonComponets/DatePicker/DatePicker';
import { useLanguage } from '../../../context/LanguageContext';
import { usePermission } from '../../../hook/usePermission';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

export const MaterialShiftEditScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Material Shift")
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
    loading,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges,
  } = useMaterialShiftEdit(id, { navigation });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [hasUnsavedChanges])
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Edit Material Shift")} onBackPress={handleBackPress} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled>
          <ScrollView keyboardShouldPersistTaps="handled">
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
              <Combo
                label={t("Source Site")}
                items={siteDetails}
                selectedValue={sourceSiteId}
                onValueChange={setSourceSiteId}
                onSearch={fetchSites}
                placeholder={t("Select Source Site")}
                required={true}
                errorMessage={error.sourceSiteId}
                isDisabled={!editable}
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
              <Textarea
                label={t("Notes")}
                value={notes}
                onChange={setNotes}
                placeholder={t("Enter your notes")}
                isDisabled={!editable}
              />
              <Button title={t("Save")} onPress={handleSubmission} disable={!editable} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

