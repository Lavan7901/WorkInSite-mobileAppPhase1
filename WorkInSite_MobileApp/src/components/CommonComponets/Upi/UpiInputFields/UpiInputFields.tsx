import React, {useCallback} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Input from '../../Input/input';
import {UpiInputFieldProps} from './DTOs';
import {UpiTypes} from '../DTOs/DTOs';
import {numberRegex, upiRegex} from '../../../../utils/regex';
import { useLanguage } from '../../../../context/LanguageContext';

const UpiInputFields: React.FC<UpiInputFieldProps> = ({
  upiType,
  input,
  setInput,
  error,
}) => {
   const { t } =  useLanguage();
  const upiComponents: Record<UpiTypes, React.FC<any>> = {
    [UpiTypes.GPAY]: props => (
      <Input
        value={props.inputValue}
        onChangeText={(value: string) => props.setInputValue(value)}
        errorMessage={props.errorMessage}
        placeholder={t("Enter Gpay number")}
        maxLength={10}
        inputType="numeric"
        regex={numberRegex}
        required
      />
    ),
    [UpiTypes.PHONEPE]: props => (
      <Input
        value={props.inputValue}
        onChangeText={(value: string) => props.setInputValue(value)}
        errorMessage={props.errorMessage}
        placeholder={t("Enter Phonepe number")}
        maxLength={10}
        required
        regex={numberRegex}
      />
    ),
    [UpiTypes.UPI_ID]: props => (
      <Input
        value={props.inputValue}
        onChangeText={(value: string) => props.setInputValue(value)}
        errorMessage={props.errorMessage}
        placeholder={t("Enter Upi ID")}
        maxLength={50}
        required
        regex={upiRegex}
      />
    ),
  };

  const upiComponent = upiComponents[upiType];

  const UpiMemoizedComponent = useCallback(upiComponent, [upiType]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          {UpiMemoizedComponent && (
            <UpiMemoizedComponent
              inputValue={input}
              setInputValue={(value: string) => setInput(value)}
              errorMessage={error[upiType.toLowerCase()]}
            />
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export {UpiInputFields};
