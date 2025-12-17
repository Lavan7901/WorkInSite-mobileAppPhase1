import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useWorkerCategoryService} from '../../../services/WorkerCategoryService';
import {useWorkerCategoryInputValidate} from '../InputValidate/WorkerCategoryInputValidate';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {WorkerRole} from '../DTOs/WorkerRoleProps';
import {useLanguage} from '../../../context/LanguageContext';

export const useWorkerCategoryCreation = ({navigation, route}: any) => {
  const redirect = route?.params?.redirect;
  const workerCategoryService = useWorkerCategoryService();
  const [name, setName] = useState(route?.params?.name || '');
  const [notes, setNotes] = useState('');
  const [workTypeList, setWorkTypeList] = useState<string[]>([]);
  const [workerRoleList, setWorkerRoleList] = useState<WorkerRole[]>([]);
  const isFocused = useIsFocused();
  const {t} = useLanguage();

  const {error, validate, setError, initialError} =
    useWorkerCategoryInputValidate(name, workTypeList, workerRoleList);

  useEffect(() => {
    if (route?.params?.name && isFocused) {
      setName(route?.params?.name);
    }
  }, [route?.params?.name && isFocused]);

  useEffect(() => {
    if (!isFocused) {
      setName('');
      setNotes('');
      setError(initialError);
      setWorkTypeList([]);
      setWorkerRoleList([]);
    }
  }, [isFocused]);

  const hasUnsavedChanges =
    name.trim() !== '' ||
    notes.trim() !== '' ||
    workTypeList.length !== 0 ||
    workerRoleList.length !== 0;

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
        {text: t('Cancel'), style: 'cancel'},
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
          name,
          workerRoles: workerRoleList,
          workTypes: workTypeList,
          note: notes,
        };
        const response = await workerCategoryService.createWorkerCategory(
          workerCategory,
        );
        if (redirect) {
          navigation.navigate(redirect, {
            workerCategoryId: response?.id || '',
            id: route?.params?.id || '',
          });
        } else {
          navigation.navigate(RouteName.WORKER_CATEGORY_LIST_SCREEN);
        }
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message ||
          'Failed to create worker category. Please try again.';
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
  };
};
