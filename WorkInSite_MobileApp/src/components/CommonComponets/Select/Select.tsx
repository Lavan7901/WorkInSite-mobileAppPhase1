import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Colors, SH } from '../../../utils';
import Icon from '../../../utils/VectorIcons';
import componentStyle from '../../../styles/componentStyle';
import { useTheme } from '../../../context/ThemeContext';

interface SelectItem {
  label: string;
  value: string | number;
}

interface SelectProps {
  label?: string;
  items: SelectItem[];
  selectedValue?: string | number;
  onValueChange: (value: string | number | any) => void;
  placeholder?: string;
  isDisabled?: boolean;
  required?: boolean;
  errorMessage?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  items,
  selectedValue,
  onValueChange,
  placeholder,
  isDisabled = false,
  required = false,
  errorMessage,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme } = useTheme();
  const toggleDropdown = () => {
    Keyboard.dismiss(); 
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (value: string | number) => {
     Keyboard.dismiss();
    onValueChange(value);
    toggleDropdown();
  };
  
  useEffect(() => {
  const keyboardListener = Keyboard.addListener(
    'keyboardDidShow',
    () => {
      setIsDropdownOpen(false); // 👈 close dropdown
    }
  );

  return () => {
    keyboardListener.remove();
  };
}, []);


  return (
    <View >
      {label && (
        <Text style={[componentStyle.label]}>
          {label}
          {required && <Text style={componentStyle.requiredAsterisk}> *</Text>}
        </Text>
      )}
      <TouchableOpacity
        style={[componentStyle.inputBox, componentStyle.inputWithIcon, isDisabled && componentStyle.inputDisabled,
         {
      borderColor: isDropdownOpen
        ? theme.primaryColor  
        : Colors.grayColor  
    }
        ]}
        onPress={toggleDropdown}
        disabled={isDisabled}>
        <Text style={componentStyle.inputText}>{selectedValue
          ? items.find(item => item.value === selectedValue)?.label
          : placeholder || 'Select'}</Text>
        <Icon
          icon="MaterialIcons"
          name={isDropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
          size={24}
          color={Colors.black}
        />
      </TouchableOpacity>
      {isDropdownOpen && (
        <Animatable.View animation="fadeIn" duration={300} style={[componentStyle.dropdownBox]}>
          <FlatList
            data={items}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            style={{ maxHeight: SH(150) }}
            keyExtractor={item => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  componentStyle.iconPadding, componentStyle.inputWithIcon,
                  item.value === selectedValue && componentStyle.selectedItem
                ]}
                onPress={() => handleSelect(item.value)}>
                <Text style={componentStyle.inputText}>{item.label}</Text>
                {item.value === selectedValue && (
                  <Icon
                    icon="MaterialIcons"
                    name="check"
                    size={24}
                    color={Colors.primaryColor}
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </Animatable.View>
      )}
      {errorMessage && <Text style={componentStyle.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

export default Select;