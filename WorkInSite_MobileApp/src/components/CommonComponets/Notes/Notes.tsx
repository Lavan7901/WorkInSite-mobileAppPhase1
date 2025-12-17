import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Colors from '../../../utils/color';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import Icon from '../../../utils/VectorIcons';
import componentStyle from '../../../styles/componentStyle';

interface TextareaProps {
  label?: string;
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  showLocationLink?: boolean;
}

const Textarea: React.FC<TextareaProps> = props => {
  const { t } = useLanguage();
  const {
    label,
    length = 1000,
    value,
    onChange,
    placeholder,
    isDisabled,
    required = false,
    errorMessage,
    showLocationLink = false,
  } = props;
  const { theme } = useTheme()
  const [isFocused, setIsFocused] = useState(false);

  const handleGetLocation = useCallback(() => {
    const googleMapsUrl = 'https://www.google.com/maps';
    Linking.openURL(googleMapsUrl).catch(err =>
      console.error('Failed to open URL:', err),
    );
  }, []);

  return (
    <View>
      <View style={componentStyle.inputWithIcon}>
        {label && (
          <Text style={[componentStyle.label]}>
            {label}
            {required && <Text style={componentStyle.requiredAsterisk}> *</Text>}
          </Text>
        )}
        {showLocationLink && (
          <TouchableOpacity
            style={componentStyle.typeRowIconWithText}
            onPress={handleGetLocation}>
            <Icon
              icon="MaterialCommunityIcons"
              name="map-marker"
              size={18}
              color={theme.secondaryColor}
            />
            <Text style={componentStyle.typeLinkText}>{t("Get Location")}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        <TextInput
          style={[
            componentStyle.textAreaInputContainer,
            componentStyle.inputBox,
            componentStyle.inputText,
            isDisabled && [componentStyle.textDisabled, componentStyle.inputDisabled],
            { borderColor: isFocused ? theme.primaryColor : Colors.grayColor }
          ]}
          maxLength={length}
          value={value}
          onChangeText={text => onChange?.(text.trimStart())}
          placeholder={placeholder}
          placeholderTextColor={Colors.grayColor}
          editable={!isDisabled}
          multiline
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Text style={[componentStyle.textCount, isDisabled && componentStyle.textDisabled]}>
          {value?.length}/{length}
        </Text>
      </View>
      {errorMessage && <Text style={componentStyle.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

export default Textarea;
