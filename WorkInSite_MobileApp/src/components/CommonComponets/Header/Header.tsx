import React, { ReactNode } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../../../utils';
import { useTheme } from '../../../context/ThemeContext';
import componentStyle from '../../../styles/componentStyle';
import { useNavigation } from '@react-navigation/native';
import { usePermission } from '../../../hook/usePermission';
import IconButton from '../IconButton/IconButton';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  handleCreate?: () => void;
  handleReset?: () => void;
  permissionKey?: string;
  rightNode?: ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  enableHome?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  handleCreate,
  permissionKey,
  rightNode,
  headerStyle,
  handleReset,
  enableHome = true,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { canEdit } = usePermission();
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  return (
    <View
      style={[
        componentStyle.inputWithIcon,
        componentStyle.inputContainer,
        componentStyle.paddingHorizontal,
        { backgroundColor: theme.primaryColor },
        headerStyle,
      ]}
    >
      <View style={componentStyle.typeRowIconWithText}>
        {onBackPress && (
          <IconButton
            iconType="MaterialCommunityIcons"
            name="arrow-left-circle"
            size={25}
            color={Colors.white}
            onPress={onBackPress}
          />
        )}
        <Text style={componentStyle.headerLabel}>{title}</Text>
      </View>
      <View style={componentStyle.typeRowIconWithText}>
        {rightNode}
        {handleCreate && (
          <IconButton
            iconType="AntDesign"
            name="pluscircle"
            size={30}
            color={theme.secondaryColor}
            onPress={handleCreate}
            disabled={!hasPermission}
          />
        )}
        {enableHome && !rightNode && !handleCreate && (
          <IconButton
            iconType="MaterialIcons"
            name="home"
            size={30}
            color={theme.secondaryColor}
            // onPress={() => navigation.navigate('Home' as never)}
            onPress={() => {
              handleReset?.();
              navigation.navigate('Home' as never);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Header;



//2


// import React, { ReactNode } from 'react';
// import { View, Text, StyleProp, ViewStyle } from 'react-native';
// import { Colors } from '../../../utils';
// import { useTheme } from '../../../context/ThemeContext';
// import componentStyle from '../../../styles/componentStyle';
// import { useNavigation } from '@react-navigation/native';
// import { usePermission } from '../../../hook/usePermission';
// import IconButton from '../IconButton/IconButton';

// interface HeaderProps {
//   title: string;
//   onBackPress?: () => void;
//   handleCreate?: () => void;
//   handleReset?: () => void;
//   permissionKey?: string;
//   rightNode?: ReactNode;
//   headerStyle?: StyleProp<ViewStyle>;
//   enableHome?: boolean;
// }

// const Header: React.FC<HeaderProps> = ({
//   title,
//   onBackPress,
//   handleCreate,
//   permissionKey,
//   rightNode,
//   headerStyle,
//   handleReset,
//   enableHome = true
// }) => {
//   const { theme } = useTheme();
//   const navigation = useNavigation();
//   const { canEdit } = usePermission();
//   const hasPermission = permissionKey ? canEdit(permissionKey) : true;

//   return (
//     <View
//       style={[
//         componentStyle.inputWithIcon,
//         componentStyle.inputContainer,
//         componentStyle.paddingHorizontal,
//         { backgroundColor: theme.primaryColor },
//         headerStyle,
//       ]}
//     >
//       <View style={componentStyle.typeRowIconWithText}>
//         {onBackPress && (
//           <IconButton
//             iconType="MaterialCommunityIcons"
//             name="arrow-left-circle"
//             size={25}
//             color={Colors.white}
//             onPress={onBackPress}
//           />
//         )}
//         <Text style={componentStyle.headerLabel}>{title}</Text>
//       </View>
//       <View style={componentStyle.typeRowIconWithText}>
//         {rightNode}
//         {handleCreate && (
//           <IconButton
//             iconType="AntDesign"
//             name="pluscircle"
//             size={30}
//             color={theme.secondaryColor}
//             onPress={handleCreate}
//             disabled={!hasPermission}
//           />
//         )}
//         {(enableHome || handleReset) && (
//           <IconButton
//             iconType="MaterialIcons"
//             name="home"
//             size={30}
//             color={theme.secondaryColor}
//             onPress={() => {
//               handleReset?.();
//               navigation.navigate('Home' as never);
//             }}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// export default Header;
