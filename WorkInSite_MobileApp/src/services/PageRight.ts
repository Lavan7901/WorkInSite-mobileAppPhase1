import {useAPIHelper} from '../helpers/ApiHelper';
import Config from 'react-native-config';

export interface PageRight {
  pageId: number;
  roleLevel: number;
}

export interface PageRightsRequest {
  roleId: number;
  pageRights: PageRight[];
}

const usePageRightsService = () => {
  const baseUrl = Config.REACT_APP_USER_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const createPageRights = async (request: PageRightsRequest) => {
    const {data} = await apiHelper.post('page-rights', request);
    return data;
  };

  const getPageRights = async (roleId?: number) => {
    const queryParams = new URLSearchParams();
    if (roleId) queryParams.append('roleId', roleId.toString());
    const {data} = await apiHelper.get(`page-rights?${queryParams.toString()}`);
    return data;
  };

  const updatePageRights = async (
    roleId: number,
    request: PageRightsRequest,
  ) => {
    const {data} = await apiHelper.put(`page-rights/${roleId}`, request);
    return data;
  };

  const deletePageRights = async (roleId: number) => {
    const {data} = await apiHelper.delete(`page-rights/${roleId}`);
    return data;
  };

  return {
    createPageRights,
    getPageRights,
    updatePageRights,
    deletePageRights,
  };
};

export {usePageRightsService};
