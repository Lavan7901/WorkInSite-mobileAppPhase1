import {useEffect, useState} from 'react';
import {useAttendanceSplitInputValidate} from '../InputValidate/AttendanceSplitInputValidate';
import {useWorkerRoleService} from '../../../services/WorkerRoleService';
import {useShiftService} from '../../../services/ShiftService';
import {Shift} from '../../Shift/DTOs/ShiftProps';

export type WorkerCategory = {
  id: number;
  name: string;
  note: string;
};

export type WorkerRole = {
  id: number;
  name: string;
  salaryPerShift: string;
  hoursPerShift: string;
  workerCategory: WorkerCategory;
};

interface AttendanceSplit {
  workerRole: WorkerRole;
  shift: Shift;
  noOfPersons: string;
}

interface AttendanceSplitEditFormProps {
  attendanceSplit: AttendanceSplit[];
  setAttendanceSplit: (attendanceSplit: AttendanceSplit[]) => void;
  selectedAttendance: AttendanceSplit;
  closeModal: () => void;
  workerCategoryId: number;
}

// Defaults
const defaultWorkerRole: WorkerRole = {
  id: 0,
  name: '',
  salaryPerShift: '',
  hoursPerShift: '',
  workerCategory: {
    id: 0,
    name: '',
    note: '',
  },
};

const defaultShift: Shift = {
  id: 0,
  name: '',
  multiplier: '',
};

const useAttendanceSplitEditForm = ({
  attendanceSplit,
  setAttendanceSplit,
  selectedAttendance,
  closeModal,
  workerCategoryId,
}: AttendanceSplitEditFormProps) => {
  const [workerRoleId, setWorkerRoleId] =
    useState<WorkerRole>(defaultWorkerRole);
  const [shiftId, setShiftId] = useState<Shift>(defaultShift);
  const [noOfPersons, setNoOfPersons] = useState(
    selectedAttendance.noOfPersons,
  );
  const [workerRoleList, setWorkerRoleList] = useState<WorkerRole[]>([]);
  const [shiftList, setShiftList] = useState<Shift[]>([]);

  const workerRoleService = useWorkerRoleService();
  const shiftService = useShiftService();

  const {error, validate, setError} = useAttendanceSplitInputValidate({
    workerRoleId: workerRoleId?.id?.toString(),
    shiftId: shiftId?.id?.toString(),
    noOfPersons,
  });

  const workerRoleDetails = workerRoleList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
    allItems: {
      value: item.id.toString(),
      id: item.id,
      name: item.name,
      workerCategory: {
        id: item.workerCategory.id,
        name: item.workerCategory.name,
      },
    },
  }));

  const shiftDetails = shiftList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {
      value: item.id.toString(),
      id: item.id,
      name: item.name,
    },
  }));

  const fetchShifts = async (searchString: string = '') => {
    if (searchString) {
      const shifts = await shiftService.getShifts(searchString);
      if (shifts) setShiftList(shifts.slice(0, 3));
    }
  };

  const fetchWorkerRoles = async (WorkerRoleName: string = '') => {
    if (WorkerRoleName) {
      const workerRoles = await workerRoleService.getWorkerRoles({
        WorkerRoleName,
        WorkerCategoryId: workerCategoryId,
      });
      if (workerRoles) setWorkerRoleList(workerRoles.slice(0, 3));
    }
  };

  useEffect(() => {
    setWorkerRoleId(selectedAttendance.workerRole);
    setShiftId(selectedAttendance.shift);
    setNoOfPersons(selectedAttendance.noOfPersons);
    setWorkerRoleList(attendanceSplit.map(({workerRole}) => workerRole));
    setShiftList(attendanceSplit.map(({shift}) => shift));
  }, [selectedAttendance]);

  const handleSubmit = async () => {
    if (!validate()) return;

    const isCombinationExists = attendanceSplit.some(
      entry =>
        entry.workerRole.id === workerRoleId.id &&
        entry.shift.id === shiftId.id &&
        !(
          entry.workerRole.id === selectedAttendance.workerRole.id &&
          entry.shift.id === selectedAttendance.shift.id
        ),
    );

    if (isCombinationExists) {
      setError(prev => ({
        ...prev,
        workerRoleId: 'This worker role and shift combination already exists',
      }));
      return;
    }

    const updatedAttendanceSplit = attendanceSplit.map(entry =>
      entry.workerRole.id === selectedAttendance.workerRole.id &&
      entry.shift.id === selectedAttendance.shift.id
        ? {
            workerRole: workerRoleId,
            shift: shiftId,
            noOfPersons,
          }
        : entry,
    );

    setAttendanceSplit(updatedAttendanceSplit);
    closeModal();
  };

  return {
    workerRoleDetails,
    shiftDetails,
    workerRoleId,
    shiftId,
    noOfPersons,
    error,
    setWorkerRoleId,
    setShiftId,
    setNoOfPersons,
    fetchWorkerRoles,
    fetchShifts,
    handleSubmit,
  };
};

export default useAttendanceSplitEditForm;
