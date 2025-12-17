import {useEffect, useState} from 'react';
import {useWorkerService} from '../../../services/WorkerService';
import {useWorkerCategoryService} from '../../../services/WorkerCategoryService';
import {useContactService} from '../../../services/ContactService';
import {GenderTypes, Worker, WorkerRequest} from '../DTOs/WorkerProps';
import {Contact} from '../../Contacts/DTOs/ContactProps';
import {WorkerCategoryProps} from '../DTOs/WorkerCategoryProps';
import {UpiTypes} from '../../Suppliers/DTOs/SupplierProps';
import {useWorkerInputValidate} from '../InputValidate/WorkerInputValidate';
import {useContactValidate} from '../../Clients/ContactValidate/ContactValidate';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
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
const useWorkerCreation = ({navigation, route}: any) => {
  const workerService = useWorkerService();
  const workerCategoryService = useWorkerCategoryService();
  const contactService = useContactService();
  const {t} = useLanguage();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [contactId, setContactId] = useState('');
  const [workerCategoryId, setWorkerCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [gender, setGender] = useState<GenderTypes | any>(''); //note gender
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>(initialContact);
  const [workerCategoryList, setWorkerCategoryList] = useState<
    WorkerCategoryProps[]
  >([]);
  const [workerCategory, setWorkerCategory] = useState<WorkerCategoryProps>({
    id: 0,
    name: '',
    workerRoles: [],
    workTypes: [],
    note: '',
  });
  const [workerDetails, setWorkerDetails] = useState<Worker | WorkerRequest>({
    name: '',
    dateOfBirth: dateOfBirth,
    contactId: parseInt(contactId),
    workerCategoryId: parseInt(workerCategoryId),
    note: '',
    gender: gender,

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
  } as WorkerRequest);

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

  const fetchWorkerCategories = async (searchString: string = '') => {
    if (searchString) {
      const workerCategories = await workerCategoryService.getWorkerCategories(
        searchString,
        false,
      );
      if (workerCategoryId && workerCategories) {
        const validWorkerCategories = workerCategories.filter(
          (item: WorkerCategoryProps) => item.id !== parseInt(workerCategoryId),
        );
        setWorkerCategoryList(
          [workerCategory, validWorkerCategories.slice(0, 3)].flat(),
        );
        return;
      }
      if (workerCategories) setWorkerCategoryList(workerCategories.slice(0, 3));
    }
  };

  useEffect(() => {
    const fetchWorkerCategoryById = async () => {
      if (workerCategoryId) {
        try {
          const workerCategory = await workerCategoryService.getWorkerCategory(
            parseInt(workerCategoryId),
          );
          setWorkerCategory(workerCategory);
          setWorkerCategoryList([workerCategory]);
        } catch (error) {
          console.error('Failed to fetch contact:', error);
        }
      }
    };
    fetchWorkerCategoryById();
  }, [workerCategoryId, isFocused]);

  //new
  useEffect(() => {
    if (route?.params?.contactId) {
      setContactId(route?.params?.contactId?.toString());
    }
  }, [route?.params?.contactId]);

  useEffect(() => {
    if (route?.params?.workerCategoryId) {
      setWorkerCategoryId(route?.params?.workerCategoryId?.toString());
    }
  }, [route?.params?.workerCategoryId]);

  const {genderItems, error, validate, setError, initialError} =
    useWorkerInputValidate({
      name,
      dateOfBirth,
      workerCategoryId,
      contactId,
      gender,
    });
  const {primaryContactDetails, hasMoreDetails} = useContactValidate(contact);

  const contactDetails = contactList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const workerCategoryDetails = workerCategoryList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const validKycDetails = workerDetails.kycDetails.filter(item => item.value);
  const validBankAccounts = workerDetails.bankAccounts.filter(
    item => item.accountName && item.accountNumber && item.ifscCode,
  );
  const validUpiDetails = workerDetails.upiDetails.filter(item => item.value);

  const isKycAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every(
    type =>
      workerDetails.kycDetails.some(
        item => item.kycType === type && item.value,
      ),
  );

  const isBankAccountsAddDisabled = validBankAccounts.length >= 2;

  const isUpiAddDisabled = [
    UpiTypes.GPAY,
    UpiTypes.PHONEPE,
    UpiTypes.UPI_ID,
  ].every(type =>
    workerDetails.upiDetails.some(item => item.upiType === type && item.value),
  );

  const handleContactChange = (value: string) => setContactId(value);
  const handleWorkerCategoryChange = (value: string) =>
    setWorkerCategoryId(value);

  const redirectUrl = RouteName.WORKER_CREATION_SCREEN;

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

  const handleWorkerCategoryCreate = (searchString: string) => {
    const redirect = redirectUrl;
    navigation.navigate(RouteName.WORKER_CATEGORY_CREATION_SCREEN, {
      name: searchString,
      redirect,
    });
  };

  const handleWorkerCategoryEdit = () => {
    const redirect = redirectUrl;
    navigation.navigate(RouteName.WORKER_CATEGORY_EDIT_SCREEN, {
      workerCategoryId: workerCategoryId,
      redirect,
    });
  };

  const resetForm = () => {
    setName('');
    setContactId('');
    setNotes('');
    setGender('');
    setContactList([]);
    setDateOfBirth('');
    setWorkerCategoryList([]);
    setWorkerCategoryId('');
    setWorkerCategory({
      id: 0,
      name: '',
      note: '',
      workerRoles: [],
      workTypes: [],
    });
    setContact(initialContact);
    setWorkerDetails({
      name: '',
      dateOfBirth: dateOfBirth,
      contactId: parseInt(contactId),
      workerCategoryId: parseInt(workerCategoryId),
      note: '',
      gender: gender,

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
    workerCategoryId !== '' ||
    dateOfBirth !== '' ||
    gender !== '' ||
    isKycDetailsFilled(workerDetails.kycDetails) ||
    isBankAccountsFilled(workerDetails.bankAccounts) ||
    isUpiDetailsFilled(workerDetails.upiDetails);

  const handleBackPress = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save before exiting?'),
        [
          {
            text: t('Save'),
            onPress: () => {
              handleSubmission(), resetForm();
            },
          },
          {
            text: t('Exit Without Saving'),
            onPress: () => {
              resetForm();
              navigation.navigate(RouteName.WORKER_LIST_SCREEN);
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
      navigation.navigate(RouteName.WORKER_LIST_SCREEN);
    }
    return true;
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const worker = {
          name: name.trim(),
          gender,
          dateOfBirth: dateOfBirth.trim(),
          note: notes.trim(),
          workerCategoryId: parseInt(workerCategoryId),
          contactId: parseInt(contactId),
          kycDetails: validKycDetails,
          bankAccounts: validBankAccounts,
          upiDetails: validUpiDetails,
        };
        await workerService.createWorker(worker);
        resetForm();
        navigation.navigate(RouteName.WORKER_LIST_SCREEN);
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0].message || 'Failed to Create Worker';
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
    dateOfBirth,
    setDateOfBirth,
    genderItems,
    gender,
    setGender,
    notes,
    setNotes,
    workerDetails,
    setWorkerDetails,
    error,
    handleSubmission,
    isKycAddDisabled,
    isBankAccountsAddDisabled,
    isUpiAddDisabled,
    contactDetails,
    workerCategoryDetails,
    contactId,
    workerCategoryId,
    handleWorkerCategoryCreate,
    handleWorkerCategoryEdit,
    handleContactCreate,
    handleWorkerCategoryChange,
    handleContactChange,
    fetchContacts,
    fetchWorkerCategories,
    contact,
    workerCategory,
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
    handleBackPress,
    hasUnsavedChanges,
    resetForm,
  };
};

export {useWorkerCreation};
