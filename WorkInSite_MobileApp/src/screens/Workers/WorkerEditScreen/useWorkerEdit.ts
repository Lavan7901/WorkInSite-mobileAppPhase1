// import {useEffect, useState} from 'react';
// import {useWorkerService} from '../../../services/WorkerService';
// import {useWorkerCategoryService} from '../../../services/WorkerCategoryService';
// import {useContactService} from '../../../services/ContactService';
// import {Contact} from '../../Contacts/DTOs/ContactProps';
// import {WorkerCategoryProps} from '../DTOs/WorkerCategoryProps';
// import {GenderTypes, Worker, WorkerRequest} from '../DTOs/WorkerProps';
// import {useWorkerInputValidate} from '../InputValidate/WorkerInputValidate';
// import {useContactValidate} from '../../Clients/ContactValidate/ContactValidate';
// import {UpiTypes} from '../../Suppliers/DTOs/SupplierProps';
// import RouteName from '../../../navigation/RouteName';
// import {Alert} from 'react-native';
// import {useIsFocused} from '@react-navigation/native';
// import {useLanguage} from '../../../context/LanguageContext';
// import {useWorkerRoleCostService} from   '../../../services/WorkerRoleCostService';
// import Toast from 'react-native-toast-message';

// enum KYCTypes {
//   AADHAAR = 'AADHAAR',
//   PAN = 'PAN',
//   GST = 'GST',
// }

// const initialContact = {
//   id: 0,
//   name: '',
//   phone: '',
//   contactDetails: [],
// };

// const useWorkerEdit = (id: string, navigation: any, route: any) => {
//   const {redirect, redirectParams} = route.params;
//   const workerService = useWorkerService();
//   const workerCategoryService = useWorkerCategoryService();
//   const contactService = useContactService();
//   const {getWorkerRoleCosts} = useWorkerRoleCostService();
//   const {t} = useLanguage();

//   const [name, setName] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState<string>('');
//   const [contactId, setContactId] = useState('');
//   const [workerCategoryId, setWorkerCategoryId] = useState('');
//   const [notes, setNotes] = useState<string>('');
//   const [gender, setGender] = useState('');
//   const [isActive, setIsActive] = useState(true);
//   const [loading, setLoading] = useState(true);

//   const [contactList, setContactList] = useState<Contact[]>([]);
//   const [contact, setContact] = useState<Contact>(initialContact);
//   const [workerCategoryList, setWorkerCategoryList] = useState<
//     WorkerCategoryProps[]
//   >([]);
//   const initialData = {
//     id: 0,
//     name: '',
//     dateOfBirth: dateOfBirth,
//     contact: {id: 0, name: '', phone: '', contactDetails: []},
//     workerCategory: {
//       id: 0,
//       name: '',
//       note: '',
//       isActive: true,
//       workerRoles: [],
//       workTypes: [],
//     },
//     note: '',
//     gender: gender as GenderTypes,
//     kycDetails: [],
//     bankAccounts: [],
//     upiDetails: [],
//     isActive: true,
//   };
//   const [initialworkerDetails, setinitialWorkerDetails] = useState<
//     Worker | WorkerRequest
//   >(initialData);
//   const [workerDetails, setWorkerDetails] = useState<Worker | WorkerRequest>(
//     initialData,
//   );
//   const [workerRoleCost, setWorkerRoleCost] = useState<any>([]);

//   const isFocused = useIsFocused();

//   const fetchWorker = async () => {
//     setLoading(true);
//     try {
//       const workerData: Worker = await workerService.getWorker(parseInt(id));
//       setDateOfBirth(workerData.dateOfBirth);
//       setWorkerDetails(workerData);
//       setinitialWorkerDetails(workerData); //new
//       setNotes(workerData.note);
//       setGender(workerData.gender);
//       setIsActive(workerData.isActive as boolean);
//       setName(workerData.name);
//       setGender(workerData.gender);
//       setContactId(workerData.contact.id.toString());
//       setWorkerCategoryId(workerData.workerCategory.id.toString());
//       setWorkerCategoryList([workerData.workerCategory]);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//     }
//   };

//   const fetchWorkerRoleCost = async () => {
//     const workerRoleCost = await getWorkerRoleCosts({
//       WorkerCategoryId: parseInt(workerCategoryId),
//       WorkerId: parseInt(id),
//     });
//     setWorkerRoleCost(workerRoleCost);
//   };

//   useEffect(() => {
//     fetchWorker();
//     fetchWorkerRoleCost();
//   }, [id, isFocused]);

//   const fetchContacts = async (searchString: string = '') => {
//     if (searchString) {
//       const contacts = await contactService.getContacts(searchString, false);
//       if (contactId && contacts) {
//         const validContacts = contacts.filter(
//           (item: Contact) => item.id !== parseInt(contactId),
//         );
//         setContactList([contact, validContacts.slice(0, 3)].flat());
//         return;
//       }
//       if (contacts) setContactList(contacts.slice(0, 3));
//     }
//   };

//   const fetchWorkerCategories = async (searchString: string = '') => {
//     if (searchString) {
//       const workerCategories = await workerCategoryService.getWorkerCategories(
//         searchString,
//         false,
//       );
//       if (workerCategories) setWorkerCategoryList(workerCategories.slice(0, 3));
//     }
//   };

//   useEffect(() => {
//     const fetchContactById = async () => {
//       if (contactId) {
//         try {
//           const fetchedContact = await contactService.getContact(
//             parseInt(contactId),
//           );
//           setContact(fetchedContact);
//           setContactList([fetchedContact]);
//         } catch (error) {
//           console.error('Failed to fetch contact:', error);
//         }
//       }
//     };
//     fetchContactById();
//   }, [contactId, isFocused]);

//   //new
//   useEffect(() => {
//     if (route?.params?.contactId) {
//       setContactId(route?.params?.contactId);
//     }
//   }, [route?.params?.contactId]);

//   const {genderItems, error, validate, initialError, setError} =
//     useWorkerInputValidate({
//       name,
//       dateOfBirth,
//       workerCategoryId,
//       contactId,
//       gender,
//     });
//   const {primaryContactDetails, hasMoreDetails} = useContactValidate(contact);

//   const contactDetails = contactList.map(item => ({
//     label: item.name,
//     value: item.id.toString(),
//   }));
//   const workerCategoryDetails = workerCategoryList.map(item => ({
//     label: item.name,
//     value: item.id.toString(),
//   }));

//   const validKycDetails = workerDetails.kycDetails.filter(item => item.value);
//   const validBankAccounts = workerDetails.bankAccounts.filter(
//     item => item.accountName && item.accountNumber && item.ifscCode,
//   );
//   const validUpiDetails = workerDetails.upiDetails.filter(item => item.value);

//   const isKycAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every(
//     type =>
//       workerDetails.kycDetails.some(
//         item => item.kycType === type && item.value,
//       ),
//   );

//   const isBankAccountsAddDisabled = validBankAccounts.length >= 2;

//   const isUpiAddDisabled = [
//     UpiTypes.GPAY,
//     UpiTypes.PHONEPE,
//     UpiTypes.UPI_ID,
//   ].every(type =>
//     workerDetails.upiDetails.some(item => item.upiType === type && item.value),
//   );

//   const handleContactChange = (value: string) => setContactId(value);
//   const handleWorkerCategoryChange = (value: string) =>
//     setWorkerCategoryId(value);

//   const redirectUrl = RouteName.WORKER_EDIT_SCREEN;

//   const handleContactCreate = (searchString: string) => {
//     const redirect = redirectUrl;
//     navigation.navigate(RouteName.CONTACT_CREATION_SCREEN, {
//       name: searchString,
//       redirect,
//       id, //note
//     });
//   };

//   const handleContactEdit = () => {
//     const redirect = redirectUrl;
//     navigation.navigate(RouteName.CONTACT_EDIT_SCREEN, {
//       contactId: contactId,
//       redirect,
//       id, //note
//     });
//   };

//   const areDetailsEqual = (obj1: any, obj2: any): boolean => {
//     if (obj1 === obj2) return true; // Identical references

//     if (
//       typeof obj1 !== 'object' ||
//       obj1 === null ||
//       typeof obj2 !== 'object' ||
//       obj2 === null
//     ) {
//       return obj1 === obj2; // Compare primitive values
//     }

//     // Compare keys length
//     const keys1 = Object.keys(obj1);
//     const keys2 = Object.keys(obj2);
//     if (keys1.length !== keys2.length) return false;

//     // Compare keys and values recursively
//     for (let key of keys1) {
//       if (!keys2.includes(key)) return false; // Different keys
//       if (!areDetailsEqual(obj1[key], obj2[key])) return false; // Compare values recursively
//     }

//     return true;
//   };

//   const hasUnsavedChanges = () => {
//     return (
//       dateOfBirth !== initialData.dateOfBirth ||
//       gender !== initialData.gender ||
//       name !== initialworkerDetails.name ||
//       notes !== initialworkerDetails.note ||
//       (initialworkerDetails as Worker).contact.id.toString() !== contactId ||
//       (initialworkerDetails as Worker).workerCategory.id.toString() !==
//         workerCategoryId ||
//       isActive !== initialworkerDetails.isActive ||
//       !areDetailsEqual(workerDetails, initialworkerDetails)
//     );
//   };

//   const navigate = () => {
//     if (redirect) {
//       navigation.navigate(redirect, {
//         ...redirectParams, // restore workerId, siteId, fromDate, toDate
//         id: id || '', // also include the worker id if needed
//       });
//       setError(initialError);
//     } else {
//       fetchWorker();
//       navigation.navigate(RouteName.WORKER_LIST_SCREEN);
//       setError(initialError);
//     }
//   };

//   const handleBackPress = () => {
//     if (hasUnsavedChanges()) {
//       Alert.alert(
//         t('Unsaved Changes'),
//         t('You have unsaved changes. Do you want to save before exiting?'),
//         [
//           {
//             text: t('Save'),
//             onPress: () => {
//               handleSubmission();
//             },
//           },
//           {
//             text: t('Exit Without Saving'),
//             onPress: navigate,
//           },
//           {
//             text: t('Cancel'),
//             onPress: () => {},
//             style: 'cancel',
//           },
//         ],
//         {cancelable: true},
//       );
//     } else {
//       // navigation.navigate(RouteName.WORKER_LIST_SCREEN);
//       navigate();
//     }
//     return true;
//   };

//   const handleWorkerRoleCostEdit = () => {
//     const redirect = redirectUrl;
//     navigation.navigate(RouteName.WORKER_ROLE_COST_EDIT, {
//       workerCategoryId: workerCategoryId,
//       redirect,
//       id, //note
//     });
//   };

//   const handleSubmission = async () => {
//     try {
//       if (validate()) {
//         const worker = {
//           name: name.trim(),
//           gender: gender as GenderTypes,
//           dateOfBirth: dateOfBirth.trim(),
//           note: notes.trim(),
//           workerCategoryId: parseInt(workerCategoryId),
//           contactId: parseInt(contactId),
//           kycDetails: validKycDetails,
//           bankAccounts: validBankAccounts,
//           upiDetails: validUpiDetails,
//           isActive,
//         };
//         await workerService.updateWorker(parseInt(id), worker);
//         // navigation.navigate(RouteName.WORKER_LIST_SCREEN);
//         navigate();
//         fetchWorker(); //note
//       }
//     } catch (error: any) {
//       const errorMsg =
//         error?.response?.data?.[0].message || 'Failed to Create Worker';
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: errorMsg,
//       });
//     }
//   };

//   return {
//     name,
//     setName,
//     dateOfBirth,
//     gender,
//     setDateOfBirth,
//     genderItems,
//     setGender,
//     notes,
//     setNotes,
//     isActive,
//     setIsActive,
//     workerDetails,
//     setWorkerDetails,
//     error,
//     handleSubmission,
//     isKycAddDisabled,
//     isBankAccountsAddDisabled,
//     isUpiAddDisabled,
//     contactDetails,
//     workerCategoryDetails,
//     contactId,
//     workerCategoryId,
//     handleContactCreate,
//     handleWorkerCategoryChange,
//     handleContactChange,
//     fetchContacts,
//     fetchWorkerCategories,
//     contact,
//     // workerCategory,
//     primaryContactDetails,
//     hasMoreDetails,
//     handleContactEdit,
//     loading,
//     handleBackPress,
//     hasUnsavedChanges,
//     workerRoleCost,
//     handleWorkerRoleCostEdit,
//   };
// };

// export {useWorkerEdit};












import {useCallback, useEffect, useRef, useState} from 'react';
import {useWorkerService} from '../../../services/WorkerService';
import {useWorkerCategoryService} from '../../../services/WorkerCategoryService';
import {useContactService} from '../../../services/ContactService';
import {Contact} from '../../Contacts/DTOs/ContactProps';
import {WorkerCategoryProps} from '../DTOs/WorkerCategoryProps';
import {GenderTypes, Worker, WorkerRequest} from '../DTOs/WorkerProps';
import {useWorkerInputValidate} from '../InputValidate/WorkerInputValidate';
import {useContactValidate} from '../../Clients/ContactValidate/ContactValidate';
import {UpiTypes} from '../../Suppliers/DTOs/SupplierProps';
import RouteName from '../../../navigation/RouteName';
import {Alert} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useLanguage} from '../../../context/LanguageContext';
import {useWorkerRoleCostService} from   '../../../services/WorkerRoleCostService';
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

const useWorkerEdit = (id: string, navigation: any, route: any) => {
  const {redirect, redirectParams} = route.params;
  const workerService = useWorkerService();
  const workerCategoryService = useWorkerCategoryService();
  const contactService = useContactService();
  const {getWorkerRoleCosts} = useWorkerRoleCostService();
  const {t} = useLanguage();

  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [contactId, setContactId] = useState('');
  const [workerCategoryId, setWorkerCategoryId] = useState('');
  const [notes, setNotes] = useState<string>('');
  const [gender, setGender] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>(initialContact);
  const [workerCategoryList, setWorkerCategoryList] = useState<
    WorkerCategoryProps[]
  >([]);
  const initialData = {
    id: 0,
    name: '',
    dateOfBirth: dateOfBirth,
    contact: {id: 0, name: '', phone: '', contactDetails: []},
    workerCategory: {
      id: 0,
      name: '',
      note: '',
      isActive: true,
      workerRoles: [],
      workTypes: [],
    },
    note: '',
    gender: gender as GenderTypes,
    kycDetails: [],
    bankAccounts: [],
    upiDetails: [],
    isActive: true,
  };
  const [initialworkerDetails, setinitialWorkerDetails] = useState<
    Worker | WorkerRequest
  >(initialData);
  const [workerDetails, setWorkerDetails] = useState<Worker | WorkerRequest>(
    initialData,
  );
  const [workerRoleCost, setWorkerRoleCost] = useState<any>([]);

  const isFocused = useIsFocused();
  
  const shouldRefetchRef = useRef(true);

  const fetchWorker = async () => {
    setLoading(true);
    try {
      const workerData: Worker = await workerService.getWorker(parseInt(id));
      setDateOfBirth(workerData.dateOfBirth);
      setWorkerDetails(workerData);
      setinitialWorkerDetails(workerData); //new
      setNotes(workerData.note);
      setGender(workerData.gender);
      setIsActive(workerData.isActive as boolean);
      setName(workerData.name);
      setGender(workerData.gender);
      setContactId(workerData.contact.id.toString());
      setWorkerCategoryId(workerData.workerCategory.id.toString());
      setWorkerCategoryList([workerData.workerCategory]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchWorkerRoleCost = async () => {
    const workerRoleCost = await getWorkerRoleCosts({
      WorkerCategoryId: parseInt(workerCategoryId),
      WorkerId: parseInt(id),
    });
    setWorkerRoleCost(workerRoleCost);
  };

  useEffect(() => {
    fetchWorker();
    fetchWorkerRoleCost();
  }, [id, isFocused]);

  useFocusEffect(
      useCallback(() => {
        if (shouldRefetchRef.current) {
          fetchWorker();
          fetchWorkerRoleCost();
        } else {
          shouldRefetchRef.current = true;
        }
      }, [id])
    );

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

  const fetchWorkerCategories = async (searchString: string = '') => {
    if (searchString) {
      const workerCategories = await workerCategoryService.getWorkerCategories(
        searchString,
        false,
      );
      if (workerCategories) setWorkerCategoryList(workerCategories.slice(0, 3));
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
    if (route.params?.name && isFocused) {
      setName(route.params.name);
    }
    if (route.params?.contactId && isFocused) {
      setContactId(route.params.contactId.toString());
    }
  }, [route.params?.name, route.params?.contactId, isFocused]);

  const {genderItems, error, validate, initialError, setError} =
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

  const redirectUrl = RouteName.WORKER_EDIT_SCREEN;

  const handleContactCreate = (searchString: string) => {
     shouldRefetchRef.current = false;
    const redirect = redirectUrl;
    navigation.navigate(RouteName.CONTACT_CREATION_SCREEN, {
      name: searchString,
      redirect,
      id, //note
    });
  };

  const handleContactEdit = () => {
     shouldRefetchRef.current = false;
    const redirect = redirectUrl;
    navigation.navigate(RouteName.CONTACT_EDIT_SCREEN, {
      contactId: contactId,
      redirect,
      id, //note
    });
  };

  const areDetailsEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true; // Identical references

    if (
      typeof obj1 !== 'object' ||
      obj1 === null ||
      typeof obj2 !== 'object' ||
      obj2 === null
    ) {
      return obj1 === obj2; // Compare primitive values
    }

    // Compare keys length
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    // Compare keys and values recursively
    for (let key of keys1) {
      if (!keys2.includes(key)) return false; // Different keys
      if (!areDetailsEqual(obj1[key], obj2[key])) return false; // Compare values recursively
    }

    return true;
  };

  const hasUnsavedChanges = () => {
    return (
      dateOfBirth !== initialData.dateOfBirth ||
      gender !== initialData.gender ||
      name !== initialworkerDetails.name ||
      notes !== initialworkerDetails.note ||
      (initialworkerDetails as Worker).contact.id.toString() !== contactId ||
      (initialworkerDetails as Worker).workerCategory.id.toString() !==
        workerCategoryId ||
      isActive !== initialworkerDetails.isActive ||
      !areDetailsEqual(workerDetails, initialworkerDetails)
    );
  };

  const navigate = () => {
    if (redirect) {
      navigation.navigate(redirect, {
        ...redirectParams, // restore workerId, siteId, fromDate, toDate
        id: id || '', // also include the worker id if needed
      });
      setError(initialError);
    } else {
      fetchWorker();
      navigation.navigate(RouteName.WORKER_LIST_SCREEN);
      setError(initialError);
    }
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
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
    } else {
      // navigation.navigate(RouteName.WORKER_LIST_SCREEN);
      navigate();
    }
    return true;
  };

  const handleWorkerRoleCostEdit = () => {
    const redirect = redirectUrl;
    navigation.navigate(RouteName.WORKER_ROLE_COST_EDIT, {
      workerCategoryId: workerCategoryId,
      redirect,
      id, //note
    });
  };

  const handleSubmission = async () => {
    try {
      if (validate()) {
        const worker = {
          name: name.trim(),
          gender: gender as GenderTypes,
          dateOfBirth: dateOfBirth.trim(),
          note: notes.trim(),
          workerCategoryId: parseInt(workerCategoryId),
          contactId: parseInt(contactId),
          kycDetails: validKycDetails,
          bankAccounts: validBankAccounts,
          upiDetails: validUpiDetails,
          isActive,
        };
        await workerService.updateWorker(parseInt(id), worker);
        // navigation.navigate(RouteName.WORKER_LIST_SCREEN);
        navigate();
        fetchWorker(); //note
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.[0].message || 'Failed to Create Worker';
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
    dateOfBirth,
    gender,
    setDateOfBirth,
    genderItems,
    setGender,
    notes,
    setNotes,
    isActive,
    setIsActive,
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
    handleContactCreate,
    handleWorkerCategoryChange,
    handleContactChange,
    fetchContacts,
    fetchWorkerCategories,
    contact,
    // workerCategory,
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
    loading,
    handleBackPress,
    hasUnsavedChanges,
    workerRoleCost,
    handleWorkerRoleCostEdit,
  };
};

export {useWorkerEdit};
