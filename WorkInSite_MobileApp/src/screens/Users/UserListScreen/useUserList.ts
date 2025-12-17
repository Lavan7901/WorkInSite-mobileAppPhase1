import {useState, useEffect} from 'react';
import {useUserService} from '../../../services/UserService';
import {User} from '../DTOs/User';
import RouteName from '../../../navigation/RouteName';
import {useIsFocused} from '@react-navigation/native';
import {useRefresh} from '../../../context/RefreshContext';

const useUserList = ({navigation}: any) => {
  const userService = useUserService();
  const isFocused = useIsFocused();
  const {refreshKeys, removeRefreshKey} = useRefresh();
  const refreshKey = refreshKeys[RouteName.USER_LIST_SCREEN];

  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchUser = async (searchString: string = '') => {
    const userList = await userService.getUsers(searchString);
    setUserList(userList);
    if (userList) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
    if (refreshKey) {
      setSearchText('');
    }
    if (!isFocused && refreshKey) {
      removeRefreshKey(RouteName.USER_LIST_SCREEN);
    }
  }, [isFocused]);

  const handleEditUser = (id: number) => {
    navigation.navigate(RouteName.USER_EDIT_SCREEN, {urlName: id});
  };

  return {
    userList,
    loading,
    handleEditUser,
    fetchUser,
    searchText,
    setSearchText,
  };
};

export {useUserList};
