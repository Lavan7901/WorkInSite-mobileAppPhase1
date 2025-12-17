import Config from 'react-native-config';
import {useAPIHelper} from '../helpers/ApiHelper';
import {WageType} from '../screens/Workers/DTOs/WorkerProps';

export const useWageTypeService = () => {
  const baseUrl = Config.REACT_APP_WORKER_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWageTypes = async (
    searchString: string = '',
    setIsLoading?: boolean,
  ) => {
    const response = await apiHelper.get(
      `wage-types?searchString=${searchString}`,
      setIsLoading,
    );
    return response.data;
  };
  const getWageType = async (id: number) => {
    const response = await apiHelper.get(`wage-types/${id}`);
    return response.data;
  };
  const createWageType = async (workerRoles: string) => {
    const response = await apiHelper.post('wage-types', workerRoles);
    return response.data;
  };
  const updateWageType = async (id: number, workerRoles: WageType) => {
    const response = await apiHelper.put(`wage-types/${id}`, workerRoles);
    return response;
  };
  const deleteWageType = async (id: number) => {
    await apiHelper.delete(`wage-types/${id}`);
  };

  return {
    getWageType,
    getWageTypes,
    createWageType,
    updateWageType,
    deleteWageType,
  };
};
