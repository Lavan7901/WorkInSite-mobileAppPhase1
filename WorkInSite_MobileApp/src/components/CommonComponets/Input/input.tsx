import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TextStyle,
  ViewStyle,
} from 'react-native';
import componentStyle from '../../../styles/componentStyle';
import Colors from '../../../utils/color';
import { useTheme } from '../../../context/ThemeContext';

interface InputsProps {
  title?: string;
  placeholder?: string;
  titleStyle?: TextStyle;
  inputStyle?: TextStyle;
  onChangeText?: (text: string) => void;
  value?: string;
  inputType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  maxLength?: number;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  onEndEditing?: (e: any) => void;
  inputContainerStyle?: ViewStyle;
  numberOfLines?: number;
  regex?: RegExp;
}

const Input: React.FC<InputsProps> = ({
  title = '',
  placeholder = '',
  titleStyle = {},
  inputStyle = {},
  onChangeText,
  value = '',
  inputType = 'default',
  autoFocus = false,
  secureTextEntry = false,
  maxLength,
  errorMessage = '',
  regex,
  disabled = false,
  required = false,
  containerStyle,
  onEndEditing,
  inputContainerStyle,
  numberOfLines,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const handleChangeText = useCallback(
    (text: string) => {
      if (!regex || regex.test(text)) {
        onChangeText?.(text);
      }
    },
    [onChangeText, regex]
  );

  return (
    <View style={containerStyle}>
      {title ? (
        <Text style={[componentStyle.label, titleStyle]}>
          {title}
          {required && <Text style={componentStyle.requiredAsterisk}> *</Text>}
        </Text>
      ) : null}

      <View style={[componentStyle.inputContainer, inputContainerStyle]}>
        <TextInput
          style={[
            componentStyle.inputBox,
            componentStyle.inputText,
            isFocused ? { borderColor: theme.primaryColor } : componentStyle.inputBlurredBorder,
            inputStyle,
            disabled && { backgroundColor: Colors.disabledBg, opacity: 0.6, borderColor: Colors.disabledBg }
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.grayColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          keyboardType={inputType}
          secureTextEntry={secureTextEntry}
          value={value}
          autoFocus={autoFocus}
          maxLength={maxLength}
          editable={!disabled}
          onEndEditing={onEndEditing}
          numberOfLines={numberOfLines}
        />
      </View>

      {errorMessage ? (
        <Text style={componentStyle.errorMessage
        }>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default Input;