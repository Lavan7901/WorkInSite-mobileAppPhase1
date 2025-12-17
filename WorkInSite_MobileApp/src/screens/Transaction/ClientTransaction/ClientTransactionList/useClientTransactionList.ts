import {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useClientTransactionService} from '../../../../services/ClientTransactionService';
import RouteName from '../../../../navigation/RouteName';
import {ClientTransactionProps} from '../DTOs/ClientTransaction';
import {Client} from '../../../Clients/DTOs/ClientProps';
import {useClientService} from '../../../../services/ClientService';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../../context/RefreshContext';

const useClienTransactiontList = ({navigation}: any) => {
  const clientTransactionService = useClientTransactionService();
  const clientService = useClientService();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.CLIENT_TRANSACTION_LIST_SCEEN];

  const [transactions, setTransactions] = useState<ClientTransactionProps[]>(
    [],
  );
  const isFocused = useIsFocused();
  const [fromDate, setFromDate] = useState('');
  const [toDate, seToDate] = useState('');
  const [client, setClient] = useState({value: '', name: ''});
  const [clientList, setClientList] = useState<Client[]>([]);

  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState('');
  const bottomSheetRef = useRef<any>(null);

  const fetchClients = async (searchString: string = '') => {
    if (searchString) {
      const clients = await clientService.getClients(searchString, false);
      if (clients) setClientList(clients.slice(0, 3));
    }
  };

  const clientDetails = clientList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {
      label: item.name,
      value: item.id.toString(),
      name: item.name,
    },
  }));

  const fetchTransactions = async (reset = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      clientId: client.value ? parseInt(client.value) : undefined,
    };
    if (!reset && !hasMore) return;
    if (reset) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }
    try {
      const response = await clientTransactionService.getClientTransactions({
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
      fetchTransactions(true);
    }
    if (refreshKey && isFocused) {
      handleClearSearch();
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.CLIENT_TRANSACTION_LIST_SCEEN);
    }
  }, [isFocused]);

  const handleBackPress = () => {
    navigation.navigate(RouteName.Home_SCREEN);
  };

  const handleCreate = () => {
    navigation.navigate(RouteName.CLIENT_TRANSACTION_CREATION_SCEEN);
  };

  const handleEdit = (id: number) => {
    navigation.navigate(RouteName.CLIENT_TRANSACTION_EDIT_SCEEN, {id});
  };

  const handleSearch = () => {
    const filters = [client?.name, fromDate, toDate].filter(Boolean).join(', ');
    setAppliedFilters(filters || 'Search');
    bottomSheetRef.current?.close();
    fetchTransactions(true);
  };

  const resetForm = () => {
    setClient({value: '', name: ''});
    setFromDate('');
    seToDate('');
    setAppliedFilters('');
  };

  const handleClearSearch = async () => {
    resetForm();
    fetchTransactions(true, {
      fromDate: undefined,
      toDate: undefined,
      clientId: undefined,
    });
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await clientTransactionService.deleteClientTransaction(id);
      fetchTransactions(true);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || 'Failed to delete Client Transaction';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions(true).finally(() => setRefreshing(false));
  };

  return {
    client,
    clientDetails,
    setClient,
    fromDate,
    setFromDate,
    toDate,
    seToDate,
    refreshing,
    paginationLoading,
    hasMore,
    bottomSheetRef,
    appliedFilters,
    fetchClients,
    transactions,
    fetchTransactions,
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

export {useClienTransactiontList};
