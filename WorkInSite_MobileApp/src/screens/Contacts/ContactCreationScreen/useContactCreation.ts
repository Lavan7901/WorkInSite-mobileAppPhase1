import {useContactService} from '../../../services/ContactService';
import {useState, useEffect} from 'react';
import {useInputValidate} from '../InputValidate/InputValidate';
import {ContactRequest, ContactTypes} from '../DTOs/ContactProps';
import Toast from 'react-native-toast-message';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useLanguage} from '../../../context/LanguageContext';

const useContactCreation = ({navigation, route}: any) => {
  const [name, setName] = useState(route?.params?.name || '');
  const [phone, setPhone] = useState<string>('');
  const [contactList, setContactList] = useState<ContactRequest>({
    name: '',
    phone: '',
    contactDetails: [],
  });
  const {error, validate, setError, initialError} = useInputValidate({
    name,
    phone,
  });
  const contactService = useContactService();
  const redirectUrl = route?.params?.redirect;
  const isFocused = useIsFocused();
  const {t} = useLanguage();

  useEffect(() => {
    if (route?.params?.name && isFocused) {
      setName(route?.params?.name);
    }
  }, [route?.params?.name && isFocused]);

  useEffect(() => {
    if (!isFocused) {
      resetForm();
    }
  }, [isFocused]);

  const isAddDisabled = [
    ContactTypes.PHONE,
    ContactTypes.EMAIL,
    ContactTypes.ADDRESS,
  ].every(type => {
    const ContactsCount = contactList.contactDetails.filter(
      item => item.contactType === type,
    ).length;
    return ContactsCount >= 5;
  });

  const resetForm = () => {
    setName('');
    setPhone('');
    setContactList({
      name: '',
      phone: '',
      contactDetails: [],
    });
    setError(initialError);
  };

  const hasUnsavedChanges =
    name.trim() !== '' ||
    phone.trim() !== '' ||
    contactList.contactDetails.length > 0;

  const handleNavigation = (redirectUrl: any) => {
    if (redirectUrl) {
      navigation.navigate(redirectUrl, {id: route?.params?.id || ''});
    } else {
      navigation.navigate(RouteName.CONTACT_LIST_SCREEN);
    }
  };

  const showUnsavedChangesAlert = () => {
    Alert.alert(
      t('Unsaved Changes'),
      t('You have unsaved changes. Do you want to save before exiting?'),
      [
        {
          text: t('Save'),
          onPress: handleSubmission,
        },
        {
          text: t('Exit Without Saving'),
          onPress: () => handleNavigation(redirectUrl),
        },
        {
          text: t('Cancel'),
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      showUnsavedChangesAlert();
    } else {
      handleNavigation(redirectUrl);
    }
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      const contact = {...contactList, name: name.trim(), phone: phone.trim()};
      try {
        const response = await contactService.createContact(contact);
        if (redirectUrl) {
          navigation.navigate(redirectUrl, {
            contactId: response.id,
            id: route?.params?.id || '',
          });
        } else {
          navigation.navigate(RouteName.CONTACT_LIST_SCREEN);
        }
      } catch (err: any) {
        const errorData = err?.response?.data?.[0];
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorData.message || 'Oops! Something went wrong.',
        });
      }
    }
  };

  return {
    name,
    setName,
    phone,
    setPhone,
    error,
    contactList,
    setContactList,
    handleSubmission,
    handleBack,
    hasUnsavedChanges,
    isAddDisabled,
  };
};

export {useContactCreation};
