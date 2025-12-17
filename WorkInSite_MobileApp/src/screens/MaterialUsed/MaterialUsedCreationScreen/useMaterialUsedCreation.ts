import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {useSiteService} from '../../../services/SiteService';
import {useMaterialService} from '../../../services/MaterialService';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Material} from '../../Materials/DTOs/MaterialProps';
import {useMaterialUsedInputValidate} from '../useMaterialUsedInputValidate';
import {useMaterialUsedService} from '../../../services/MaterialUsedService';
import {useWorkModeService} from '../../../services/WorkModeService';
import {useLanguage} from '../../../context/LanguageContext';
import {WorkMode} from '../../WorkMode/DTOs/WorkModeProps';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {formatDateToString} from '../../../utils/functions';

const useMaterialUsedCreation = ({navigation}: any) => {
  const materialUsedService = useMaterialUsedService();
  const siteService = useSiteService();
  const materialService = useMaterialService();
  const workModeService = useWorkModeService();
  const {t} = useLanguage();
  const isFocused = useIsFocused();

  const [siteId, setSiteId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [workModeId, setWorkModeId] = useState('');
  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [materialList, setMaterialList] = useState<Material[]>([]);

  const {error, validate, setError, initialError} =
    useMaterialUsedInputValidate({
      siteId,
      materialId,
      quantity,
      workModeId,
      date,
    });

  const today = new Date();
  const formatted = formatDateToString(today);

  const resetFormFields = () => {
    setSiteId('');
    setMaterialId('');
    setWorkModeId('');
    setQuantity('');
    setNotes('');
    setDate(formatted);
    setError(initialError);
  };

  useEffect(() => {
    if (!isFocused) {
      resetFormFields();
    }
  }, [isFocused]);

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const materialDetails = materialList.map(item => ({
    label: `${item.name} [${item.unit.name}]`,
    value: item.id.toString(),
  }));
  const workModeDetails = workModeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const fetchSites = async (searchString: string = '') => {
    if (searchString) {
      const sites = await siteService.getSites({
        searchString,
        status: 'Working',
      });
      if (sites) setSiteList(sites.slice(0, 3));
    }
  };
  const fetchMaterials = async (searchString: string = '') => {
    if (searchString) {
      const materials = await materialService.getMaterials(searchString);
      if (materials) setMaterialList(materials.slice(0, 3));
    }
  };
  const fetchWorkModes = async (searchString: string = '') => {
    const workModes = await workModeService.getWorkModes(searchString);
    setWorkModeList(workModes);
  };

  const hasUnsavedChanges = () => {
    return (
      siteId !== '' ||
      materialId !== '' ||
      workModeId !== '' ||
      quantity.trim() !== '' ||
      notes.trim() !== '' ||
      date !== formatted
    );
  };

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
              navigation.navigate(RouteName.MATERIALUSED_LIST_SCREEN);
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.MATERIALUSED_LIST_SCREEN);
    }
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const materialUsed = {
          date: date.trim(),
          siteId: parseInt(siteId),
          materialId: parseInt(materialId),
          workModeId: parseInt(workModeId),
          quantity: quantity.trim(),
          note: notes.trim(),
        };
        await materialUsedService.createMaterialUsed(materialUsed);
        navigation.navigate(RouteName.MATERIALUSED_LIST_SCREEN);
        resetFormFields();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message ||
          'Failed to Create Material Used';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  return {
    siteId,
    setSiteId,
    materialId,
    setMaterialId,
    quantity,
    setQuantity,
    notes,
    setNotes,
    date,
    setDate,
    workModeId,
    setWorkModeId,
    siteDetails,
    materialDetails,
    workModeDetails,
    error,
    fetchWorkModes,
    hasUnsavedChanges,
    fetchSites,
    fetchMaterials,
    handleSubmission,
    handleBackPress,
  };
};

export {useMaterialUsedCreation};
