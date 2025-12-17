// import {SupplierDetailsType} from '../DTOs/SupplierDetails';
// import {BankAccountProps} from '../DTOs/SupplierProps';

// interface BankAccountEditDeleteButtonsProp extends SupplierDetailsType {
//   selectedItem: {id: number; item: BankAccountProps};
// }

// export type {BankAccountEditDeleteButtonsProp};

//2

interface Details<T> {
  bankAccounts: T[];
}

interface BankAccountProps {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

interface BankAccountEditDeleteButtonsProp<T> {
  details: Details<T>;
  setDetails: React.Dispatch<React.SetStateAction<Details<T>>>;
  selectedItem: {
    id: number;
    item: BankAccountProps;
  };
  permissionKey?: string;
}
