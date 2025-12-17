import React from 'react';
import { View, Text } from 'react-native';
import { getVerificationScreenStyles } from '../../styles/VertificationCodeStyle'; // adjust path as needed
import { useTheme } from '../../context/ThemeContext'; // if you’re using ThemeContext

const Footer = () => {
    const { theme } = useTheme(); // get current theme (light/dark)
    const Style = getVerificationScreenStyles(theme);

    return (
        <View style={Style.footerContainer}>
            <Text style={Style.footerMainText}>
                BM e-Solutions | Privacy & Terms
            </Text>
            <Text style={Style.footerSubText}>
                Copyright © 2025 BM e-Solutions | Erode | Chennai – Tamil Nadu
            </Text>
        </View>
    );
};

export default Footer;