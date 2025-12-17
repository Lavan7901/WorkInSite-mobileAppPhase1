import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import RouteName from '../../../navigation/RouteName';
import {useUnitService} from '../../../services/UnitService';
import {useMaterialInputValidate} from '../useMaterialInputValidate';
import {Unit} from '../../Unit/DTOs/UnitProps';
import {Material} from '../DTOs/MaterialProps';
import {useMaterialService} from '../../../services/MaterialService';
import {useLanguage} from '../../../context/LanguageContext';

export const useMaterialEdit = (id: string, {navigation}: any) => {
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const materialService = useMaterialService();
  const unitService = useUnitService();
  const {t} = useLanguage();

  const [materialDetails, setMaterialDetails] = useState<Material>();
  const [name, setName] = useState('');
  const [unitId, setUnitId] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const {error, validate, setError, initialError} = useMaterialInputValidate({
    name,
    unitId,
  });

  useEffect(() => {
    if (isFocused) {
      fetchMaterial();
    }
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.unitId && isFocused) {
      setUnitId(route.params?.unitId);
    }
  }, [route.params?.unitId, isFocused]);

  const fetchMaterial = async () => {
    setLoading(true);
    try {
      const materialData: Material = await materialService.getMaterial(
        parseInt(id),
      );
      setMaterialDetails(materialData);
      setName(materialData.name);
      setHsnCode(materialData.hsnCode);
      setUnitId(materialData.unit?.id.toString());
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch material data.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (searchString: string = '') => {
    const units = await unitService.getUnits(searchString, false);
    setUnitList(units);
  };

  useEffect(() => {
    const fetchUnitById = async () => {
      if (unitId) {
        const unit = await unitService.getUnit(parseInt(unitId));
        setUnitList([unit]);
      }
    };
    fetchUnitById();
  }, [unitId]);

  const unitDetails = unitList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleUnitChange = (value: string) => setUnitId(value);

  const handleUnitCreate = (searchString: string) => {
    navigation.navigate(RouteName.UNIT_CREATION_SCREEN, {
      name: searchString,
      redirect: RouteName.MATERIAL_EDIT_SCREEN,
      id,
    });
  };

  const hasUnsavedChanges = () => {
    return (
      name !== materialDetails?.name ||
      hsnCode !== materialDetails?.hsnCode ||
      unitId !== materialDetails?.unit?.id.toString()
    );
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
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
              navigation.navigate(RouteName.MATERIAL_LIST_SCREEN);
              fetchMaterial();
              setError(initialError);
            },
          },
          {
            text: t('Cancel'),
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
      return true;
    }
    navigation.navigate(RouteName.MATERIAL_LIST_SCREEN);
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const Material = {
          name: name.trim(),
          hsnCode: hsnCode.trim(),
          unitId: parseInt(unitId),
        };
        await materialService.updateMaterial(parseInt(id), Material);
        navigation.navigate(RouteName.MATERIAL_LIST_SCREEN, {id});
        fetchMaterial();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to Edit Material';
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
    unitId,
    setUnitId,
    unitDetails,
    hsnCode,
    setHsnCode,
    error,
    handleSubmission,
    handleBackPress,
    handleUnitCreate,
    handleUnitChange,
    fetchUnits,
    hasUnsavedChanges,
    loading,
  };
};
