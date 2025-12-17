import {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {useSiteService} from '../../../services/SiteService';
import {useMaterialService} from '../../../services/MaterialService';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Material} from '../../Materials/DTOs/MaterialProps';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {useMaterialShiftInputValidate} from '../useMaterialShiftInputValidate';
import {useMaterialShiftService} from '../../../services/MaterialShiftService';
import {MaterialShiftCreationRequest} from '../DTOs/MaterialShiftProps';
import {useLanguage} from '../../../context/LanguageContext';
import {formatDateToString} from '../../../utils/functions';

export const useMaterialShiftCreation = ({navigation}: any) => {
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const {t} = useLanguage();
  const materialShiftService = useMaterialShiftService();
  const siteService = useSiteService();
  const materialService = useMaterialService();

  const [date, setDate] = useState<string>('');
  const [materialId, setMaterialId] = useState('');
  const [sourceSiteId, setSourceSiteId] = useState('');
  const [targetSiteId, setTargetSiteId] = useState('');
  const [quantity, setQuantity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [materialList, setMaterialList] = useState<Material[]>([]);

  const {error, validate, setError, initialError} =
    useMaterialShiftInputValidate({
      date,
      materialId,
      sourceSiteId,
      targetSiteId,
      quantity,
    });

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

  const today = new Date();
  const formatted = formatDateToString(today);

  const resetFormFields = () => {
    setDate(formatted);
    setMaterialId('');
    setSourceSiteId('');
    setTargetSiteId('');
    setQuantity('');
    setNotes('');
    setError(initialError);
  };

  const hasUnsavedChanges = () => {
    return (
      date !== '' ||
      materialId !== '' ||
      sourceSiteId !== '' ||
      targetSiteId !== '' ||
      quantity !== '' ||
      notes !== formatted
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
              resetFormFields();
              navigation.navigate(RouteName.MATERIALSHIFT_LIST_SCREEN);
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.MATERIALSHIFT_LIST_SCREEN);
    }
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      if (sourceSiteId === targetSiteId) {
        Toast.show({
          type: 'error',
          text1: 'error',
          text2: 'Source and Target sites cannot be the same.',
        });
      } else {
        try {
          const materialShift: MaterialShiftCreationRequest = {
            date: date.trim(),
            materialId: parseInt(materialId),
            sourceSiteId: parseInt(sourceSiteId),
            targetSiteId: parseInt(targetSiteId),
            quantity: quantity.toString(),
            note: notes.trim(),
          };
          await materialShiftService.createMaterialShift(materialShift);
          resetFormFields();
          navigation.navigate(RouteName.MATERIALSHIFT_LIST_SCREEN);
        } catch (error: any) {
          const errorMsg =
            error?.response?.data?.[0]?.message ||
            'Failed to Create Material Shift';
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMsg,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (route.params?.materialId && isFocused) {
      setMaterialId(route.params.materialId);
    }
    if (route.params?.sourceSiteId && isFocused) {
      setSourceSiteId(route.params.sourceSiteId);
    }
    if (route.params?.targetSiteId && isFocused) {
      setTargetSiteId(route.params.targetSiteId);
    }
  }, [route.params, isFocused]);

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
    fetchSites,
    fetchMaterials,
    error,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges,
  };
};
