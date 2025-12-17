import {useEffect, useRef, useState} from 'react';
import RouteName from '../../../navigation/RouteName';
import {Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useLanguage} from '../../../context/LanguageContext';
import {useWorkerService} from '../../../services/WorkerService';
import {Worker} from '../DTOs/WorkerProps';
import {WorkerCategoryProps} from '../DTOs/WorkerCategoryProps';
import {useWorkerCategoryService} from '../../../services/WorkerCategoryService';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../context/RefreshContext';

const useWorkerList = ({navigation}: any) => {
  const workerService = useWorkerService();
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<any>(null);
  const {t} = useLanguage();
  const workerCategoryService = useWorkerCategoryService();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.WORKER_LIST_SCREEN];

  const [workerDetails, setWorkerDetails] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [appliedFilters, setAppliedFilters] = useState('');

  const [workerCategoryList, setWorkerCategoryList] = useState<
    WorkerCategoryProps[]
  >([]);
  const [workerCategory, setWorkerCategory] = useState<{
    value: string;
    name: string;
  }>({
    value: '',
    name: '',
  });

  const fetchWorker = async (reset = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      WorkerName: searchText.trim() || undefined,
      WorkerCategoryId: workerCategory?.value
        ? Number(workerCategory.value)
        : undefined,
    };
    if (!reset && !hasMore) return;
    reset ? setLoading(true) : setPaginationLoading(true);
    try {
      const response = await workerService.getWorkers({
        ...filters,
        PageNumber: reset ? 1 : pageNumber,
        PageSize: pageSize,
      });

      const items = response.items || [];
      if (reset) {
        setWorkerDetails(items);
        setPageNumber(2);
      } else {
        setWorkerDetails(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }
      setHasMore(response.totalPages > response.pageNumber);
    } catch (error) {
      console.error('Error fetching worker:', error);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchWorker(true);
    } else {
      setSearchText('');
      setWorkerCategory({value: '', name: ''});
    }
  }, [isFocused]);

  const handleWorkerEdit = (id: number) => {
    navigation.navigate(RouteName.WORKER_EDIT_SCREEN, {id});
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
              await workerService.deleteWorker(id);
              fetchWorker(true);
            } catch (error: any) {
              const errorMsg =
                error?.response?.data?.message || 'Failed to delete Worker';
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
    fetchWorker(true).finally(() => setRefreshing(false));
  };

  const handleBack = () => navigation.navigate(RouteName.Home_SCREEN);

  const handlePress = () =>
    navigation.navigate(RouteName.WORKER_CREATION_SCREEN);

  const workerCategoryDetails = workerCategoryList.map(workerCategory => ({
    label: workerCategory.name,
    value: workerCategory.id.toString(),
    allItems: {
      value: workerCategory?.id?.toString(),
      name: workerCategory.name,
    },
  }));

  const fetchWorkerCategories = async (searchString: string = '') => {
    if (searchString) {
      const workerCategories = await workerCategoryService.getWorkerCategories(
        searchString,
        false,
      );
      if (workerCategories) setWorkerCategoryList(workerCategories.slice(0, 3));
    }
  };

  const handleSearch = () => {
    const filters = [searchText, workerCategory?.name]
      .filter(Boolean)
      .join(', ');

    setAppliedFilters(filters || 'Search');
    bottomSheetRef.current?.close();
    fetchWorker(true);
  };

  const resetForm = () => {
    setSearchText('');
    setWorkerCategory({value: '', name: ''});
    setAppliedFilters('');
  };

  const handleClearSearch = () => {
    resetForm();
    fetchWorker(true, {
      WorkerName: undefined,
      WorkerCategoryId: undefined,
    });
  };

  useEffect(() => {
    if (!refreshKey && isFocused) {
      fetchWorker(true);
    }
    if (refreshKey && isFocused) {
      handleClearSearch();
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.WORKER_LIST_SCREEN);
    }
  }, [isFocused]);

  return {
    hasMore,
    workerDetails,
    loading,
    paginationLoading,
    refreshing,
    bottomSheetRef,
    appliedFilters,
    fetchWorker,
    handleWorkerEdit,
    confirmDelete,
    handleBack,
    handlePress,
    handleRefresh,
    handleSearch,
    searchText,
    setSearchText,
    workerCategory,
    setWorkerCategory,
    workerCategoryDetails,
    fetchWorkerCategories,
    handleClearSearch,
  };
};

export {useWorkerList};
