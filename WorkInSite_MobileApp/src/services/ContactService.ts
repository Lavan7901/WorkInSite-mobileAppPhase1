import {ContactRequest} from '../screens/Contacts/DTOs/ContactProps';
import {useAPIHelper} from '../helpers/ApiHelper';
import Config from 'react-native-config';

const useContactService = () => {
  const baseUrl = Config.REACT_APP_MASTER_DATA_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getContacts = async (
    searchString: string = '',
    setIsLoading?: boolean,
  ) => {
    const response = await apiHelper.get(
      `contacts?searchString=${searchString}`,
      setIsLoading,
    );
    return response.data;
  };

  const getContact = async (id: number) => {
    const response = await apiHelper.get(`contacts/${id}`);
    return response.data;
  };

  const createContact = async (contact: ContactRequest) => {
    const response = await apiHelper.post('contacts', contact);
    return response.data;
  };

  const updateContact = async (id: number, contact: ContactRequest) => {
    await apiHelper.put(`contacts/${id}`, contact);
  };

  const deleteContact = async (id: number) => {
    await apiHelper.delete(`contacts/${id}`);
  };

  return {getContacts, getContact, createContact, updateContact, deleteContact};
};

export {useContactService};
