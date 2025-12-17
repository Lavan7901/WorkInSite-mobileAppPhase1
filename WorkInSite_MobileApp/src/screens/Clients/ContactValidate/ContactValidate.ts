import {Contact, ContactTypes} from '../../Contacts/DTOs/ContactProps';

const useContactValidate = (contact: Contact) => {
  const findPrimaryContactDetails = [
    {
      contactType: ContactTypes.PHONE,
      value: contact.phone,
    },
    contact.contactDetails.find(
      item => item.contactType === ContactTypes.EMAIL,
    ),
    contact.contactDetails.find(
      item => item.contactType === ContactTypes.ADDRESS,
    ),
  ].filter(Boolean) as Array<{contactType: ContactTypes; value: string}>;

  const primaryContactDetails = {
    ...contact,
    contactDetails: findPrimaryContactDetails,
  };

  const countByType = (type: ContactTypes) =>
    contact.contactDetails.filter(item => item.contactType === type).length;

  const hasMoreDetails = [
    ContactTypes.PHONE,
    ContactTypes.EMAIL,
    ContactTypes.ADDRESS,
  ].some(type => countByType(type) > 1);

  return {primaryContactDetails, hasMoreDetails};
};

export {useContactValidate};
