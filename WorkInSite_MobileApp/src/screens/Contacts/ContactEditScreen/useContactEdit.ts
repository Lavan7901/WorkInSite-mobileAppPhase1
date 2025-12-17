import Toast from 'react-native-toast-message';
import {useEffect, useState} from 'react';
import {useInputValidate} from '../InputValidate/InputValidate';
import {useContactService} from '../../../services/ContactService';
import {
  Contact,
  ContactDetail,
  ContactRequest,
  ContactTypes,
} from '../DTOs/ContactProps';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useLanguage} from '../../../context/LanguageContext';

const useContactEdit = (
  contactId: string,
  navigation: any,
  redirect: string,
  id: string,
) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState<string>('');
  const [contactList, setContactList] = useState<ContactRequest>({
    name: '',
    phone: '',
    contactDetails: [],
  });
  const [initialcontactList, setinitialContactList] = useState<Contact>({
    id: 0,
    name: '',
    phone: '',
    contactDetails: [],
  });
  const [loading, setLoading] = useState<boolean>(false);

  const {error, validate, setError, initialError} = useInputValidate({
    name,
    phone,
  });
  const contactService = useContactService();

  const isFocused = useIsFocused();
  const {t} = useLanguage();

  const fetchContact = async () => {
    setLoading(true);
    try {
      const contactData = await contactService.getContact(parseInt(contactId));
      setContactList(contactData);
      setName(contactData.name);
      setPhone(contactData.phone);
      setinitialContactList(contactData);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch contact details.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [contactId, isFocused]);

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

  const handleSubmission = async () => {
    if (validate()) {
      const contact = {...contactList, name: name.trim(), phone: phone.trim()};
      try {
        await contactService.updateContact(parseInt(contactId), contact);
        if (redirect) {
          navigation.navigate(redirect, {id: id || ''});
          return;
        }
        navigation.navigate(RouteName.CONTACT_LIST_SCREEN);
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

  const haveContactDetailsChanged = (
    current: ContactDetail[],
    initial: ContactDetail[],
  ): boolean => {
    if (current.length !== initial.length) return true;

    return current.some((item, index) => {
      const initialItem = initial[index];
      return (
        item.contactType !== initialItem?.contactType ||
        item.value.trim() !== initialItem?.value.trim()
      );
    });
  };

  const hasUnsavedChanges =
    name.trim() !== initialcontactList.name.trim() ||
    phone.trim() !== initialcontactList.phone.trim() ||
    contactList.contactDetails.length !==
      initialcontactList.contactDetails.length ||
    haveContactDetailsChanged(
      contactList.contactDetails,
      initialcontactList.contactDetails,
    );

  const navigate = () => {
    if (redirect) {
      navigation.navigate(redirect, {id: id || ''});
      setError(initialError);
    } else {
      navigation.navigate(RouteName.CONTACT_LIST_SCREEN);
      setError(initialError);
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
          onPress: navigate,
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
      navigate();
    }
    return true;
  };

  return {
    name,
    setName,
    phone,
    setPhone,
    error,
    contactList,
    setContactList,
    handleBack,
    hasUnsavedChanges,
    handleSubmission,
    isAddDisabled,
    loading,
  };
};

export {useContactEdit};
