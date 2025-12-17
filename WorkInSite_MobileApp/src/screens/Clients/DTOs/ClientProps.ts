import {Contact} from '../../Contacts/DTOs/ContactProps';

enum KYCTypes {
  AADHAAR = 'AADHAAR',
  PAN = 'PAN',
  GST = 'GST',
}

interface KYCDetail {
  kycType: KYCTypes;
  value: string;
}

interface ClientRequest {
  name: string;
  contactId: number;
  note: string;
  kycDetails: KYCDetail[];
}

interface Client {
  id: number;
  name: string;
  note: string;
  contact: Contact;
  kycDetails: KYCDetail[];
}

export {KYCTypes};
export type {ClientRequest, Client, KYCDetail};
