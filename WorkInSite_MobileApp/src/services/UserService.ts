import {useAPIHelper} from '../helpers/ApiHelper';
import {ProfileUpdationRequest} from '../screens/Users/DTOs/ProfileUpdationRequest';
import {UserCreationRequest} from '../screens/Users/DTOs/UserCreationRequest';
import {UserUpdationRequest} from '../screens/Users/DTOs/UserUpdationRequest';
import Config from 'react-native-config';

const useUserService = () => {
  const baseUrl = Config.REACT_APP_USER_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getUsers = async (
    searchString: string = '',
    setIsLoading?: boolean,
  ) => {
    const response = await apiHelper.get(
      `users?searchString=${searchString}`,
      setIsLoading,
    );
    return response.data;
  };

  const getUser = async (id: number) => {
    const response = await apiHelper.get(`users/${id}`);
    return response.data;
  };

  const createUser = async (user: UserCreationRequest) => {
    const response = await apiHelper.post('users', user);
    return response.data;
  };

  const updateUser = async (id: number, user: UserUpdationRequest) => {
    await apiHelper.put(`users/${id}`, user);
  };

  const updatePin = async (id: number, pin: string) => {
    await apiHelper.put(`users/${id}/password`, {password: pin});
  };

  const getProfile = async () => {
    const response = await apiHelper.get('users/profile');
    return response.data;
  };

  const updateProfile = async (user: ProfileUpdationRequest) => {
    await apiHelper.put('users/profile', user);
  };

  const updateProfilePin = async (pin: string) => {
    await apiHelper.put('users/profile/password', {password: pin});
  };

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    updatePin,
    getProfile,
    updateProfile,
    updateProfilePin,
  };
};

export {useUserService};
