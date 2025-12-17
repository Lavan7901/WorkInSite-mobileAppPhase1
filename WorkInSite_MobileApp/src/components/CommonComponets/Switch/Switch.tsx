import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Switch as ReactNativeSwitch } from 'react-native-switch';
import { Colors } from '../../../utils';
import { useTheme } from '../../../context/ThemeContext';
import componentStyle from '../../../styles/componentStyle';

interface CustomSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<CustomSwitchProps> = ({
  label,
  value,
  onValueChange,
  disabled = false,
}) => {
  const { theme } = useTheme()
  return (
    <View style={componentStyle.inputWithIcon
}>
      <Text style={componentStyle.label
}>{label}</Text>
      <ReactNativeSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        activeText={''} // No text displayed
        inActiveText={''} // No text displayed
        circleSize={24}
        barHeight={25}
        backgroundActive={disabled ? Colors.grayColor : theme.primaryColor}
        backgroundInactive={Colors.grayColor}
        circleActiveColor={Colors.white}
        circleInActiveColor={Colors.white}
        switchLeftPx={3}
        switchRightPx={3}
        switchBorderRadius={20}
      />
    </View>
  );
};

export default Switch;
