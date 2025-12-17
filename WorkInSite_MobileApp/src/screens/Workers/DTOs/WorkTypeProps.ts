interface WorkType {
  name: string;
  id: number;
}

interface WorkTypes {
  name: string;
}

interface WorkTypeProp {
  name: string;
  id: number;
  workerCategory: {
    id: number;
    name: string;
    note: string;
  };
}

interface SelectedItemProps {
  index: number;
  value: WorkType | WorkTypes;
  source: string;
}

interface WorkTypeCreateFormProps {
  workTypeList: string[];
  setWorkTypeList: React.Dispatch<React.SetStateAction<string[]>>;
  updatedWorkTypeList?: WorkType[];
  bottomSheetRef?: any;
}

interface WorkTypeListProps {
  workTypeList: string[];
  setWorkTypeList: React.Dispatch<React.SetStateAction<string[]>>;
  updatedWorkTypeList?: WorkType[];
  setUpdatedWorkTypeList?: React.Dispatch<React.SetStateAction<WorkType[]>>;
  deletedWorkTypeList?: number[];
  setDeletedWorkTypeList?: React.Dispatch<React.SetStateAction<number[]>>;
}

interface WorkTypeEditFormProps {
  workTypeList: string[];
  setWorkTypeList: React.Dispatch<React.SetStateAction<string[]>>;
  updatedWorkTypeList?: WorkType[];
  setUpdatedWorkTypeList?: React.Dispatch<React.SetStateAction<WorkType[]>>;
  Ref?: any;
  selectedItem?: SelectedItemProps;
  deletedWorkTypeList?: number[];
  setDeletedWorkTypeList?: React.Dispatch<React.SetStateAction<number[]>>;
}

export type {
  WorkType,
  WorkTypes,
  WorkTypeProp,
  WorkTypeListProps,
  SelectedItemProps,
  WorkTypeEditFormProps,
  WorkTypeCreateFormProps,
};
