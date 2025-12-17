import {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {useMaterialPurchaseService} from '../../../services/PurchaseService';
import {useSiteService} from '../../../services/SiteService';
import {useSupplierService} from '../../../services/SupplierService';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Supplier} from '../../Suppliers/DTOs/SupplierProps';
import {useLanguage} from '../../../context/LanguageContext';
import {Purchase} from '../DTOs/PurchaseProps';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../context/RefreshContext';

export const usePurchaseList = ({navigation}: any) => {
  const materialPurchaseService = useMaterialPurchaseService();
  const siteService = useSiteService();
  const supplierService = useSupplierService();
  const {t} = useLanguage();

  const [purchaseDetails, setPurchaseDetails] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [siteId, setSiteId] = useState<{value: string; name: string}>({
    value: '',
    name: '',
  });
  const [supplierId, setSupplierId] = useState<{value: string; name: string}>({
    value: '',
    name: '',
  });
  const [billNumber, setBillNumber] = useState('');
  const [date, setDate] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [appliedFilters, setAppliedFilters] = useState('');
  const bottomSheetRef = useRef<any>(null);

  const isFocused = useIsFocused();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.PURCHASE_LIST_SCREEN];

  const fetchPurchases = async (resetList = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      siteId: siteId.value ? parseInt(siteId.value) : undefined,
      billNumber: billNumber || undefined,
      supplierId: supplierId.value ? parseInt(supplierId.value) : undefined,
      date: date || undefined,
    };

    if (!resetList && !hasMore) return;

    if (resetList) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }
    try {
      const response = await materialPurchaseService.getMaterialPurchases({
        ...filters,
        pageNumber: resetList ? 1 : pageNumber,
        pageSize,
      });

      const items = response.items || [];

      if (resetList) {
        setPurchaseDetails(items);
        setPageNumber(2);
      } else {
        setPurchaseDetails(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }

      setHasMore(response.totalPages > response.pageNumber);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch Purchase.',
      });
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = [date, siteId?.name, supplierId?.name, billNumber]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filters || 'Search');
    bottomSheetRef.current?.close();
    fetchPurchases(true);
  };

  const resetForm = () => {
    setSiteId({value: '', name: ''});
    setSupplierId({value: '', name: ''});
    setBillNumber('');
    setDate('');
    setAppliedFilters('');
  };
  const handleClearSearch = async () => {
    resetForm();
    fetchPurchases(true, {
      billNumber: undefined,
      siteId: undefined,
      supplierId: undefined,
      date: undefined,
    });
  };

  useEffect(() => {
    if (!refreshKey && isFocused) {
      fetchPurchases(true);
    }
    if (refreshKey && isFocused) {
      handleClearSearch();
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.PURCHASE_LIST_SCREEN);
    }
  }, [isFocused]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPurchases(true).finally(() => setRefreshing(false));
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      t('Confirm Delete'),
      t('Are you sure you want to delete this Delete?'),
      [
        {text: t('Cancel'), style: 'cancel'},
        {
          text: t('Delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await materialPurchaseService.deleteMaterialPurchase(id);
              fetchPurchases(true);
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2:
                  error?.response?.data?.message ||
                  'Failed to delete Purchase.',
              });
            }
          },
        },
      ],
    );
  };

  const handleEditPurchase = (id: number) => {
    navigation.navigate(RouteName.PURCHASE_EDIT_SCREEN, {id});
  };

  const handleAddPurchase = () => {
    navigation.navigate(RouteName.PURCHASE_CREATION_SCREEN);
  };

  const fetchSites = async (searchString: string = '') => {
    if (searchString) {
      const sites = await siteService.getSites({searchString});
      if (sites) setSiteList(sites.slice(0, 3));
    }
  };

  const fetchSuppliers = async (search: string = '') => {
    if (search) {
      const suppliers = await supplierService.getSuppliers(search);
      if (suppliers) setSupplierList(suppliers.slice(0, 3));
    }
  };

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {value: item.id.toString(), name: item.name},
  }));

  const supplierDetails = supplierList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {value: item.id.toString(), name: item.name},
  }));

  return {
    purchaseDetails,
    loading,
    paginationLoading,
    refreshing,
    hasMore,
    fetchPurchases,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    confirmDelete,
    handleEditPurchase,
    handleAddPurchase,
    billNumber,
    setBillNumber,
    date,
    setDate,
    siteId,
    setSiteId,
    supplierId,
    setSupplierId,
    fetchSites,
    fetchSuppliers,
    siteDetails,
    supplierDetails,
    appliedFilters,
  };
};
