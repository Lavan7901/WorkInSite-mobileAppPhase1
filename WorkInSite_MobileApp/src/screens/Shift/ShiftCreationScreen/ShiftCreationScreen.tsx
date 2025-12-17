import React, { useCallback } from "react";
import { View, ScrollView, KeyboardAvoidingView, BackHandler, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useShiftCreation } from "./useShiftCreation";
import Header from "../../../components/CommonComponets/Header/Header";
import commonStyle from "../../../styles/commonStyle";
import { Input } from "../../../components/CommonComponets";
import Button from "../../../components/CommonComponets/Button/Button";
import Loader from "../../../components/Loader/Loader";
import { nameRegex } from "../../../utils/regex";
import ShiftListScreen from "../ShiftListScreen/ShiftListScreen";
import { useLanguage } from "../../../context/LanguageContext";
import { usePermission } from "../../../hook/usePermission";
import ToastNotification from "../../../components/CommonComponets/Toast/Toast";

export const ShiftCreationScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Shift")
  const {
    name,
    loading,
    shiftDetails,
    isEditing,
    error,
    editingShiftId,
    refreshing,
    setName,
    resetFormFields,
    handleSubmission,
    handleUpdate,
    handleBackPress,
    handleShiftDelete,
    setEditingShift,
    handleRefresh,
    setMultiplier,
    multiplier,
    isFixedMultiplier
  } = useShiftCreation({ navigation });

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
      <Header title={t("Create Shift")} onBackPress={handleBackPress} enableHome={false} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled style={{ flex: 1 }}>
          <View style={commonStyle.inputfieldContainer}>
            <Input
              title={t("Shift")}
              value={name}
              onChangeText={setName}
              placeholder={t("Enter Shift")}
              errorMessage={error.name}
              regex={nameRegex}
              disabled={!editable}
              maxLength={50}
              required
            />
            <Input
              title={t("Multiplier (00.00)")}
              value={multiplier}
              onChangeText={setMultiplier}
              placeholder={t("Enter Multiplier")}
              errorMessage={error.multiplier}
              inputType="numeric"
              disabled={!editable || isFixedMultiplier}
              maxLength={5}
              required
            />
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Button
                buttonStyle={{ width: isEditing ? "45%" : "100%" }}
                title={isEditing ? t("Update") : t("Save")}
                onPress={isEditing ? handleUpdate : handleSubmission}
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
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>{t("Shift List")}</Text>
          </View>
          {loading ? <Loader /> : (
            <ShiftListScreen
              shiftDetails={shiftDetails}
              handleShiftDelete={handleShiftDelete}
              handleShiftEdit={setEditingShift}
              editingShiftId={editingShiftId}
              refreshing={refreshing}
              handleRefresh={handleRefresh}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </>
  );
};
