import {Alert} from 'react-native';
import {
  WorkerRole,
  WorkerRoleListProps,
  WorkerRoles,
} from '../DTOs/WorkerRoleProps';
import {useRef, useState} from 'react';
import {useWorkerRoleService} from '../../../services/WorkerRoleService';
import { useLanguage } from '../../../context/LanguageContext';

export const useWorkerRoleList = (props: WorkerRoleListProps) => {
  const {
    workerRoleList,
    setWorkerRoleList,
    updateworkerRoleList,
    setUpdateWorkerRoleList,
    deleteworkerRoleList,
    setDeleteWorkerRoleList,
  } = props;

  const workerRoleBottomSheetRef = useRef<any>(null);
  const [selectedItem, setSelectedItem] = useState<{
    index: number;
    value: WorkerRole | WorkerRoles;
  } | null>(null);

  const WorkerRoleService = useWorkerRoleService();
   const { t } = useLanguage();

  const handleEdit = (index: number, value: WorkerRole | WorkerRoles) => {
    setSelectedItem({index, value});
    workerRoleBottomSheetRef.current?.open();
  };

  const handleDelete = async (index: number, source: string, item: any) => {
    if (source === 'update' && item.id) {
      const isInUse = await WorkerRoleService.getWorkerRoleUsage(item.id);
      if (isInUse === true) {
        Alert.alert(
          'Cannot Delete',
          'This worker role is currently in use and cannot be deleted.',
        );
        return;
      }
    }
    Alert.alert(
      t('Confirm Delete'),
      t('Are you sure you want to delete this Detail?'),
      [
        {text: t('Cancel'), style: 'cancel'},
        {
          text: t('Delete'),
          style: 'destructive',
          onPress: () => {
            if (source === 'new') {
              const updated = [...(workerRoleList || [])];
              updated.splice(index, 1);
              setWorkerRoleList(updated);
            } else if (
              source === 'update' &&
              updateworkerRoleList &&
              setUpdateWorkerRoleList
            ) {
              const updated = [...(updateworkerRoleList || [])];
              updated.splice(index, 1);
              setUpdateWorkerRoleList(updated);
              if (deleteworkerRoleList && setDeleteWorkerRoleList && item.id) {
                setDeleteWorkerRoleList([...deleteworkerRoleList, item.id]);
              }
            }
          },
        },
      ],
    );
  };

  return {
    workerRoleBottomSheetRef,
    selectedItem,
    handleDelete,
    handleEdit,
  };
};
