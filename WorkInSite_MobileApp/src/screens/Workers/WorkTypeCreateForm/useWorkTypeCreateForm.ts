import {useState} from 'react';
import {WorkTypeCreateFormProps} from '../DTOs/WorkTypeProps';

export const useWorkType = (props: WorkTypeCreateFormProps) => {
  const {workTypeList, setWorkTypeList, bottomSheetRef, updatedWorkTypeList} =
    props;
  const [workType, setWorkType] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!workType) {
      setError('Enter work type');
      return;
    }
    const trimmedWorkType = workType.trim().toLowerCase();
    const isDuplicate = workTypeList.some(
      type => type.toLowerCase().trim() === trimmedWorkType,
    );
    const isDuplicateUpdated = updatedWorkTypeList?.some(
      type => type.name?.toLowerCase()?.trim() === trimmedWorkType,
    );
    if (isDuplicate || isDuplicateUpdated) {
      setError('Work type already exists');
      return;
    }
    setWorkTypeList([...workTypeList, workType?.trim()]);
    setWorkType('');
    bottomSheetRef?.current.close();
    setError('');
  };

  return {
    workType,
    setWorkType,
    handleAdd,
    workTypeList,
    setWorkTypeList,
    error,
  };
};
