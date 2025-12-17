import {useState} from 'react';
import {Alert} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {useMaterialInputValidate} from '../useMaterialInputValidate'; // Validation hook
import {Unit} from '../../Unit/DTOs/UnitProps';
import {useUnitService} from '../../../services/UnitService';
import {useMaterialService} from '../../../services/MaterialService';
import {useLanguage} from '../../../context/LanguageContext';
import Toast from 'react-native-toast-message';

const useMaterialCreation = ({navigation}: any) => {
  const unitService = useUnitService();
  const materialService = useMaterialService();
  const {t} = useLanguage();

  const [name, setName] = useState('');
  const [unitId, setUnitId] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const {error, validate, setError, initialError} = useMaterialInputValidate({
    name,
    unitId,
  });

  const fetchUnits = async (searchString: string = '') => {
    const units = await unitService.getUnits(searchString, false);
    setUnitList(units);
  };

  const unitDetails = unitList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const handleUnitChange = (value: string) => setUnitId(value);

  const hasUnsavedChanges = () =>
    name.trim() !== '' || unitId !== '' || hsnCode.trim() !== '';

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save before exiting?'),
        [
          {
            text: t('Save'),
            onPress: () => {
              handleSubmission();
            },
          },
          {
            text: t('Exit Without Saving'),
            onPress: () => {
              resetFormFields();
              navigation.navigate(RouteName.MATERIAL_LIST_SCREEN);
            },
          },
          {
            text: t('Cancel'),
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.MATERIAL_LIST_SCREEN);
    }
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const material = {
          name: name.trim(),
          unitId: parseInt(unitId),
          hsnCode: hsnCode.trim(),
        };
        const response = await materialService.createMaterial(material);
        navigation.navigate(RouteName.MATERIAL_LIST_SCREEN, {
          materialId: response.id,
        });
        resetFormFields();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to Create Material';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  const resetFormFields = () => {
    setName('');
    setUnitId('');
    setUnitList([]);
    setHsnCode('');
    setError(initialError);
  };

  return {
    name,
    setName,
    unitId,
    setUnitId,
    unitDetails,
    hsnCode,
    setHsnCode,
    error,
    handleSubmission,
    handleBackPress,
    handleUnitChange,
    fetchUnits,
    hasUnsavedChanges,
  };
};

export {useMaterialCreation};
