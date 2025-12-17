import {Contact} from '../../../screens/Contacts/DTOs/ContactProps';

interface ContactDetailFormProps {
  handleContactEdit: () => void;
  primaryContactDetails: Contact;
  hasMoreDetails: boolean;
  handleMoreDetails: () => void;
  permissionKey?: string;
}

export type {ContactDetailFormProps};
