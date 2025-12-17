import {KYCDetail} from '../../Clients/DTOs/ClientProps';
import {Contact} from '../../Contacts/DTOs/ContactProps';

enum UpiTypes {
  GPAY = 'GPAY',
  PHONEPE = 'PHONEPE',
  UPI_ID = 'UPI_ID',
}

interface UpiDetail {
  upiType: UpiTypes;
  value: string;
}

interface BankAccountProps {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

interface SupplierBase {
  name: string;
  note: string;
  isActive?: boolean;
  kycDetails: KYCDetail[];
  bankAccounts: BankAccountProps[];
  upiDetails: UpiDetail[];
}

interface SupplierRequest extends SupplierBase {
  contactId: number;
}

interface Supplier extends SupplierBase {
  id: number;
  contact: Contact;
}

export {UpiTypes};
export type {SupplierRequest, Supplier, UpiDetail, BankAccountProps};
