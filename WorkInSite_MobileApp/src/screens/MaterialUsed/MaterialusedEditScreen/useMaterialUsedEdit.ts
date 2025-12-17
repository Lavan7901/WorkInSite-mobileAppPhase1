import {useCallback, useState} from 'react';
import {useSiteService} from '../../../services/SiteService';
import {useMaterialService} from '../../../services/MaterialService';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Material} from '../../Materials/DTOs/MaterialProps';
import Toast from 'react-native-toast-message';
import {useMaterialUsedInputValidate} from '../useMaterialUsedInputValidate';
import RouteName from '../../../navigation/RouteName';
import {useFocusEffect} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useMaterialUsedService} from '../../../services/MaterialUsedService';
import {useWorkModeService} from '../../../services/WorkModeService';
import {MaterialUsed} from '../DTOs/MaterialUsedProps';
import {useLanguage} from '../../../context/LanguageContext';
import {WorkMode} from '../../WorkMode/DTOs/WorkModeProps';

export const useMaterialUsedEdit = (id: string, {navigation}: any) => {
  const materialUsedService = useMaterialUsedService();
  const siteService = useSiteService();
  const materialService = useMaterialService();
  const workModeService = useWorkModeService();
  const {t} = useLanguage();

  const [siteId, setSiteId] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [materialId, setMaterialId] = useState('');
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState('');
  const [workModeId, setWorkModeId] = useState('');
  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [materialUsedDetails, setMaterialUsedDetails] =
    useState<MaterialUsed>();
  const [loading, setLoading] = useState(true);
  const {error, validate, setError, initialError} =
    useMaterialUsedInputValidate({
      siteId,
      materialId,
      quantity,
      workModeId,
      date,
    });

  const fetchMaterialUsed = async () => {
    setLoading(true);
    try {
      const materialUsedData = await materialUsedService.getMaterialUsedById(
        parseInt(id),
      );
      setDate(materialUsedData.date);
      setMaterialUsedDetails(materialUsedData);
      setSiteId(materialUsedData.site.id.toString());
      setSiteList([materialUsedData.site]);
      setMaterialId(materialUsedData.material.id.toString());
      setMaterialList([materialUsedData.material]);
      setQuantity(materialUsedData.quantity.toString());
      setWorkModeId(materialUsedData.workMode.id.toString());
      setWorkModeList([materialUsedData.workMode]);
      setNotes(materialUsedData.notes);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch material used data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMaterialUsed();
    }, [id]),
  );

  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({
      searchString,
      status: 'Working',
    });
    setSiteList(sites.slice(0, 3));
  };
  const fetchMaterials = async (searchString: string = '') => {
    const materials = await materialService.getMaterials(searchString);
    setMaterialList(materials.slice(0, 3));
  };
  const fetchWorkModes = async (searchString: string = '') => {
    const workModes = await workModeService.getWorkModes(searchString);
    setWorkModeList(workModes);
  };

  const materialDetails = materialList.map(item => ({
    label: `${item.name} [${item.unit.name}]`,
    value: item.id.toString(),
  }));
  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const workModeDetails = workModeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const hasUnsavedChanges = () => {
    return (
      siteId !== materialUsedDetails?.site.id.toString() ||
      materialId !== materialUsedDetails?.material.id.toString() ||
      workModeId !== materialUsedDetails?.workMode.id.toString() ||
      quantity !== materialUsedDetails?.quantity.toString() ||
      notes !== materialUsedDetails?.notes ||
      date !== materialUsedDetails?.date
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
              navigation.navigate(RouteName.MATERIALUSED_LIST_SCREEN);
              fetchMaterialUsed();
              setError(initialError);
            },
          },
        ],
        {cancelable: false},
      );
      return true;
    }
    navigation.navigate(RouteName.MATERIALUSED_LIST_SCREEN);
    return true;
  };

  const handleSubmission = async () => {
    const materialUsed = {
      date: date?.trim(),
      siteId: parseInt(siteId),
      materialId: parseInt(materialId),
      workModeId: parseInt(workModeId),
      quantity: quantity?.trim(),
      note: notes?.trim() || '',
    };
    if (validate()) {
      try {
        await materialUsedService.updateMaterialUsed(
          parseInt(id),
          materialUsed,
        );
        navigation.navigate(RouteName.MATERIALUSED_LIST_SCREEN);
      } catch (error: any) {
        console.log(error?.response?.data);

        const errorMsg =
          error?.response?.data?.[0]?.message ||
          error?.response?.data?.message ||
          'Failed to Edit Material Used';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to Edit Material Used',
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
    materialUsedDetails,
    error,
    materialDetails,
    siteDetails,
    workModeDetails,
    loading,
    workModeId,
    setWorkModeId,
    fetchSites,
    fetchMaterials,
    fetchWorkModes,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges,
  };
};
