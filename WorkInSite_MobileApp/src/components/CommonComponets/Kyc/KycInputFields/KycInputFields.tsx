import React, {useCallback} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {KycInputFieldProps} from './DTOs';
import Input from '../../Input/input';
import {KYCTypes} from '../DTOs/DTOs';
import {numberRegex, splCharRegex} from '../../../../utils/regex';
import { useLanguage } from '../../../../context/LanguageContext';

const KycInputFields: React.FC<KycInputFieldProps> = ({
  kycType,
  input,
  setInput,
  error,
}) => {
   const { t } =  useLanguage();
  const kycComponents: Record<KYCTypes, React.FC<any>> = {
    [KYCTypes.AADHAAR]: props => (
      <Input
        value={props.inputValue}
        onChangeText={(value: string) => props.setInputValue(value)}
        errorMessage={props.errorMessage}
        placeholder={t("Enter Aadhaar number")}
        maxLength={12}
        inputType="numeric"
        regex={numberRegex}
        required
      />
    ),
    [KYCTypes.PAN]: props => (
      <Input
        value={props.inputValue}
        onChangeText={(value: string) => props.setInputValue(value)}
        errorMessage={props.errorMessage}
        placeholder={t("Enter PAN number")}
        maxLength={10}
        required
        regex={splCharRegex}
      />
    ),
    [KYCTypes.GST]: props => (
      <Input
        value={props.inputValue}
        onChangeText={(value: string) => props.setInputValue(value)}
        errorMessage={props.errorMessage}
        placeholder={t("Enter GST number")}
        maxLength={15}
        regex={splCharRegex}
        required
      />
    ),
  };

  const KycComponent = kycComponents[kycType];

  const KycMemoizedComponent = useCallback(KycComponent, [kycType]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          {KycMemoizedComponent && (
            <KycMemoizedComponent
              inputValue={input}
              setInputValue={(value: string) => setInput(value)}
              errorMessage={error[kycType.toLowerCase()]}
            />
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export {KycInputFields};
