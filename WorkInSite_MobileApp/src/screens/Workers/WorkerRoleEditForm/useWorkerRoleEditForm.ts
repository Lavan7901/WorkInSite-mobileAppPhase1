import {useEffect, useState} from 'react';
import {useWorkerRoleInputValidate} from '../InputValidate/WorkerRoleValidate';
import {WorkerRoleEditFormProps, WorkerRoles} from '../DTOs/WorkerRoleProps';

export const useWorkerRoleEditForm = (props: WorkerRoleEditFormProps) => {
  const {
    workerRoleList,
    setWorkerRoleList,
    selectedItem,
    bottomSheetRef,
    updateworkerRoleList,
    setUpdateWorkerRoleList,
  } = props;

  const [name, setName] = useState(selectedItem.value.name);
  const [salaryPerShift, setSalaryPerShift] = useState(
    selectedItem.value.salaryPerShift,
  );
  const [hoursPerShift, setHoursPerShift] = useState(
    selectedItem.value.hoursPerShift,
  );

  const {error, validate, setError, initialError} = useWorkerRoleInputValidate(
    name,
    salaryPerShift,
    hoursPerShift,
  );

  useEffect(() => {
    setName(selectedItem.value.name);
    setSalaryPerShift(selectedItem.value.salaryPerShift);
    setHoursPerShift(selectedItem.value.hoursPerShift);
  }, [selectedItem]);

  const handleSave = () => {
    if (!validate()) return;

    const trimmedName = name.trim().toLowerCase();

    // Combine both lists for duplicate check
    const combinedList = [
      ...(workerRoleList || []),
      ...(updateworkerRoleList || []),
    ];

    const isDuplicate = combinedList.some((role, index) => {
      const currentIndex = selectedItem.index;
      const currentName = role?.name?.trim().toLowerCase();
      const isSame = currentName === trimmedName;

      // To avoid false positives, skip the current item (match by index and object)
      if (
        (selectedItem.value as WorkerRoles).id !== undefined &&
        'id' in role &&
        (selectedItem.value as WorkerRoles).id === role.id
      ) {
        return false;
      }

      // Fallback check for newly added (without id): check by index and name
      if (
        (selectedItem.value as WorkerRoles).id === undefined &&
        role?.name === selectedItem.value.name &&
        index === currentIndex
      ) {
        return false;
      }

      return isSame;
    });

    if (isDuplicate) {
      setError(prev => ({
        ...prev,
        name: 'Role name already exists',
      }));
      return;
    }

    const updatedRole = {
      name: name.trim(),
      salaryPerShift,
      hoursPerShift,
    };

    const hasId =
      'id' in selectedItem.value &&
      selectedItem.value.id !== undefined &&
      selectedItem.value.id !== null;

    if (hasId && updateworkerRoleList && setUpdateWorkerRoleList) {
      const updatedList = [...updateworkerRoleList];
      updatedList[selectedItem.index] = {
        ...updatedRole,
        id: (selectedItem.value as WorkerRoles).id,
      };
      setUpdateWorkerRoleList(updatedList);
    } else {
      const updatedList = [...workerRoleList];
      updatedList[selectedItem.index] = updatedRole;
      setWorkerRoleList(updatedList);
    }

    bottomSheetRef?.current?.close();
    setError(initialError);
  };

  return {
    name,
    setName,
    salaryPerShift,
    setSalaryPerShift,
    hoursPerShift,
    setHoursPerShift,
    handleSave,
    error,
    validate,
    setError,
    initialError,
  };
};
