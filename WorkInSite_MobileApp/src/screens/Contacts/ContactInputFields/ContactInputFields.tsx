import React from 'react';
import {Input} from '../../../components/CommonComponets';
import Textarea from '../../../components/CommonComponets/Notes/Notes';
import {ContactTypes} from '../DTOs/ContactProps';
import {ContactInputFieldProps} from './DTOs';
import {emailRegex, numberRegex} from '../../../utils/regex';
import { useLanguage } from '../../../context/LanguageContext';

const ContactInputFields = (props: ContactInputFieldProps) => {
  const {contactType, input, setInput, error} = props;
  const { t } = useLanguage();
  const contactField = {
    [ContactTypes.PHONE]: (
      <Input
        value={input}
        onChangeText={setInput}
        errorMessage={error.phone}
        placeholder={t("Phone")}
        inputType="phone-pad"
        maxLength={10}
        regex={numberRegex}
      />
    ),
    [ContactTypes.EMAIL]: (
      <Input
        value={input}
        onChangeText={setInput}
        errorMessage={error.email}
        placeholder={t("Email")}
        regex={emailRegex}
      />
    ),
    [ContactTypes.ADDRESS]: (
      <Textarea
        length={300}
        value={input}
        onChange={setInput}
        errorMessage={error.address}
        placeholder={t("Address")}
      />
    ),
  };

  return contactField[contactType as keyof typeof contactField] || <></>;
};

export {ContactInputFields};
