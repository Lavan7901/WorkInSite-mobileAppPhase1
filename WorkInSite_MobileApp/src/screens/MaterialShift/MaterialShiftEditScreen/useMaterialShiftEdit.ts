import {useState, useCallback} from 'react';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {useSiteService} from '../../../services/SiteService';
import {useMaterialService} from '../../../services/MaterialService';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Material} from '../../Materials/DTOs/MaterialProps';
import {useMaterialShiftInputValidate} from '../useMaterialShiftInputValidate';
import {useMaterialShiftService} from '../../../services/MaterialShiftService';
import {useFocusEffect} from '@react-navigation/native';
import {useLanguage} from '../../../context/LanguageContext';

export const useMaterialShiftEdit = (id: string, {navigation}: any) => {
  const materialShiftService = useMaterialShiftService();
  const siteService = useSiteService();
  const materialService = useMaterialService();
  const {t} = useLanguage();

  const [date, setDate] = useState<string>('');
  const [materialId, setMaterialId] = useState('');
  const [sourceSiteId, setSourceSiteId] = useState('');
  const [targetSiteId, setTargetSiteId] = useState('');
  const [quantity, setQuantity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [materialShift, setMaterialShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {error, validate, setError, initialError} =
    useMaterialShiftInputValidate({
      date,
      materialId,
      sourceSiteId,
      targetSiteId,
      quantity,
    });

  const fetchMaterialShift = async () => {
    setLoading(true);
    try {
      const materialShiftData = await materialShiftService.getMaterialShift(
        parseInt(id),
      );
      setMaterialShift(materialShiftData);
      setDate(materialShiftData.date);
      setMaterialId(materialShiftData.material.id.toString());
      setMaterialList([materialShiftData.material]);
      setSourceSiteId(materialShiftData.sourceSite.id.toString());
      setTargetSiteId(materialShiftData.targetSite.id.toString());
      setSiteList([materialShiftData.sourceSite, materialShiftData.targetSite]);
      setQuantity(materialShiftData.quantity.toString());
      setNotes(materialShiftData.note);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch material shift data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMaterialShift();
    }, [id]),
  );

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

  const siteDetails = siteList.map(site => ({
    label: site.name,
    value: site.id.toString(),
  }));

  const materialDetails = materialList.map(item => ({
    label: `${item.name} [${item.unit.name}]`,
    value: item.id.toString(),
  }));

  const hasUnsavedChanges = () => {
    return (
      materialId !== materialShift?.material.id.toString() ||
      sourceSiteId !== materialShift?.sourceSite.id.toString() ||
      targetSiteId !== materialShift?.targetSite.id.toString() ||
      quantity !== materialShift?.quantity ||
      date !== materialShift?.date ||
      notes !== materialShift?.note
    );
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
        [
          {text: t('Cancel'), style: 'cancel'},
          {text: t('Save'), onPress: handleSubmission},
          {
            text: t('Exit Without Save'),
            onPress: () => {
              navigation.navigate(RouteName.MATERIALSHIFT_LIST_SCREEN);
              fetchMaterialShift();
              setError(initialError);
            },
          },
        ],
        {cancelable: false},
      );
      return true;
    }
    navigation.navigate(RouteName.MATERIALSHIFT_LIST_SCREEN);
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      if (sourceSiteId === targetSiteId) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Source and Target sites cannot be the same.',
        });
        return;
      } else {
        try {
          await materialShiftService.updateMaterialShift(parseInt(id), {
            date: date.trim(),
            materialId: parseInt(materialId),
            sourceSiteId: parseInt(sourceSiteId),
            targetSiteId: parseInt(targetSiteId),
            quantity: quantity.trim(),
            note: notes.trim(),
          });
          navigation.navigate(RouteName.MATERIALSHIFT_LIST_SCREEN);
        } catch (error: any) {
          const errorMsg =
            error?.response?.data?.[0]?.message ||
            'Failed to Edit Material Shift';
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMsg,
          });
        }
      }
    }
  };

  return {
    date,
    setDate,
    materialId,
    setMaterialId,
    sourceSiteId,
    setSourceSiteId,
    targetSiteId,
    setTargetSiteId,
    quantity,
    setQuantity,
    notes,
    setNotes,
    siteDetails,
    materialDetails,
    materialShift,
    fetchSites,
    fetchMaterials,
    error,
    loading,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges,
  };
};
