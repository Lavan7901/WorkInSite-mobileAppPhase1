import {WorkerRole, WorkerRoles} from './WorkerRoleProps';
import {WorkType} from './WorkTypeProps';

interface WorkerCategoryCreationRequest {
  name: string;
  workTypes: string[];
  workerRoles: WorkerRole[];
  note: string;
}

interface WorkerCategoryUpdationRequest {
  name: string;
  note: string;
  newWorkTypes: string[];
  updatedWorkTypes: WorkType[];
  deletedWorkTypes: number[];
  newWorkerRoles: WorkerRole[];
  updatedWorkerRoles: WorkerRoles[];
  deletedWorkerRoles: number[];
}

interface WorkerCategoryProps {
  name: string;
  workTypes: WorkType[];
  workerRoles: WorkerRoles[];
  note: string;
  id: number;
}

export type {
  WorkerCategoryCreationRequest,
  WorkerCategoryUpdationRequest,
  WorkerCategoryProps,
};
