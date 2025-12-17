import {useCallback, useEffect, useRef, useState} from 'react';
import {useClientService} from '../../../services/ClientService';
import {useContactService} from '../../../services/ContactService';
import {Contact} from '../../Contacts/DTOs/ContactProps';
import RouteName from '../../../navigation/RouteName';
import Toast from 'react-native-toast-message';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useInputValidate} from '../useClientInputValidate';
import {useContactValidate} from '../ContactValidate/ContactValidate';
import {Client, ClientRequest, KYCTypes} from '../DTOs/ClientProps';
import {useLanguage} from '../../../context/LanguageContext';

const useClientEdit = (id: string, {navigation}: any) => {
  const clientService = useClientService();
  const contactService = useContactService();
  const {t} = useLanguage();

  const initialContactList = {id: 0, name: '', phone: '', contactDetails: []};
  const initialClientDetails = {
    id: 0,
    name: '',
    note: '',
    contact: initialContactList,
    kycDetails: [],
  };
  const route = useRoute<any>();
  const [name, setName] = useState('');
  const [contactId, setContactId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [clientDetails, setClientDetails] = useState<Client | ClientRequest>(
    initialClientDetails,
  );
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>(initialContactList);
  const {error, validate, setError, initialError} = useInputValidate({name});
  const {primaryContactDetails, hasMoreDetails} = useContactValidate(contact);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [initialKycDetails, setInitialKycDetails] = useState<any[]>([]); // Track initial KYC details
  const shouldRefetchRef = useRef(true);
  
useEffect(() => {
    if (route.params?.name && isFocused) {
      setName(route.params.name);
    }
    if (route.params?.contactId && isFocused) {
      setContactId(route.params.contactId.toString());
    }
  }, [route.params?.name, route.params?.contactId, isFocused]);

  const fetchClient = async () => {
    setLoading(true);
    try {
      const clientData: Client = await clientService.getClient(parseInt(id));
      setClientDetails(clientData);
      setName(clientData.name);
      setNotes(clientData.note);
      setContactId(clientData.contact.id.toString());
      setInitialKycDetails(clientData.kycDetails); // Save initial KYC details
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

  useEffect(() => {
    fetchClient();
  }, [id]);

 useFocusEffect(
    useCallback(() => {
      if (shouldRefetchRef.current) {
        fetchClient();
      } else {
        shouldRefetchRef.current = true; // reset flag for next time
      }
    }, [id]),
  );

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

  const isAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every(
    type =>
      clientDetails.kycDetails.some(
        (item: any) => item.kycType === type && item.value,
      ),
  );

  const hasUnsavedChanges = () => {
    // Check if KYC details have changed
    const kycDetailsChanged =
      JSON.stringify(clientDetails.kycDetails) !==
      JSON.stringify(initialKycDetails);

    return (
      name !== clientDetails.name || // Check if name has changed
      notes !== clientDetails.note || // Check if notes have changed
      (clientDetails as Client).contact.id.toString() !== contactId ||
      kycDetailsChanged // Check if KYC details have changed
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
            onPress: () => null, // Stay on the current screen
            style: 'cancel',
          },
          {
            text: t('Save'),
            onPress: () => {
              handleSubmission(); // Save the changes
            },
          },
          {
            text: t('Exit Without Save'),
            onPress: () => {
              navigation.navigate(RouteName.CLIENT_LIST_SCREEN);
              fetchClient();
              setError(initialError);
            },
          },
        ],
        {cancelable: false}, // Prevent dismissing the alert by tapping outside
      );
      return true; // Prevent the default back action
    }
    navigation.navigate(RouteName.CLIENT_LIST_SCREEN); // Navigate directly
    return true; // Prevent default behavior
  };

  const handleContactCreate = (searchString: string) => {
    shouldRefetchRef.current = false;
    const redirectUrl = RouteName.CLIENT_EDIT_SCREEN;
    navigation.navigate(RouteName.CONTACT_CREATION_SCREEN, {
      name: searchString,
      redirect: redirectUrl,
      id,
    });
  };
  const handleContactEdit = () => {
    shouldRefetchRef.current = false;
    const redirectUrl = RouteName.CLIENT_EDIT_SCREEN;
    navigation.navigate(RouteName.CONTACT_EDIT_SCREEN, {
      redirect: redirectUrl,
      contactId: contactId,
      id,
    });
  };
  const handleSubmission = async () => {
    if (validate()) {
      try {
        const client = {
          name: name.trim(),
          note: notes.trim(),
          contactId: Number(contactId),
          kycDetails: clientDetails.kycDetails,
        };
        await clientService.updateClient(parseInt(id), client);
        navigation.navigate(RouteName.CLIENT_LIST_SCREEN, {id});
        fetchClient();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0].message || 'Failed to Edit Client';
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
    notes,
    setNotes,
    clientDetails,
    setClientDetails,
    error,
    navigation,
    handleContactEdit,
    handleSubmission,
    isAddDisabled,
    contactDetails,
    contactId,
    setContactId,
    handleContactCreate,
    fetchContacts,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    loading,
    handleBackPress,
    hasUnsavedChanges,
  };
};

export {useClientEdit};
