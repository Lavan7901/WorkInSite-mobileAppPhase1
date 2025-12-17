import {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {useMaterialShiftService} from '../../../services/MaterialShiftService';
import {useSiteService} from '../../../services/SiteService';
import {useMaterialService} from '../../../services/MaterialService';
import {MaterialShift} from '../DTOs/MaterialShiftProps';
import {Site} from '../../Sites/DTOs/SiteProps';
import {useLanguage} from '../../../context/LanguageContext';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../context/RefreshContext';

export const useMaterialShiftList = ({navigation}: any) => {
  const materialShiftService = useMaterialShiftService();
  const siteService = useSiteService();
  const materialService = useMaterialService();
  const isFocused = useIsFocused();
  const {t} = useLanguage();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.MATERIALSHIFT_LIST_SCREEN];

  const [materialShiftDetails, setMaterialShiftDetails] = useState<
    MaterialShift[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState('');

  const [materialId, setMaterialId] = useState({value: '', name: ''});
  const [sourceSiteId, setSourceSiteId] = useState({value: '', name: ''});
  const [targetSiteId, setTargetSiteId] = useState({value: '', name: ''});
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [materialList, setMaterialList] = useState<Site[]>([]);
  const bottomSheetRef = useRef<any>(null);

  const fetchMaterialShifts = async (
    resetList = false,
    overrideFilters?: any,
  ) => {
    const filters = overrideFilters || {
      materialId: materialId.value ? parseInt(materialId.value) : undefined,
      sourceSiteId: sourceSiteId.value
        ? parseInt(sourceSiteId.value)
        : undefined,
      targetSiteId: targetSiteId.value
        ? parseInt(targetSiteId.value)
        : undefined,
      date: date || undefined,
      quantity: quantity || undefined,
    };
    if (!resetList && !hasMore) return;
    if (resetList) {
      setLoading(true);
      setPageNumber(1);
    } else {
      setPaginationLoading(true);
    }

    try {
      const response = await materialShiftService.getMaterialShifts({
        ...filters,
        pageNumber: resetList ? 1 : pageNumber,
        pageSize: pageSize,
      });

      const items = response.items || [];

      if (resetList) {
        setMaterialShiftDetails(items); 
        setPageNumber(2); 
      } else {
        setMaterialShiftDetails(prev => [...prev, ...items]); 
        setPageNumber(prev => prev + 1);
      }

      setHasMore(response.totalPages > response.pageNumber); 
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch MaterialShift data.',
      });
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = [
      date,
      materialId?.name,
      sourceSiteId?.name,
      targetSiteId?.name,
      quantity,
    ]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filters || 'Search');
    bottomSheetRef.current?.close();
    fetchMaterialShifts(true);
  };

  const resetForm = () => {
    setMaterialId({value: '', name: ''});
    setSourceSiteId({value: '', name: ''});
    setTargetSiteId({value: '', name: ''});
    setDate('');
    setQuantity('');
    setAppliedFilters('');
  };

  const handleClearSearch = async () => {
    resetForm();
    fetchMaterialShifts(true, {
      sourceSiteId: undefined,
      targetSiteId: undefined,
      materialId: undefined,
      date: undefined,
      quantity: undefined,
    });
  };

  useEffect(() => {
    if (!refreshKey && isFocused) {
      fetchMaterialShifts(true);
    }
    if (refreshKey && isFocused) {
      handleClearSearch();
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.MATERIALSHIFT_LIST_SCREEN);
    }
  }, [isFocused]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMaterialShifts(true).finally(() => setRefreshing(false));
  };

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
              await materialShiftService.deleteMaterialShift(id);
              fetchMaterialShifts(true);
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

  const handleEditMaterialShift = (id: number) => {
    navigation.navigate(RouteName.MATERIALSHIFT_EDIT_SCREEN, {id});
  };

  const handleAddShift = () => {
    navigation.navigate(RouteName.MATERIALSHIFT_CREATION_SCREEN);
  };

  const fetchMaterials = async (search: string = '') => {
    if (search) {
      const materials = await materialService.getMaterials(search);
      if (materials) setMaterialList(materials.slice(0, 3)); // You can increase the slice if needed
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

  return {
    materialShiftDetails,
    loading,
    paginationLoading,
    refreshing,
    hasMore,
    fetchMaterialShifts,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    confirmDelete,
    handleEditMaterialShift,
    handleAddShift,
    materialId,
    setMaterialId,
    sourceSiteId,
    setSourceSiteId,
    targetSiteId,
    setTargetSiteId,
    date,
    setDate,
    quantity,
    setQuantity,
    fetchSites,
    siteDetails,
    materialDetails,
    fetchMaterials,
    bottomSheetRef,
    appliedFilters,
  };
};
