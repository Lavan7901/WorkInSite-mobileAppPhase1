import React, { useCallback } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../../../components/CommonComponets/Header/Header';
import { Input } from '../../../components/CommonComponets';
import Button from '../../../components/CommonComponets/Button/Button';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import { useWorkRateAbstractCreate } from './useWorkRateAbstractCreate';
import { useFocusEffect } from '@react-navigation/native';
import commonStyle from '../../../styles/commonStyle';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { useLanguage } from '../../../context/LanguageContext';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import { numberRegex } from '../../../utils/regex';

const WorkRateAbstractCreation = ({ navigation }: any) => {
  const { t } = useLanguage();
  const {
    siteDetails,
    workTypeDetails,
    error,
    siteId,
    unitId,
    unitDetails,
    workTypeId,
    totalRate,
    totalQuantity,
    notes,
    handleBackPress,
    hasUnsavedChanges,
    setSiteId,
    fetchSites,
    fetchWorkTypes,
    fetchUnits,
    setWorkTypeId,
    setTotalRate,
    setTotalQuantity,
    setNotes,
    handleSubmit,
    setUnitId,
  } = useWorkRateAbstractCreate(navigation)

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
      <Header title={t("Create Work Rate Abstract")} onBackPress={handleBackPress} />
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
          />
          <Combo
            label={t("Work Type")}
            items={workTypeDetails}
            selectedValue={workTypeId}
            onValueChange={setWorkTypeId}
            required
            onSearch={fetchWorkTypes}
            errorMessage={error.workType}
          />
          <Input
            title={t("Total Rate")}
            placeholder={t("Enter Total Rate")}
            value={totalRate}
            onChangeText={setTotalRate}
            inputType='numeric'
            required
            errorMessage={error.totalRate}
            regex={numberRegex}
          />
          <Input
            title={t("Total Quantity")}
            placeholder={t("Enter Total Quantity")}
            value={totalQuantity}
            onChangeText={setTotalQuantity}
            inputType='numeric'
            required
            errorMessage={error.totalQuantity}
            regex={numberRegex}
          />
          <Combo
            label={t("Unit")}
            items={unitDetails}
            selectedValue={unitId}
            onValueChange={setUnitId}
            onSearch={fetchUnits}
            required
            errorMessage={error.unit}
          />
          <Textarea
            label={t("Remark")}
            placeholder={t("Enter your Remark")}
            value={notes}
            onChange={setNotes}
          />
          <Button title={t("Save")} onPress={handleSubmit} />
        </View>
      </ScrollView>
    </>
  );
};

export default WorkRateAbstractCreation;



