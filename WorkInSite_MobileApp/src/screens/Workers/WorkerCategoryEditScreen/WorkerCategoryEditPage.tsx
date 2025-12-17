import React, { useCallback, useRef } from 'react';
import { BackHandler, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/CommonComponets/Header/Header';
import { Input } from '../../../components/CommonComponets';
import commonStyle from '../../../styles/commonStyle';
import { nameRegex } from '../../../utils/regex';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import Button from '../../../components/CommonComponets/Button/Button';
import CustomBottomSheet from '../../../components/CommonComponets/CustomBottomSheet/CustomBottomSheet';
import WorkTypeCreateForm from "../WorkTypeCreateForm/WorkTypeCreateForm"
import WorkTypeList from '../WorkTypeList/WorkTypeList';
import WorkerRoleCreateForm from '../WorkerRoleCreateForm/WorkerRoleCreateForm';
import WorkerRoleList from '../WorkerRoleList/WorkerRoleList';
import { useWorkerCategoryCreation } from './useWorkerCategoryEdit';
import ToastNotification from '../../../components/CommonComponets/Toast/Toast';
import { useLanguage } from '../../../context/LanguageContext';
import { FormActionButton } from '../../../components/CommonComponets/FormActionButton/FormActionButton';
import { usePermission } from '../../../hook/usePermission';
import Loader from '../../../components/Loader/Loader';

const WorkerCategoryEditPage = ({ navigation, route }: any) => {
  const { t } = useLanguage();
  const { canEdit } = usePermission()
  const editable = canEdit("Worker Category")
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
    updateworkerRoleList,
    setUpdateWorkerRoleList,
    deleteworkerRoleList,
    setDeleteWorkerRoleList,
    updatedWorkTypeList,
    setUpdatedWorkTypeList,
    deletedWorkTypeList,
    setDeletedWorkTypeList,
    loading
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

  if (loading) return <Loader />

  return (
    <>
      <View style={{ zIndex: 9 }}>
        <ToastNotification />
      </View>
      <Header title={t("Edit Worker Category")} onBackPress={handleBack} />
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
            disabled={!editable}
          />
          <FormActionButton
            heading={t("Work Type")}
            iconType="plus-circle"
            onClick={() => handleAdd("Type")}
            required={true}
            isIconDisabled={!editable}
            errorMessage={error.workTypeList}
          />
          {error.workerRoleList &&
            <Text style={commonStyle.error}>{error.workTypeList}</Text>}
          <CustomBottomSheet
            ref={bottomSheetRef}
            title={t("Create Work Type")}
            onClose={() => bottomSheetRef.current.close()}>
            <WorkTypeCreateForm
              workTypeList={workTypeList}
              setWorkTypeList={setWorkTypeList}
              updatedWorkTypeList={updatedWorkTypeList}
              bottomSheetRef={bottomSheetRef}
            />
          </CustomBottomSheet>
          <WorkTypeList
            workTypeList={workTypeList}
            setWorkTypeList={setWorkTypeList}
            updatedWorkTypeList={updatedWorkTypeList}
            setUpdatedWorkTypeList={setUpdatedWorkTypeList}
            deletedWorkTypeList={deletedWorkTypeList}
            setDeletedWorkTypeList={setDeletedWorkTypeList}
          />
          <FormActionButton
            heading={t("Worker Role")}
            iconType="plus-circle"
            onClick={() => handleAdd("Role")}
            required={true}
            isIconDisabled={!editable}
          />
          {error.workerRoleList &&
            <Text style={commonStyle.error}>{error.workerRoleList}</Text>}
          <WorkerRoleList
            workerRoleList={workerRoleList}
            setWorkerRoleList={setWorkerRoleList}
            updateworkerRoleList={updateworkerRoleList}
            setUpdateWorkerRoleList={setUpdateWorkerRoleList}
            deleteworkerRoleList={deleteworkerRoleList}
            setDeleteWorkerRoleList={setDeleteWorkerRoleList}
          />
          <CustomBottomSheet
            ref={workerRolebottomSheetRef}
            title={t("Create Worker Role")}
            onClose={() => workerRolebottomSheetRef.current.close()}>
            <WorkerRoleCreateForm
              workerRoleList={workerRoleList}
              setWorkerRoleList={setWorkerRoleList}
              updateworkerRoleList={updateworkerRoleList}
              bottomSheetRef={workerRolebottomSheetRef}
            />
          </CustomBottomSheet>
          <Textarea
            label={t("Notes")}
            placeholder={t("Enter your notes")}
            value={notes}
            onChange={setNotes}
            isDisabled={!editable}
          />
          <Button
            buttonStyle={{ marginTop: 10 }}
            title={t("Save")}
            onPress={handleSubmission}
            disable={!editable}
          />
        </View>
      </ScrollView>
    </>
  );
};

export { WorkerCategoryEditPage };

