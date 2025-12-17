import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import RouteName from '../../../navigation/RouteName';
import {Alert} from 'react-native';
import {useWorkRateAbstractService} from '../../../services/WorkRateAbstractService';
import {WorkRateAbstractProps} from '../DTOs/WorkRateAbstract';
import {useLanguage} from '../../../context/LanguageContext';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../context/RefreshContext';

const useWorkRateAbstractionList = ({navigation}: any) => {
  const workRateAbstractService = useWorkRateAbstractService();
  const isFocused = useIsFocused();
  const {t} = useLanguage();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.WORK_RATE_ABSTRACT_LIST];

  const [workRateAbstract, setWorkRateAbstract] = useState<
    WorkRateAbstractProps[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchWorkRateAbstract = async (searchString: string = '') => {
    setLoading(true);
    const workRateAbstractData =
      await workRateAbstractService.getWorkRateAbstracts(searchString);
    setWorkRateAbstract(workRateAbstractData);
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      fetchWorkRateAbstract();
    }
    if (refreshKey) {
      setSearchText('');
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.WORK_RATE_ABSTRACT_LIST);
    }
  }, [isFocused]);

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
              await workRateAbstractService.deleteWorkRateAbstract(id);
              fetchWorkRateAbstract();
            } catch (error: any) {
              const errorMsg =
                error?.response?.data?.message || 'Failed to delete Supplier';
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

  const handleEditworkRateAbstract = (id: number) => {
    navigation.navigate(RouteName.WORK_RATE_ABSTRACT_EDIT, {
      workRateAbstractId: id,
    });
  };

  return {
    workRateAbstract,
    fetchWorkRateAbstract,
    confirmDelete,
    handleEditworkRateAbstract,
    loading,
    searchText,
    setSearchText,
  };
};

export {useWorkRateAbstractionList};
