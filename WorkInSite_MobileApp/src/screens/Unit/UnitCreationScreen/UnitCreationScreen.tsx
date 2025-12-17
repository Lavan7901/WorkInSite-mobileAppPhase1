import React, { useCallback } from "react";
import { View, ScrollView, KeyboardAvoidingView, BackHandler, Text } from "react-native";
import { useUnitCreation } from "./useUnitCreation";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../../components/CommonComponets/Header/Header";
import commonStyle from "../../../styles/commonStyle";
import { Input } from "../../../components/CommonComponets";
import { nameRegex } from "../../../utils/regex";
import Button from "../../../components/CommonComponets/Button/Button";
import Loader from "../../../components/Loader/Loader";
import UnitListScreen from "../UnitListScreen/UnitListScreen";
import ToastNotification from "../../../components/CommonComponets/Toast/Toast";
import { useLanguage } from "../../../context/LanguageContext";
import { usePermission } from "../../../hook/usePermission";

export const UnitCreationScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Unit")
  const {
    name,
    unitDetails,
    loading,
    isEditing,
    error,
    editingUnitId,
    refreshing,
    handleRefresh,
    setName,
    resetFormFields,
    handleSubmission,
    handleBackPress,
    handleUnitUpdate,
    handleUnitDelete,
    setEditingUnit
  } = useUnitCreation({ navigation });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBackPress])
  );

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Create Unit")} onBackPress={handleBackPress} enableHome={false} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled style={{ flex: 1 }}>
          <View style={commonStyle.inputfieldContainer}>
            <Input
              title={t("Unit")}
              value={name}
              onChangeText={setName}
              placeholder={t("Enter unit")}
              errorMessage={error.name}
              regex={nameRegex}
              disabled={!editable}
              maxLength={50}
              required
            />
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Button
                buttonStyle={{ width: isEditing ? "45%" : "100%" }}
                title={isEditing ? t("Update") : t("Save")}
                onPress={isEditing ? handleUnitUpdate : handleSubmission}
                disable={!editable}
              />
              {isEditing && (
                <Button
                  variant="secondary"
                  buttonStyle={{ width: "45%" }}
                  title={t("Cancel")}
                  onPress={resetFormFields}
                  disable={!editable}
                />)}
            </View>
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>{t("Unit List")}</Text>
          </View>
          {loading ? <Loader /> : (
            <UnitListScreen
              unitDetails={unitDetails}
              handleUnitDelete={handleUnitDelete}
              handleUnitEdit={setEditingUnit}
              editingUnitId={editingUnitId}
              refreshing={refreshing}
              handleRefresh={handleRefresh}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </>
  );
};
