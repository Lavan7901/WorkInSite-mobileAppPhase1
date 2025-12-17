import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    GestureResponderEvent,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import Icon from '../../../utils/VectorIcons';
import { Colors } from '../../../utils';

type UploadButtonProps = {
    text: string;
    onPress: (event: GestureResponderEvent) => void;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean; // ✅ NEW
};

const UploadButton: React.FC<UploadButtonProps> = ({
    text,
    onPress,
    buttonStyle,
    textStyle,
    disabled = false, // ✅ default false
}) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: disabled ? Colors.grayColor : theme.secondaryColor }, // ✅ Disabled color
                buttonStyle,
            ]}
            activeOpacity={0.85}
            onPress={disabled ? undefined : onPress} // ✅ Disable press
            disabled={disabled} // ✅ Disable interaction
        >
            <Icon
                icon="MaterialIcons"
                name="cloud-upload"
                size={28}
                color={disabled ? '#cfcfcf' : '#fff'} // ✅ Icon color change
                style={styles.icon}
            />
            <Text
                style={[
                    styles.text,
                    { color: disabled ? '#cfcfcf' : '#fff' }, // ✅ Text color change
                    textStyle,
                ]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default UploadButton;

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        justifyContent: "center"
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});
