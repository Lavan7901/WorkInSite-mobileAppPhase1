import {useState, useEffect} from 'react';
import {useContactService} from '../../../services/ContactService';
import {useClientService} from '../../../services/ClientService';
import {Contact} from '../../Contacts/DTOs/ContactProps';
import {Client, ClientRequest} from '../DTOs/ClientProps';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useInputValidate} from '../useClientInputValidate';
import {useContactValidate} from '../ContactValidate/ContactValidate';
import {useLanguage} from '../../../context/LanguageContext';
import Toast from 'react-native-toast-message';
enum KYCTypes {
  AADHAAR = 'AADHAAR',
  PAN = 'PAN',
  GST = 'GST',
}

const useClientCreation = ({navigation}: any) => {
  const route = useRoute<any>();
  const {t} = useLanguage();
  const clientService = useClientService();
  const contactService = useContactService();

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [contactId, setContactId] = useState('');
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>({
    id: 0,
    name: '',
    phone: '',
    contactDetails: [],
  });
  const isFocused = useIsFocused();

  const [clientDetails, setClientDetails] = useState<Client | ClientRequest>({
    name: '',
    contactId: parseInt(contactId),
    note: '',
    kycDetails: [
      {kycType: KYCTypes.AADHAAR, value: ''},
      {kycType: KYCTypes.PAN, value: ''},
      {kycType: KYCTypes.GST, value: ''},
    ],
  });

  const fetchContacts = async (searchString: string = '') => {
    if (searchString) {
      const contacts = await contactService.getContacts(searchString, false);
      if (contactId && contacts) {
        const validContacts = contacts.filter(
          (item: Contact) => item.id !== parseInt(contactId),
        );
        setContactList([contact, ...validContacts.slice(0, 3)]);
        return;
      }
      if (contacts) setContactList(contacts.slice(0, 3));
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

  const {error, validate, setError, initialError} = useInputValidate({
    name,
    contactId,
  });
  const {primaryContactDetails, hasMoreDetails} = useContactValidate(contact);

  const contactDetails = contactList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const validKycDetails = clientDetails.kycDetails.filter(item => item.value);

  const isAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every(
    type =>
      clientDetails.kycDetails.some(
        item => item.kycType === type && item.value,
      ),
  );

  const handleContactCreate = (searchString: string) => {
    const redirectUrl = RouteName.CLIENT_CREATION_SCREEN;
    navigation.navigate(RouteName.CONTACT_CREATION_SCREEN, {
      name: searchString,
      redirect: redirectUrl,
    });
  };
  const handleContactEdit = () => {
    const redirectUrl = RouteName.CLIENT_CREATION_SCREEN;
    navigation.navigate(RouteName.CONTACT_EDIT_SCREEN, {
      redirect: redirectUrl,
      contactId: contactId,
    });
  };

  useEffect(() => {
    if (route.params?.name && isFocused) {
      setName(route.params.name);
    }
    if (route.params?.contactId && isFocused) {
      setContactId(route.params.contactId.toString());
    }
  }, [route.params?.name, route.params?.contactId, isFocused]);

  const resetFormFields = () => {
    setName('');
    setNotes('');
    setContactId('');
    setContact({
      id: 0,
      name: '',
      phone: '',
      contactDetails: [],
    });
    setContactList([]);
    setClientDetails({
      name: '',
      contactId: 0,
      note: '',
      kycDetails: [
        {kycType: KYCTypes.AADHAAR, value: ''},
        {kycType: KYCTypes.PAN, value: ''},
        {kycType: KYCTypes.GST, value: ''},
      ],
    });
    setError(initialError);
  };

  const hasUnsavedChanges = () => {
    return (
      name.trim() !== '' ||
      notes.trim() !== '' ||
      contactId !== '' ||
      isKycDetailsFilled(clientDetails.kycDetails)
    );
  };
  const isKycDetailsFilled = (kycDetails: {kycType: string; value: string}[]) =>
    kycDetails.some(item => item.value.trim() !== '');

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
        [
          {
            text: t('Cancel'),
            onPress: () => {}, // Stay on the current screen
            style: 'cancel',
          },
          {
            text: t('Save'),
            onPress: () => handleSubmission(),
          },
          {
            text: t('Exit Without Save'),
            onPress: () => {
              resetFormFields();
              navigation.navigate(RouteName.CLIENT_LIST_SCREEN);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.CLIENT_LIST_SCREEN);
    }
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const client = {
          name: name.trim(),
          note: notes.trim(),
          contactId: parseInt(contactId),
          kycDetails: validKycDetails,
        };
        const response = await clientService.createClient(client);
        resetFormFields();
        if (route.params?.redirect) {
          navigation.navigate(route.params.redirect, {clientId: response.id ,id: route?.params?.id || ''});
          return;
        }
        navigation.navigate(RouteName.CLIENT_LIST_SCREEN, {
          clientId: response.id,
        });
        resetFormFields();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0].message || 'Failed to Create Client';
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
    handleSubmission,
    isAddDisabled,
    contactDetails,
    contactId,
    setContactId,
    setContact,
    setContactList,
    handleContactCreate,
    fetchContacts,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
    handleBackPress,
    hasUnsavedChanges,
    resetFormFields,
  };
};

export {useClientCreation};
