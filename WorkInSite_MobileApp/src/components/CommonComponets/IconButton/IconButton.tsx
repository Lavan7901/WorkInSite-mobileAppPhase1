import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, GestureResponderEvent } from 'react-native';
import Icon from '../../../utils/VectorIcons';
import { Colors } from '../../../utils';

interface IconButtonProps {
    iconType: string; // e.g., "MaterialIcons", "MaterialCommunityIcons"
    name: string; // e.g., "edit", "delete"
    size?: number;
    color?: string;
    disabled?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
    style?: ViewStyle;
}

const IconButton: React.FC<IconButtonProps> = ({
    iconType,
    name,
    size = 24,
    color = Colors.primaryColor,
    disabled = false,
    onPress,
    style,
}) => {
    const handlePress = (event: GestureResponderEvent) => {
        if (!disabled && onPress) {
            onPress(event);
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
            style={[styles.iconWrapper, disabled && styles.disabled, style]}
        >
            <Icon
                icon={iconType}
                name={name}
                size={size}
                color={disabled ? Colors.grayColor : color}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconWrapper: {
        padding: 6,
        borderRadius: 8,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default IconButton;
