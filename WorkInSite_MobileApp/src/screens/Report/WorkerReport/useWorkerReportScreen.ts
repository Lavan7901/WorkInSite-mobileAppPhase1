// import {useWorkerRoleCostInputValidate} from './InputValidation';
// import {formatStringToDate, getWeekRange} from '../../../utils/functions';
// import {useIsFocused} from '@react-navigation/native';
// import {useState, useRef, useEffect} from 'react';
// import RouteName from '../../../navigation/RouteName';
// import {useSiteService} from '../../../services/SiteService';
// import {useWorkerService} from '../../../services/WorkerService';
// import {useWorkerReportService} from '../../../services/WorkerReportService';
// import {Site} from '../../Sites/DTOs/SiteProps';
// import {Worker} from '../../Workers/DTOs/WorkerProps';

// type WorkerReport = {
//   workerId: number;
//   workerName: string;
//   workerCategoryName: string;
//   amount: string;
// };

// const useWorkerReportScreen = ({navigation}: any) => {
//   const workerReportService = useWorkerReportService();
//   const siteService = useSiteService();
//   const workerService = useWorkerService();

//   const [workerReport, setWorkerReport] = useState<WorkerReport[]>([]);
//   const [totalAmount, setTotalAmount] = useState<number>(0);
//   const [loading, setLoading] = useState(true);
//   const [paginationLoading, setPaginationLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize] = useState(3);
//   const [hasMore, setHasMore] = useState(true);
//   const [hasSearchFilter, setHasSearchFilter] = useState(false);
//   const [clearTrigger, setClearTrigger] = useState(false);
//   const [appliedFilters, setAppliedFilters] = useState('');

//   const [site, setSite] = useState({name: '', value: ''});
//   const [siteList, setSiteList] = useState<Site[]>([]);
//   const [worker, setWorker] = useState({name: '', value: ''});
//   const [workerList, setWorkerList] = useState<Worker[]>([]);
//   const [dateRange, setDateRange] = useState<{from: string; to: string}>({
//     from: '',
//     to: '',
//   });

//   const bottomSheetRef = useRef<any>(null);
//   const isFocused = useIsFocused();

//   const [selectedOption, setSelectedOption] = useState<
//     'lastWeek' | 'currentWeek' | 'custom'
//   >('currentWeek');

//   const resetForm = () => {
//     setSite({name: '', value: ''});
//     setWorker({name: '', value: ''});
//     setDateRange({from: '', to: ''});
//     setError(initialError);
//     setSelectedOption('currentWeek');
//     setAppliedFilters('');
//   };

//   const isFiltered =
//     dateRange.from || dateRange.to || site.value || worker.value;

//   // ---------- Fetch Worker Reports with Pagination ----------
//   const fetchWorkerReports = async (reset = false) => {
//     if (!reset && !hasMore) return;
//     if (reset) setLoading(true);
//     else setPaginationLoading(true);

//     try {
//       // ✅ Always include from/to before making the call
//       let from = dateRange.from;
//       let to = dateRange.to;

//       // If empty, default to current week range
//       if (!from || !to) {
//         const weekRange = getWeekRange('currentWeek');
//         from = weekRange.from;
//         to = weekRange.to;
//         setDateRange(weekRange);
//       }

//       const response = await workerReportService.getAttendanceReportSummary({
//         SiteId: site.value ? parseInt(site.value) : undefined,
//         WorkerId: worker.value ? parseInt(worker.value) : undefined,
//         FromDate: from,
//         ToDate: to,
//         PageNumber: reset ? 1 : pageNumber,
//         PageSize: pageSize,
//       });

//       const items = response.items || [];

//       if (reset) {
//         setWorkerReport(items);
//         setPageNumber(2);
//       } else {
//         setWorkerReport(prev => [...prev, ...items]);
//         setPageNumber(prev => prev + 1);
//       }

//       setTotalAmount(response.totalAmount);
//       setHasMore(response.totalPages > response.pageNumber);
//       setHasSearchFilter(!!isFiltered);
//     } catch (error) {
//       console.error('Error fetching Worker Reports:', error);
//     } finally {
//       setLoading(false);
//       setPaginationLoading(false);
//     }
//   };

//   // ---------- Fetch Sites / Workers for Autocomplete ----------
//   const fetchSites = async (searchString: string = '') => {
//     if (searchString) {
//       const sites = await siteService.getSites({
//         searchString,
//       });
//       if (sites) setSiteList(sites.slice(0, 3));
//     }
//   };

//   const fetchWorkers = async (WorkerName: string = '') => {
//     if (WorkerName) {
//       const workers = await workerService.getWorkers({WorkerName});
//       if (workers.items) setWorkerList(workers.items.slice(0, 3));
//     }
//   };

//   // ---------- Mapping for Dropdowns ----------
//   const siteDetails = siteList.map(item => ({
//     label: item.name,
//     value: item.id.toString(),
//     allItems: {value: item.id.toString(), name: item.name},
//   }));

//   const workerDetails = workerList.map(item => ({
//     label: `${item.name} [${item.workerCategory.name}]`,
//     value: item.id.toString(),
//     allItems: {value: item.id.toString(), name: item.name},
//   }));

//   // ---------- Validation ----------
//   const formatedFromDate = formatStringToDate(dateRange.from);
//   const formatedToDate = formatStringToDate(dateRange.to);

//   const {validate, error, initialError, setError} =
//     useWorkerRoleCostInputValidate({
//       fromDate: formatedFromDate,
//       toDate: formatedToDate,
//     });

//   // ---------- Initialize fetch on focus ----------
//   const initializeWorkerReportFetch = async () => {
//     const weekRange = getWeekRange('currentWeek');
//     setDateRange(weekRange);
//     setSelectedOption('currentWeek');
//     setError(initialError);

//     // Ensure state updates are applied before fetching
//     await new Promise(resolve => setTimeout(resolve, 0));
//     await fetchWorkerReports(true);
//   };

//   useEffect(() => {
//     if (isFocused && site.value === '') {
//       initializeWorkerReportFetch();
//     }
//     if (!isFocused && site.value === '') {
//       resetForm();
//     }
//   }, [isFocused]);

//   // ---------- Handlers ----------
//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchWorkerReports(true).finally(() => setRefreshing(false));
//   };

//   useEffect(() => {
//     fetchWorkerReports(true);
//   }, [clearTrigger]);

//   const handleSearch = () => {
//     if (validate()) {
//       const filters = [site?.name, worker?.name, dateRange.from, dateRange.to]
//         .filter(Boolean)
//         .join(', ');
//       setAppliedFilters(filters || 'Search');
//       bottomSheetRef.current?.close();
//       setError(initialError);
//       fetchWorkerReports(true);
//     }
//   };

//   const handleClearSearch = () => {
//     resetForm();
//     setClearTrigger(prev => !prev);
//   };

//   const handleBack = () => {
//     navigation.navigate(RouteName.Home_SCREEN);
//     resetForm();
//   };

//   const handleViewDetails = (id: number) =>
//     navigation.navigate(RouteName.WORKER_REPORT_DETAILS_SCREEN, {
//       workerId: id,
//       fromDate: dateRange.from,
//       toDate: dateRange.to,
//       siteId: site?.value,
//     });

//   return {
//     workerReport,
//     loading,
//     paginationLoading,
//     refreshing,
//     site,
//     worker,
//     dateRange,
//     bottomSheetRef,
//     selectedOption,
//     error,
//     siteDetails,
//     workerDetails,
//     totalAmount,
//     totalWorkers: workerReport.length,
//     hasMore,
//     hasSearchFilter,
//     appliedFilters,
//     setSite,
//     setWorker,
//     setDateRange,
//     setSelectedOption,
//     fetchSites,
//     fetchWorkers,
//     fetchWorkerReports,
//     handleBack,
//     handleRefresh,
//     handleSearch,
//     handleClearSearch,
//     isFiltered,
//     handleViewDetails,
//   };
// };

// export {useWorkerReportScreen};

//2

// import {useWorkerRoleCostInputValidate} from './InputValidation';
// import {formatStringToDate, getWeekRange} from '../../../utils/functions';
// import {useIsFocused} from '@react-navigation/native';
// import {useState, useRef, useEffect} from 'react';
// import RouteName from '../../../navigation/RouteName';
// import {useSiteService} from '../../../services/SiteService';
// import {useWorkerService} from '../../../services/WorkerService';
// import {useWorkerReportService} from '../../../services/WorkerReportService';
// import {Site} from '../../Sites/DTOs/SiteProps';
// import {Worker} from '../../Workers/DTOs/WorkerProps';
// import {useRefresh} from '../../../context/RefreshContext';

// type WorkerReport = {
//   workerId: number;
//   workerName: string;
//   workerCategoryName: string;
//   amount: string;
// };

// const useWorkerReportScreen = ({navigation}: any) => {
//   const workerReportService = useWorkerReportService();
//   const siteService = useSiteService();
//   const workerService = useWorkerService();
//   const {refreshKeys, removeRefreshKey} = useRefresh();
//   const refreshKey = refreshKeys[RouteName.WORKER_REPORT_SCREEN];

//   const [workerReport, setWorkerReport] = useState<WorkerReport[]>([]);
//   const [totalAmount, setTotalAmount] = useState<number>(0);
//   const [loading, setLoading] = useState(true);
//   const [paginationLoading, setPaginationLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize] = useState(3);
//   const [hasMore, setHasMore] = useState(true);
//   const [hasSearchFilter, setHasSearchFilter] = useState(false);
//   const [appliedFilters, setAppliedFilters] = useState('');

//   const [site, setSite] = useState({name: '', value: ''});
//   const [siteList, setSiteList] = useState<Site[]>([]);
//   const [worker, setWorker] = useState({name: '', value: ''});
//   const [workerList, setWorkerList] = useState<Worker[]>([]);
//   const [dateRange, setDateRange] = useState<{from: string; to: string}>({
//     from: '',
//     to: '',
//   });

//   const bottomSheetRef = useRef<any>(null);
//   const isFocused = useIsFocused();

//   const [selectedOption, setSelectedOption] = useState<
//     'lastWeek' | 'currentWeek' | 'custom'
//   >('currentWeek');

//   const resetForm = () => {
//     const weekRange = getWeekRange('currentWeek');
//     setSite({name: '', value: ''});
//     setWorker({name: '', value: ''});
//     setDateRange(weekRange);
//     setError(initialError);
//     setSelectedOption('currentWeek');
//     setAppliedFilters('');
//   };

//   const isFiltered =
//     dateRange.from || dateRange.to || site.value || worker.value;

//   // ---------- Fetch Worker Reports with Pagination ----------
//   // const fetchWorkerReports = async (reset = false, overrideFilters?: any) => {
//   //   if (!reset && !hasMore) return;
//   //   if (reset) setLoading(true);
//   //   else setPaginationLoading(true);

//   //   try {
//   //     // ✅ Always include from/to before making the call
//   //     let from = dateRange.from;
//   //     let to = dateRange.to;

//   //     const filters = overrideFilters || {
//   //       SiteId: site.value ? parseInt(site.value) : undefined,
//   //       WorkerId: worker.value ? parseInt(worker.value) : undefined,
//   //     };

//   //     // If empty, default to current week range
//   //     if (!from || !to) {
//   //       const weekRange = getWeekRange('currentWeek');
//   //       from = weekRange.from;
//   //       to = weekRange.to;
//   //       setDateRange(weekRange);
//   //     }

//   //     const response = await workerReportService.getAttendanceReportSummary({
//   //       ...filters,
//   //       FromDate: from,
//   //       ToDate: to,
//   //       PageNumber: reset ? 1 : pageNumber,
//   //       PageSize: pageSize,
//   //     });

//   //     const items = response.items || [];

//   //     if (reset) {
//   //       setWorkerReport(items);
//   //       setPageNumber(2);
//   //     } else {
//   //       setWorkerReport(prev => [...prev, ...items]);
//   //       setPageNumber(prev => prev + 1);
//   //     }

//   //     setTotalAmount(response.totalAmount);
//   //     setHasMore(response.totalPages > response.pageNumber);
//   //     setHasSearchFilter(!!isFiltered);
//   //   } catch (error) {
//   //     console.error('Error fetching Worker Reports:', error);
//   //   } finally {
//   //     setLoading(false);
//   //     setPaginationLoading(false);
//   //   }
//   // };

//   const fetchWorkerReports = async (reset = false, overrideFilters?: any) => {
//     if (!reset && !hasMore) return;
//     if (reset) setLoading(true);
//     else setPaginationLoading(true);

//     try {
//       let from = dateRange.from;
//       let to = dateRange.to;

//       if (overrideFilters?.FromDate && overrideFilters?.ToDate) {
//         from = overrideFilters.FromDate;
//         to = overrideFilters.ToDate;
//       }

//       if (!from || !to) {
//         const weekRange = getWeekRange('currentWeek');
//         from = weekRange.from;
//         to = weekRange.to;
//         setDateRange(weekRange);
//       }

//       const response = await workerReportService.getAttendanceReportSummary({
//         SiteId:
//           overrideFilters?.SiteId ??
//           (site.value ? parseInt(site.value) : undefined),
//         WorkerId:
//           overrideFilters?.WorkerId ??
//           (worker.value ? parseInt(worker.value) : undefined),
//         FromDate: from,
//         ToDate: to,
//         PageNumber: reset ? 1 : pageNumber,
//         PageSize: pageSize,
//       });

//       const items = response.items || [];

//       if (reset) {
//         setWorkerReport(items);
//         setPageNumber(2);
//       } else {
//         setWorkerReport(prev => [...prev, ...items]);
//         setPageNumber(prev => prev + 1);
//       }

//       setTotalAmount(response.totalAmount);
//       setHasMore(response.totalPages > response.pageNumber);
//       setHasSearchFilter(!!isFiltered);
//     } catch (error) {
//       console.error('Error fetching Worker Reports:', error);
//     } finally {
//       setLoading(false);
//       setPaginationLoading(false);
//     }
//   };

//   // ---------- Fetch Sites / Workers for Autocomplete ----------
//   const fetchSites = async (searchString: string = '') => {
//     if (searchString) {
//       const sites = await siteService.getSites({
//         searchString,
//       });
//       if (sites) setSiteList(sites.slice(0, 3));
//     }
//   };

//   const fetchWorkers = async (WorkerName: string = '') => {
//     if (WorkerName) {
//       const workers = await workerService.getWorkers({WorkerName});
//       if (workers.items) setWorkerList(workers.items.slice(0, 3));
//     }
//   };

//   // ---------- Mapping for Dropdowns ----------
//   const siteDetails = siteList.map(item => ({
//     label: item.name,
//     value: item.id.toString(),
//     allItems: {value: item.id.toString(), name: item.name},
//   }));

//   const workerDetails = workerList.map(item => ({
//     label: `${item.name} [${item.workerCategory.name}]`,
//     value: item.id.toString(),
//     allItems: {value: item.id.toString(), name: item.name},
//   }));

//   // ---------- Validation ----------
//   const formatedFromDate = formatStringToDate(dateRange.from);
//   const formatedToDate = formatStringToDate(dateRange.to);

//   const {validate, error, initialError, setError} =
//     useWorkerRoleCostInputValidate({
//       fromDate: formatedFromDate,
//       toDate: formatedToDate,
//     });

//   // ---------- Initialize fetch on focus ----------
//   const initializeWorkerReportFetch = async () => {
//     const weekRange = getWeekRange('currentWeek');
//     setDateRange(weekRange);
//     setSelectedOption('currentWeek');
//     setError(initialError);

//     // Ensure state updates are applied before fetching
//     await new Promise(resolve => setTimeout(resolve, 0));
//     await fetchWorkerReports(true);
//   };

//   // useEffect(() => {
//   //   if (isFocused && site.value === '') {
//   //     initializeWorkerReportFetch();
//   //   }
//   //   if (!isFocused && site.value === '') {
//   //     resetForm();
//   //   }
//   // }, [isFocused]);

//   useEffect(() => {
//     if (!refreshKey && isFocused) {
//       fetchWorkerReports(true);
//     }
//     if (refreshKey && isFocused) {
//       handleClearSearch();
//     }
//     if (!isFocused && refreshKey) {
//       removeRefreshKey(RouteName.WORKER_REPORT_SCREEN);
//     }
//   }, [isFocused]);

//   // ---------- Handlers ----------
//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchWorkerReports(true).finally(() => setRefreshing(false));
//   };

//   const handleSearch = () => {
//     if (validate()) {
//       const filters = [site?.name, worker?.name, dateRange.from, dateRange.to]
//         .filter(Boolean)
//         .join(', ');
//       setAppliedFilters(filters || 'Search');
//       bottomSheetRef.current?.close();
//       setError(initialError);
//       fetchWorkerReports(true);
//     }
//   };

//   // const handleClearSearch = () => {
//   //   resetForm();
//   //   fetchWorkerReports(true, {
//   //     SiteId: undefined,
//   //     WorkerId: undefined,
//   //   });
//   // };

//   const handleClearSearch = () => {
//     const weekRange = getWeekRange('currentWeek');

//     setSite({name: '', value: ''});
//     setWorker({name: '', value: ''});
//     setDateRange(weekRange);
//     setSelectedOption('currentWeek');
//     setAppliedFilters('');
//     setError(initialError);

//     fetchWorkerReports(true, {
//       SiteId: undefined,
//       WorkerId: undefined,
//       FromDate: weekRange.from,
//       ToDate: weekRange.to,
//     });
//   };

//   const handleBack = () => {
//     navigation.navigate(RouteName.Home_SCREEN);
//     resetForm();
//   };

//   const handleViewDetails = (id: number) =>
//     navigation.navigate(RouteName.WORKER_REPORT_DETAILS_SCREEN, {
//       workerId: id,
//       fromDate: dateRange.from,
//       toDate: dateRange.to,
//       siteId: site?.value,
//     });

//   return {
//     workerReport,
//     loading,
//     paginationLoading,
//     refreshing,
//     site,
//     worker,
//     dateRange,
//     bottomSheetRef,
//     selectedOption,
//     error,
//     siteDetails,
//     workerDetails,
//     totalAmount,
//     totalWorkers: workerReport?.length,
//     hasMore,
//     hasSearchFilter,
//     appliedFilters,
//     setSite,
//     setWorker,
//     setDateRange,
//     setSelectedOption,
//     fetchSites,
//     fetchWorkers,
//     fetchWorkerReports,
//     handleBack,
//     handleRefresh,
//     handleSearch,
//     handleClearSearch,
//     isFiltered,
//     handleViewDetails,
//   };
// };

// export {useWorkerReportScreen};

//2

import {useState, useRef, useEffect, useMemo} from 'react';
import {useIsFocused} from '@react-navigation/native';
import RouteName from '../../../navigation/RouteName';
import {getWeekRange, formatStringToDate} from '../../../utils/functions';
import {useSiteService} from '../../../services/SiteService';
import {useWorkerService} from '../../../services/WorkerService';
import {useWorkerReportService} from '../../../services/WorkerReportService';
import {useRefresh} from '../../../context/RefreshContext';
import {useWorkerRoleCostInputValidate} from './InputValidation';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Worker} from '../../Workers/DTOs/WorkerProps';

const PAGE_SIZE = 3;

type WorkerReport = {
  workerId: number;
  workerName: string;
  workerCategoryName: string;
  amount: string;
};

export function useWorkerReportScreen({navigation}: any) {
  const isFocused = useIsFocused();

  // Services
  const siteService = useSiteService();
  const workerService = useWorkerService();
  const workerReportService = useWorkerReportService();
  const {refreshKeys, removeRefreshKey} = useRefresh();

  const refreshKey = refreshKeys[RouteName.WORKER_REPORT_SCREEN];

  // UI States
  const bottomSheetRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Data States
  const [workerReport, setWorkerReport] = useState<WorkerReport[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasSearchFilter, setHasSearchFilter] = useState(false);

  // Filter States
  const [site, setSite] = useState({name: '', value: ''});
  const [worker, setWorker] = useState({name: '', value: ''});
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [appliedFilters, setAppliedFilters] = useState('');

  const [selectedOption, setSelectedOption] = useState<
    'lastWeek' | 'currentWeek' | 'custom'
  >('currentWeek');

  const [dateRange, setDateRange] = useState(getWeekRange('currentWeek'));

  const {validate, error, initialError, setError} =
    useWorkerRoleCostInputValidate({
      fromDate: formatStringToDate(dateRange.from),
      toDate: formatStringToDate(dateRange.to),
    });

  const isFiltered = useMemo(
    () => site.value || worker.value || dateRange.from || dateRange.to,
    [site, worker, dateRange],
  );

  const fetchWorkerReports = async (reset = false, override?: any) => {
    if (!reset && !hasMore) return;

    reset ? setLoading(true) : setPaginationLoading(true);

    try {
      const filters = {
        SiteId:
          override?.SiteId ?? (site.value ? Number(site.value) : undefined),
        WorkerId:
          override?.WorkerId ??
          (worker.value ? Number(worker.value) : undefined),
        FromDate: override?.FromDate ?? dateRange.from,
        ToDate: override?.ToDate ?? dateRange.to,
        PageNumber: reset ? 1 : pageNumber,
        PageSize: PAGE_SIZE,
      };

      const response = await workerReportService.getAttendanceReportSummary(
        filters,
      );

      const items = response.items ?? [];

      if (reset) {
        setWorkerReport(items);
        setPageNumber(2);
      } else {
        setWorkerReport(prev => [...prev, ...items]);
        setPageNumber(n => n + 1);
      }

      setTotalAmount(response.totalAmount);
      setHasMore(response.totalPages > response.pageNumber);
      setHasSearchFilter(Boolean(isFiltered));
    } catch (err) {
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const fetchSites = async (text = '') => {
    if (!text) return;
    const res = await siteService.getSites({searchString: text});
    setSiteList(res?.slice(0, 3) || []);
  };

  const fetchWorkers = async (text = '') => {
    if (!text) return;
    const res = await workerService.getWorkers({WorkerName: text});
    setWorkerList(res?.items?.slice(0, 3) || []);
  };

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {value: item.id.toString(), name: item.name},
  }));

  const workerDetails = workerList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
    allItems: {value: item.id.toString(), name: item.name},
  }));

  const handleClearSearch = () => {
    const week = getWeekRange('currentWeek');

    setSite({name: '', value: ''});
    setWorker({name: '', value: ''});
    setDateRange(week);
    setSelectedOption('currentWeek');
    setAppliedFilters('');
    setError(initialError);

    fetchWorkerReports(true, {
      SiteId: undefined,
      WorkerId: undefined,
      FromDate: week.from,
      ToDate: week.to,
    });
  };

  const handleSearch = () => {
    if (!validate()) return;

    const filterText = [site?.name, worker?.name, dateRange.from, dateRange.to]
      .filter(Boolean)
      .join(', ');

    setAppliedFilters(filterText || 'Search');
    bottomSheetRef.current?.close();
    setError(initialError);

    fetchWorkerReports(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWorkerReports(true).finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (!isFocused) return;

    if (refreshKey) {
      handleClearSearch();
      removeRefreshKey(RouteName.WORKER_REPORT_SCREEN);
      return;
    }

    fetchWorkerReports(true);
  }, [isFocused]);

  const handleBack = () => {
    navigation.navigate(RouteName.Home_SCREEN);
  };

  const handleViewDetails = (workerId: number) =>
    navigation.navigate(RouteName.WORKER_REPORT_DETAILS_SCREEN, {
      workerId,
      fromDate: dateRange.from,
      toDate: dateRange.to,
      siteId: site.value,
    });

  return {
    workerReport,
    loading,
    paginationLoading,
    refreshing,
    totalAmount,
    hasMore,
    hasSearchFilter,
    appliedFilters,
    totalWorkers: workerReport.length,

    site,
    worker,
    dateRange,
    selectedOption,
    error,
    siteDetails,
    workerDetails,
    bottomSheetRef,

    // handlers
    setSite,
    setWorker,
    setDateRange,
    setSelectedOption,
    fetchSites,
    fetchWorkers,
    fetchWorkerReports,

    handleSearch,
    handleClearSearch,
    handleBack,
    handleRefresh,
    handleViewDetails,

    isFiltered,
  };
}
