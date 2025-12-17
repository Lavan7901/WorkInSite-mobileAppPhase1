import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../../utils';
import Icon from '../../../utils/VectorIcons';
import componentStyle from '../../../styles/componentStyle';
import { useTheme } from '../../../context/ThemeContext';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChangeText, ...props }) => {
  const handleClear = () => {
    onChangeText('');
  };
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={[
      componentStyle.searchContainer,
      focused && { borderColor: theme.primaryColor }
    ]}>
      <TouchableOpacity onPress={() => inputRef.current?.focus()}>
        <Icon
          icon="MaterialIcons"
          name="search"
          size={24}
          color={Colors.grayColor}
          style={componentStyle.typeIconRightSpacing}
        />
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        style={componentStyle.searchInputText}
        placeholder="Search workers..."
        placeholderTextColor={Colors.grayColor}
        value={value}
        onChangeText={onChangeText}
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} >
          <Icon
            icon="MaterialIcons"
            name="cancel"
            size={24}
            color={Colors.grayColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchInput;