import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useWorkerCategoryService} from '../../../services/WorkerCategoryService';
import {useWorkerCategoryInputValidate} from '../InputValidate/WorkerCategoryInputValidate';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused} from '@react-navigation/native';
import {WorkerCategoryProps} from '../DTOs/WorkerCategoryProps';
import Toast from 'react-native-toast-message';
import {WorkerRole, WorkerRoles} from '../DTOs/WorkerRoleProps';
import {WorkType} from '../DTOs/WorkTypeProps';
import {useLanguage} from '../../../context/LanguageContext';

export const useWorkerCategoryCreation = ({navigation, route}: any) => {
  const {workerCategoryId, redirect} = route.params;
  const workerCategoryService = useWorkerCategoryService();
  const {t} = useLanguage();
  const [name, setName] = useState(route?.params?.name || '');
  const [notes, setNotes] = useState('');
  const [workTypeList, setWorkTypeList] = useState<any>([]);
  const [updatedWorkTypeList, setUpdatedWorkTypeList] = useState<WorkType[]>(
    [],
  );
  const [deletedWorkTypeList, setDeletedWorkTypeList] = useState<number[]>([]);
  const [workerRoleList, setWorkerRoleList] = useState<WorkerRole[]>([]);
  const [updateworkerRoleList, setUpdateWorkerRoleList] = useState<
    WorkerRoles[]
  >([]);
  const [deleteworkerRoleList, setDeleteWorkerRoleList] = useState<number[]>(
    [],
  );
  const [workerCategoryList, setWorkerCategoryList] =
    useState<WorkerCategoryProps>();
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  const {error, validate, setError, initialError} =
    useWorkerCategoryInputValidate(
      name,
      [...workTypeList, ...updatedWorkTypeList],
      [...workerRoleList, ...updateworkerRoleList],
    );

  const fetchWorkerCategory = async () => {
    setLoading(true);
    try {
      const workerCategory = await workerCategoryService.getWorkerCategory(
        parseInt(workerCategoryId),
      );
      setName(workerCategory.name);
      setWorkerCategoryList(workerCategory);
      setNotes(workerCategory.note);
      setUpdatedWorkTypeList(workerCategory.workTypes);
      setUpdateWorkerRoleList(workerCategory.workerRoles);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.[0]?.message ||
        'Could not fetch worker category. Please try again';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchWorkerCategory();
    } else {
      setName('');
      setNotes('');
      setError(initialError);
      setWorkTypeList([]);
      setWorkerRoleList([]);
      setDeleteWorkerRoleList([]);
      setUpdateWorkerRoleList([]);
      setDeletedWorkTypeList([]);
      setUpdatedWorkTypeList([]);
    }
  }, [isFocused]);

  const hasUnsavedChanges =
    name.trim() !== workerCategoryList?.name?.trim() ||
    notes.trim() !== workerCategoryList?.note?.trim() ||
    workerRoleList?.length > 0 ||
    workTypeList?.length > 0 ||
    updateworkerRoleList?.length !==
      (workerCategoryList?.workerRoles?.length || 0) ||
    updatedWorkTypeList?.length !==
      (workerCategoryList?.workTypes?.length || 0) ||
    [...updateworkerRoleList]
      .sort((a, b) => a?.id - b?.id)
      .some((role, i) => {
        const original = [...(workerCategoryList?.workerRoles || [])]?.sort(
          (a, b) => a?.id - b?.id,
        )[i];
        return (
          role?.id !== original?.id ||
          role?.name.trim() !== original?.name?.trim() ||
          role?.salaryPerShift.trim() !== original?.salaryPerShift?.trim() ||
          role?.hoursPerShift.trim() !== original?.hoursPerShift?.trim()
        );
      }) ||
    [...updatedWorkTypeList]
      .sort((a, b) => a?.id - b?.id)
      .some((type, i) => {
        const original = [...(workerCategoryList?.workTypes || [])]?.sort(
          (a, b) => a?.id - b?.id,
        )[i];
        return (
          type?.id !== original?.id ||
          type.name?.trim() !== original?.name?.trim()
        );
      });

  const handleNavigation = () => {
    if (redirect) {
      navigation.navigate(redirect, {
        id: route?.params?.id || '',
      });
    } else {
      navigation.navigate(RouteName.WORKER_CATEGORY_LIST_SCREEN);
    }
  };

  const showUnsavedChangesAlert = () => {
    Alert.alert(
      t('Unsaved Changes'),
      t('You have unsaved changes. Do you want to save before exiting?'),
      [
        {text: t('Save'), onPress: handleSubmission},
        {
          text: t('Exit Without Saving'),
          onPress: () => handleNavigation(),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const handleBack = () => {
    hasUnsavedChanges ? showUnsavedChangesAlert() : handleNavigation();
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const workerCategory = {
          name: name?.trim(),
          note: notes.trim(),
          newWorkTypes: workTypeList,
          updatedWorkTypes: updatedWorkTypeList,
          deletedWorkTypes: deletedWorkTypeList,
          newWorkerRoles: workerRoleList,
          updatedWorkerRoles: updateworkerRoleList,
          deletedWorkerRoles: deleteworkerRoleList,
        };

        await workerCategoryService.updateWorkerCategory(
          parseInt(workerCategoryId),
          workerCategory,
        );
        if (redirect) {
          navigation.navigate(redirect, {
            workerCategoryId,
            id: route?.params?.id || '',
          });
        } else {
          navigation.navigate(RouteName.WORKER_CATEGORY_LIST_SCREEN);
        }
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message ||
          'Could not update worker category. Please try again';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  return {
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
    loading,
  };
};
