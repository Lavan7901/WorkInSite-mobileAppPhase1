// DTOs.ts

enum KYCTypes {
  AADHAAR = 'AADHAAR',
  PAN = 'PAN',
  GST = 'GST',
}
interface KycEditDeleteButtonsProp {
  // Accepts any of the details types (e.g., workerDetails, clientDetails, supplierDetails)
  details: {kycDetails: Array<any>}; // Adjust the type of `kycDetails` based on your actual data structure
  setDetails: React.Dispatch<React.SetStateAction<{kycDetails: Array<any>}>>; // Sets the updated details after deletion

  // The selected item to be edited or deleted
  selectedItem: {
    id: number;
    item: {kycType: KYCTypes; value: string}; // Adjust this based on your actual data structure
  };
  permissionKey?: string;
}

export type {KycEditDeleteButtonsProp};
