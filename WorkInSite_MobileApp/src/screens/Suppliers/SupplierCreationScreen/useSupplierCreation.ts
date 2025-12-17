import {useEffect, useState} from 'react';
import {useSupplierService} from '../../../services/SupplierService';
import {useContactService} from '../../../services/ContactService';
import {Contact} from '../../Contacts/DTOs/ContactProps';
import {Supplier, SupplierRequest, UpiTypes} from '../DTOs/SupplierProps';
import {useInputValidate} from '../InputValidate/InputValidate';
import RouteName from '../../../navigation/RouteName';
import {useContactValidate} from '../../Clients/ContactValidate/ContactValidate';
import {Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useLanguage} from '../../../context/LanguageContext';
import Toast from 'react-native-toast-message';

enum KYCTypes {
  AADHAAR = 'AADHAAR',
  PAN = 'PAN',
  GST = 'GST',
}
const initialContact = {
  id: 0,
  name: '',
  phone: '',
  contactDetails: [],
};
const useSupplierCreation = ({navigation, route}: any) => {
  const supplierService = useSupplierService();
  const contactService = useContactService();
  const {t} = useLanguage();
  const [name, setName] = useState('');
  const [contactId, setContactId] = useState(route?.params?.contactId || '');
  const [notes, setNotes] = useState('');

  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>(initialContact);

  const [supplierDetails, setSupplierDetails] = useState<
    Supplier | SupplierRequest
  >({
    name: '',
    contactId: parseInt(contactId),
    note: '',
    kycDetails: [
      {kycType: KYCTypes.AADHAAR, value: ''},
      {kycType: KYCTypes.PAN, value: ''},
      {kycType: KYCTypes.GST, value: ''},
    ],
    bankAccounts: [
      {
        accountName: '',
        accountNumber: '',
        ifscCode: '',
      },
      {
        accountName: '',
        accountNumber: '',
        ifscCode: '',
      },
    ],
    upiDetails: [
      {upiType: UpiTypes.GPAY, value: ''},
      {upiType: UpiTypes.PHONEPE, value: ''},
      {upiType: UpiTypes.UPI_ID, value: ''},
    ],
  } as SupplierRequest);

  const isFocused = useIsFocused();

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

  useEffect(() => {
    if (route?.params?.contactId) {
      setContactId(route?.params?.contactId?.toString());
    }
  }, [route?.params?.contactId]);

  const {error, validate, setError, initialError} = useInputValidate({
    name,
    contactId,
  });
  const {primaryContactDetails, hasMoreDetails} = useContactValidate(contact);
  const contactDetails = contactList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const validKycDetails = supplierDetails.kycDetails.filter(item => item.value);
  const validBankAccounts = supplierDetails.bankAccounts.filter(
    item => item.accountName && item.accountNumber && item.ifscCode,
  );
  const validUpiDetails = supplierDetails.upiDetails.filter(item => item.value);

  const isKycAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every(
    type =>
      supplierDetails.kycDetails.some(
        item => item.kycType === type && item.value,
      ),
  );

  const isBankAccountsAddDisabled = validBankAccounts.length >= 2;

  const isUpiAddDisabled = [
    UpiTypes.GPAY,
    UpiTypes.PHONEPE,
    UpiTypes.UPI_ID,
  ].every(type =>
    supplierDetails.upiDetails.some(
      item => item.upiType === type && item.value,
    ),
  );

  const handleContactChange = (value: string) => setContactId(value);

  const redirectUrl = RouteName.SUPPLIER_CREATION_SCREEN;

  const handleContactCreate = (searchString: string) => {
    const redirect = redirectUrl;
    navigation.navigate(RouteName.CONTACT_CREATION_SCREEN, {
      name: searchString,
      redirect,
    });
  };

  const handleContactEdit = () => {
    const redirect = redirectUrl;
    navigation.navigate(RouteName.CONTACT_EDIT_SCREEN, {
      contactId: contactId,
      redirect,
    });
  };

  const resetForm = () => {
    setName('');
    setContactId('');
    setNotes('');
    setContactList([]);
    setContact(initialContact);
    setSupplierDetails({
      name: '',
      contactId: parseInt(contactId),
      note: '',
      kycDetails: [
        {kycType: KYCTypes.AADHAAR, value: ''},
        {kycType: KYCTypes.PAN, value: ''},
        {kycType: KYCTypes.GST, value: ''},
      ],
      bankAccounts: [
        {
          accountName: '',
          accountNumber: '',
          ifscCode: '',
        },
        {
          accountName: '',
          accountNumber: '',
          ifscCode: '',
        },
      ],
      upiDetails: [
        {upiType: UpiTypes.GPAY, value: ''},
        {upiType: UpiTypes.PHONEPE, value: ''},
        {upiType: UpiTypes.UPI_ID, value: ''},
      ],
    });
    setError(initialError);
  };

  //exit
  const isKycDetailsFilled = (kycDetails: {kycType: string; value: string}[]) =>
    kycDetails.some(item => item.value.trim() !== '');

  const isBankAccountsFilled = (
    bankAccounts: {
      accountName: string;
      accountNumber: string;
      ifscCode: string;
    }[],
  ) =>
    bankAccounts.some(
      account =>
        account.accountName.trim() !== '' &&
        account.accountNumber.trim() !== '' &&
        account.ifscCode.trim() !== '',
    );

  const isUpiDetailsFilled = (upiDetails: {upiType: string; value: string}[]) =>
    upiDetails.some(item => item.value.trim() !== '');

  const hasUnsavedChanges =
    name.trim() !== '' ||
    notes.trim() !== '' ||
    contactId !== '' ||
    isKycDetailsFilled(supplierDetails.kycDetails) ||
    isBankAccountsFilled(supplierDetails.bankAccounts) ||
    isUpiDetailsFilled(supplierDetails.upiDetails);

  const handleBackPress = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save before exiting?'),
        [
          {
            text: t('Save'),
            onPress: () => {
              handleSubmission();
            },
          },
          {
            text: t('Exit Without Saving'),
            onPress: () => {
              resetForm();
              navigation.navigate(RouteName.SUPPLIER_LIST_SCREEN);
            },
          },
          {
            text: t('Cancel'),
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      resetForm();
      navigation.navigate(RouteName.SUPPLIER_LIST_SCREEN);
    }
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const supplier = {
          name: name.trim(),
          note: notes.trim(),
          contactId: parseInt(contactId),
          kycDetails: validKycDetails,
          bankAccounts: validBankAccounts,
          upiDetails: validUpiDetails,
        };
        await supplierService.createSupplier(supplier);
        resetForm();
        navigation.navigate(RouteName.SUPPLIER_LIST_SCREEN);
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to Create Supplier';
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
    supplierDetails,
    setSupplierDetails,
    error,
    handleSubmission,
    isKycAddDisabled,
    isBankAccountsAddDisabled,
    isUpiAddDisabled,
    contactDetails,
    contactId,
    handleContactCreate,
    handleContactChange,
    fetchContacts,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
    handleBackPress,
    hasUnsavedChanges,
    resetForm,
  };
};

export {useSupplierCreation};
