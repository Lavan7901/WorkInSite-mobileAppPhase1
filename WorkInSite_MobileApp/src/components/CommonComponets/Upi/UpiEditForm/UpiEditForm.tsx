import React from 'react';
import {View} from 'react-native';
import {useUpiEditForm} from './useUpiEditForm';
import {UpiDetails, UpiEditFormProps} from './DTOs';
import Select from '../../Select/Select';
import {UpiInputFields} from '../UpiInputFields/UpiInputFields';
import Button from '../../Button/Button';
import { useLanguage } from '../../../../context/LanguageContext';
import commonStyle from '../../../../styles/commonStyle';

const UpiEditForm = <T extends {upiDetails: UpiDetails[]}>(
  props: UpiEditFormProps<T>,
) => {
   const { t } =  useLanguage();
  const {upiType, upiItems, input, setInput, error, handleUpdate} =
    useUpiEditForm(props);

  return (
    <View>
       <View style={commonStyle.gapContainer}>
      <Select
        items={upiItems}
        selectedValue={props.selectedItem.type}
        onValueChange={() => {}}
        isDisabled={true}
      />
      <UpiInputFields
        upiType={upiType}
        input={input}
        setInput={setInput}
        error={error}
      />
      </View>
      <Button
        title={t("Update")}
        onPress={handleUpdate}
      />
    </View>
  );
};

export {UpiEditForm};
