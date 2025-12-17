import {useIsFocused} from '@react-navigation/native';
import {useRef, useState, useEffect} from 'react';
import {Alert} from 'react-native';
import RouteName from '../../../navigation/RouteName';
import {useRoleService} from '../../../services/RoleService';
import {RoleRequest, Roles} from './DTOs';
import Toast from 'react-native-toast-message';

export const useRolesScreen = ({navigation}: any) => {
  const {getRoles, createRole, updateRole, deleteRole} = useRoleService();
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<any>(null);

  const [roles, setRoles] = useState<Roles[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await getRoles();
      setRoles(response.items || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch roles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRole = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter a role name');
      return;
    }

    const payload: RoleRequest = {name: name.trim(), note: note.trim()};

    try {
      if (editId) {
        await updateRole(editId, payload);
      } else {
        await createRole(payload);
      }
      resetForm();
      bottomSheetRef.current?.close();
      fetchRoles();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.[0].message || 'Failed to Save Role';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
      bottomSheetRef.current?.close();
    }
  };

  const handleDeleteRole = (id: number) => {
    Alert.alert('Delete Role', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRole(id);
            fetchRoles();
          } catch (error: any) {
            const errorMsg =
              error?.response?.data?.message || 'Failed to delete Role';
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: errorMsg,
            });
          }
        },
      },
    ]);
  };

  const handleEditRole = (role: Roles) => {
    setEditId(role.id);
    setName(role.name);
    setNote(role.note || '');
    bottomSheetRef.current?.open();
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setNote('');
  };

  const handleBackPress = () => navigation.navigate(RouteName.Home_SCREEN);

  const handleRefresh = async () => {
    setRefreshing(true); // ✅ start refreshing loader
    await fetchRoles(); // ✅ re-fetch list
    setRefreshing(false); // ✅ stop refreshing loader
  };

  useEffect(() => {
    if (isFocused) {
      fetchRoles();
    } else {
      resetForm();
    }
  }, [isFocused]);

  return {
    roles,
    isLoading,
    name,
    note,
    editId,
    bottomSheetRef,
    handleRefresh,
    refreshing,
    handleSaveRole,
    handleEditRole,
    handleDeleteRole,
    handleBackPress,
    resetForm,
    setName,
    setNote,
  };
};
