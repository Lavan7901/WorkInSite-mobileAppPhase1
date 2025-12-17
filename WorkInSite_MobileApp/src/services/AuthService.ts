import axios, {AxiosResponse} from 'axios';
import Config from 'react-native-config';
const api = axios.create({
  baseURL: Config.REACT_APP_USER_SERVICE_BASE_URL || '',
});

const AuthService = {
  login: async (phoneNumber: string, pin: string): Promise<string> => {
    try {
      const response: AxiosResponse<any> = await api.post('/auth/login', {
        phone: phoneNumber,
        password: pin,
      });
      return response.data.accessToken;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  },
};

export {AuthService};
