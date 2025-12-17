import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useMaterialService} from '../../../services/MaterialService';
import {useLanguage} from '../../../context/LanguageContext';
import Toast from 'react-native-toast-message';
import RouteName from '../../../navigation/RouteName';
import {useRefresh} from '../../../context/RefreshContext';

const useMaterialList = ({navigation}: any) => {
  const materialService = useMaterialService();
  const {t} = useLanguage();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.MATERIAL_LIST_SCREEN];

  const [materialDetails, setMaterialDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const isFocused = useIsFocused();

  const fetchMaterial = async (searchString: string = '') => {
    setLoading(true);
    const materialData = await materialService.getMaterials(searchString);
    setMaterialDetails(materialData);
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      fetchMaterial();
    }
    if (refreshKey) {
      setSearchText('');
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.MATERIAL_LIST_SCREEN);
    }
  }, [isFocused]);

  const handleMaterialSelect = (id: number) => {
    navigation.navigate('MaterialEditScreen', {id});
  };

  const handleMaterialDelete = async (id: number) => {
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
              await materialService.deleteMaterial(id);
              fetchMaterial();
            } catch (error: any) {
              const errorMsg =
                error?.response?.data?.message || 'Failed to delete Material';
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

  return {
    materialDetails,
    fetchMaterial,
    handleMaterialSelect,
    handleMaterialDelete,
    loading,
    searchText,
    setSearchText,
  };
};

export {useMaterialList};
