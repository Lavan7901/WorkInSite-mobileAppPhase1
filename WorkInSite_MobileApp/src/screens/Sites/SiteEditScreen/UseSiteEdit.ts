import {useCallback, useEffect, useRef, useState} from 'react';
import {useClientService} from '../../../services/ClientService';
import {useContactService} from '../../../services/ContactService';
import {useSiteService} from '../../../services/SiteService';
import {Contact} from '../../Contacts/DTOs/ContactProps';
import {Site, SiteStatus} from '../DTOs/SiteProps';
import Toast from 'react-native-toast-message';
import {useSiteInputValidate} from '../SiteInputValidate';
import RouteName from '../../../navigation/RouteName';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useContactValidate} from '../../Clients/ContactValidate/ContactValidate';
import {Client} from '../../Clients/DTOs/ClientProps';
import {useLanguage} from '../../../context/LanguageContext';
import {User} from '../../Users/DTOs/User';

const useSiteEdit = (id: string, {navigation}: any) => {
  const clientService = useClientService();
  const contactService = useContactService();
  const siteService = useSiteService();
  const {t} = useLanguage();

  const initialContactList = {id: 0, name: '', phone: '', contactDetails: []};

  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [googleLocation, setGoogleLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [contactId, setContactId] = useState<string>('');
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [status, setStatus] = useState('');
  const [clientList, setClientList] = useState<Client[]>([]);
  const [client, setClient] = useState<Client>();
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>(initialContactList);
  const [siteDetails, setSiteDetails] = useState<Site>();
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const route = useRoute<any>();
  const shouldRefetchRef = useRef(true);

   useEffect(() => {
    if (route.params?.name && isFocused) setName(route.params.name);
    if (route.params?.clientId && isFocused) setClientId(route.params.clientId.toString());
    if (route.params?.contactId && isFocused) setContactId(route.params.contactId.toString());
  }, [route.params?.name, route.params?.clientId, route.params?.contactId, isFocused]);

 useEffect(() => {
  if (isFocused && route.params?.newSupervisor) {
    const newSupervisor = route.params.newSupervisor;

    setSupervisors(prev => [
      ...prev,
      {
        ...newSupervisor,
        role: {
          id: newSupervisor.roleId,
          name: newSupervisor.roleName,
        },
      },
    ]);

    shouldRefetchRef.current = false;
  }
}, [route.params?.newSupervisor, isFocused]);

  const fetchSite = async (skipSupervisorUpdate = false) => {
    setLoading(true);
    try {
      const siteData: Site = await siteService.getSite(parseInt(id));
      setSiteDetails(siteData);
      setName(siteData.name);
      setClientId(siteData.client.id.toString());
      setGoogleLocation(siteData.googleLocation);
      setNotes(siteData.note);
      setContactId(siteData.contact.id.toString());
      setStatus(siteData.status);

      // ✅ only update supervisors when not skipping
      if (!skipSupervisorUpdate) {
        setSupervisors(siteData.supervisors);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch site data.',
      });
    } finally {
      setLoading(false);
    }
  };

   useFocusEffect(
    useCallback(() => {
      if (shouldRefetchRef.current) {
        fetchSite();
      } else {
        shouldRefetchRef.current = true;
      }
    }, [id])
  );

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

  const fetchContacts = async (searchString: string = '') => {
    if (searchString) {
      const contacts = await contactService.getContacts(searchString, false);
      if (contactId && contacts) {
        const validContacts = contacts.filter(
          (item: Contact) => item.id !== parseInt(contactId),
        );
        setContactList([contact, validContacts.slice(0, 3)].flat());
      }
    }
  };

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

  const contactDetails = contactList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const {error, validate, setError, initialError} = useSiteInputValidate({
    name,
    clientId,
    googleLocation,
    contactId,
  });
  const {primaryContactDetails, hasMoreDetails} = useContactValidate(contact);

  const clientDetails = clientList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const siteStatus = [
    {label: SiteStatus.YET_TO_START, value: SiteStatus.YET_TO_START},
    {label: SiteStatus.WORKING, value: SiteStatus.WORKING},
    {label: SiteStatus.HOLD, value: SiteStatus.HOLD},
    {label: SiteStatus.COMPLETED, value: SiteStatus.COMPLETED},
  ];

  const handleClientCreate = (searchString: string) => {
    shouldRefetchRef.current = false;
    const redirectUrl = RouteName.SITE_EDIT_SCREEN;
    navigation.navigate(RouteName.CLIENT_CREATION_SCREEN, {
      name: searchString,
      redirect: redirectUrl,
      id
    });
  };

  const handleContactCreate = (searchString: string) => {
    shouldRefetchRef.current = false;
    const redirectUrl = RouteName.SITE_EDIT_SCREEN;
    navigation.navigate(RouteName.CONTACT_CREATION_SCREEN, {
      name: searchString,
      redirect: redirectUrl,
      id,
    });
  };
  const handleContactEdit = () => {
    shouldRefetchRef.current = false;
    const redirectUrl = RouteName.SITE_EDIT_SCREEN;
    navigation.navigate(RouteName.CONTACT_EDIT_SCREEN, {
      redirect: redirectUrl,
      contactId: contactId,
      id,
    });
  };

  const hasUnsavedChanges = () => {
    const currentSupervisorIds = supervisors.map(s => s.id).sort();
    const originalSupervisorIds =
      siteDetails?.supervisors?.map(s => s.id).sort() || [];

    return (
      name !== siteDetails?.name ||
      notes !== siteDetails?.note ||
      clientId !== siteDetails?.client?.id?.toString() ||
      contactId !== siteDetails?.contact?.id?.toString() ||
      googleLocation !== siteDetails?.googleLocation ||
      status !== siteDetails?.status ||
      JSON.stringify(currentSupervisorIds) !==
        JSON.stringify(originalSupervisorIds)
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
            style: 'cancel',
          },
          {
            text: t('Save'),
            onPress: handleSubmission,
          },
          {
            text: t('Exit Without Save'),
            onPress: () => {
              navigation.navigate(RouteName.SITE_LIST_SCREEN);
              fetchSite();
              setError(initialError);
            },
          },
        ],
        {cancelable: false},
      );
      return true;
    }
    navigation.navigate(RouteName.SITE_LIST_SCREEN); // Navigate directly
    return true; // Prevent default behavior
  };

  const handleSubmission = async () => {
    if (!validate()) return;
    const site = {
      name: name.trim(),
      clientId: parseInt(clientId),
      googleLocation,
      note: notes.trim(),
      contactId: parseInt(contactId),
      supervisorIds: supervisors?.map(s => s?.id) || [],
      status,
    };
    try {
      await siteService.updateSite(parseInt(id), site);
      navigation.navigate(RouteName.SITE_LIST_SCREEN);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.[0]?.message || 'Failed to Edit Site';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
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
    contactDetails,
    fetchContacts,
    setContactId,
    handleContactCreate,
    handleContactEdit,
    primaryContactDetails,
    hasMoreDetails,
    error,
    handleSubmission,
    supervisors,
    setSupervisors,
    status,
    setStatus,
    siteStatus,
    siteDetails,
    loading,
    handleBackPress,
    hasUnsavedChanges,
  };
};

export {useSiteEdit};
