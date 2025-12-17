// import {WorkerDetailsType} from '../DTOs/WorkerDetails';

// interface BankAccountEditFormProps extends WorkerDetailsType {
//   selectedItem: {
//     id: number;
//     accountName: string;
//     accountNumber: string;
//     ifscCode: string;
//   };
// }

// export type {BankAccountEditFormProps};


//2

interface BankAccountEditFormProps<T> {
  details: T; // The main entity details (e.g., supplier or worker)
  setDetails: React.Dispatch<React.SetStateAction<T>>;
  selectedItem: {
    id: number;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
  };
  Ref?: React.RefObject<{ close: () => void }>;
}
