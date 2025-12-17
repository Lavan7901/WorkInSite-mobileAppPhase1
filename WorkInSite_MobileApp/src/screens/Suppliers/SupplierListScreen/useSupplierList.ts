import {useEffect, useState} from 'react';
import {useSupplierService} from '../../../services/SupplierService';
import {Supplier} from '../DTOs/SupplierProps';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useLanguage} from '../../../context/LanguageContext';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../context/RefreshContext';

const useSupplierList = ({navigation}: any) => {
  const supplierService = useSupplierService();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.SUPPLIER_LIST_SCREEN];
  const isFocused = useIsFocused();
  const {t} = useLanguage();

  const [supplierDetails, setSupplierDetails] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchSupplier = async () => {
    const supplierData = await supplierService.getSuppliers('');
    setSupplierDetails(supplierData);
    if (supplierData) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchSupplier();
    }
    if (refreshKey) {
      setSearchText('');
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.SUPPLIER_LIST_SCREEN);
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
              await supplierService.deleteSupplier(id);
              fetchSupplier();
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

  const handleEditSupplier = (id: number) => {
    navigation.navigate(RouteName.SUPPLIER_EDIT_SCREEN, {id: id});
  };

  return {
    supplierDetails,
    fetchSupplier,
    handleEditSupplier,
    confirmDelete,
    loading,
    searchText,
    setSearchText,
  };
};

export {useSupplierList};
