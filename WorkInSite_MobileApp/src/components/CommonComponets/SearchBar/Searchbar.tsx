import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../../../utils';
import Icon from '../../../utils/VectorIcons';
import componentStyle from '../../../styles/componentStyle';
import { useTheme } from '../../../context/ThemeContext';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  searchCategory?: string; 
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, setSearchText, searchCategory }) => {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme();
  return (
    <View style={[
      componentStyle.searchContainer,
      focused && { borderColor: theme.primaryColor },
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
        placeholder={`Search ${searchCategory || ''}...`} // Dynamic placeholder
        value={searchText}
        onChangeText={text => {
          const sanitizedText = text.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
          setSearchText(sanitizedText.trimStart()); // Remove leading spaces
        }}
        keyboardType="default"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {searchText ? (
        <TouchableOpacity onPress={() => setSearchText('')}>
          <Icon
            icon="MaterialIcons"
            name="cancel"
            size={24}
            color={Colors.grayColor}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchBar;