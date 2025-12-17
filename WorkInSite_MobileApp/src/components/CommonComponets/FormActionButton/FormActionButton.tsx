import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../../utils';
import Icon from '../../../utils/VectorIcons';
import { useTheme } from '../../../context/ThemeContext';
import componentStyle from '../../../styles/componentStyle';

interface FormActionButtonProps {
  heading: string;
  iconType: 'edit' | 'plus-circle' | 'contacts';
  onClick: () => void;
  isIconDisabled?: boolean;
  required?: boolean;
  errorMessage?: string;
}

const FormActionButton: React.FC<FormActionButtonProps> = ({
  heading,
  iconType,
  onClick,
  isIconDisabled = false,
  required = false,
  errorMessage = '',
}) => {
  const { theme } = useTheme();

  const renderIcon = () => {
    const color = isIconDisabled ? Colors.grayColor : theme.secondaryColor;
    const name = iconType === 'edit' ? 'playlist-edit' : iconType;

    return (
      <Icon
        icon="MaterialCommunityIcons"
        name={name}
        size={32}
        color={color}
      />
    );
  };

  return (
    <View>
      <View style={componentStyle.inputWithIcon
      }>
        <View>
          <Text style={[componentStyle.label
          ]}>
            {heading}
            {required && <Text style={componentStyle.requiredAsterisk
            }> *</Text>}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={onClick}
            disabled={isIconDisabled}
            style={[isIconDisabled && componentStyle.iconDisabled
            ]}>
            {renderIcon()}
          </TouchableOpacity>
        </View>
      </View>
      {errorMessage ? (
        <Text style={componentStyle.errorMessage
        }>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export { FormActionButton };
