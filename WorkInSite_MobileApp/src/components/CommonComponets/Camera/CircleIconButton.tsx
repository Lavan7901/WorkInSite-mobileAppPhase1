import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../../../utils/VectorIcons';

type Props = {
  icon: string,
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
};

const CircleIconButton: React.FC<Props> = ({
  icon,
  name,
  size = 24,
  color = '#fff',
  onPress,
  disabled = false,
  style,
}) => (
  <TouchableOpacity
    style={[styles.button, disabled && { opacity: 0.5 }, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <Icon icon={icon} name={name} size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00000088',
    padding: 12,
    borderRadius: 30,
  },
});

export default CircleIconButton;
