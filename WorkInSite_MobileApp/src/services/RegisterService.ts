import axios, { AxiosResponse } from 'axios';
import Config from 'react-native-config';

const api = axios.create({
  baseURL: Config.REACT_APP_USER_SERVICE_BASE_URL || '',
});

export const RegisterService = {

  checkUserExists: async (phone: string): Promise<boolean> => {
    try {
      const response: AxiosResponse<any> = await api.get(`/auth/phone-exists`, {
        params: { phone },
      });
      return response.data?.isExists ?? false;
    } catch (error: any) {
      throw new Error('Failed to check user existence');
    }
  },

  // ✅ Send OTP with proper payload
  sendOtp: async (payload: { phone: string; purpose: string }) => {
    try {
      const response = await api.post('/otps', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

verifyOtp: async (
  phone: string,
  otp: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const payload = { phone, otp, purpose: 'register' };
    const response = await api.post('/Otps/Verification', payload);
    const isSuccess = response.data?.isVerified === true;

    return {
      success: isSuccess,
      message: response.data?.message || (isSuccess
        ? 'OTP verified successfully'
        : 'Invalid OTP. Please try again.'),
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'OTP verification failed.'
    );
  }
},

registerUser: async (
  name: string,
  phone: string,
  password: string,
  organisationName: string
): Promise<any> => {
  const payload = { name, phone, password, organisationName };

  try {
    const response = await api.post('/auth/register', payload);
    return { success: true, data: response.data };

  } catch (error: any) {
    if (error.response) {
      if (error.response.data?.id) {
        return { success: true, data: error.response.data };
      }

      return {
        success: false,
        message: error.response.data?.message || 'Registration failed. Try again.',
      };
    }
    return { success: false, message: error.message || 'Unexpected error occurred' };
  }
},

};
