import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useState, useCallback, useMemo, useEffect} from 'react';
import {BackHandler} from 'react-native';
import RouteName from '../../../../navigation/RouteName';
import {useWorkerReportService} from '../../../../services/WorkerReportService';
import {WorkerReportResponse} from './DTOs';

const useWorkerReportDetails = ({navigation, route}: any) => {
  const {workerId, siteId, fromDate, toDate} = route.params;
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<WorkerReportResponse | null>(null);

  const workerReportService = useWorkerReportService();
  const isFocused = useIsFocused();

  const handleBack = () => navigation.navigate(RouteName.WORKER_REPORT_SCREEN);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [handleBack]),
  );

  const redirectUrl = RouteName.WORKER_REPORT_DETAILS_SCREEN;

  const handleAttendanceOpen = (attendanceId: number) =>
    navigation.navigate(RouteName.ATTENDANCE_EDIT_SCREEN, {
      attendanceId: attendanceId,
      redirect: redirectUrl,
      redirectParams: {workerId, siteId, fromDate, toDate},
    });

  const handleWorkerOpen = (workerId: number) =>
    navigation.navigate(RouteName.WORKER_EDIT_SCREEN, {
      id: workerId,
      redirect: redirectUrl,
      redirectParams: {workerId, siteId, fromDate, toDate},
    });

  const totalAmount = useMemo(() => {
    if (!report?.items) return 0;
    return report.items.reduce(
      (sum, item) => sum + parseFloat(item.amount || '0'),
      0,
    );
  }, [report?.items]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await workerReportService.getAttendanceReports({
        WorkerId: workerId,
        SiteId: siteId,
        FromDate: fromDate,
        ToDate: toDate,
        IgnorePagination: true,
      });
      setReport(response);
    } catch (error) {
      console.error('Error fetching worker report details:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDetails();
  }, [workerId, siteId, fromDate, toDate, isFocused]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDetails();
    setRefreshing(false);
  };

  return {
    loading,
    report,
    totalAmount,
    handleAttendanceOpen,
    handleWorkerOpen,
    handleBack,
    refreshing,
    handleRefresh,
  };
};

export {useWorkerReportDetails};
