import {Alert} from 'react-native';
import {
  SelectedItemProps,
  WorkType,
  WorkTypeListProps,
  WorkTypes,
} from '../DTOs/WorkTypeProps';
import {useRef, useState} from 'react';
import {useWorkTypeService} from '../../../services/WorkTypeService';
import { useLanguage } from '../../../context/LanguageContext';

export const useWorkTypeList = (props: WorkTypeListProps) => {
  const {
    workTypeList,
    setWorkTypeList,
    updatedWorkTypeList,
    deletedWorkTypeList,
    setDeletedWorkTypeList,
    setUpdatedWorkTypeList,
  } = props;
  
  const [selectedItem, setSelectedItem] = useState<SelectedItemProps | null>(
    null,
  );
  const bottomSheetRef = useRef<any>(null);
  const WorkTypeService = useWorkTypeService();
   const { t } = useLanguage();

  const handleEdit = (
    index: number,
    value: WorkType | WorkTypes,
    source: string,
  ) => {
    setSelectedItem({index, value, source});
    bottomSheetRef.current?.open();
  };

  const handleDelete = async (index: number, source: string, item: any) => {
    if (source === 'update' && item.id) {
      const isInUse = await WorkTypeService.getWorkTypeUsage(item.id);
      if (isInUse === true) {
        Alert.alert(
          'Cannot Delete',
          'This workType  is currently in use and cannot be deleted.',
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
              const updated = [...(workTypeList || [])];
              updated.splice(index, 1);
              setWorkTypeList(updated);
            } else if (
              source === 'update' &&
              updatedWorkTypeList &&
              setUpdatedWorkTypeList
            ) {
              const updated = [...(updatedWorkTypeList || [])];
              updated.splice(index, 1);
              setUpdatedWorkTypeList(updated);
              if (deletedWorkTypeList && setDeletedWorkTypeList && item.id) {
                setDeletedWorkTypeList([...deletedWorkTypeList, item.id]);
              }
            }
          },
        },
      ],
    );
  };

  return {
    handleDelete,
    handleEdit,
    selectedItem,
    setSelectedItem,
    bottomSheetRef,
  };
};
