import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import commonStyle from '../../styles/commonStyle';
import componentStyle from '../../styles/componentStyle';

const Loader = ({ size = 'large' }: { size?: 'small' | 'large' }) => {
  const { theme } = useTheme();

  if (size === 'large') {
    return (
      <View style={[commonStyle.container, commonStyle.alignContent]}>
        <ActivityIndicator size={size} color={theme.primaryColor} />
      </View>
    );
  }

  return (
    <View style={[componentStyle.inputPadding]}>
      <ActivityIndicator size={"large"} color={theme.primaryColor} />
    </View>
  );
};

export default Loader;