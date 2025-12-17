import {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import RouteName from '../../../../navigation/RouteName';
import {SupplierTransactionProps} from '../DTOs/SupplierTransaction';
import {useSupplierTransactionService} from '../../../../services/SupplierTransactionService';
import {Supplier} from '../../../Suppliers/DTOs/SupplierProps';
import {useSupplierService} from '../../../../services/SupplierService';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../../context/RefreshContext';

const useSupplierTransactiontList = ({navigation}: any) => {
  const supplierTransactionService = useSupplierTransactionService();
  const supplierService = useSupplierService();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.SUPPLIER_TRANSACTION_LIST_SCEEN];

  const [transactions, setTransactions] = useState<SupplierTransactionProps[]>(
    [],
  );
  const isFocused = useIsFocused();
  const [fromDate, setFromDate] = useState('');
  const [toDate, seToDate] = useState('');
  const [supplier, setSupplier] = useState({value: '', name: ''});
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);

  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState('');
  const bottomSheetRef = useRef<any>(null);

  const fetchSuppliers = async (searchString: string = '') => {
    if (searchString) {
      const suppliers = await supplierService.getSuppliers(searchString);
      if (suppliers) setSupplierList(suppliers.slice(0, 3));
    }
  };

  const supplierDetails = supplierList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {
      label: item.name,
      value: item.id.toString(),
      name: item.name,
    },
  }));

  const fetchSupplierTransactions = async (
    reset = false,
    overrideFilters?: any,
  ) => {
    const filters = overrideFilters || {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      supplierId: supplier.value ? parseInt(supplier.value) : undefined,
    };
    if (!reset && !hasMore) return;
    if (reset) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }
    try {
      const response = await supplierTransactionService.getSupplierTransactions(
        {
          ...filters,
          pageNumber: reset ? 1 : pageNumber,
          pageSize,
        },
      );
      const items = response.items || [];
      if (reset) {
        setTransactions(items);
        setPageNumber(2);
      } else {
        setTransactions(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }
      setHasMore(response.totalPages > response.pageNumber);
    } catch (error) {
      console.error('Error fetching MaterialUsed:', error);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    if (!refreshKey && isFocused) {
      fetchSupplierTransactions(true);
    }
    if (refreshKey && isFocused) {
      handleClearSearch();
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.SUPPLIER_TRANSACTION_LIST_SCEEN);
    }
  }, [isFocused]);

  const handleBackPress = () => {
    navigation.navigate(RouteName.Home_SCREEN);
  };

  const handleCreate = () => {
    navigation.navigate(RouteName.SUPPLIER_TRANSACTION_CREATION_SCEEN);
  };

  const handleEdit = (id: number) => {
    navigation.navigate(RouteName.SUPPLIER_TRANSACTION_EDIT_SCEEN, {id});
  };

  const handleSearch = () => {
    const filters = [supplier?.name, fromDate, toDate]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filters || 'Search');
    bottomSheetRef.current?.close();
    fetchSupplierTransactions(true);
  };

  const resetForm = () => {
    setSupplier({value: '', name: ''});
    setFromDate('');
    seToDate('');
    setAppliedFilters('');
  };

  const handleClearSearch = () => {
    resetForm();
    fetchSupplierTransactions(true, {
      fromDate: undefined,
      toDate: undefined,
      clientId: undefined,
    });
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await supplierTransactionService.deleteSupplierTransaction(id);
      fetchSupplierTransactions(true);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        'Failed to delete Supplier Transaction';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSupplierTransactions(true).finally(() => setRefreshing(false));
  };

  return {
    supplier,
    supplierDetails,
    setSupplier,
    fromDate,
    setFromDate,
    toDate,
    seToDate,
    fetchSuppliers,
    transactions,
    fetchSupplierTransactions,
    handleBackPress,
    handleCreate,
    handleDeleteConfirm,
    handleEdit,
    loading,
    handleSearch,
    handleRefresh,
    handleClearSearch,
    refreshing,
    paginationLoading,
    hasMore,
    appliedFilters,
    bottomSheetRef,
  };
};

export {useSupplierTransactiontList};
