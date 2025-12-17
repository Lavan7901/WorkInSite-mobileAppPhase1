enum ContactTypes {
  PHONE = 'Phone',
  EMAIL = 'Email',
  ADDRESS = 'Address',
}

interface ContactDetail {
  contactType: ContactTypes;
  value: string;
}

interface ContactRequest {
  name: string;
  phone: string;
  contactDetails: ContactDetail[];
}

interface Contact extends ContactRequest {
  id: number;
}

export {ContactTypes};
export type {ContactDetail, ContactRequest, Contact};
