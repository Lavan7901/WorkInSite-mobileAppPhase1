import {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {useClientService} from '../../../services/ClientService';
import {useContactService} from '../../../services/ContactService';
import {useSiteService} from '../../../services/SiteService';
import {Client} from '../../Clients/DTOs/ClientProps';
import {Contact} from '../../Contacts/DTOs/ContactProps';
import {useSiteInputValidate} from '../SiteInputValidate';
import {Alert} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {useContactValidate} from '../../Clients/ContactValidate/ContactValidate';
import RouteName from '../../../navigation/RouteName';
import {useLanguage} from '../../../context/LanguageContext';
import {SiteStatus} from '../DTOs/SiteProps';
import {User} from '../../Users/DTOs/User';

const useSiteCreation = ({navigation}: any) => {
  const route = useRoute<any>();
  const clientService = useClientService();
  const contactService = useContactService();
  const siteService = useSiteService();
  const {t} = useLanguage();

  const initialContact = {id: 0, name: '', phone: '', contactDetails: []};

  const [name, setName] = useState('');
  const [clientId, setClientId] = useState<string>('');
  const [googleLocation, setGoogleLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [contactId, setContactId] = useState('');
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [clientList, setClientList] = useState<Client[]>([]);
  const [client, setClient] = useState<Client>();
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [status, setStatus] = useState('Yet to start');
  const [contact, setContact] = useState<Contact>(initialContact);
  const isFocused = useIsFocused();

  const fetchClients = async (searchString: string = '') => {
    if (searchString) {
      const clients = await clientService.getClients(searchString, false);
      if (clientId && clients) {
        const validClients = clients.filter(
          (item: Client) => item.id !== parseInt(clientId),
        );
        setClientList([client, validClients.slice(0, 3)].flat());
        return;
      }
      if (clients) setClientList(clients.slice(0, 3));
    }
  };

  const fetchContacts = async (searchString: string = '') => {
    if (searchString) {
      const contacts = await contactService.getContacts(searchString, false);
      if (contactId && contacts) {
        const validContacts = contacts.filter(
          (item: Contact) => item.id !== parseInt(contactId),
        );
        setContactList([contact, validContacts.slice(0, 3)].flat());
        return;
      }
      if (contacts) setContactList(contacts.slice(0, 3));
    }
  };

  useEffect(() => {
    const fetchClientById = async () => {
      if (clientId) {
        const client = await clientService.getClient(parseInt(clientId));
        setClient(client);
        setClientList([client]);
      }
    };
    fetchClientById();
  }, [clientId]);

  useEffect(() => {
    const fetchContactById = async () => {
      if (contactId) {
        try {
          const fetchedContact = await contactService.getContact(
            parseInt(contactId),
          );
          setContact(fetchedContact);
          setContactList([fetchedContact]);
        } catch (error) {
          console.error('Failed to fetch contact:', error);
        }
      }
    };
    fetchContactById();
  }, [contactId, isFocused]);

  const {error, validate, setError, initialError} = useSiteInputValidate({
    name,
    clientId,
    googleLocation,
    contactId,
  });
  const {primaryContactDetails, hasMoreDetails} = useContactValidate(contact);

  const siteStatus = [
    {label: SiteStatus.YET_TO_START, value: SiteStatus.YET_TO_START},
    {label: SiteStatus.WORKING, value: SiteStatus.WORKING},
    {label: SiteStatus.HOLD, value: SiteStatus.HOLD},
    {label: SiteStatus.COMPLETED, value: SiteStatus.COMPLETED},
  ];

  const clientDetails = clientList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const contactDetails = contactList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleClientCreate = (searchString: string) => {
    const redirectUrl = RouteName.SITE_CREATION_SCREEN;
    navigation.navigate(RouteName.CLIENT_CREATION_SCREEN, {
      name: searchString,
      redirect: redirectUrl,
    });
  };

  const handleContactCreate = (searchString: string) => {
    const redirectUrl = RouteName.SITE_CREATION_SCREEN;
    navigation.navigate(RouteName.CONTACT_CREATION_SCREEN, {
      name: searchString,
      redirect: redirectUrl,
    });
  };

  const handleContactEdit = () => {
    const redirectUrl = RouteName.SITE_CREATION_SCREEN;
    navigation.navigate(RouteName.CONTACT_EDIT_SCREEN, {
      redirect: redirectUrl,
      contactId: contactId,
    });
  };

  const resetFormFields = () => {
    setName('');
    setNotes('');
    setClientId('');
    setClientList([]);
    setContactId('');
    setContact(initialContact);
    setContactList([]);
    setGoogleLocation('');
    setSupervisors([]);
    setStatus('Yet to start');
    setError(initialError);
  };

  const hasUnsavedChanges = () => {
    return (
      name.trim() !== '' ||
      notes.trim() !== '' ||
      clientId !== '' ||
      contactId !== '' ||
      googleLocation.trim() !== '' ||
      status !== 'Yet to start' ||
      supervisors.length > 0
    );
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
        [
          {
            text: t('Cancel'),
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: t('Save'),
            onPress: () => {
              handleSubmission();
            },
          },
          {
            text: t('Exit Without Save'),
            onPress: () => {
              resetFormFields();
              navigation.navigate(RouteName.SITE_LIST_SCREEN);
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.SITE_LIST_SCREEN);
    }
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      if (route.params?.name) {
        setName(route.params.name);
      }
      if (route.params?.clientId) {
        setClientId(route.params.clientId.toString());
      }
      if (route.params?.contactId) {
        setContactId(route.params.contactId.toString());
      }
    }
  }, [
    route.params?.clientId,
    route.params?.contactId,
    route.params?.name,
    isFocused,
  ]);

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const site = {
          name: name.trim(),
          clientId: parseInt(clientId),
          googleLocation,
          note: notes.trim(),
          contactId: parseInt(contactId),
          supervisorIds: supervisors?.map(s => s?.id) || [],
          status,
        };
        await siteService.createSite(site);
        resetFormFields();
        navigation.navigate(RouteName.SITE_LIST_SCREEN);
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to Create Site';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  return {
    name,
    setName,
    clientDetails,
    clientId,
    setClientId,
    handleClientCreate,
    fetchClients,
    googleLocation,
    setGoogleLocation,
    notes,
    setNotes,
    contact,
    contactId,
    setContactId,
    contactDetails,
    fetchContacts,
    handleContactCreate,
    handleContactEdit,
    primaryContactDetails,
    hasMoreDetails,
    error,
    handleSubmission,
    supervisors,
    setSupervisors,
    handleBackPress,
    hasUnsavedChanges,
    status,
    setStatus,
    siteStatus,
    resetFormFields,
  };
};

export {useSiteCreation};
