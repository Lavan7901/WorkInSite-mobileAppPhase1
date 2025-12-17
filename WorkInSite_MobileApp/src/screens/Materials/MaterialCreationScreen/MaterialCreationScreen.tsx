import React, { useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import commonStyle from '../../../styles/commonStyle';
import { Input } from '../../../components/CommonComponets';
import Header from '../../../components/CommonComponets/Header/Header';
import Button from '../../../components/CommonComponets/Button/Button';
import { useMaterialCreation } from './useMaterialCreation';
import { useLanguage } from '../../../context/LanguageContext';
import { Combo } from '../../../components/CommonComponets/Combo/Combo';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';

const MaterialCreationScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const {
    name,
    setName,
    unitId,
    setUnitId,
    unitDetails,
    hsnCode,
    setHsnCode,
    error,
    handleSubmission,
    handleBackPress,
    fetchUnits,
  } = useMaterialCreation({ navigation });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [handleBackPress]),
  );

  return (
    <>
      <Header title={t("Create Material")} onBackPress={handleBackPress} />
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={commonStyle.inputfieldContainer}>
              <Input
                title={t("Material Name")}
                value={name}
                onChangeText={setName}
                placeholder={t("Enter material")}
                required={true}
                errorMessage={error.name}
              />
              <Combo
                label={t("Unit")}
                showCreateButton={false}
                items={unitDetails}
                selectedValue={unitId}
                onValueChange={setUnitId}
                onSearch={fetchUnits}
                required={true}
                errorMessage={error.unitId}
              />
              <Input
                title={t("HSN Code")}
                value={hsnCode}
                onChangeText={setHsnCode}
                placeholder={t("Enter HSN code")}
                inputType="phone-pad"
                maxLength={15}
              />
              <Button title={t("Save")} onPress={handleSubmission} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export { MaterialCreationScreen };
