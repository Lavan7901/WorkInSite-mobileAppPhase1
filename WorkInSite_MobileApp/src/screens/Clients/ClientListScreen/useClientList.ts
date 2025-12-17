import {useEffect, useState} from 'react';
import {useClientService} from '../../../services/ClientService';
import {Client} from '../DTOs/ClientProps';
import RouteName from '../../../navigation/RouteName';
import {Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useLanguage} from '../../../context/LanguageContext';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../context/RefreshContext';

const useClientList = ({navigation}: any) => {
  const clientService = useClientService();
  const isFocused = useIsFocused();
  const {t} = useLanguage();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.CLIENT_LIST_SCREEN];

  const [clientDetails, setClientDetails] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchClient = async (searchString: string = '') => {
    const clientData = await clientService.getClients(searchString);
    setClientDetails(clientData);
    if (clientData) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchClient();
    }
    if (refreshKey) {
      setSearchText('');
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.CLIENT_LIST_SCREEN);
    }
  }, [isFocused]);

  const handleClientSelect = (id: number) => {
    navigation.navigate(RouteName.CLIENT_EDIT_SCREEN, {id});
  };

  const handleClientDelete = async (id: number) => {
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
              await clientService.deleteClient(id);
              fetchClient();
            } catch (error: any) {
              const errorMsg =
                error?.response?.data?.message || 'Failed to delete unit';
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
    clientDetails,
    fetchClient,
    handleClientSelect,
    handleClientDelete,
    loading,
    searchText,
    setSearchText,
  };
};

export {useClientList};
