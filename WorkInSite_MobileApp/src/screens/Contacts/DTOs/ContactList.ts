import {ContactRequest, Contact} from './ContactProps';

interface ContactListType {
  contactList: ContactRequest | Contact;
  setContactList?: React.Dispatch<
    React.SetStateAction<ContactRequest | Contact>
  >;
  Ref?: React.MutableRefObject<any>;
}

export type {ContactListType};
