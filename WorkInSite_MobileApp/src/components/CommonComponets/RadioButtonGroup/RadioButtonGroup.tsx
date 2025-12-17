// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Colors } from '../../../utils';
// import { useTheme } from '../../../context/ThemeContext';
// import componentStyle from '../../../styles/componentStyle';

// interface RadioButtonGroupProps {
//   label: string;
//   items: Array<{ label: string; value: string }>;
//   selectedValue: string;
//   onValueChange: (value: string) => void;
//   errorMessage?: string;
//   required?: boolean;
// }
// const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
//   label,
//   items,
//   selectedValue,
//   onValueChange,
//   errorMessage,
//   required = false,
// }) => {
//   const { theme } = useTheme()
//   return (
//     <View>
//       {label && (
//         <Text style={[componentStyle.label]}>
//           {label}
//           {required && <Text style={componentStyle.requiredAsterisk}> *</Text>}
//         </Text>
//       )}
//       <View style={componentStyle.radioGroupContainer}>
//         {items.map(item => (
//           <TouchableOpacity
//             key={item.value}
//             style={componentStyle.radioItem}
//             onPress={() => onValueChange(item.value)}>
//             <View style={[componentStyle.radioCircle, { borderColor: theme.primaryColor }]}>
//               {selectedValue === item.value && (
//                 <View style={[componentStyle.selectedRadioCircle, { backgroundColor: theme.primaryColor }]} />
//               )}
//             </View>
//             <Text style={componentStyle.inputText}>{item.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       {errorMessage ? (
//         <Text style={componentStyle.errorMessage}>{errorMessage}</Text>
//       ) : null}
//     </View>
//   );
// };

// export default RadioButtonGroup;

//2

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../utils';
import { useTheme } from '../../../context/ThemeContext';
import componentStyle from '../../../styles/componentStyle';

interface RadioButtonGroupProps {
  label: string;
  items: Array<{ label: string; value: string }>;
  selectedValue: string;
  onValueChange: (value: string) => void;
  errorMessage?: string;
  required?: boolean;
  isDisabled?: boolean;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  label,
  items,
  selectedValue,
  onValueChange,
  errorMessage,
  required = false,
  isDisabled = false,
}) => {
  const { theme } = useTheme();

  return (
    <View>
      {label && (
        <Text style={[componentStyle.label]}>
          {label}
          {required && <Text style={componentStyle.requiredAsterisk}> *</Text>}
        </Text>
      )}

      <View style={componentStyle.radioGroupContainer}>
        {items.map(item => {
          const isSelected = selectedValue === item.value;

          return (
            <TouchableOpacity
              key={item.value}
              style={[
                componentStyle.radioItem,
                isDisabled && styles.disabledItem,
              ]}
              onPress={() => {
                if (!isDisabled) {
                  onValueChange(item.value);
                }
              }}
              activeOpacity={isDisabled ? 1 : 0.7}
              disabled={isDisabled}>
              <View
                style={[
                  componentStyle.radioCircle,
                  { borderColor: theme.primaryColor },
                  isDisabled && { borderColor: Colors.grayColor },
                ]}>
                {isSelected && (
                  <View
                    style={[
                      componentStyle.selectedRadioCircle,
                      {
                        backgroundColor: isDisabled
                          ? Colors.grayColor
                          : theme.primaryColor,
                      },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  componentStyle.inputText,
                  isDisabled && { color: Colors.grayColor },
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {errorMessage ? (
        <Text style={componentStyle.errorMessage}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  disabledItem: {
    opacity: 0.6,
  },
});

export default RadioButtonGroup;
