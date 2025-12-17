enum KYCTypes {
  AADHAAR = 'AADHAAR',
  PAN = 'PAN',
  GST = 'GST',
}

// Define the structure of each KYC item
interface KYCDetail {
  id?: number; //note
  kycType: KYCTypes;
  //   type?: KYCTypes; // This can be something like 'PAN', 'Aadhaar', etc.
  value: string; // The value of the KYC item
}

// Define the structure for the `details` (could be `clientDetails`, `workerDetails`, or `supplierDetails`)
interface KycDetails {
  kycDetails: KYCDetail[];
}

// Define the interface for the `selectedItem` that will be edited
interface SelectedItem {
  id: number;
  type: KYCTypes;
  value: string;
}

interface KycTypesProps {
  details: KycDetails; // The full details (client, worker, supplier)
  setDetails: React.Dispatch<React.SetStateAction<KycDetails>>; // Function to update the details
  Ref?: any; //note
}

// Define the `KycEditFormProps` interface

interface KycEditFormProps extends KycTypesProps {
  selectedItem: SelectedItem; // The selected item to edit
  Ref?: React.RefObject<any>; // Optional reference (e.g., for closing a modal)
}

export {KYCTypes};
export type {
  KycTypesProps,
  KycEditFormProps,
  KycDetails,
  KYCDetail,
  SelectedItem,
};








// // changes typescript

// // Enum for allowed KYC types
// export enum KYCTypes {
//   AADHAAR = 'AADHAAR',
//   PAN = 'PAN',
//   GST = 'GST',
// }

// // Individual KYC item structure
// export interface KYCDetail {
//   id?: number;                // Optional: useful when editing existing KYC records
//   kycType: KYCTypes;          // Required: must be one of the defined enum values
//   value: string;              // Required: actual KYC identifier like PAN number
// }

// // Container for an array of KYC details
// export interface KycDetails {
//   kycDetails: KYCDetail[];
// }

// // A selected KYC item being edited
// export interface SelectedItem {
//   id: number;
//   type: KYCTypes;
//   value: string;
// }

// // Props for KYC form component (e.g., add/edit/delete kycDetails)
// export interface KycTypesProps {
//   details: KycDetails;
//   setDetails: React.Dispatch<React.SetStateAction<KycDetails>>;
//  Ref?: React.RefObject<{ close: () => void }>;

// }

// // Extended props for KYC edit screen
// export interface KycEditFormProps extends KycTypesProps {
//   selectedItem: SelectedItem;
//   Ref?: React.RefObject<{ close: () => void }>;

// }
