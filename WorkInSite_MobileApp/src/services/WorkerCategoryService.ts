import Config from 'react-native-config';
import {useAPIHelper} from '../helpers/ApiHelper';
import {
  WorkerCategoryCreationRequest,
  WorkerCategoryUpdationRequest,
} from '../screens/Workers/DTOs/WorkerCategoryProps';

const useWorkerCategoryService = () => {
  const baseUrl = Config.REACT_APP_WORKER_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkerCategories = async (
    searchString: string = '',
    setIsLoading?: boolean,
  ) => {
    const response = await apiHelper.get(
      `worker-categories?searchString=${searchString}`,
      setIsLoading,
    );
    return response.data;
  };

  const getWorkerCategory = async (id: number) => {
    const response = await apiHelper.get(`worker-categories/${id}`);
    return response.data;
  };

  const createWorkerCategory = async (
    workerCategory: WorkerCategoryCreationRequest,
  ) => {
    const response = await apiHelper.post('worker-categories', workerCategory);
    return response.data;
  };

  const updateWorkerCategory = async (
    id: number,
    workerCategory: WorkerCategoryUpdationRequest,
  ) => {
    await apiHelper.put(`worker-categories/${id}`, workerCategory);
  };

  const deleteWorkerCategory = async (id: number) => {
    await apiHelper.delete(`worker-categories/${id}`);
  };

  return {
    getWorkerCategories,
    getWorkerCategory,
    createWorkerCategory,
    updateWorkerCategory,
    deleteWorkerCategory,
  };
};

export {useWorkerCategoryService};
