import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useUpiCreateForm } from './useUpiCreateForm';
import Select from '../../Select/Select';
import { UpiInputFields } from '../UpiInputFields/UpiInputFields';
import Button from '../../Button/Button';
import { UpiTypes } from '../DTOs/DTOs';
import { useLanguage } from '../../../../context/LanguageContext';
import commonStyle from '../../../../styles/commonStyle';

interface UpiCreateFormProps<T> {
  details: T;
  setDetails: React.Dispatch<React.SetStateAction<T>>;
  Ref?: React.RefObject<{ close: () => void }>;
}

const UpiCreateForm = <T extends { upiDetails: { upiType: UpiTypes; value: string }[] }>({
  details,
  setDetails,
  Ref,
}: UpiCreateFormProps<T>) => {
   const { t } =  useLanguage();
  const { upiType, upiItems, input, setInput, error, handleSelectChange, handleAdd } =
    useUpiCreateForm(details, setDetails, Ref);

  return (
    <View>
      <View style={commonStyle.gapContainer}>
        <Select
          selectedValue={upiType}
          items={upiItems}
          errorMessage={error.select}
          onValueChange={handleSelectChange}
        />
        <UpiInputFields
          upiType={upiType as UpiTypes}
          input={input}
          setInput={setInput}
          error={error}
        />
      </View>
      <Button title={t("Add")} onPress={handleAdd} />
    </View>
  );
};

export { UpiCreateForm };
