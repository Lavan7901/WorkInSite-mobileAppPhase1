import Config from 'react-native-config';
import {useAPIHelper} from '../helpers/ApiHelper';
import {WorkerRole, WorkerRoles} from '../screens/Workers/DTOs/WorkerRoleProps';

interface GetWorkerRolesParams {
  WorkerRoleName?: string;
  WorkerCategoryId?: number;
  ResultLimit?: number;
  setIsLoading?: boolean;
}

export const useWorkerRoleService = () => {
  const baseUrl = Config.REACT_APP_WORKER_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);
  // const getWorkerRoles = async (
  //   searchString: string = '',
  //   setIsLoading?: boolean,
  // ) => {
  //   const response = await apiHelper.get(
  //     `worker-roles?searchString=${searchString}`,
  //     setIsLoading,
  //   );
  //   return response.data;
  // };

  const getWorkerRoles = async ({
    WorkerRoleName = '',
    WorkerCategoryId,
    ResultLimit,
    setIsLoading,
  }: GetWorkerRolesParams) => {
    const params = new URLSearchParams();

    if (WorkerRoleName) params.append('WorkerRoleName', WorkerRoleName);
    if (WorkerCategoryId !== undefined)
      params.append('WorkerCategoryId', WorkerCategoryId.toString());
    if (ResultLimit !== undefined)
      params.append('ResultLimit', ResultLimit.toString());

    const response = await apiHelper.get(
      `worker-roles?${params.toString()}`,
      setIsLoading,
    );

    return response.data;
  };

  const getWorkerRole = async (id: number) => {
    const response = await apiHelper.get(`worker-roles/${id}`);
    return response.data;
  };
  const createWorkerRole = async (workerRoles: WorkerRole) => {
    const response = await apiHelper.post('worker-roles', workerRoles);
    return response.data;
  };
  const updateWorkerRole = async (id: number, workerRoles: WorkerRoles) => {
    const response = await apiHelper.put(`worker-roles/${id}`, workerRoles);
    return response;
  };
  const deleteWorkerRole = async (id: number) => {
    await apiHelper.delete(`worker-roles/${id}`);
  };

  const getWorkerRoleUsage = async (id: number) => {
    const response = await apiHelper.get(`worker-roles/${id}/usage`);
    return response.data;
  };
  return {
    getWorkerRoles,
    getWorkerRole,
    createWorkerRole,
    updateWorkerRole,
    deleteWorkerRole,
    getWorkerRoleUsage,
  };
};
