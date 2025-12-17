// import React, { useMemo } from 'react';
// import {
//   TouchableOpacity,
//   StyleSheet,
//   Text,
//   View,
//   StyleProp,
//   TextStyle,
//   ViewStyle,
//   Platform,
// } from 'react-native';
// import { SF, SH } from '../../../utils/dimensions';
// import { useTheme } from '../../../context/ThemeContext';
// import Icon from '../../../utils/VectorIcons';

// interface ButtonProps {
//   title: string;
//   onPress: any;
//   buttonStyle?: StyleProp<ViewStyle>;
//   disable?: boolean;
//   buttonTextStyle?: StyleProp<TextStyle>;
//   variant?: 'primary' | 'secondary'; // Optional variant for button styles
//   rightIcon?: string; 
// }
// const Button = ({
//   title = '',
//   onPress,
//   buttonStyle = {},
//   disable = false,
//   buttonTextStyle = {},
//   variant = 'primary', // Default is primary variant
//   rightIcon = '', // Default no icon
// }: ButtonProps) => {
//   const { theme } = useTheme()
//   const styles = useMemo(
//     () =>
//       StyleSheet.create({
//         buttonStyle: {
//           alignItems: 'center',
//           borderRadius: 6,
//           justifyContent: 'center',
//           backgroundColor: variant === 'primary' ? theme.primaryColor : theme.secondaryColor, // Switch color based on variant
//           width: '100%',
//           textAlign: 'center',
//           height: 50,
//           alignSelf: 'center',
//           shadowColor: '#000',
//           shadowOffset: {
//             width: 0,
//             height: Platform.OS === 'ios' ? 0 : 0,
//           },
//           shadowOpacity: 0.58,
//           shadowRadius: Platform.OS === 'ios' ? 0 : 0,
//           elevation: Platform.OS === 'ios' ? 0 : 0,
//           paddingHorizontal: variant === 'secondary' ? 15 : 0,
//           opacity: disable ? 0.6 : 9
//         },
//         buttonTextStyle: {
//           color: variant === 'primary' ? 'black' : 'white', // Adjust text color based on variant
//           fontSize: variant === 'primary' ? SF(19) : SF(18),
//           fontWeight: 'bold',
//           lineHeight: SH(26),
//         },
//         buttonViewStyle: {
//           flexDirection: 'row',
//           alignItems: 'center',
//           width: '100%',
//           justifyContent: variant === 'primary' ? 'center' : 'center',
//         },
//         iconStyle: {
//           marginLeft: 20,
//           fontSize: SF(24)
//         },
//       }),
//     [disable, theme, variant],
//   );
//   return (
//     <TouchableOpacity
//       disabled={disable}
//       style={[styles.buttonStyle, buttonStyle]}
//       onPress={() => onPress()}>
//       <View style={styles.buttonViewStyle}>
//         <Text style={[styles.buttonTextStyle, buttonTextStyle]}>
//           {title}
//         </Text>
//         {rightIcon ? (
//           <Icon icon="FontAwesome" name={rightIcon} color={styles.buttonTextStyle.color}
//             style={[styles.buttonTextStyle, styles.iconStyle]} />
//         ) : null}
//       </View>
//     </TouchableOpacity>
//   );
// };
// export default Button;











//changes usecallback

import React, { useMemo, useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
  Platform,
} from 'react-native';
import { SF, SH } from '../../../utils/dimensions';
import { useTheme } from '../../../context/ThemeContext';
import Icon from '../../../utils/VectorIcons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  disable?: boolean;
  buttonTextStyle?: StyleProp<TextStyle>;
  variant?: 'primary' | 'secondary';
  rightIcon?: string;
}

const Button = ({
  title = '',
  onPress,
  buttonStyle = {},
  disable = false,
  buttonTextStyle = {},
  variant = 'primary',
  rightIcon = '',
}: ButtonProps) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        buttonStyle: {
          alignItems: 'center',
          borderRadius: 6,
          justifyContent: 'center',
          backgroundColor: variant === 'primary' ? theme.primaryColor : theme.secondaryColor,
          width: '100%',
          textAlign: 'center',
          height: 50,
          alignSelf: 'center',
          shadowColor: '#000',
          marginTop: 12,
          shadowOffset: {
            width: 0,
            height: Platform.OS === 'ios' ? 0 : 0,
          },
          shadowOpacity: 0.58,
          shadowRadius: Platform.OS === 'ios' ? 0 : 0,
          elevation: Platform.OS === 'ios' ? 0 : 0,
          paddingHorizontal: variant === 'secondary' ? 15 : 0,
          opacity: disable ? 0.6 : 1,
        },
        buttonTextStyle: {
          color: variant === 'primary' ? 'black' : 'white',
          fontSize: variant === 'primary' ? SF(19) : SF(18),
          fontWeight: 'bold',
          lineHeight: SH(26),
        },
        buttonViewStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
        },
        iconStyle: {
          marginLeft: 20,
          fontSize: SF(24),
        },
      }),
    [disable, theme, variant]
  );


  const handlePress = useCallback(() => {
    if (!disable && onPress) {
      onPress();
    }
  }, [onPress, disable]);

  return (
    <TouchableOpacity
      disabled={disable}
      style={[styles.buttonStyle, buttonStyle]}
      onPress={handlePress}
    >
      <View style={styles.buttonViewStyle}>
        <Text style={[styles.buttonTextStyle, buttonTextStyle]}>
          {title}
        </Text>
        {rightIcon ? (
          <Icon
            icon="FontAwesome"
            name={rightIcon}
            color={styles.buttonTextStyle.color}
            style={[styles.buttonTextStyle, styles.iconStyle]}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
