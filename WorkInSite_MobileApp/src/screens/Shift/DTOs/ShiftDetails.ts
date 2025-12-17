// import {Shift} from './ShiftProps';

// export interface ShiftDetailsProps {
//   id: string;
//   ShiftSheetRef: any;
//   onUpdateSuccess: () => void;
// }

// export interface ShiftListProps {
//   shiftDetails: Shift[];
//   handleShiftDelete: (id: number) => void;
//   handleShiftEdit: (shift: {id: number; name: string}) => void;
//   editingShiftId: number | null;
//   refreshing: boolean;
//   handleRefresh: () => void;
// }

//2

import {Shift} from './ShiftProps';

export interface ShiftDetailsProps {
  id: string;
  ShiftSheetRef: any;
  onUpdateSuccess: () => void;
}

export interface ShiftListProps {
  shiftDetails: Shift[];
  handleShiftDelete: (id: number) => void;
  handleShiftEdit: (shift: Shift) => void; // update shift type
  editingShiftId: number | null;
  refreshing: boolean;
  handleRefresh: () => void;
}
