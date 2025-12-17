interface WorkerRole {
  name: string;
  salaryPerShift: string;
  hoursPerShift: string;
}

interface WorkerRoles {
  name: string;
  salaryPerShift: string;
  hoursPerShift: string;
  id: number;
}

interface WorkerRoleEditFormProps {
  workerRoleList: WorkerRole[];
  setWorkerRoleList: React.Dispatch<React.SetStateAction<WorkerRole[]>>;
  selectedItem: {
    index: number;
    value: WorkerRoles | WorkerRole;
  };
  updateworkerRoleList?: WorkerRoles[];
  setUpdateWorkerRoleList?: React.Dispatch<React.SetStateAction<WorkerRoles[]>>;
  deleteworkerRoleList?: number[];
  setDeleteWorkerRoleList?: React.Dispatch<React.SetStateAction<number[]>>;
  bottomSheetRef: any;
}

interface WorkerRoleListProps {
  workerRoleList: WorkerRole[];
  setWorkerRoleList: React.Dispatch<React.SetStateAction<WorkerRole[]>>;
  updateworkerRoleList?: WorkerRoles[];
  setUpdateWorkerRoleList?: React.Dispatch<React.SetStateAction<WorkerRoles[]>>;
  deleteworkerRoleList?: number[];
  setDeleteWorkerRoleList?: React.Dispatch<React.SetStateAction<number[]>>;
}

interface WorkerRoleCreateFormProps {
  workerRoleList: WorkerRole[];
  setWorkerRoleList: React.Dispatch<React.SetStateAction<WorkerRole[]>>;
  updateworkerRoleList?: WorkerRoles[];
  bottomSheetRef?: any;
}

export type {
  WorkerRole,
  WorkerRoles,
  WorkerRoleCreateFormProps,
  WorkerRoleEditFormProps,
  WorkerRoleListProps,
};
