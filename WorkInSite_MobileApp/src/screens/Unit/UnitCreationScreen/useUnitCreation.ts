import {useState, useEffect} from 'react';
import {Alert, Keyboard} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {Unit} from '../DTOs/UnitProps';
import {useUnitService} from '../../../services/UnitService';
import {useUnitInputValidate} from '../useUnitInputValidate';
import RouteName from '../../../navigation/RouteName';
import Toast from 'react-native-toast-message';
import {useLanguage} from '../../../context/LanguageContext';

export const useUnitCreation = ({navigation}: any) => {
  const route = useRoute<any>();
  const unitService = useUnitService();
  const isFocused = useIsFocused();
  const {t} = useLanguage();
  const [name, setName] = useState('');
  const [unitDetails, setUnitDetails] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUnit = async () => {
    setLoading(true);
    const data = await unitService.getUnits('');
    setUnitDetails(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      fetchUnit();
    }
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.name && isFocused) {
      setName(route.params.name);
    }
  }, [route.params?.name, isFocused]);

  const {error, validate, setError, initialError} = useUnitInputValidate({
    name,
  });

  const resetFormFields = () => {
    Keyboard.dismiss();
    setName('');
    setError(initialError);
    setIsEditing(false);
    setEditingUnitId(null);
  };

  const setEditingUnit = (unit: {id: number; name: string}) => {
    setIsEditing(true);
    setEditingUnitId(unit.id);
    setName(unit.name); // Pre-fill input with name
  };

  const handleUnitUpdate = async () => {
    Keyboard.dismiss();
    if (validate() && editingUnitId !== null) {
      const unit = {id: editingUnitId, name: name.trim()};
      try {
        const response = await unitService.updateUnit(editingUnitId, unit);
        if (response) {
          fetchUnit();
          resetFormFields();
          setIsEditing(false); // Exit edit mode
        }
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to update Unit';
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

  const handleUnitDelete = async (id: number) => {
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
              await unitService.deleteUnit(id);
              fetchUnit();
            } catch (error: any) {
              const errorMsg =
                error?.response?.data?.message || 'Failed to delete unit';
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
      const unit = {
        name: name.trim(),
      };
      try {
        const response = await unitService.createUnit(unit);
        if (response.id) {
          fetchUnit();
        }
        resetFormFields();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0].message || 'Failed to create unit';
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
    await fetchUnit();
    setRefreshing(false);
  };

  return {
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
    setEditingUnit,
  };
};
