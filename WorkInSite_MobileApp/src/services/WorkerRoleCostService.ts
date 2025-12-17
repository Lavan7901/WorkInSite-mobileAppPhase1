import Config from 'react-native-config';
import {useAPIHelper} from '../helpers/ApiHelper';
import {
  GetWorkerRoleCostParams,
  WorkerRoleCost,
} from '../screens/Workers/WorkerRoleCostEdit/DTOs';

export const useWorkerRoleCostService = () => {
  const baseUrl = Config.REACT_APP_WORKER_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkerRoleCosts = async ({
    WorkerCategoryId,
    WorkerId,
    setIsLoading,
  }: GetWorkerRoleCostParams) => {
    const params = new URLSearchParams();

    if (WorkerCategoryId !== undefined)
      params.append('WorkerCategoryId', WorkerCategoryId.toString());
    if (WorkerId !== undefined) params.append('WorkerId', WorkerId.toString());

    const response = await apiHelper.get(
      `worker-role-costs?${params.toString()}`,
      setIsLoading,
    );

    return response.data;
  };

  const createWorkerRoleCost = async (workerRoleCost: WorkerRoleCost) => {
    const response = await apiHelper.post('worker-role-costs', workerRoleCost);
    return response.data;
  };

  return {
    getWorkerRoleCosts,
    createWorkerRoleCost,
  };
};
