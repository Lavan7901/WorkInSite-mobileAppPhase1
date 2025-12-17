import React, { useCallback, useEffect, useRef } from "react";
import { View, BackHandler } from "react-native";
import { useUserCreation } from "./useUserCreation";
import Input from "../../../components/CommonComponets/Input/input";
import Header from "../../../components/CommonComponets/Header/Header";
import { UserCreationPinForm } from "../UserCreationPinForm/UserCreationPinForm";
import Button from "../../../components/CommonComponets/Button/Button";
import ToastNotification from "../../../components/CommonComponets/Toast/Toast";
import { useFocusEffect } from "@react-navigation/native";
import CustomBottomSheet from "../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet";
import commonStyle from "../../../styles/commonStyle";
import { nameRegex, numberRegex } from "../../../utils/regex";
import { useLanguage } from "../../../context/LanguageContext";
import RoleSelect from "../../../components/CommonComponets/RoleSelect/RoleSelect";

const UserCreationPage = ({ route, navigation }: any) => {
  const { t } = useLanguage();
  const { redirect, name: initialName } = route.params || {};
 useEffect(() => {
  if (initialName) {
    setName(initialName);
  } else {
    setName("");
  }
}, [initialName]);

  const bottomSheetRef = useRef<any>(null);

  const handleOnSave = () => {
    if (validate()) {
      bottomSheetRef.current?.open();
    }
  };

  const {
    name,
    setName,
    phoneNumber,
    setPhoneNumber,
    role,
    setRole,
    error,
    validate,
    roleList,
    userDetail,
    handleBack,
    hasUnsavedChanges,
  } = useUserCreation(redirect, navigation, handleOnSave);

  // ✅ handle Android back press properly
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBack();
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [hasUnsavedChanges])
  );

  return (
    <>
      <Header title={t("Create User")} onBackPress={handleBack} />
      <View style={commonStyle.container}>
        <View style={commonStyle.inputfieldContainer}>
          <View style={commonStyle.toast}>
            <ToastNotification />
          </View>

          {/* Name Input */}
          <Input
            title={t("Name")}
            placeholder={t("Enter name")}
            value={name}
            onChangeText={setName}
            errorMessage={error.name}
            required={true}
            inputContainerStyle={{ height: 50 }}
            regex={nameRegex}
          />

          {/* Phone Input */}
          <Input
            title={t("Phone Number")}
            placeholder={t("Enter phone number")}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            inputType="phone-pad"
            errorMessage={error.phoneNumber}
            required={true}
            maxLength={10}
            inputContainerStyle={{ height: 50 }}
            regex={numberRegex}
          />

          <RoleSelect
            label={t("Role")}
            items={roleList} // fetched via useUserCreation
            selectedValue={role}
            onValueChange={setRole}
            required={true}
            errorMessage={error.role}
          />

          <Button title={t("Save")} onPress={handleOnSave} />
        </View>

        <CustomBottomSheet
          ref={bottomSheetRef}
          title={t("Set up a PIN")}
          onClose={() => bottomSheetRef.current.close()}
        >
          <UserCreationPinForm
            redirect={redirect}
            navigation={navigation}
            userDetail={userDetail}
            bottomSheetRef={bottomSheetRef}
          />
        </CustomBottomSheet>
      </View>
    </>
  );
};

export default UserCreationPage;

