import {Shift} from '../../Shift/DTOs/ShiftProps';
import {Site} from '../../Sites/DTOs/SiteProps';
import {Unit} from '../../Unit/DTOs/UnitProps';
import {WageType, Worker} from '../../Workers/DTOs/WorkerProps';
import {WorkMode} from '../../WorkMode/DTOs/WorkModeProps';

interface AttendanceSplits {
  workerRoleId: number;
  shiftId: number;
  noOfPersons: string;
}

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

interface WorkType {
  id: number;
  name: string;
  workerCategory: {
    id: number;
    name: string;
    note: string;
  };
}

interface AttendanceCreationRequest {
  date: string;
  siteId: number;
  wageTypeId: number;
  workTypeId: number;
  workerId: number;
  workedQuantity: string;
  unitId: number;
  workModeId: number;
  // attendanceSplits: AttendanceSplits[];
  attendanceSplitsJsonString: string;
  note: string;
  images?: any;
}

interface AttendanceUpdationRequest {
  date: string;
  siteId: number;
  wageTypeId: number;
  workTypeId: number;
  workerId: number;
  workedQuantity: string;
  unitId: number;
  workModeId: number;
  attendanceSplitsJsonString: string;
  // attendanceSplits: AttendanceSplits[];
  note: string;
}

type UploadedImage = {
  name: string;
  interface: string;
  uri: string;
};

interface AttendanceProps {
  id: number;
  date: string;
  site: Site;
  wageType: WageType;
  workType: WorkType;
  worker: Worker;
  workedQuantity: string;
  unit: Unit;
  shift: Shift;
  workMode: WorkMode;
  notes: string;
  attendanceSplits: AttendanceSplit[];
  images?: any;
  // uploadedImages: UploadedImage[];
}

export type {
  AttendanceSplit,
  AttendanceSplits,
  AttendanceCreationRequest,
  AttendanceUpdationRequest,
  AttendanceProps,
};
