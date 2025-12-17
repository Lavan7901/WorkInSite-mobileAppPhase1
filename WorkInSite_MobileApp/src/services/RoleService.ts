import {useAPIHelper} from '../helpers/ApiHelper';
import Config from 'react-native-config';
import {RoleRequest} from '../screens/RolesAndRights/Role/DTOs';

type GetRolesParams = {
  name?: string;
  pageNumber?: number;
  pageSize?: number;
  ignorePagination?: boolean;
};

const useRoleService = () => {
  const baseUrl = Config.REACT_APP_USER_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getRoles = async (params: GetRolesParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.name) queryParams.append('name', params.name);
    if (params.pageNumber)
      queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params.ignorePagination)
      queryParams.append('ignorePagination', String(params.ignorePagination));

    const {data} = await apiHelper.get(`roles?${queryParams.toString()}`);
    return data;
  };

  const createRole = async (role: RoleRequest) => {
    const {data} = await apiHelper.post('roles', role);
    return data;
  };

  const getRole = async (id: number) => {
    const {data} = await apiHelper.get(`roles/${id}`);
    return data;
  };

  const updateRole = async (id: number, role: RoleRequest) => {
    await apiHelper.put(`roles/${id}`, role);
  };

  const deleteRole = async (id: number) => {
    await apiHelper.delete(`roles/${id}`);
  };

  return {
    getRoles,
    createRole,
    getRole,
    updateRole,
    deleteRole,
  };
};

export {useRoleService};
