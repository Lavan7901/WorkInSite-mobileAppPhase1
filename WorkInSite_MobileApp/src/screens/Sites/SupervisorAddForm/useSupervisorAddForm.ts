import {useState} from 'react';
import {useUserService} from '../../../services/UserService';
import {User} from '../../Users/DTOs/User';
import RouteName from '../../../navigation/RouteName';

export interface UseSupervisorAddFormProps {
  siteId?: string;
  supervisors: User[];
  setSupervisors: React.Dispatch<React.SetStateAction<User[]>>;
  navigation: any;
  redirectUrl: string;
  Ref?: React.MutableRefObject<any>;
}

export const useSupervisorAddForm = ({
  siteId,
  supervisors,
  setSupervisors,
  navigation,
  redirectUrl,
  Ref,
}: UseSupervisorAddFormProps) => {
  const userService = useUserService();

  const [options, setOptions] = useState<{label: string; value: string}[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchUsers = async (search: string = '') => {
    try {
      const data = await userService.getUsers(search, false);
      const filtered = data?.filter(
        (u: User) => !(supervisors ?? []).some(s => s?.id === u?.id),
      );

      setOptions(
        filtered.map((u: User) => ({
          label: `${u?.name} ${u.role?.name ? `(${u?.role?.name})` : ''}`,
          value: u?.id?.toString(),
        })),
      );
    } catch (err) {
      console.error('fetchUsers error', err);
    }
  };

  const validate = () => {
    if (!selected) {
      setError('Please select a supervisor');
      return false;
    }
    setError('');
    return true;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      const user = await userService.getUser(parseInt(selected));
      if (!user) return;

      setSupervisors(prev => {
        const list = prev ?? [];
        if (list?.some(p => p?.id === user?.id)) return list;
        return [...list, user];
      });

      setSelected('');
      Ref?.current?.close?.();
    } catch (err) {
      console.error('handleAdd error', err);
    }
  };

  const handleCreate = (searchString: string) => {
    navigation.navigate(RouteName.USER_CREATION_SCREEN, {
      name: searchString,
      redirect: redirectUrl,
      ...(siteId ? {siteId} : {}),
    });
  };

  return {
    options,
    selected,
    setSelected,
    error,
    fetchUsers,
    handleAdd,
    handleCreate,
  };
};
