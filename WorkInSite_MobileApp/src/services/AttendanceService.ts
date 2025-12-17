import Config from 'react-native-config';
import {useAPIHelper} from '../helpers/ApiHelper';
import {
  AttendanceCreationRequest,
  AttendanceUpdationRequest,
} from '../screens/Attendance/DTOs/AttendanceProps';
import {AxiosRequestHeaders} from 'axios';

type GetAttendanceParams = {
  siteId?: number;
  wageTypeId?: number;
  workTypeId?: number;
  workerId?: number;
  date?: string;
  pageNumber?: number;
  pageSize?: number;
};

const useAttendanceService = () => {
  const baseUrl = Config.REACT_APP_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getAttendances = async (params: GetAttendanceParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.siteId) queryParams.append('SiteId', params.siteId.toString());
    if (params.wageTypeId)
      queryParams.append('WageTypeId', params.wageTypeId.toString());
    if (params.workTypeId)
      queryParams.append('WorkTypeId', params.workTypeId.toString());
    if (params.workerId)
      queryParams.append('WorkerId', params.workerId.toString());
    if (params.date) queryParams.append('Date', params.date);
    if (params.pageNumber)
      queryParams.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize)
      queryParams.append('PageSize', params.pageSize.toString());

    const {data} = await apiHelper.get(
      `/attendances?${queryParams.toString()}`,
    );
    return data;
  };

  const getAttendance = async (id: number) => {
    const response = await apiHelper.get(`attendances/${id}`);
    return response.data;
  };

  const createAttendance = async (
    // attendance: AttendanceCreationRequest
    attendance: FormData,
  ) => {
    await apiHelper.post('attendances', attendance, {
      headers: {'Content-Type': 'multipart/form-data'} as AxiosRequestHeaders,
    });
  };

  const updateAttendance = async (
    id: number,
    // attendance: AttendanceUpdationRequest,
    attendance: FormData,
  ) => {
    await apiHelper.put(`attendances/${id}`, attendance, {
      headers: {'Content-Type': 'multipart/form-data'} as AxiosRequestHeaders,
    });
  };

  const deleteAttendance = async (id: number) => {
    await apiHelper.delete(`attendances/${id}`);
  };

  return {
    getAttendances,
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
  };
};

export {useAttendanceService};
