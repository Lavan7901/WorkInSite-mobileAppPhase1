// import {useState, useEffect} from 'react';
// import {Alert} from 'react-native';
// import {useIsFocused, useRoute} from '@react-navigation/native';
// import RouteName from '../../../navigation/RouteName';
// import {useShiftService} from '../../../services/ShiftService';
// import {useShiftInputValidate} from '../useShiftInputValidate';
// import {Shift} from '../DTOs/ShiftProps';
// import Toast from 'react-native-toast-message';
// import {useLanguage} from '../../../context/LanguageContext';

// export const useShiftCreation = ({navigation}: any) => {
//   const route = useRoute<any>();
//   const shiftService = useShiftService();
//   const isFocused = useIsFocused();
//   const {t} = useLanguage();
//   const [name, setName] = useState('');
//   const [shiftDetails, setShiftDetails] = useState<Shift[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchShift = async () => {
//     setLoading(true);
//     const shiftData = await shiftService.getShifts('');
//     setShiftDetails(shiftData);
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (isFocused) {
//       fetchShift();
//     }
//   }, [isFocused]);

//   useEffect(() => {
//     if (route.params?.name && isFocused) {
//       setName(route.params.name);
//     }
//   }, [route.params?.name, isFocused]);

//   const {error, validate, setError, initialError} = useShiftInputValidate({
//     name,
//   });

//   const resetFormFields = () => {
//     setName('');
//     setError(initialError);
//     setIsEditing(false);
//     setEditingShiftId(null);
//   };

//   const setEditingShift = (shift: {id: number; name: string}) => {
//     setIsEditing(true);
//     setEditingShiftId(shift.id);
//     setName(shift.name); // Pre-fill input with name
//   };

//   const handleUpdate = async () => {
//     if (validate() && editingShiftId !== null) {
//       const shift = {id: editingShiftId, name};
//       try {
//         const response = await shiftService.updateShift(editingShiftId, shift);
//         if (response) {
//           fetchShift();
//           resetFormFields();
//           setIsEditing(false); // Exit edit mode
//         }
//       } catch (error: any) {
//         const errorMsg =
//           error?.response?.data?.[0]?.message || 'Failed to update shift';
//         Toast.show({
//           type: 'error',
//           text1: 'Error',
//           text2: errorMsg,
//         });
//       }
//     }
//   };

//   const hasUnsavedChanges = () => name.trim() !== '';

//   const handleBackPress = () => {
//     if (hasUnsavedChanges()) {
//       Alert.alert(
//         t('Unsaved Changes'),
//         t('You have unsaved changes. Do you want to save them?'),
//         [
//           {text: 'Cancel', style: 'cancel'},
//           {text: t('Save'), onPress: handleSubmission},
//           {
//             text: t('Exit Without Save'),
//             onPress: () => {
//               resetFormFields();
//               navigation.navigate(RouteName.Home_SCREEN); // You may want to navigate here
//             },
//           },
//         ],
//         {cancelable: false},
//       );
//     } else {
//       resetFormFields();
//       navigation.navigate(RouteName.Home_SCREEN); // You may want to navigate here
//     }
//     return true;
//   };

//   const handleShiftDelete = async (id: number) => {
//     Alert.alert(
//       t('Confirm Delete'),
//       t('Are you sure you want to delete this Detail?'),
//       [
//         {
//           text: t('Cancel'),
//           style: 'cancel',
//         },
//         {
//           text: t('Delete'),
//           onPress: async () => {
//             try {
//               await shiftService.deleteShift(id);
//               fetchShift();
//             } catch (error: any) {
//               const errorMsg =
//                 error?.response?.data?.[0]?.message || 'Failed to delete shift';
//               Toast.show({
//                 type: 'error',
//                 text1: 'Error',
//                 text2: errorMsg,
//               });
//             }
//           },
//           style: 'destructive',
//         },
//       ],
//     );
//   };

//   const handleSubmission = async () => {
//     if (validate()) {
//       const shift = {
//         name,
//       };
//       try {
//         const response = await shiftService.createShift(shift);
//         if (response.id) {
//           fetchShift();
//         }
//         resetFormFields();
//       } catch (error: any) {
//         const errorMsg =
//           error?.response?.data?.[0]?.message || 'Failed to create shift';
//         Toast.show({
//           type: 'error',
//           text1: 'Error',
//           text2: errorMsg,
//         });
//       }
//     }
//   };
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchShift();
//     setRefreshing(false);
//   };

//   return {
//     name,
//     loading,
//     shiftDetails,
//     isEditing,
//     error,
//     editingShiftId,
//     refreshing,
//     setName,
//     resetFormFields,
//     handleSubmission,
//     handleUpdate,
//     handleBackPress,
//     handleShiftDelete,
//     setEditingShift,
//     handleRefresh,
//   };
// };

//2

import {useState, useEffect} from 'react';
import {Alert, Keyboard} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import RouteName from '../../../navigation/RouteName';
import {useShiftService} from '../../../services/ShiftService';
import {useShiftInputValidate} from '../useShiftInputValidate';
import {Shift} from '../DTOs/ShiftProps';
import Toast from 'react-native-toast-message';
import {useLanguage} from '../../../context/LanguageContext';

export const useShiftCreation = ({navigation}: any) => {
  const route = useRoute<any>();
  const shiftService = useShiftService();
  const isFocused = useIsFocused();
  const {t} = useLanguage();

  const [name, setName] = useState('');
  const [shiftDetails, setShiftDetails] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [multiplier, setMultiplier] = useState('');

  const fetchShift = async () => {
    setLoading(true);
    const shiftData = await shiftService.getShifts('');
    setShiftDetails(shiftData);
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      fetchShift();
    }
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.name && isFocused) {
      setName(route.params.name);
    }
  }, [route.params?.name, isFocused]);

  const {error, validate, setError, initialError} = useShiftInputValidate({
    name,
    multiplier,
  });

  const resetFormFields = () => {
    Keyboard.dismiss();
    setName('');
    setMultiplier('');
    setError(initialError);
    setIsEditing(false);
    setEditingShiftId(null);
  };

  const setEditingShift = (shift: Shift) => {
    setIsEditing(true);
    setEditingShiftId(shift.id);
    setName(shift.name);
    setMultiplier(shift.multiplier);
  };

  const handleUpdate = async () => {
    Keyboard.dismiss();
    if (validate() && editingShiftId !== null) {
      const shift = {
        id: editingShiftId,
        name: name.trim(),
        multiplier: multiplier.trim(),
      };
      try {
        const response = await shiftService.updateShift(editingShiftId, shift);
        if (response) {
          fetchShift();
          resetFormFields();
          setIsEditing(false); // Exit edit mode
        }
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to update shift';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  const hasUnsavedChanges = () => name.trim() !== '';

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
        [
          {text: 'Cancel', style: 'cancel'},
          {text: t('Save'), onPress: handleSubmission},
          {
            text: t('Exit Without Save'),
            onPress: () => {
              resetFormFields();
              navigation.navigate(RouteName.Home_SCREEN); // You may want to navigate here
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      resetFormFields();
      navigation.navigate(RouteName.Home_SCREEN); // You may want to navigate here
    }
    return true;
  };

  const handleShiftDelete = async (id: number) => {
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
          onPress: async () => {
            try {
              await shiftService.deleteShift(id);
              fetchShift();
            } catch (error: any) {
              const errorMsg =
                error?.response?.data?.message || 'Failed to delete shift';
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMsg,
              });
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleSubmission = async () => {
    Keyboard.dismiss();
    if (validate()) {
      const shift = {
        name: name.trim(),
        multiplier: multiplier.trim(),
      };
      try {
        const response = await shiftService.createShift(shift);
        if (response.id) {
          fetchShift();
        }
        resetFormFields();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message ||
          error?.response?.data?.message ||
          'Failed to create shift';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchShift();
    setRefreshing(false);
  };

  const fixedMultipliers = ['0.50', '1.00', '1.50', '2.00'];
  const isFixedMultiplier = isEditing && fixedMultipliers.includes(multiplier);

  return {
    name,
    loading,
    shiftDetails,
    isEditing,
    error,
    editingShiftId,
    refreshing,
    setName,
    resetFormFields,
    handleSubmission,
    handleUpdate,
    handleBackPress,
    handleShiftDelete,
    setEditingShift,
    handleRefresh,
    setMultiplier,
    multiplier,
    isFixedMultiplier,
  };
};
