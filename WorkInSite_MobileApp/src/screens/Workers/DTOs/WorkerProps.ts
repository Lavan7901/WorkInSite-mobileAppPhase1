import {BankAccountProps, UpiDetail} from '../../Suppliers/DTOs/SupplierProps';
import {WorkerCategoryProps} from './WorkerCategoryProps';
import {KYCDetail} from '../../Clients/DTOs/ClientProps';
import {Contact} from '../../Contacts/DTOs/ContactProps';
 
enum GenderTypes {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
 
interface WorkerBase {
  name: string;
  gender: GenderTypes;
  dateOfBirth: string;
  kycDetails: KYCDetail[];
  bankAccounts: BankAccountProps[];
  upiDetails: UpiDetail[];
  note: string;
  isActive?: boolean;
}
 
interface WorkerRequest extends WorkerBase {
  contactId: number;
  workerCategoryId: number;
}
 
interface Worker extends WorkerBase {
  id: number;
  contact: Contact;
  workerCategory: WorkerCategoryProps;
}
 
interface WageType {
  id: number;
  name: string;
}
 
export {GenderTypes};
export type {WorkerRequest, Worker, WageType};
 