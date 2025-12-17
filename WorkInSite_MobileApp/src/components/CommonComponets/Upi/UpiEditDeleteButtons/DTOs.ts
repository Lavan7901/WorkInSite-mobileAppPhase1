import {UpiTypes} from '../DTOs/DTOs';

export interface UpiEditDeleteButtonsProps<T> {
  details: T;
  setDetails: React.Dispatch<React.SetStateAction<T>>;
  selectedItem: {
    id: number;
    item: {upiType: UpiTypes; value: string};
  };
  permissionKey?: string;
}
