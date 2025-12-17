import {WorkMode} from './WorkModeProps';

export interface workModeDetailsProps {
  id: string;
  workModeSheetRef: any;
  onUpdateSuccess: () => void;
}

export interface WorkModeListProps {
  workModeDetails: WorkMode[];
  handleWorkModeDelete: (id: number) => void;
  handleWorkModeEdit: (shift: {id: number; name: string}) => void;
  editingWorkModeId: number | null;
  refreshing: boolean;
  handleRefresh: () => void;
}
