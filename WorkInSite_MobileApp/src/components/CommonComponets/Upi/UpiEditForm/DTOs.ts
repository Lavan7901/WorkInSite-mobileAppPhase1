import { UpiTypes } from "../DTOs/DTOs";

export type UpiDetails = {
  upiType: UpiTypes;
  value: string;
};

interface DynamicDetails<T extends {upiDetails: UpiDetails[]}> {
  details: T;
  setDetails: React.Dispatch<React.SetStateAction<T>>;
}

export interface UpiEditFormProps<T extends {upiDetails: UpiDetails[]}> {
  details: T;
  setDetails: React.Dispatch<React.SetStateAction<T>>;
  selectedItem: {
    id: number;
    type: UpiTypes;
    value: string;
  };
  Ref?: React.RefObject<any>;
}
