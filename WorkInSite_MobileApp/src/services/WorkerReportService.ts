import Config from 'react-native-config';
import {useAPIHelper} from '../helpers/ApiHelper';

export interface AttendanceReportParams {
  SiteId?: number;
  WorkerId?: number;
  FromDate?: string; 
  ToDate?: string;  
  PageNumber?: number;
  PageSize?: number;
  IgnorePagination?: boolean;
}

const useWorkerReportService = () => {
  const baseUrl = Config.REACT_APP_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const buildQuery = (params: AttendanceReportParams) => {
    const query = new URLSearchParams();

    if (params.SiteId) query.append('SiteId', params.SiteId.toString());
    if (params.WorkerId) query.append('WorkerId', params.WorkerId.toString());
    if (params.FromDate) query.append('FromDate', params.FromDate);
    if (params.ToDate) query.append('ToDate', params.ToDate);
    if (params.PageNumber) query.append('PageNumber', params.PageNumber.toString());
    if (params.PageSize) query.append('PageSize', params.PageSize.toString());
    if (params.IgnorePagination !== undefined)
      query.append('IgnorePagination', params.IgnorePagination.toString());

    return query.toString();
  };

  const getAttendanceReportSummary = async (params: AttendanceReportParams) => {
    const queryString = buildQuery(params);
    const response = await apiHelper.get(`attendance-reports/summary?${queryString}`);
    return response.data;
  };

  const getAttendanceReports = async (params: AttendanceReportParams) => {
    const queryString = buildQuery(params);
    const response = await apiHelper.get(`attendance-reports?${queryString}`);
    return response.data;
  };

  return { getAttendanceReportSummary, getAttendanceReports };
};

export { useWorkerReportService };
