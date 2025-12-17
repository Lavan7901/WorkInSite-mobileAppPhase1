import {useEffect, useRef, useState} from 'react';
import {MaterialUsed} from '../DTOs/MaterialUsedProps';
import RouteName from '../../../navigation/RouteName';
import {Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useMaterialUsedService} from '../../../services/MaterialUsedService';
import {useMaterialService} from '../../../services/MaterialService';
import {useSiteService} from '../../../services/SiteService';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Material} from '../../Materials/DTOS/MaterialProps';
import {useWorkModeService} from '../../../services/WorkModeService';
import {useLanguage} from '../../../context/LanguageContext';
import {WorkMode} from '../../WorkMode/DTOs/WorkModeProps';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../context/RefreshContext';

const useMaterialUsedList = ({navigation}: any) => {
  const materialService = useMaterialService();
  const siteService = useSiteService();
  const workModeService = useWorkModeService();
  const materialUsedService = useMaterialUsedService();
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<any>(null);
  const {t} = useLanguage();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.MATERIALUSED_LIST_SCREEN];

  const [materialUsedDetails, setMaterialUsedDetails] = useState<
    MaterialUsed[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState('');

  const [date, setDate] = useState('');
  const [materialId, setMaterialId] = useState({value: '', name: ''});
  const [siteId, setSiteId] = useState({value: '', name: ''});
  const [workModeId, setWorkModeId] = useState({value: '', name: ''});
  const [quantity, setQuantity] = useState('');
  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [materialList, setMaterialList] = useState<Material[]>([]);

  const fetchMaterials = async (search: string = '') => {
    if (search) {
      const materials = await materialService.getMaterials(search);
      if (materials) setMaterialList(materials.slice(0, 3));
    }
  };

  const fetchSites = async (searchString: string = '') => {
    if (searchString) {
      const sites = await siteService.getSites({
        searchString,
      });
      if (sites) setSiteList(sites.slice(0, 3));
    }
  };

  const fetchWorkModes = async (search: string = '') => {
    if (search) {
      const workMode = await workModeService.getWorkModes(search);
      if (workMode) setWorkModeList(workMode.slice(0, 3));
    }
  };

  const siteDetails = siteList.map(site => ({
    label: site.name,
    value: site.id.toString(),
    allItems: {value: site.id.toString(), name: site.name},
  }));

  const materialDetails = materialList.map(material => ({
    label: material.name,
    value: material.id.toString(),
    allItems: {value: material.id.toString(), name: material.name},
  }));

  const workModeDetails = workModeList.map(workMode => ({
    label: workMode.name,
    value: workMode.id.toString(),
    allItems: {value: workMode.id.toString(), name: workMode.name},
  }));

  const fetchMaterialUsed = async (reset = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      date: date || undefined,
      siteId: siteId.value ? parseInt(siteId.value) : undefined,
      materialId: materialId.value ? parseInt(materialId.value) : undefined,
      quantity: quantity || undefined,
      workModeId: workModeId.value ? parseInt(workModeId.value) : undefined,
    };
    if (!reset && !hasMore) return;
    if (reset) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }
    try {
      const response = await materialUsedService.getMaterialsUsed({
        ...filters,
        pageNumber: reset ? 1 : pageNumber,
        pageSize,
      });
      const items = response.items || [];
      if (reset) {
        setMaterialUsedDetails(items);
        setPageNumber(2);
      } else {
        setMaterialUsedDetails(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }
      setHasMore(response.totalPages > response.pageNumber);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch MaterialUsed data.',
      });
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    if (!refreshKey && isFocused) {
      fetchMaterialUsed(true);
    }
    if (refreshKey && isFocused) {
      handleClearSearch();
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.MATERIALUSED_LIST_SCREEN);
    }
  }, [isFocused]);

  const handleMaterialUsedEdit = (id: number) =>
    navigation.navigate(RouteName.MATERIALUSED_EDIT_SCREEN, {id});

  const confirmDelete = async (id: number) => {
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
              await materialUsedService.deleteMaterialUsed(id);
              fetchMaterialUsed(true);
            } catch (error: any) {
              const errorMsg =
                error?.response?.data?.message ||
                'Failed to delete Material Shift';
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMaterialUsed(true).finally(() => setRefreshing(false));
  };

  const handleSearch = () => {
    const filters = [date, materialId?.name, siteId?.name, workModeId?.name, quantity]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filters || 'Search');
    bottomSheetRef.current?.close();
    fetchMaterialUsed(true);
  };

  const resetForm = () => {
    setSiteId({value: '', name: ''});
    setMaterialId({value: '', name: ''});
    setWorkModeId({value: '', name: ''});
    setDate('');
    setQuantity('');
    setAppliedFilters('');
  };

  // const handleClearSearch = async () => {
  //   resetForm();
  //   fetchMaterialUsed(true, {
  //     fromDate: undefined,
  //     toDate: undefined,
  //     clientId: undefined,
  //   });
  // };
const handleClearSearch = async () => {
    resetForm();
    fetchMaterialUsed(true, {
      siteId: undefined,
      materialId: undefined,
      workModeId: undefined,
      date: undefined,
      quantity: undefined,
    });
  };
  const handleBack = () => navigation.navigate(RouteName.Home_SCREEN);

  const handlePress = () =>
    navigation.navigate(RouteName.MATERIALUSED_CREATION_SCREEN);

  return {
    siteId,
    setSiteId,
    date,
    setDate,
    materialId,
    setMaterialId,
    workModeId,
    setWorkModeId,
    quantity,
    siteDetails,
    workModeDetails,
    materialDetails,
    hasMore,
    materialUsedDetails,
    loading,
    paginationLoading,
    refreshing,
    bottomSheetRef,
    appliedFilters,
    setQuantity,
    fetchSites,
    fetchMaterials,
    fetchWorkModes,
    fetchMaterialUsed,
    handleMaterialUsedEdit,
    confirmDelete,
    handleBack,
    handleClearSearch,
    handlePress,
    handleRefresh,
    handleSearch,
  };
};

export {useMaterialUsedList};
