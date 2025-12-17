import Toast from 'react-native-toast-message';
import RouteName from '../../../navigation/RouteName';
import {useContactService} from '../../../services/ContactService';
import {Contact} from '../../Contacts/DTOs/ContactProps';
import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useLanguage} from '../../../context/LanguageContext';
import {useRefresh} from '../../../context/RefreshContext';

const useContactList = ({navigation}: any) => {
  const contactService = useContactService();
  const isFocused = useIsFocused();
  const {t} = useLanguage();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.CONTACT_LIST_SCREEN];

  const [contactList, setContactList] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchContact = async (searchString: string = '') => {
    const contactData = await contactService.getContacts(searchString);
    setContactList(contactData);
    if (contactData) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchContact();
    }
    if (refreshKey) {
      setSearchText('');
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.CONTACT_LIST_SCREEN);
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
            await handleContactDelete(id);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleContactDelete = async (id: number) => {
    try {
      await contactService.deleteContact(id);
      fetchContact();
    } catch (error: any) {
      error?.response?.data?.forEach((i: any) => {
        const messages = JSON.parse(i.message);
        const shortMessage = messages[0];
        Toast.show({
          type: 'error',
          text1: "Couldn't Delete!",
          text2: shortMessage,
        });
      });
      return;
    }
  };

  const handleEditContact = (id: number) => {
    navigation.navigate(RouteName.CONTACT_EDIT_SCREEN, {contactId: id});
  };

  return {
    contactList,
    loading,
    refreshing,
    searchText,
    fetchContact,
    handleContactDelete,
    handleEditContact,
    confirmDelete,
    setSearchText,
    setRefreshing,
  };
};

export {useContactList};
