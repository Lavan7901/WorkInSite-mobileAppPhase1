import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import RouteName from '../../../navigation/RouteName';
import {Alert} from 'react-native';
import {useWorkerCategoryService} from '../../../services/WorkerCategoryService';
import {WorkerCategoryProps} from '../DTOs/WorkerCategoryProps';
import Toast from 'react-native-toast-message';
import {useLanguage} from '../../../context/LanguageContext';
import {useRefresh} from '../../../context/RefreshContext';

const useWorkerCategoryList = ({navigation}: any) => {
  const WorkerCategoryService = useWorkerCategoryService();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.WORKER_CATEGORY_LIST_SCREEN];

  const [WorkerCategoryDetails, setWorkerCategoryDetails] = useState<
    WorkerCategoryProps[]
  >([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();
  const {t} = useLanguage();

  const fetchWorkerCategory = async (searchString = '') => {
    const WorkerCategoryData = await WorkerCategoryService.getWorkerCategories(
      searchString,
    );
    setWorkerCategoryDetails(WorkerCategoryData);
    if (WorkerCategoryData) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchWorkerCategory();
    }
    if (refreshKey) {
      setSearchText('');
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.WORKER_CATEGORY_LIST_SCREEN);
    }
  }, [isFocused]);

  const confirmDelete = (id: number) => {
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
          style: 'destructive',
          onPress: async () => {
            await handleWorkerCategoryDelete(id);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const redirectUrl = RouteName.WORKER_CATEGORY_LIST_SCREEN;

  const handleEditWorkerCategory = (id: number) => {
    const redirect = redirectUrl;
    navigation.navigate(RouteName.WORKER_CATEGORY_EDIT_SCREEN, {
      workerCategoryId: id,
      redirect,
    });
  };

  const handleWorkerCategoryDelete = async (id: number) => {
    try {
      await WorkerCategoryService.deleteWorkerCategory(id);
      fetchWorkerCategory();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.[0]?.message ||
        'Failed to delete worker Category';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
    }
  };

  return {
    WorkerCategoryDetails,
    fetchWorkerCategory,
    confirmDelete,
    handleEditWorkerCategory,
    loading,
    searchText,
    setSearchText,
  };
};

export {useWorkerCategoryList};
