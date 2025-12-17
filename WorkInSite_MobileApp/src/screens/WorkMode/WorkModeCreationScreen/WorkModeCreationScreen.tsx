import React, { useCallback } from "react";
import { View, KeyboardAvoidingView, BackHandler, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../../components/CommonComponets/Header/Header";
import commonStyle from "../../../styles/commonStyle";
import { Input } from "../../../components/CommonComponets";
import Button from "../../../components/CommonComponets/Button/Button";
import Loader from "../../../components/Loader/Loader";
import { useWorkModeCreation } from "./useWorkModeCreation";
import WorkModeListScreen from "../WorkModeListScreen/WorkModeListScreen";
import { nameRegex } from "../../../utils/regex";
import ToastNotification from "../../../components/CommonComponets/Toast/Toast";
import { useLanguage } from "../../../context/LanguageContext";
import { usePermission } from "../../../hook/usePermission";

export const WorkModeCreationScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Work Mode")
  const {
    name,
    workModeDetails,
    loading,
    isEditing,
    error,
    editingWorkModeId,
    refreshing,
    handleRefresh,
    setName,
    resetFormFields,
    handleSubmission,
    handleBackPress,
    handleWorkModeUpdate,
    handleWorkModeDelete,
    setEditingWorkMode
  } = useWorkModeCreation({ navigation });

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
      <Header title={t("Create Work Mode")} onBackPress={handleBackPress} enableHome={false} />
      <View style={commonStyle.container}>
        <KeyboardAvoidingView enabled style={{ flex: 1 }}>
          <View style={commonStyle.inputfieldContainer}>
            <Input
              title={t("Work Mode")}
              value={name}
              onChangeText={setName}
              placeholder={t("Enter work mode")}
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
                onPress={isEditing ? handleWorkModeUpdate : handleSubmission}
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
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>{t("Work Mode List")}</Text>
          </View>
          {loading ? <Loader /> : (
            <WorkModeListScreen
              workModeDetails={workModeDetails}
              handleWorkModeDelete={handleWorkModeDelete}
              handleWorkModeEdit={setEditingWorkMode}
              editingWorkModeId={editingWorkModeId}
              refreshing={refreshing}
              handleRefresh={handleRefresh}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </>
  );
};
