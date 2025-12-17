import React, { useCallback, useRef } from 'react';
import { View, ScrollView, KeyboardAvoidingView, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import commonStyle from '../../../styles/commonStyle';
import { Input } from '../../../components/CommonComponets';
import Header from '../../../components/CommonComponets/Header/Header';
import Button from '../../../components/CommonComponets/Button/Button';
import Loader from '../../../components/Loader/Loader';
import { useMaterialEdit } from './useMaterialEdit';
import { useLanguage } from '../../../context/LanguageContext';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import { usePermission } from '../../../hook/usePermission';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

export const MaterialEditScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Material")
  const {
    name,
    setName,
    unitId,
    unitDetails,
    hsnCode,
    setHsnCode,
    error,
    handleSubmission,
    handleBackPress,
    fetchUnits,
    handleUnitChange,
    loading,
    hasUnsavedChanges,
  } = useMaterialEdit(id, { navigation });

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
      <Header title={t("Edit Material")} onBackPress={handleBackPress} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={commonStyle.inputfieldContainer}>
              <Input
                title={t("Material Name")}
                value={name}
                onChangeText={setName}
                placeholder={t("Enter material name")}
                required
                errorMessage={error.name}
                disabled={!editable}
              />
              <Combo
                label={t("Unit")}
                showCreateButton={false}
                items={unitDetails}
                selectedValue={unitId}
                onValueChange={handleUnitChange}
                onSearch={fetchUnits}
                required
                errorMessage={error.unitId}
                isDisabled={!editable}
              />
              <Input
                title={t("HSN Code")}
                value={hsnCode}
                onChangeText={setHsnCode}
                placeholder={t("Enter HSN code")}
                inputType="phone-pad"
                disabled={!editable}
                maxLength={15}
              />
              <Button title={t("Save")} onPress={handleSubmission} disable={!editable} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

