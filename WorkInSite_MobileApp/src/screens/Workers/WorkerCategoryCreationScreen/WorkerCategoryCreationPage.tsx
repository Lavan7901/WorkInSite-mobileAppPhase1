import React, { useCallback, useRef } from 'react';
import { BackHandler, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/CommonComponets/Header/Header';
import { Input } from '../../../components/CommonComponets';
import commonStyle from '../../../styles/commonStyle';
import { nameRegex } from '../../../utils/regex';
import { useWorkerCategoryCreation } from './useWorkerCategoryCreation';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import Button from '../../../components/CommonComponets/Button/Button';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import WorkTypeCreateForm from "../WorkTypeCreateForm/WorkTypeCreateForm"
import WorkTypeList from '../WorkTypeList/WorkTypeList';
import WorkerRoleCreateForm from '../WorkerRoleCreateForm/WorkerRoleCreateForm';
import WorkerRoleList from '../WorkerRoleList/WorkerRoleList';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { useLanguage } from '../../../context/LanguageContext';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';

const WorkerCategoryCreationPage = ({ navigation, route }: any) => {
  const { t } = useLanguage();
  const {
    name,
    setName,
    notes,
    setNotes,
    error,
    handleBack,
    handleSubmission,
    workTypeList,
    setWorkTypeList,
    workerRoleList,
    setWorkerRoleList,
  } = useWorkerCategoryCreation({ navigation, route });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBack();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [handleBack])
  );
  const bottomSheetRef = useRef<any>(null);
  const workerRolebottomSheetRef = useRef<any>(null);

  const handleAdd = (type: "Type" | "Role") => {
    if (type === "Type" && bottomSheetRef?.current) {
      bottomSheetRef.current.open();
    } else if (type === "Role" && workerRolebottomSheetRef?.current) {
      workerRolebottomSheetRef.current.open();
    }
  };
  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Create Worker Category")} onBackPress={handleBack} />
      <ScrollView style={commonStyle.container} keyboardShouldPersistTaps="handled">
        <View style={commonStyle.inputfieldContainer}>
          <Input
            title={t("Worker Category Name")}
            placeholder={t("Enter worker category name")}
            value={name}
            onChangeText={setName}
            errorMessage={error.name}
            required
            regex={nameRegex}
            maxLength={50}
          />
          <FormActionButton
            heading={t("Work Type")}
            iconType="plus-circle"
            onClick={() => handleAdd("Type")}
            required={true}
          />
          {error.workTypeList &&
            <Text style={commonStyle.error}>{error.workTypeList}</Text>
          }
          <CustomBottomSheet
            ref={bottomSheetRef}
            title={t("Create Work Type")}
            onClose={() => bottomSheetRef.current.close()}>
            <WorkTypeCreateForm
              workTypeList={workTypeList}
              setWorkTypeList={setWorkTypeList}
              bottomSheetRef={bottomSheetRef}
            />
          </CustomBottomSheet>
          <WorkTypeList
            workTypeList={workTypeList}
            setWorkTypeList={setWorkTypeList}
          />
          <FormActionButton
            heading={t("Worker Role")}
            iconType="plus-circle"
            onClick={() => handleAdd("Role")}
            required={true}
          />
          {error.workerRoleList &&
            <Text style={commonStyle.error}>{error.workerRoleList}</Text>
          }
          <WorkerRoleList
            workerRoleList={workerRoleList}
            setWorkerRoleList={setWorkerRoleList}
          />
          <CustomBottomSheet
            ref={workerRolebottomSheetRef}
            title={t("Create Worker Role")}
            onClose={() => workerRolebottomSheetRef.current.close()}
            height={500}
          >
            <WorkerRoleCreateForm
              workerRoleList={workerRoleList}
              setWorkerRoleList={setWorkerRoleList}
              bottomSheetRef={workerRolebottomSheetRef}
            />
          </CustomBottomSheet>
          <Textarea
            label={t("Notes")}
            placeholder={t("Enter your notes")}
            value={notes}
            onChange={setNotes}
          />
          <Button
            buttonStyle={{ marginTop: 10 }}
            title={t("Save")}
            onPress={handleSubmission}
          />
        </View>
      </ScrollView>
    </>
  );
};

export { WorkerCategoryCreationPage };

