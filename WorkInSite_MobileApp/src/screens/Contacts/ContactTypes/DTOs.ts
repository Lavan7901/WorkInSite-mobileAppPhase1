import { ContactListType } from "../DTOs/ContactList";

interface ContactTypesProps extends ContactListType {
  showEditDeleteButtons?: boolean;
  classNames?: string;
}

export type { ContactTypesProps };
