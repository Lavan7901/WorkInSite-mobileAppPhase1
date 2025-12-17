import React, { useCallback } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../../../components/CommonComponets/Header/Header';
import { Input } from '../../../components/CommonComponets';
import Button from '../../../components/CommonComponets/Button/Button';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import { useWorkRateAbstractEdit } from './useWorkRateAbstractEdit';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../../components/Loader/Loader';
import commonStyle from '../../../styles/commonStyle';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { useLanguage } from '../../../context/LanguageContext';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import { usePermission } from '../../../hook/usePermission';

const WorkRateAbstractEdit = ({ navigation, route }: any) => {
  const { t } = useLanguage();
  const {
    siteDetails,
    workTypeId,
    totalRate,
    totalQuantity,
    notes,
    siteId,
    unitId,
    error,
    workTypeDetails,
    unitDetails,
    loading,
    hasUnsavedChanges,
    handleBackPress,
    setSiteId,
    handleSubmission,
    setWorkTypeId,
    setUnitId,
    setTotalRate,
    setTotalQuantity,
    setNotes,
    fetchWorkTypes,
    fetchUnits,
    fetchSites,
  } = useWorkRateAbstractEdit({ navigation, route })

  const { canEdit } = usePermission()
  const editable = canEdit('Work Rate Abstract"');

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
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Work Rate Abstract Edit")} onBackPress={handleBackPress} />
      <ScrollView style={commonStyle.flexContainer} keyboardShouldPersistTaps="handled">
        <View style={{ padding: 16, gap: 10 }}>
          <Combo
            label={t("Site")}
            items={siteDetails}
            selectedValue={siteId}
            onValueChange={setSiteId}
            required
            onSearch={fetchSites}
            errorMessage={error.site}
            isDisabled={!editable}
          />
          <Combo
            label={t("Work Type")}
            items={workTypeDetails}
            selectedValue={workTypeId}
            onValueChange={setWorkTypeId}
            required
            onSearch={fetchWorkTypes}
            errorMessage={error.workType}
            isDisabled={!editable}
          />
          <Input
            title={t("Total Rate")}
            placeholder={t("Enter Total Rate")}
            value={totalRate}
            onChangeText={setTotalRate}
            inputType='numeric'
            required
            errorMessage={error.totalRate}
            disabled={!editable}
          />
          <Input
            title={t("Total Quantity")}
            placeholder={t("Enter Total Quantity")}
            value={totalQuantity}
            onChangeText={setTotalQuantity}
            inputType='numeric'
            required
            errorMessage={error.totalQuantity}
            disabled={!editable}
          />
          <Combo
            label={t("Unit")}
            items={unitDetails}
            selectedValue={unitId}
            onValueChange={setUnitId}
            onSearch={fetchUnits}
            required
            errorMessage={error.unit}
            isDisabled={!editable}
          />
          <Textarea
            label={t("Remark")}
            placeholder={t("Enter your Remark")}
            value={notes}
            onChange={setNotes}
            isDisabled={!editable}
          />
          <Button title={t("Save")} onPress={handleSubmission} disable={!editable} />
        </View>
      </ScrollView>
    </>
  );
};

export default WorkRateAbstractEdit;


