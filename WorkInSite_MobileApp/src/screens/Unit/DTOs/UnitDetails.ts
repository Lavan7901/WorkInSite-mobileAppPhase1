import {Unit} from './UnitProps';

export interface UnitDetailsProps {
  id: string;
  unitSheetRef: any;
  onUpdateSuccess: () => void;
}

export interface UnitListProps {
  unitDetails: Unit[];
  handleUnitDelete: (id: number) => void;
  handleUnitEdit: (shift: {id: number; name: string}) => void;
  editingUnitId: number | null;
  refreshing: boolean;
  handleRefresh: () => void;
}
