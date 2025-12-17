// // import React, {useRef, FC, useState} from 'react';
// // import {
// //   View,
// //   TextInput,
// //   StyleSheet,
// //   NativeSyntheticEvent,
// //   TextInputKeyPressEventData,
// //   Text, // Import Text for label and error message
// // } from 'react-native';
// // import {SF, SH, SW} from '../../../utils';
// // import {Colors} from '../../../utils';
// // import {numberRegex} from '../../../utils/regex';
// // interface PinInputProps {
// //   value: string;
// //   pinLength?: number;
// //   secureTextEntry?: boolean;
// //   onPinChange: (pin: string) => void;
// //   errorMessage?: string; // New prop for error message
// //   label?: string; // New prop for the label text
// //   isRequired?: boolean; // New prop for marking the field as required
// // }
// // const PinInput: FC<PinInputProps> = ({
// //   value,
// //   pinLength = 4,
// //   secureTextEntry = false,
// //   onPinChange,
// //   errorMessage,
// //   label,
// //   isRequired = false, // Default to false if not provided
// // }) => {
// //   const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // Track focused index
// //   const inputRefs = useRef<Array<TextInput | null>>(
// //     Array(pinLength).fill(null),
// //   );

// //   const handleTextChange = (text: string, index: number) => {
// //     if (numberRegex.test(text)) {
// //       const newPin = value.split('');
// //       newPin[index] = text;
// //       onPinChange(newPin.join(''));
// //       if (text && index < pinLength - 1) {
// //         inputRefs.current[index + 1]?.focus();
// //       }
// //     }
// //   };
// //   const handleBackspace = (
// //     index: number,
// //     event: NativeSyntheticEvent<TextInputKeyPressEventData>,
// //   ) => {
// //     if (event.nativeEvent.key === 'Backspace' && index > 0 && !value[index]) {
// //       inputRefs.current[index - 1]?.focus();
// //       handleTextChange('', index - 1);
// //     }
// //   };
// //   const handleFocus = (index: number) => {
// //     setFocusedIndex(index);
// //   };
// //   const handleBlur = () => {
// //     setFocusedIndex(null);
// //   };
// //   return (
// //     <View style={styles.container}>
// //       {/* Display label if available */}
// //       {label && (
// //         <Text style={styles.label}>
// //           {label} {isRequired ? <Text style={styles.required}>*</Text> : null}
// //         </Text>
// //       )}
// //       <View style={styles.inputContainer}>
// //         {Array.from({length: pinLength}).map((_, index) => (
// //           <TextInput
// //             key={index}
// //             ref={ref => (inputRefs.current[index] = ref)}
// //             style={[
// //               styles.pinInput,
// //               focusedIndex === index && styles.pinInputFocused,
// //             ]}
// //             maxLength={1}
// //             value={value[index] || ''}
// //             onChangeText={text => handleTextChange(text, index)}
// //             secureTextEntry={secureTextEntry}
// //             placeholder={t("*")}
// //             keyboardType="number-pad"
// //             textContentType="oneTimeCode"
// //             onKeyPress={event => handleBackspace(index, event)}
// //             onFocus={() => handleFocus(index)}
// //             onBlur={handleBlur}
// //           />
// //         ))}
// //       </View>
// //       {/* Display error message if provided */}
// //       {errorMessage ? (
// //         <Text style={styles.errorMessage}>{errorMessage}</Text>
// //       ) : null}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flexDirection: 'column', // Change to column to stack label, inputs, and error message
// //   },
// //   label: {
// //     fontWeight: '500',
// //     fontSize: SF(16),
// //     color: Colors.black,
// //     marginBottom: SH(8), // Some space between label and inputs
// //   },
// //   required: {
// //     color: Colors.dangerColor, // Color for the asterisk
// //   },
// //   inputContainer: {
// //     flexDirection: 'row', // Keep inputs in a row
// //     justifyContent: 'space-between',
// //   },
// //   pinInput: {
// //     width: SW(60),
// //     height: SH(50),
// //     fontSize: SF(16),
// //     textAlign: 'center',
// //     textAlignVertical: 'center', // Ensures cursor stays centered vertically
// //     paddingTop: SH(12), // Adjust to center the text vertically in the input
// //     paddingBottom: SH(12), // Adjust to balance the padding
// //     borderWidth: 1,
// //     borderColor: Colors.grayColor,
// //     color: Colors.black,
// //     borderRadius: SH(10),
// //   },
// //   pinInputFocused: {
// //     borderColor: Colors.primaryColor,
// //   },
// //   errorMessage: {
// //     color: Colors.dangerColor, // Use a color for errors
// //     fontSize: 16,
// //     marginTop: SH(4), // Some space between the input and the error message
// //   },
// // });
// // export default PinInput;



// //2

// // import React from 'react';
// // import { StyleSheet, Text, View } from 'react-native';
// // import { OtpInput } from 'react-native-otp-entry';
// // import { Colors, SF, SH, SW } from '../../../utils';
// // import { useTheme } from '../../../context/ThemeContext';
// // import componentStyle from '../../../styles/componentStyle';

// // interface PinInputProps {
// //   value: string;
// //   keyProp: number,
// //   onPinChange: (pin: string) => void;
// //   pinLength?: number;
// //   secureTextEntry?: boolean;
// //   errorMessage?: string;
// //   label?: string;
// //   isRequired?: boolean;
// // }

// // const PinInput: React.FC<PinInputProps> = ({
// //   // value,
// //   keyProp,
// //   onPinChange,
// //   pinLength = 4,
// //   secureTextEntry = false,
// //   errorMessage,
// //   label,
// //   isRequired = false,
// // }) => {
// //   const { theme } = useTheme()

// //   return (
// //     <View style={styles.wrapper}>
// //       {label && (
// //         <Text style={[componentStyle.label]}>
// //                 {label}
// //                 {isRequired && <Text style={componentStyle.requiredAsterisk}> *</Text>}
// //         </Text>
// //       )}

// //       <OtpInput
// //         key={keyProp}
// //         numberOfDigits={pinLength}
// //         focusColor={Colors.primaryColor}
// //         autoFocus={false}
// //         hideStick={true}
// //         placeholder={secureTextEntry ? '•'.repeat(pinLength) : '*'.repeat(pinLength)}
// //         blurOnFilled={true}
// //         disabled={false}
// //         type="numeric"
// //         secureTextEntry={secureTextEntry}
// //         focusStickBlinkingDuration={300}
// //         onTextChange={onPinChange}
// //         // onFocus={() => console.log('Focused')}
// //         // onBlur={() => console.log('Blurred')}
// //         // onFilled={(text) => console.log(`OTP is ${text}`)}
// //         textInputProps={{
// //           accessibilityLabel: 'One-Time Password',
// //         }}
// //         textProps={{
// //           accessibilityRole: 'text',
// //           accessibilityLabel: 'OTP digit',
// //           allowFontScaling: false,
// //         }}
// //         theme={{
// //           containerStyle: styles.container,
// //           pinCodeContainerStyle: styles.pinCodeContainer,
// //           pinCodeTextStyle: styles.pinCodeText,
// //           focusStickStyle: styles.focusStick,
// //           focusedPinCodeContainerStyle: { borderColor: theme.primaryColor},
// //           placeholderTextStyle: styles.placeholderText,
// //           filledPinCodeContainerStyle: styles.filledPinCodeContainer,
// //           disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
// //         }}
// //       />

// //       {errorMessage && <Text style={componentStyle.errorMessage}>{errorMessage}</Text>}
// //     </View>
// //   );
// // };

// // export default PinInput;

// // const styles = StyleSheet.create({
// //   wrapper: {
// //     flexDirection: 'column',
// //   },
// //   container: {
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     // paddingVertical: SH(10),
// //   },
// //   pinCodeContainer: {
// //     borderBottomWidth: 2,
// //     borderColor: Colors.grayColor,
// //     width: SW(60),
// //     height: SH(50),
// //     marginHorizontal: SW(6),
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   pinCodeText: {
// //     fontSize: SF(20),
// //     color: Colors.black,
// //   },
// //   focusStick: {
// //     width: 2,
// //     height: 25,
// //     // backgroundColor: Colors.primaryColor,
// //     marginTop: 4,
// //   },
// //   activePinCodeContainer: {
// //     borderColor: Colors.primaryColor,
// //   },
// //   filledPinCodeContainer: {
// //     // borderColor: Colors.successColor,
// //   },
// //   disabledPinCodeContainer: {
// //     borderColor: Colors.grayColor,
// //     backgroundColor: '#f2f2f2',
// //   },
// //   placeholderText: {
// //     color: Colors.lightGray,
// //     fontSize: SF(20),
// //   },

// // });















// // //// style changes testing


// // import React from 'react';
// // import { StyleSheet, Text, View } from 'react-native';
// // import { OtpInput } from 'react-native-otp-entry';
// // import { Colors, SF, SH, SW } from '../../../utils';
// // import { useTheme } from '../../../context/ThemeContext';
// // import componentStyle from '../../../styles/componentStyle';

// // interface PinInputProps {
// //   value: string;
// //   keyProp: number,
// //   onPinChange: (pin: string) => void;
// //   pinLength?: number;
// //   secureTextEntry?: boolean;
// //   errorMessage?: string;
// //   label?: string;
// //   isRequired?: boolean;
// // }

// // const PinInput: React.FC<PinInputProps> = ({
// //   // value,
// //   keyProp,
// //   onPinChange,
// //   pinLength = 4,
// //   secureTextEntry = false,
// //   errorMessage,
// //   label,
// //   isRequired = false,
// // }) => {
// //   const { theme } = useTheme();

// //   return (
// //     <View style={styles.wrapper}>
// //       {label && (
// //         <Text style={[componentStyle.label]}>
// //                 {label}
// //                 {isRequired && <Text style={componentStyle.requiredAsterisk}> *</Text>}
// //         </Text>
// //       )}

// //       <OtpInput
// //         key={keyProp}
// //         numberOfDigits={pinLength}
// //         focusColor={Colors.primaryColor}
// //         autoFocus={false}
// //         hideStick={true}
// //         placeholder={secureTextEntry ? '•'.repeat(pinLength) : '*'.repeat(pinLength)}
// //         blurOnFilled={true}
// //         disabled={false}
// //         type="numeric"
// //         secureTextEntry={secureTextEntry}
// //         focusStickBlinkingDuration={300}
// //         onTextChange={onPinChange}
// //         // onFocus={() => console.log('Focused')}
// //         // onBlur={() => console.log('Blurred')}
// //         // onFilled={(text) => console.log(`OTP is ${text}`)}
// //         textInputProps={{
// //           accessibilityLabel: 'One-Time Password',
// //         }}
// //         textProps={{
// //           accessibilityRole: 'text',
// //           accessibilityLabel: 'OTP digit',
// //           allowFontScaling: false,
// //         }}
// //         theme={{
// //           containerStyle: styles.container,
// //           pinCodeContainerStyle: styles.pinCodeContainer,
// //           pinCodeTextStyle: styles.pinCodeText,
// //           focusStickStyle: styles.focusStick,
// //           focusedPinCodeContainerStyle: { borderColor: theme.primaryColor},
// //           placeholderTextStyle: styles.placeholderText,
// //           filledPinCodeContainerStyle: styles.filledPinCodeContainer,
// //           disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
// //         }}
// //       />
// //       {errorMessage && <Text style={componentStyle.errorMessage}>{errorMessage}</Text>}
// //     </View>
// //   );
// // };

// // export default PinInput;

// // const styles = StyleSheet.create({
// //   wrapper: {
// //     flexDirection: 'column',
// //   },
// //   container: {
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     // paddingVertical: SH(10),
// //   },
// //   pinCodeContainer: {
// //     borderBottomWidth: 2,
// //     borderColor: Colors.grayColor,
// //     width: SW(60),
// //     height: SH(50),
// //     marginHorizontal: SW(6),
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   pinCodeText: {
// //     fontSize: SF(16),
// //     color: Colors.grayColor,
// //   },
// //   focusStick: {
// //     width: 2,
// //     height: 25,
// //     // backgroundColor: Colors.primaryColor,
// //     marginTop: 4,
// //   },
// //   activePinCodeContainer: {
// //     borderColor: Colors.primaryColor,
// //   },
// //   filledPinCodeContainer: {
// //     // borderColor: Colors.successColor,
// //   },
// //   disabledPinCodeContainer: {
// //     borderColor: Colors.grayColor,
// //     backgroundColor: '#f2f2f2',
// //   },
// //   placeholderText: {
// //     color: Colors.dangerColor,
// //     fontSize: SF(16),
// //   },

// // });


// //final

// import React from 'react';
// import { Text, View } from 'react-native';
// import { OtpInput } from 'react-native-otp-entry';
// import { Colors } from '../../../utils';
// import { useTheme } from '../../../context/ThemeContext';
// import componentStyle from '../../../styles/componentStyle';

// interface PinInputProps {
//   value: string;
//   keyProp: number,
//   onPinChange: (pin: string) => void;
//   pinLength?: number;
//   secureTextEntry?: boolean;
//   errorMessage?: string;
//   label?: string;
//   isRequired?: boolean;
// }

// const PinInput: React.FC<PinInputProps> = ({
//   // value,
//   keyProp,
//   onPinChange,
//   pinLength = 4,
//   secureTextEntry = false,
//   errorMessage,
//   label,
//   isRequired = false,
// }) => {
//   const { theme } = useTheme()

//   return (
//     <View style={componentStyle.directionColumn}>
//       {label && (
//         <Text style={[componentStyle.label]}>
//           {label}
//           {isRequired && <Text style={componentStyle.requiredAsterisk}> *</Text>}
//         </Text>
//       )}

//       <OtpInput
//         key={keyProp}
//         numberOfDigits={pinLength}
//         focusColor={Colors.primaryColor}
//         autoFocus={false}
//         hideStick={true}
//         placeholder={secureTextEntry ? '•'.repeat(pinLength) : '*'.repeat(pinLength)}
//         blurOnFilled={true}
//         disabled={false}
//         type="numeric"
//         secureTextEntry={secureTextEntry}
//         focusStickBlinkingDuration={300}
//         onTextChange={onPinChange}
//         // onFocus={() => console.log('Focused')}
//         // onBlur={() => console.log('Blurred')}
//         // onFilled={(text) => console.log(`OTP is ${text}`)}
//         textInputProps={{
//           accessibilityLabel: 'One-Time Password',
//         }}
//         textProps={{
//           accessibilityRole: 'text',
//           accessibilityLabel: 'OTP digit',
//           allowFontScaling: false,
//         }}
//         theme={{
//           containerStyle: componentStyle.pinContainer,
//           pinCodeContainerStyle: componentStyle.pinCodeContainer,
//           pinCodeTextStyle: componentStyle.pinCodeText,
//           focusStickStyle: componentStyle.focusStick,
//           focusedPinCodeContainerStyle: { borderColor: theme.primaryColor },
//           placeholderTextStyle: componentStyle.placeholderText,
//           filledPinCodeContainerStyle: componentStyle.filledPinCodeContainer,
//           disabledPinCodeContainerStyle: componentStyle.disabledPinCodeContainer,
//         }}
//       />
//       {errorMessage && <Text style={componentStyle.errorMessage}>{errorMessage}</Text>}
//     </View>
//   );
// };

// export default PinInput;









import React from 'react';
import { Text, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { Colors } from '../../../utils';
import { useTheme } from '../../../context/ThemeContext';
import componentStyle from '../../../styles/componentStyle';

interface PinInputProps {
  value: string;
  keyProp: number,
  onPinChange: (pin: string) => void;
  pinLength?: number;
  secureTextEntry?: boolean;
  errorMessage?: string;
  label?: string;
  isRequired?: boolean;
  boxSize?: number;
}

const PinInput: React.FC<PinInputProps> = ({
  // value,
  keyProp,
  onPinChange,
  pinLength = 4,
  secureTextEntry = false,
  errorMessage,
  label,
  isRequired = false,
  boxSize
}) => {
  const { theme } = useTheme()

  return (
    <View style={componentStyle.directionColumn}>
      {label && (
        <Text style={[componentStyle.label]}>
          {label}
          {isRequired && <Text style={componentStyle.requiredAsterisk}> *</Text>}
        </Text>
      )}

      <OtpInput
        key={keyProp}
        numberOfDigits={pinLength}
        focusColor={Colors.primaryColor}
        autoFocus={false}
        hideStick={true}
        placeholder={secureTextEntry ? '•'.repeat(pinLength) : '*'.repeat(pinLength)}
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={secureTextEntry}
        focusStickBlinkingDuration={300}
        onTextChange={onPinChange}
        // onFocus={() => console.log('Focused')}
        // onBlur={() => console.log('Blurred')}
        // onFilled={(text) => console.log(`OTP is ${text}`)}
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
        }}
        textProps={{
          accessibilityRole: 'text',
          accessibilityLabel: 'OTP digit',
          allowFontScaling: false,
        }}
        theme={{
          containerStyle: componentStyle.pinContainer,
          pinCodeContainerStyle: {
  ...componentStyle.pinCodeContainer,
  ...(boxSize && { width: boxSize, height: boxSize }), // 👈 apply only if passed
},
          pinCodeTextStyle: componentStyle.pinCodeText,
          focusStickStyle: componentStyle.focusStick,
          focusedPinCodeContainerStyle: { borderColor: theme.primaryColor },
          placeholderTextStyle: componentStyle.placeholderText,
          filledPinCodeContainerStyle: componentStyle.filledPinCodeContainer,
          disabledPinCodeContainerStyle: componentStyle.disabledPinCodeContainer,
        }}
      />
      {errorMessage && <Text style={componentStyle.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

export default PinInput;