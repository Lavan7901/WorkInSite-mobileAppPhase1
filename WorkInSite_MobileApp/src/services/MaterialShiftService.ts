import Config from 'react-native-config';
import { useAPIHelper } from '../helpers/ApiHelper';
import {
  MaterialShiftCreationRequest,
  MaterialShiftFilterRequest,
} from '../screens/MaterialShift/DTOs/MaterialShiftProps';
 
const useMaterialShiftService = () => {
  const baseUrl = Config.REACT_APP_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);
 
 const getMaterialShifts = async (filters: MaterialShiftFilterRequest = {}) => {
  const queryParams = new URLSearchParams();
 
  if (filters.materialId) queryParams.append('materialId', filters.materialId.toString());
  if (filters.sourceSiteId) queryParams.append('sourceSiteId', filters.sourceSiteId.toString());
  if (filters.targetSiteId) queryParams.append('targetSiteId', filters.targetSiteId.toString());
  if (filters.date) queryParams.append('date', filters.date);
  if (filters.quantity) queryParams.append('quantity', filters.quantity.toString());
  if (filters.pageNumber) queryParams.append('pageNumber', filters.pageNumber.toString());
  if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());
 
  const { data } = await apiHelper.get(`/material-shifts?${queryParams.toString()}`);
  return data;
};
 
 
  const getMaterialShift = async (id: number) => {
    const response = await apiHelper.get(`material-shifts/${id}`);
    return response.data;
  };
 
  const createMaterialShift = async (data: MaterialShiftCreationRequest) => {
    await apiHelper.post('material-shifts', data);
  };
 
  const updateMaterialShift = async (id: number, data: MaterialShiftCreationRequest) => {
    await apiHelper.put(`material-shifts/${id}`, data);
  };
 
  const deleteMaterialShift = async (id: number) => {
    await apiHelper.delete(`material-shifts/${id}`);
  };
 
  return {
    getMaterialShifts,
    getMaterialShift,
    createMaterialShift,
    updateMaterialShift,
    deleteMaterialShift,
  };
};
 
export { useMaterialShiftService };