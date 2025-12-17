import {useEffect, useRef, useState} from 'react';
import {useSiteService} from '../../../services/SiteService';
import {useWorkTypeService} from '../../../services/WorkTypeService';
import {useUnitService} from '../../../services/UnitService';
import {Alert} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {useAttendanceInputValidate} from '../InputValidate/AttendanceValidate';
import {useWorkModeService} from '../../../services/WorkModeService';
import {useWorkerService} from '../../../services/WorkerService';
import {useWageTypeService} from '../../../services/WageTypeService';
import {useAttendanceService} from '../../../services/AttendanceService';
import {launchImageLibrary} from 'react-native-image-picker';
import {AttendanceSplit} from '../DTOs/AttendanceProps';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Unit} from '../../Unit/DTOs/UnitProps';
import {WageType, Worker} from '../../Workers/DTOs/WorkerProps';
import {useLanguage} from '../../../context/LanguageContext';
import {WorkMode} from '../../WorkMode/DTOs/WorkModeProps';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {formatDateToString} from '../../../utils/functions';

type UploadedImage = {
  uri: string;
};

interface WorkType {
  id: number;
  name: string;
  workerCategory: {
    id: number;
    name: string;
    note: string;
  };
}

const defaultWorkType = {
  name: '',
  id: 0,
  workerCategory: {
    id: 0,
    name: '',
    note: '',
  },
};

const useAttendanceCreationScreen = ({navigation, route}: any) => {
  const redirectParams = route?.params?.redirectParams || {};
  const redirect = route?.params?.redirect || null;

  const [siteId, setSiteId] = useState<string>('');
  const [workType, setWorkType] = useState<WorkType>(defaultWorkType);
  const [unitId, setUnitId] = useState<string>('');
  const [workerId, setWorkerId] = useState<string>('');
  const [wageTypeId, setWageTypeId] = useState<string>('');
  const [workModeId, setWorkModeId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [workedQuantity, setWorkedQuantity] = useState<string>('');

  const [siteList, setSiteList] = useState<Site[]>([]);
  const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [wageTypeList, setWageTypeList] = useState<WageType[]>([]);
  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [attendanceSplit, setAttendanceSplit] = useState<AttendanceSplit[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const isFocused = useIsFocused();

  const {t} = useLanguage();
  const siteService = useSiteService();
  const workTypeService = useWorkTypeService();
  const unitService = useUnitService();
  const workModeService = useWorkModeService();
  const workerService = useWorkerService();
  const wageTypeService = useWageTypeService();
  const attendanceService = useAttendanceService();

  const bottomSheetRef = useRef<any>();
  const imageSheetRef = useRef<any>();
  const handleBottomSheetOpen = () => {
    bottomSheetRef.current?.open();
  };
  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close();
  };

  const handleImageSheetOpen = () => {
    imageSheetRef.current?.open();
  };
  const handleImageSheetClose = () => {
    imageSheetRef.current?.close();
  };

  const today = new Date();
  const formatted = formatDateToString(today);

  const resetFormFields = () => {
    setSiteId('');
    setWorkType(defaultWorkType);
    setWorkTypeList([]);
    setUnitId('');
    setWorkerId('');
    setWageTypeId('');
    setWorkModeId('');
    setNotes('');
    setWorkedQuantity('');
    setDate(formatted);
    setUploadedImages([]);
    setAttendanceSplit([]);
    setError(initialError);
    setShowCamera(false);
  };

  useEffect(() => {
    if (!isFocused) {
      resetFormFields();
    }
  }, [isFocused]);

  const {error, validate, setError, initialError} = useAttendanceInputValidate({
    date,
    siteId,
    wageTypeId,
    workTypeId: workType?.id?.toString(),
    workerId,
    workedQuantity,
    unitId,
    workModeId,
    attendanceSplit,
  });

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const workTypeDetails = workTypeList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
    allItems: {
      value: item.id.toString(),
      name: item.name,
      id: item.id,
      workerCategory: {
        id: item.workerCategory.id,
        name: item.workerCategory.name,
        note: item.workerCategory.note,
      },
    },
  }));
  const unitDetails = unitList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const workerDetails = workerList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
  }));
  const wageTypeDetails = wageTypeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const workModeDetails = workModeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const fetchSites = async (searchString: string = '') => {
    if (searchString) {
      const sites = await siteService.getSites({
        searchString,
        status: 'Working',
      });
      if (sites) setSiteList(sites.slice(0, 3));
    }
  };
  const fetchWorkTypes = async (searchString: string = '') => {
    if (searchString) {
      const workTypes = await workTypeService.getWorkTypes(searchString);
      if (workTypes) setWorkTypeList(workTypes.slice(0, 3));
    }
  };

  const fetchUnits = async (searchString: string = '') => {
    if (searchString) {
      const units = await unitService.getUnits(searchString);
      if (units) setUnitList(units.slice(0, 3));
    }
  };

  const fetchWorkers = async (WorkerName: string = '') => {
    if (WorkerName) {
      const workers = await workerService.getWorkers({
        WorkerName,
        WorkerCategoryId: workType.workerCategory.id,
      });
      if (workers.items) setWorkerList(workers.items.slice(0, 3));
    }
  };

  const fetchWageTypes = async (searchString: string = '') => {
    if (searchString) {
      const wageTypes = await wageTypeService.getWageTypes(searchString);
      if (wageTypes) setWageTypeList(wageTypes.slice(0, 3));
    }
  };

  const fetchWorkModes = async (searchString: string = '') => {
    if (searchString) {
      const workModes = await workModeService.getWorkModes(searchString);
      if (workModes) setWorkModeList(workModes.slice(0, 3));
    }
  };
  const confirmDelete = (index: number) => {
    Alert.alert(
      t('Confirm Delete'),
      t('Are you sure you want to remove this item?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Delete'),
          onPress: () => handleDelete(index),
          style: 'destructive', // iOS red button style
        },
      ],
    );
  };

  const handleDelete = (index: number) => {
    const updatedAttendance = [...attendanceSplit];
    updatedAttendance.splice(index, 1);
    setAttendanceSplit(updatedAttendance);
  };

  const handleWorkTypeChange = (newWorkType: WorkType) => {
    const isSameCategory =
      newWorkType.workerCategory.id === workType.workerCategory.id;
    if (isSameCategory) {
      setWorkType(newWorkType);
      return;
    }
    const hasDependentData = workerId !== '' || attendanceSplit.length > 0;
    if (hasDependentData) {
      Alert.alert(
        t('Change Work Type'),
        t(
          'Selected work type belongs to different worker category. This will reset selected worker and attendance split. Continue?',
        ),
        [
          {text: t('Cancel'), style: 'cancel'},
          {
            text: t('Continue'),
            style: 'destructive',
            onPress: () => {
              setWorkerId('');
              setWorkerList([]);
              setAttendanceSplit([]);
              setWorkType(newWorkType);
            },
          },
        ],
      );
    } else {
      setWorkType(newWorkType);
    }
  };

  const hasUnsavedChanges = () => {
    return (
      siteId !== '' ||
      workType.name !== '' ||
      unitId !== '' ||
      workerId !== '' ||
      wageTypeId !== '' ||
      workModeId !== '' ||
      notes !== '' ||
      date !== formatted ||
      workedQuantity !== '' ||
      uploadedImages.length > 0 ||
      attendanceSplit.length > 0
    );
  };

  const navigate = () => {
    if (redirect) {
      navigation.navigate(redirect, {
        ...redirectParams, // restore workerId, siteId, fromDate, toDate
        // id: id || '', // also include the worker id if needed
      });
      setError(initialError);
    } else {
      navigation.navigate(RouteName.ATTENDANCE_LIST_SCREEN);
      setError(initialError);
    }
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('Unsaved Changes'),
        t('You have unsaved changes. Do you want to save them?'),
        [
          {text: 'Cancel', style: 'cancel'},
          {text: t('Save'), onPress: () => handleSubmit()},
          {
            text: t('Exit Without Save'),
            onPress: () => {
              resetFormFields();
              navigate();
              // navigation.navigate(RouteName.ATTENDANCE_LIST_SCREEN);
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      resetFormFields();
      navigate();
      // navigation.navigate(RouteName.ATTENDANCE_LIST_SCREEN);
    }
    return true;
  };

  const prepareImagesForPayload = async (images: any[]) => {
    return images.map(image => ({
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.name || `photo_${Date.now()}.jpg`,
    }));
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const formattedAttendanceSplits = attendanceSplit.map(split => ({
          workerRoleId: split.workerRole.id,
          shiftId: split.shift.id,
          noOfPersons: split.noOfPersons,
        }));
        const images = await prepareImagesForPayload(uploadedImages);

        const formData = new FormData();

        formData.append('Date', date);
        formData.append('SiteId', parseInt(siteId));
        formData.append('WageTypeId', parseInt(wageTypeId));
        formData.append('WorkTypeId', workType.id);
        formData.append('WorkerId', parseInt(workerId));
        formData.append('WorkedQuantity', workedQuantity.toString());
        formData.append('UnitId', parseInt(unitId));
        formData.append('WorkModeId', parseInt(workModeId));
        // formData.append(
        //   'AttendanceSplits',
        //   formattedAttendanceSplits,
        // );

        // ✅ Append AttendanceSplits like images array
        formattedAttendanceSplits.forEach((split, index) => {
          formData.append(
            `AttendanceSplits[${index}].WorkerRoleId`,
            split.workerRoleId,
          );
          formData.append(`AttendanceSplits[${index}].ShiftId`, split.shiftId);
          formData.append(
            `AttendanceSplits[${index}].NoOfPersons`,
            String(split.noOfPersons),
          );
        });
        if (notes) formData.append('Note', notes?.trim());
        if (images && images.length > 0) {
          images.forEach(img => {
            formData.append('Images', {
              uri: img.uri,
              name: img.name,
              type: img.type,
            } as any);
          });
        }
        await attendanceService.createAttendance(formData);
        resetFormFields();
        navigate();
        // navigation.navigate(RouteName.ATTENDANCE_LIST_SCREEN);
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0].message || 'Failed to create Attendance';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
        });
      }
    }
  };

  // const handleSubmit = async () => {
  //   if (!validate()) return;

  //   try {
  //     const formattedAttendanceSplits = attendanceSplit.map(split => ({
  //       workerRoleId: split.workerRole.id,
  //       shiftId: split.shift.id,
  //       noOfPersons: String(split.noOfPersons), // ensure string
  //     }));

  //     const images = await prepareImagesForPayload(uploadedImages);

  //     const formData = new FormData();

  //     // Convert all numeric values to string (required for FormData)
  //     formData.append('Date', date); // "14/11/2025"
  //     formData.append('SiteId', String(siteId));
  //     formData.append('WageTypeId', String(wageTypeId));
  //     formData.append('WorkTypeId', String(workType.id));
  //     formData.append('WorkerId', String(workerId));
  //     formData.append('WorkedQuantity', workedQuantity.toString());
  //     formData.append('UnitId', String(unitId));
  //     formData.append('WorkModeId', String(workModeId));

  //     // Complex object → MUST be stringified
  //     formData.append(
  //       'AttendanceSplits',
  //       JSON.stringify(formattedAttendanceSplits),
  //     );

  //     if (notes) {
  //       formData.append('Note', notes.trim());
  //     }

  //     // Add images for S3 upload
  //     if (images?.length > 0) {
  //       images.forEach(img => {
  //         formData.append('Images', {
  //           uri: img.uri,
  //           name: img.name,
  //           type: img.type,
  //         } as any);
  //       });
  //     }

  //     // Debugging - print all formData values
  //     // for (let pair of formData.entries()) {
  //     //   console.log(pair[0] + ' → ', pair[1]);
  //     // }

  //     await attendanceService.createAttendance(formData);

  //     resetFormFields();
  //     navigate();
  //   } catch (error: any) {
  //     const errorMsg =
  //       error?.response?.data?.[0]?.message || 'Failed to create Attendance';

  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: errorMsg,
  //     });
  //   }
  // };

  const handleImageUpload = () => {
    handleImageSheetClose();
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
      },
      async response => {
        if (response.didCancel) {
          Alert.alert('Cancelled', 'No image selected.');
        } else if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
        } else if (response.assets) {
          try {
            const resizedImages = await Promise.all(
              response.assets.map(async asset => {
                if (!asset.uri) return null;

                const originalUri = asset.uri;
                const compressed = await ImageResizer.createResizedImage(
                  originalUri,
                  1080,
                  1920,
                  'WEBP',
                  100,
                  0,
                );

                return {
                  uri: compressed.uri,
                  // name: asset.fileName ?? 'image.webp',
                  // type: asset.type ?? 'image/webp',
                };
              }),
            );

            // Filter out any null results in case asset.uri was missing
            const validImages = resizedImages.filter(img => img !== null);

            setUploadedImages(prev => [...prev, ...validImages]);
          } catch (error) {
            Alert.alert(
              'Resize Error',
              'An error occurred while resizing images.',
            );
            console.error(error);
          }
        }
      },
    );
  };

  return {
    siteDetails,
    workTypeDetails,
    unitDetails,
    workerDetails,
    wageTypeDetails,
    workModeDetails,
    error,
    siteId,
    workType,
    unitId,
    workerId,
    wageTypeId,
    workModeId,
    notes,
    workedQuantity,
    date,
    attendanceSplit,
    uploadedImages,
    setUploadedImages,
    setAttendanceSplit,
    setDate,
    setWorkedQuantity,
    setSiteId,
    setWorkType,
    setUnitId,
    setWorkerId,
    setWageTypeId,
    setWorkModeId,
    setNotes,
    fetchSites,
    fetchWorkTypes,
    fetchUnits,
    fetchWorkers,
    fetchWageTypes,
    fetchWorkModes,
    handleBackPress,
    handleSubmit,
    hasUnsavedChanges,
    confirmDelete,
    handleImageUpload,
    bottomSheetRef,
    handleBottomSheetOpen,
    handleBottomSheetClose,
    imageSheetRef,
    handleImageSheetOpen,
    handleImageSheetClose,
    showCamera,
    setShowCamera,
    handleWorkTypeChange,
  };
};

export {useAttendanceCreationScreen};
