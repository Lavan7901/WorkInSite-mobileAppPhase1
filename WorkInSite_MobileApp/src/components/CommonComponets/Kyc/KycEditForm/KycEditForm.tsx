import React from 'react';
import {View, StyleSheet} from 'react-native';
import {KycInputFields} from '../KycInputFields/KycInputFields';
import {useKycEditForm} from './useKycEditForm';
import Select from '../../Select/Select';
import Button from '../../Button/Button';
import { KycEditFormProps } from './DTOs';
import { useLanguage } from '../../../../context/LanguageContext';
import commonStyle from '../../../../styles/commonStyle';
import componentStyle from '../../../../styles/componentStyle';

const KycEditForm = (props: KycEditFormProps) => {
   const { t } =  useLanguage();
  const {details, setDetails, selectedItem, Ref} = props; // dynamic details and setDetails

  // Use the dynamic hook with passed props
  const {kycType, kycItems, input, setInput, error, handleUpdate} =
    useKycEditForm({
      details,
      setDetails,
      selectedItem,
      Ref,
    });

  const handleChange = (value: string) => {
    setInput(value); // Update the input when select value changes
  };

  return (
    <View>
      <View style={commonStyle.gapContainer}>
        <Select
          items={kycItems}
          selectedValue={selectedItem.type}
          onValueChange={handleChange}
          isDisabled={true} 
        />
        <KycInputFields
          kycType={kycType}
          input={input}
          setInput={setInput}
          error={error}
        />
      </View>
      <Button title={t("Update")} onPress={handleUpdate} />
    </View>
  );
};


export {KycEditForm};
