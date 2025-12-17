import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useContactEditForm } from './useContactEditForm';
import { ContactEditFormProps } from './DTOs';
import Select from '../../../components/CommonComponets/Select/Select';
import Button from '../../../components/CommonComponets/Button/Button';
import { ContactInputFields } from '../ContactInputFields/ContactInputFields';
import commonStyle from '../../../styles/commonStyle';
import { useLanguage } from '../../../context/LanguageContext';
const ContactEditForm = (props: ContactEditFormProps) => {
  const { t } = useLanguage();
  const { contactType, contactItems, input, setInput, error, handleUpdate } =
    useContactEditForm(props);
  const handleOnChange = () => { };
  return (
    <View style={[commonStyle.flexContainer, { gap: 8 }]}>
      <Select
        items={contactItems}
        selectedValue={props.selectedItem.type}
        onValueChange={handleOnChange}
        isDisabled={true}
      />
      <ContactInputFields
        contactType={contactType}
        input={input}
        setInput={setInput}
        error={error}
      />
      <Button buttonStyle={{ marginTop: 10 }} title={t("Update")} onPress={handleUpdate} />
    </View>
  );
};
export { ContactEditForm };
