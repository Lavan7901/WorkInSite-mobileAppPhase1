// import {useEffect, useState} from 'react';
// import {useIsFocused} from '@react-navigation/native';
// import {AttendanceProps} from '../DTOs/AttendanceProps';
// import {useAttendanceService} from '../../../services/AttendanceService';
// import {useSiteService} from '../../../services/SiteService';
// import {useWageTypeService} from '../../../services/WageTypeService';
// import {useWorkerService} from '../../../services/WorkerService';
// import {useWorkTypeService} from '../../../services/WorkTypeService';
// import {Alert} from 'react-native';
// import {Site} from '../../Sites/DTOs/SiteProps';
// import {WageType, Worker} from '../../Workers/DTOs/WorkerProps';
// import RouteName from '../../../navigation/RouteName';
// import {WorkTypeProp} from '../../Workers/DTOs/WorkTypeProps';
// import {useLanguage} from '../../../context/LanguageContext';
// import Toast from 'react-native-toast-message';

// export const useAttendanceListScreen = ({navigation}: any) => {
//   const [attendance, setAttendance] = useState<AttendanceProps[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [paginationLoading, setPaginationLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize] = useState(3);
//   const [hasMore, setHasMore] = useState(true);
//   const [siteList, setSiteList] = useState<Site[]>([]);
//   const [workTypeList, setWorkTypeList] = useState<WorkTypeProp[]>([]);
//   const [workerList, setWorkerList] = useState<Worker[]>([]);
//   const [wageTypeList, setWageTypeList] = useState<WageType[]>([]);
//   const [date, setDate] = useState('');
//   const [siteId, setSiteId] = useState<{value: string; name: string}>({
//     value: '',
//     name: '',
//   });
//   const [wageTypeId, setWageTypeId] = useState<{value: string; name: string}>({
//     value: '',
//     name: '',
//   });
//   const [workTypeId, setWorkTypeId] = useState<{
//     value: string;
//     name: string;
//     workerCategoryId: string;
//   }>({value: '', name: '', workerCategoryId: ''});
//   const [workerId, setWorkerId] = useState<{value: string; name: string}>({
//     value: '',
//     name: '',
//   });
//   const [hasSearchFilter, setHasSearchFilter] = useState(false);
//   //note
//   const [clearTrigger, setClearTrigger] = useState(false);

//   const {t} = useLanguage();
//   const attendanceService = useAttendanceService();
//   const siteService = useSiteService();
//   const wageTypeService = useWageTypeService();
//   const workTypeService = useWorkTypeService();
//   const workerService = useWorkerService();
//   const isFocused = useIsFocused();

//   const fetchAttendance = async (reset = false) => {
//     const isFiltered =
//       date ||
//       siteId.value ||
//       wageTypeId.value ||
//       workTypeId.value ||
//       workerId.value;

//     if (!reset && !hasMore) return;

//     if (reset) {
//       setLoading(true);
//     } else {
//       setPaginationLoading(true);
//     }

//     try {
//       const response = await attendanceService.getAttendances({
//         siteId: siteId.value ? parseInt(siteId.value) : undefined,
//         wageTypeId: wageTypeId.value ? parseInt(wageTypeId.value) : undefined,
//         workTypeId: workTypeId.value ? parseInt(workTypeId.value) : undefined,
//         workerId: workerId.value ? parseInt(workerId.value) : undefined,
//         date: date || undefined,
//         pageNumber: reset ? 1 : pageNumber,
//         pageSize: pageSize,
//       });

//       const items = response.items || [];

//       if (reset) {
//         setAttendance(items);
//         setPageNumber(2);
//       } else {
//         setAttendance(prev => [...prev, ...items]);
//         setPageNumber(prev => prev + 1);
//       }
//       setHasMore(response.totalPages > response.pageNumber);
//       setHasSearchFilter(!!isFiltered);
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Failed to fetch Attendance data.',
//       });
//     } finally {
//       setLoading(false);
//       setPaginationLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     fetchAttendance(true);
//   };

//   const handleClearSearch = () => {
//     setDate('');
//     setSiteId({value: '', name: ''});
//     setWageTypeId({value: '', name: ''});
//     setWorkTypeId({value: '', name: '', workerCategoryId: ''});
//     setWorkerId({value: '', name: ''});
//     setClearTrigger(prev => !prev); // Toggle to trigger useEffect
//   };

//   useEffect(() => {
//     fetchAttendance(true);
//   }, [clearTrigger]);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchAttendance(true).finally(() => setRefreshing(false));
//   };

//   const confirmDelete = async (id: number) => {
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
//               await attendanceService.deleteAttendance(id);
//               fetchAttendance(true);
//             } catch (error: any) {
//               const errorMsg =
//                 error?.response?.data?.message || 'Failed to delete Attendance';
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

//   const handleEditAttendance = (id: number) => {
//     navigation.navigate(RouteName.ATTENDANCE_EDIT_SCREEN, {attendanceId: id});
//   };

//   useEffect(() => {
//     if (isFocused) fetchAttendance(true);
//   }, [isFocused]);

//   const siteDetails = siteList.map(item => ({
//     label: item.name,
//     value: item.id.toString(),
//     allItems: {value: item.id.toString(), name: item.name},
//   }));

//   const workTypeDetails = workTypeList.map(item => ({
//     label: `${item.name} [${item.workerCategory.name}]`,
//     value: item.id.toString(),
//     allItems: {
//       value: item.id.toString(),
//       name: item.name,
//       workerCategoryId: item.workerCategory.id.toString(),
//     },
//   }));

//   const workerDetails = workerList.map(item => ({
//     label: `${item.name} [${item.workerCategory.name}]`,
//     value: item.id.toString(),
//     allItems: {value: item.id.toString(), name: item.name},
//   }));

//   const wageTypeDetails = wageTypeList.map(item => ({
//     label: item.name,
//     value: item.id.toString(),
//     allItems: {value: item.id.toString(), name: item.name},
//   }));

//   const fetchSites = async (searchString: string = '') => {
//     if (searchString) {
//       const sites = await siteService.getSites(searchString);
//       if (sites) setSiteList(sites.slice(0, 3));
//     }
//   };

//   const fetchWorkTypes = async (searchString: string = '') => {
//     if (searchString) {
//       const workTypes = await workTypeService.getWorkTypes(searchString);
//       if (workTypes) setWorkTypeList(workTypes.slice(0, 3));
//     }
//   };

//   const fetchWorkers = async (WorkerName: string = '') => {
//     if (WorkerName) {
//       const workers = await workerService.getWorkers({
//         WorkerName,
//         WorkerCategoryId: parseInt(workTypeId.workerCategoryId),
//       });
//       if (workers.items) setWorkerList(workers.items.slice(0, 3));
//     }
//   };

//   const fetchWageTypes = async (searchString: string = '') => {
//     if (searchString) {
//       const wageTypes = await wageTypeService.getWageTypes(searchString);
//       if (wageTypes) setWageTypeList(wageTypes.slice(0, 3));
//     }
//   };

//   const handleBack = () => navigation.navigate(RouteName.Home_SCREEN);

//   const handlePress = () =>
//     navigation.navigate(RouteName.ATTENDANCE_CREATION_SCREEN);

//   return {
//     fetchAttendance,
//     handleBack,
//     handlePress,
//     attendance,
//     loading,
//     paginationLoading,
//     refreshing,
//     hasMore,
//     handleSearch,
//     handleClearSearch,
//     handleRefresh,
//     confirmDelete,
//     handleEditAttendance,
//     date,
//     setDate,
//     siteId,
//     setSiteId,
//     wageTypeId,
//     setWageTypeId,
//     workTypeId,
//     setWorkTypeId,
//     workerId,
//     setWorkerId,
//     hasSearchFilter,
//     fetchSites,
//     fetchWageTypes,
//     fetchWorkTypes,
//     fetchWorkers,
//     siteDetails,
//     workTypeDetails,
//     wageTypeDetails,
//     workerDetails,
//   };
// };

//2

import {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {AttendanceProps} from '../DTOs/AttendanceProps';
import {useAttendanceService} from '../../../services/AttendanceService';
import {useSiteService} from '../../../services/SiteService';
import {useWageTypeService} from '../../../services/WageTypeService';
import {useWorkerService} from '../../../services/WorkerService';
import {useWorkTypeService} from '../../../services/WorkTypeService';
import {Alert} from 'react-native';
import {Site} from '../../Sites/DTOs/SiteProps';
import {WageType, Worker} from '../../Workers/DTOs/WorkerProps';
import RouteName from '../../../navigation/RouteName';
import {WorkTypeProp} from '../../Workers/DTOs/WorkTypeProps';
import {useLanguage} from '../../../context/LanguageContext';
import Toast from 'react-native-toast-message';
import {useRefresh} from '../../../context/RefreshContext';

interface WorkType {
  value: string;
  name: string;
  workerCategoryId: string;
}

export const useAttendanceListScreen = ({navigation}: any) => {
  const {t} = useLanguage();
  const attendanceService = useAttendanceService();
  const siteService = useSiteService();
  const wageTypeService = useWageTypeService();
  const workTypeService = useWorkTypeService();
  const workerService = useWorkerService();
  const isFocused = useIsFocused();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.ATTENDANCE_LIST_SCREEN];

  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState('');

  const [attendance, setAttendance] = useState<AttendanceProps[]>([]);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [workTypeList, setWorkTypeList] = useState<WorkTypeProp[]>([]);
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [wageTypeList, setWageTypeList] = useState<WageType[]>([]);
  const [date, setDate] = useState('');
  const [siteId, setSiteId] = useState<{value: string; name: string}>({
    value: '',
    name: '',
  });
  const [wageTypeId, setWageTypeId] = useState<{value: string; name: string}>({
    value: '',
    name: '',
  });
  const [workTypeId, setWorkTypeId] = useState<{
    value: string;
    name: string;
    workerCategoryId: string;
  }>({value: '', name: '', workerCategoryId: ''});
  const [workerId, setWorkerId] = useState<{value: string; name: string}>({
    value: '',
    name: '',
  });
  const bottomSheetRef = useRef<any>(null);

  const fetchAttendance = async (reset = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      siteId: siteId.value ? parseInt(siteId.value) : undefined,
      wageTypeId: wageTypeId.value ? parseInt(wageTypeId.value) : undefined,
      workTypeId: workTypeId.value ? parseInt(workTypeId.value) : undefined,
      workerId: workerId.value ? parseInt(workerId.value) : undefined,
      date: date || undefined,
    };

    if (!reset && !hasMore) return;

    if (reset) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }

    try {
      const response = await attendanceService.getAttendances({
        ...filters,
        pageNumber: reset ? 1 : pageNumber,
        pageSize: pageSize,
      });

      const items = response.items || [];

      if (reset) {
        setAttendance(items);
        setPageNumber(2);
      } else {
        setAttendance(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }
      setHasMore(response.totalPages > response.pageNumber);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch Attendance data.',
      });
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = [
      date,
      siteId?.name,
      wageTypeId?.name,
      workTypeId?.name,
      workerId?.name,
    ]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filters || 'Search');
    bottomSheetRef.current?.close();
    fetchAttendance(true);
  };

  useEffect(() => {
    if (!refreshKey && isFocused) {
      fetchAttendance(true);
    }
    if (refreshKey && isFocused) {
      handleClearSearch();
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.ATTENDANCE_LIST_SCREEN);
    }
  }, [isFocused]);

  const resetForm = () => {
    setDate('');
    setSiteId({value: '', name: ''});
    setWageTypeId({value: '', name: ''});
    setWorkTypeId({value: '', name: '', workerCategoryId: ''});
    setWorkerId({value: '', name: ''});
    setAppliedFilters('');
  };

  const handleClearSearch = () => {
    resetForm();
    fetchAttendance(true, {
      siteId: undefined,
      wageTypeId: undefined,
      workTypeId: undefined,
      workerId: undefined,
      date: undefined,
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAttendance(true).finally(() => setRefreshing(false));
  };

  const confirmDelete = async (id: number) => {
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
              await attendanceService.deleteAttendance(id);
              fetchAttendance(true);
            } catch (error: any) {
              const errorMsg =
                error?.response?.data?.message || 'Failed to delete Attendance';
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

  const handleEditAttendance = (id: number) => {
    navigation.navigate(RouteName.ATTENDANCE_EDIT_SCREEN, {attendanceId: id});
  };

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {value: item.id.toString(), name: item.name},
  }));

  const workTypeDetails = workTypeList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
    allItems: {
      value: item.id.toString(),
      name: item.name,
      workerCategoryId: item.workerCategory.id.toString(),
    },
  }));

  const workerDetails = workerList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
    allItems: {value: item.id.toString(), name: item.name},
  }));

  const wageTypeDetails = wageTypeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {value: item.id.toString(), name: item.name},
  }));

  const fetchSites = async (searchString: string = '') => {
    if (searchString) {
      const sites = await siteService.getSites({searchString});
      if (sites) setSiteList(sites.slice(0, 3));
    }
  };

  const fetchWorkTypes = async (searchString: string = '') => {
    if (searchString) {
      const workTypes = await workTypeService.getWorkTypes(searchString);
      if (workTypes) setWorkTypeList(workTypes.slice(0, 3));
    }
  };

  const fetchWorkers = async (WorkerName: string = '') => {
    if (WorkerName) {
      const workers = await workerService.getWorkers({
        WorkerName,
        WorkerCategoryId: parseInt(workTypeId.workerCategoryId),
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

  const handleBack = () => navigation.navigate(RouteName.Home_SCREEN);

  const handlePress = () =>
    navigation.navigate(RouteName.ATTENDANCE_CREATION_SCREEN);

  const handleWorkTypeChange = (newWorkType: WorkType) => {
    const isSameCategory =
      newWorkType.workerCategoryId === workTypeId.workerCategoryId;
    if (isSameCategory) {
      setWorkTypeId(newWorkType);
      return;
    }
    const hasDependentData = workerId.name !== '';
    if (hasDependentData) {
      Alert.alert(
        t('Change Work Type'),
        t(
          'Selected work type belongs to different worker category. This will reset selected worker. Continue?',
        ),
        [
          {text: t('Cancel'), style: 'cancel'},
          {
            text: t('Continue'),
            style: 'destructive',
            onPress: () => {
              setWorkerId({name: '', value: ''});
              setWorkerList([]);
              setWorkTypeId(newWorkType);
            },
          },
        ],
      );
    } else {
      setWorkTypeId(newWorkType);
    }
  };

  return {
    attendance,
    loading,
    paginationLoading,
    refreshing,
    hasMore,
    bottomSheetRef,
    appliedFilters,
    date,
    setDate,
    siteId,
    setSiteId,
    wageTypeId,
    setWageTypeId,
    workTypeId,
    workerId,
    setWorkerId,
    fetchSites,
    fetchWageTypes,
    fetchWorkTypes,
    fetchWorkers,
    siteDetails,
    workTypeDetails,
    wageTypeDetails,
    workerDetails,
    handleWorkTypeChange,
    fetchAttendance,
    handleBack,
    handlePress,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    confirmDelete,
    handleEditAttendance,
  };
};
