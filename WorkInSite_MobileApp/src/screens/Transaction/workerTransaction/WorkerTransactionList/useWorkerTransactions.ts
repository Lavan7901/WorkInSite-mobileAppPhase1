import {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import RouteName from '../../../../navigation/RouteName';
import {useWorkerTransactionService} from '../../../../services/WorkerTransactionService';
import {WorkerTransactionProps} from '../DTOs/WorkerTransaction';
import {Worker} from '../../../Workers/DTOs/WorkerProps';
import {useWorkerService} from '../../../../services/WorkerService';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../../context/RefreshContext';

const useWorkerTransactiontList = ({navigation}: any) => {
  const workerTransactionService = useWorkerTransactionService();
  const workerService = useWorkerService();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.WORKER_TRANSACTION_LIST_SCEEN];

  const [transactions, setTransactions] = useState<WorkerTransactionProps[]>(
    [],
  );
  const isFocused = useIsFocused();
  const [fromDate, setFromDate] = useState('');
  const [toDate, seToDate] = useState('');
  const [worker, setWorker] = useState({value: '', name: ''});
  const [workerList, setWorkerList] = useState<Worker[]>([]);

  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState('');
  const bottomSheetRef = useRef<any>(null);

  const fetchWorkers = async (WorkerName: string = '') => {
    if (WorkerName) {
      const workers = await workerService.getWorkers({WorkerName});
      if (workers.items) setWorkerList(workers.items.slice(0, 3));
    }
  };

  const workerDetails = workerList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {
      label: item.name,
      value: item.id.toString(),
      name: item.name,
    },
  }));

  const fetchWorkerTransactions = async (
    reset = false,
    overrideFilters?: any,
  ) => {
    const filters = overrideFilters || {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      supplierId: worker.value ? parseInt(worker.value) : undefined,
    };
    if (!reset && !hasMore) return;
    if (reset) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }
    try {
      const response = await workerTransactionService.getWorkerTransactions({
        ...filters,
        pageNumber: reset ? 1 : pageNumber,
        pageSize,
      });
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
      fetchWorkerTransactions(true);
    }
    if (refreshKey && isFocused) {
      handleClearSearch();
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.WORKER_TRANSACTION_LIST_SCEEN);
    }
  }, [isFocused]);

  const handleBackPress = () => {
    navigation.navigate(RouteName.Home_SCREEN);
  };

  const handleCreate = () => {
    navigation.navigate(RouteName.WORKER_TRANSACTION_CREATION_SCEEN);
  };

  const handleEdit = (id: number) => {
    navigation.navigate(RouteName.WORKER_TRANSACTION_EDIT_SCEEN, {id});
  };

  const handleSearch = () => {
    const filters = [worker?.name, fromDate, toDate].filter(Boolean).join(', ');
    setAppliedFilters(filters || 'Search');
    bottomSheetRef.current?.close();
    fetchWorkerTransactions(true);
  };

  const resetForm = () => {
    setWorker({value: '', name: ''});
    setFromDate('');
    seToDate('');
    setAppliedFilters('');
  };

  const handleClearSearch = () => {
    resetForm();
    fetchWorkerTransactions(true, {
      fromDate: undefined,
      toDate: undefined,
      clientId: undefined,
    });
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await workerTransactionService.deleteWorkerTransaction(id);
      fetchWorkerTransactions(true);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || 'Failed to delete Worker Transaction';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWorkerTransactions(true).finally(() => setRefreshing(false));
  };

  return {
    worker,
    workerDetails,
    setWorker,
    fromDate,
    setFromDate,
    toDate,
    seToDate,
    refreshing,
    paginationLoading,
    hasMore,
    appliedFilters,
    bottomSheetRef,
    fetchWorkers,
    transactions,
    fetchWorkerTransactions,
    handleBackPress,
    handleCreate,
    handleDeleteConfirm,
    handleEdit,
    loading,
    handleSearch,
    handleRefresh,
    handleClearSearch,
  };
};

export {useWorkerTransactiontList};
