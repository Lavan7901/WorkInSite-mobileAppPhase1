// import {
//   MaterialUsedCreationRequest,
//   MaterialUsedUpdationRequest,
// } from '../screens/MaterialUsed/DTOs/MaterialUsedProps';
// import Config from 'react-native-config';
// import {useAPIHelper} from '../helpers/ApiHelper';

// const useMaterialUsedService = () => {
//   const baseUrl = Config.REACT_APP_SITE_SERVICE_BASE_URL || '';
//   const apiHelper = useAPIHelper(baseUrl, true);

//   const getMaterialsUsed = async (searchString: string = '') => {
//     const response = await apiHelper.get(
//       `material-usages?searchString=${searchString}`,
//     );
//     return response.data;
//   };

//   const getMaterialUsed = async (id: number) => {
//     const response = await apiHelper.get(`material-usages/${id}`);
//     return response.data;
//   };

//   const createMaterialUsed = async (
//     MaterialUsed: MaterialUsedCreationRequest,
//   ) => {
//     await apiHelper.post('material-usages', MaterialUsed);
//   };

//   const updateMaterialUsed = async (
//     id: number,
//     MaterialUsed: MaterialUsedUpdationRequest,
//   ) => {
//     await apiHelper.put(`material-usages/${id}`, MaterialUsed);
//   };

//   const deleteMaterialUsed = async (id: number) => {
//     await apiHelper.delete(`material-usages/${id}`);
//   };

//   return {
//     getMaterialsUsed,
//     getMaterialUsed,
//     createMaterialUsed,
//     updateMaterialUsed,
//     deleteMaterialUsed,
//   };
// };

// export {useMaterialUsedService};

//2

import {
  MaterialUsedCreationRequest,
  MaterialUsedUpdationRequest,
} from '../screens/MaterialUsed/DTOs/MaterialUsedProps';
import Config from 'react-native-config';
import {useAPIHelper} from '../helpers/ApiHelper';

type GetMaterialsUsedParams = {
  date?: string;
  siteId?: number;
  materialId?: number;
  quantity?: string;
  workModeId?: number;
  pageNumber?: number;
  pageSize?: number;
};

export const useMaterialUsedService = () => {
  const baseUrl = Config.REACT_APP_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getMaterialsUsed = async (params: GetMaterialsUsedParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.date) queryParams.append('Date', params.date);
    if (params.siteId) queryParams.append('SiteId', params.siteId.toString());
    if (params.materialId)
      queryParams.append('MaterialId', params.materialId.toString());
    if (params.quantity) queryParams.append('Quantity', params.quantity);
    if (params.workModeId)
      queryParams.append('WorkModeId', params.workModeId.toString());
    if (params.pageNumber)
      queryParams.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize)
      queryParams.append('PageSize', params.pageSize.toString());

    const {data} = await apiHelper.get(
      `material-usages?${queryParams.toString()}`,
    );
    return data;
  };

  const getMaterialUsedById = async (id: number) => {
    const {data} = await apiHelper.get(`material-usages/${id}`);
    return data;
  };

  const createMaterialUsed = async (payload: MaterialUsedCreationRequest) => {
    const {data} = await apiHelper.post('material-usages', payload);
    return data;
  };

  const updateMaterialUsed = async (
    id: number,
    payload: MaterialUsedUpdationRequest,
  ) => {
    const {data} = await apiHelper.put(`material-usages/${id}`, payload);
    return data;
  };

  const deleteMaterialUsed = async (id: number) => {
    const {data} = await apiHelper.delete(`material-usages/${id}`);
    return data;
  };

  return {
    getMaterialsUsed,
    getMaterialUsedById,
    createMaterialUsed,
    updateMaterialUsed,
    deleteMaterialUsed,
  };
};
