import axios from 'axios';

export const useAttendanceSplitService = () => {
  const baseUrl = 'https://workinsite-test-api.onrender.com/AttendanceSplit';
  const getAttendanceSplits = async (
    searchString: string = '',
  ): Promise<any[]> => {
    const response = await axios.get(`${baseUrl}?q=${searchString}`);
    return response.data;
  };
  const getAttendanceSplit = async (id: number): Promise<any> => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  };
  const createAttendanceSplit = async (AttendanceSplit: any): Promise<void> => {
    await axios.post(baseUrl, AttendanceSplit);
  };
  const updateAttendanceSplit = async (
    id: number,
    AttendanceSplit: any,
  ): Promise<void> => {
    await axios.put(`${baseUrl}/${id}`, AttendanceSplit);
  };
  const deleteAttendanceSplit = async (id: number): Promise<void> => {
    await axios.delete(`${baseUrl}/${id}`);
  };
  return {
    getAttendanceSplits,
    getAttendanceSplit,
    createAttendanceSplit,
    updateAttendanceSplit,
    deleteAttendanceSplit,
  };
};
