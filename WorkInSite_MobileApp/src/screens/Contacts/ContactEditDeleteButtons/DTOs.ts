import {ContactListType} from '../DTOs/ContactList';
import {ContactDetail} from '../DTOs/ContactProps';

interface ContactEditDeleteButtonsProps extends ContactListType {
  selectedItem: {id: number; item: ContactDetail};
}

export type {ContactEditDeleteButtonsProps};
