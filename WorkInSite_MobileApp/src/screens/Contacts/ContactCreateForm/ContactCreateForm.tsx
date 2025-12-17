import { View } from 'react-native';
import React from 'react';
import { useContactCreateForm } from './useContactCreateForm';
import Select from '../../../components/CommonComponets/Select/Select';
import { ContactListType } from '../DTOs/ContactList';
import { ContactInputFields } from '../ContactInputFields/ContactInputFields';
import { ContactTypes } from '../DTOs/ContactProps';
import Button from '../../../components/CommonComponets/Button/Button';
import commonStyle from '../../../styles/commonStyle';
import { useLanguage } from '../../../context/LanguageContext';
const ContactCreateForm = (props: ContactListType) => {
  const { t } = useLanguage();
  const {
    contactType,
    contactItems,
    input,
    setInput,
    error,
    handleSelectChange,
    handleAdd,
  } = useContactCreateForm(props);
  return (
    <View style={[commonStyle.flexContainer, { gap: 8 }]}>
      <Select
        selectedValue={contactType}
        items={contactItems}
        onValueChange={handleSelectChange}
        errorMessage={error.select}
      />
      <ContactInputFields
        contactType={contactType as ContactTypes}
        input={input}
        setInput={setInput}
        error={error}
      />
      <Button buttonStyle={{ marginTop: 10 }} title={t("Add")} onPress={handleAdd} />
    </View>
  );
};
export default ContactCreateForm;
