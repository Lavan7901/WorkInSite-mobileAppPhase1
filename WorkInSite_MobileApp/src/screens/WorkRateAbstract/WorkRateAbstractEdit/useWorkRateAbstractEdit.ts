import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import RouteName from '../../../navigation/RouteName';
import {useWorkRateAbstractValidate} from '../InputValidate/WorkRateAbstractValidate';
import {useSiteService} from '../../../services/SiteService';
import {Site} from '../../Sites/DTOs/SiteProps';
import {useWorkTypeService} from '../../../services/WorkTypeService';
import {useUnitService} from '../../../services/UnitService';
import {useWorkRateAbstractService} from '../../../services/WorkRateAbstractService';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import {WorkRateAbstractProps} from '../DTOs/WorkRateAbstract';
import {Unit} from '../../Unit/DTOs/UnitProps';
import {useLanguage} from '../../../context/LanguageContext';
import {WorkType} from '../../Workers/DTOs/WorkTypeProps';

const useWorkRateAbstractEdit = ({navigation, route}: any) => {
  const {workRateAbstractId} = route.params;
  const [siteId, setSiteId] = useState('');
  const [workTypeId, setWorkTypeId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [totalRate, setTotalRate] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [workRateAbstract, setWorkRateAbstract] =
    useState<WorkRateAbstractProps>();

  const isFocused = useIsFocused();
  const siteService = useSiteService();
  const workTypeService = useWorkTypeService();
  const unitService = useUnitService();
  const workRateAbstractService = useWorkRateAbstractService();
  const {t} = useLanguage();

  const {error, validate, setError, initialError} = useWorkRateAbstractValidate(
    {siteId, workTypeId, totalRate, totalQuantity, unitId},
  );

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const workTypeDetails = workTypeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const unitDetails = unitList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const fetchSites = async (searchString: string = '') => {
    if (searchString) {
      const sites = await siteService.getSites({searchString});
      if (sites) setSiteList(sites.slice(0, 3));
    }
  };

  const fetchWorkTypes = async (searchString: string = '') => {
    if (searchString) {
      const workType = await workTypeService.getWorkTypes(searchString);
      if (workType) setWorkTypeList(workType.slice(0, 3));
    }
  };

  const fetchUnits = async (searchString: string = '') => {
    if (searchString) {
      const units = await unitService.getUnits(searchString);
      if (units) setUnitList(units.slice(0, 3));
    }
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const workRateAbstract = {
          siteId: parseInt(siteId),
          workTypeId: parseInt(workTypeId),
          unitId: parseInt(unitId),
          totalRate: totalRate.trim(),
          totalQuantity: totalQuantity.trim(),
          note: notes.trim(),
        };
        await workRateAbstractService.updateWorkRateAbstract(
          parseInt(workRateAbstractId),
          workRateAbstract,
        );
        navigation.navigate(RouteName.WORK_RATE_ABSTRACT_LIST);
        fetchWorkRateAbstract();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message ||
          'Failed to Update work Rate Abstract. Please try again.';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  const fetchWorkRateAbstract = async () => {
    setLoading(true);
    try {
      const workRateAbstractData: WorkRateAbstractProps =
        await workRateAbstractService.getWorkRateAbstract(
          parseInt(workRateAbstractId),
        );

      setWorkRateAbstract(workRateAbstractData);
      setSiteId(workRateAbstractData.site?.id?.toString());
      setWorkTypeId(workRateAbstractData.workType?.id?.toString());
      setUnitId(workRateAbstractData.unit?.id.toString());
      setTotalRate(workRateAbstractData.totalRate?.toString());
      setTotalQuantity(workRateAbstractData.totalQuantity?.toString());
      setNotes(workRateAbstractData.note);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch work rate abstract data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSiteById = async () => {
      if (siteId) {
        try {
          const site = await siteService.getSite(parseInt(siteId));
          setSiteList([site]);
        } catch (error) {
          console.error('Failed to fetch Site:', error);
        }
      }
    };

    fetchSiteById();
  }, [siteId, isFocused]);

  useEffect(() => {
    const fetchWorkTypeById = async () => {
      if (workTypeId) {
        try {
          const workType = await workTypeService.getWorkType(
            parseInt(workTypeId),
          );
          setWorkTypeList([workType]);
        } catch (error) {
          console.error('Failed to fetch workType:', error);
        }
      }
    };

    fetchWorkTypeById();
  }, [workTypeId, isFocused]);

  useEffect(() => {
    const fetchUnitById = async () => {
      if (unitId) {
        try {
          const unit = await unitService.getUnit(parseInt(unitId));
          setUnitList([unit]);
        } catch (error) {
          console.error('Failed to fetch unit:', error);
        }
      }
    };

    fetchUnitById();
  }, [unitId, isFocused]);

  useFocusEffect(
    useCallback(() => {
      fetchWorkRateAbstract();
    }, [workRateAbstractId]),
  );

  const resetFormFields = () => {
    setSiteId('');
    setWorkTypeId('');
    setUnitId('');
    setTotalRate('');
    setTotalQuantity('');
    setNotes('');
    setSiteList([]);
    setWorkTypeList([]);
    setUnitList([]);
    setError(initialError);
  };

  const hasUnsavedChanges = () => {
    return (
      siteId !== workRateAbstract?.site?.id.toString() ||
      workTypeId !== workRateAbstract?.workType.id.toString() ||
      unitId !== workRateAbstract?.unit.id.toString() ||
      totalRate !== workRateAbstract?.totalRate.toString() ||
      totalQuantity !== workRateAbstract?.totalQuantity.toString() ||
      notes !== workRateAbstract?.note
    );
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
        [
          {
            text: t('Cancel'),
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: t('Save'),
            onPress: () => {
              handleSubmission();
            },
          },
          {
            text: t('Exit Without Save'),
            onPress: () => {
              resetFormFields();
              navigation.navigate(RouteName.WORK_RATE_ABSTRACT_LIST);
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.WORK_RATE_ABSTRACT_LIST);
    }
    return true;
  };

  return {
    siteDetails,
    workTypeId,
    totalRate,
    totalQuantity,
    notes,
    siteId,
    unitId,
    error,
    workTypeDetails,
    unitDetails,
    loading,
    hasUnsavedChanges,
    handleBackPress,
    setSiteId,
    handleSubmission,
    setWorkTypeId,
    setUnitId,
    setTotalRate,
    setTotalQuantity,
    setNotes,
    fetchWorkTypes,
    fetchUnits,
    fetchSites,
  };
};

export {useWorkRateAbstractEdit};
