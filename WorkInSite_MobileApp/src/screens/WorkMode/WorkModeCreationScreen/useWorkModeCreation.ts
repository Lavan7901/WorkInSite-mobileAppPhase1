import {useState, useEffect} from 'react';
import {Alert, Keyboard} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import RouteName from '../../../navigation/RouteName';
import {WorkMode} from '../DTOs/WorkModeProps';
import {useWorkModeInputValidate} from '../useWorkModeInputValidate';
import {useWorkModeService} from '../../../services/WorkModeService';
import Toast from 'react-native-toast-message';
import {useLanguage} from '../../../context/LanguageContext';

export const useWorkModeCreation = ({navigation}: any) => {
  const route = useRoute<any>();
  const workmodeService = useWorkModeService();
  const isFocused = useIsFocused();
  const {t} = useLanguage();
  const [name, setName] = useState('');
  const [workModeDetails, setWorkModeDetails] = useState<WorkMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkModeId, setEditingWorkModeId] = useState<number | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkMode = async () => {
    setLoading(true);
    const data = await workmodeService.getWorkModes('');
    setWorkModeDetails(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      fetchWorkMode();
    }
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.name && isFocused) {
      setName(route.params.name);
    }
  }, [route.params?.name, isFocused]);

  const {error, validate, setError, initialError} = useWorkModeInputValidate({
    name,
  });

  const resetFormFields = () => {
    Keyboard.dismiss();
    setName('');
    setError(initialError);
    setIsEditing(false);
    setEditingWorkModeId(null);
  };

  const setEditingWorkMode = (workmode: {id: number; name: string}) => {
    setIsEditing(true);
    setEditingWorkModeId(workmode.id);
    setName(workmode.name); // Pre-fill input with name
  };

  const handleWorkModeUpdate = async () => {
    Keyboard.dismiss();
    if (validate() && editingWorkModeId !== null) {
      const workmode = {id: editingWorkModeId, name: name.trim()};
      try {
        const response = await workmodeService.updateWorkMode(
          editingWorkModeId,
          workmode,
        );
        if (response) {
          fetchWorkMode();
          resetFormFields();
          setIsEditing(false); // Exit edit mode
        }
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to update work mode';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  const hasUnsavedChanges = () => name.trim() !== '';

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
        [
          {text: 'Cancel', style: 'cancel'},
          {text: t('Save'), onPress: handleSubmission},
          {
            text: t('Exit Without Save'),
            onPress: () => {
              resetFormFields();
              navigation.navigate(RouteName.Home_SCREEN); // You may want to navigate here
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.Home_SCREEN); // You may want to navigate here
    }
    return true;
  };

  const handleWorkModeDelete = async (id: number) => {
    Alert.alert(
      t('Confirm Delete'),
      t('Are you sure you want to delete this Detail?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Delete'),
          onPress: async () => {
            try {
              await workmodeService.deleteWorkMode(id);
              fetchWorkMode();
            } catch (error: any) {
              const errorMsg =
                error?.response?.data?.message || 'Failed to delete work mode';
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMsg,
              });
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleSubmission = async () => {
    Keyboard.dismiss();
    if (validate()) {
      const workmode = {
        name: name.trim(),
      };
      try {
        const response = await workmodeService.createWorkMode(workmode);
        if (response.id) {
          fetchWorkMode();
        }
        resetFormFields();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to create work mode';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWorkMode();
    setRefreshing(false);
  };

  return {
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
    setEditingWorkMode,
  };
};
