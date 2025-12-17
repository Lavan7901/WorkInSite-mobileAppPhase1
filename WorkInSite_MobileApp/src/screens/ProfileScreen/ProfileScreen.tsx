// import React from 'react';
// import {
//   Text,
//   TouchableOpacity,
//   View,
//   Share,
//   ToastAndroid,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { Colors } from '../../utils';
// import CustomAvatar from './CustomAvatar';
// import RouteName from '../../navigation/RouteName';
// import { AuthHelper } from '../../helpers/AuthHelper';
// import { useUserProfile } from './useUserProfile';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from '../../utils/VectorIcons';
// import { useTheme } from '../../context/ThemeContext';
// import { getProfileScreenStyles } from '../../styles/ProfileScreenStyle';
// import { useLanguage } from '../../context/LanguageContext';
// import commonStyle from '../../styles/commonStyle';

// interface ProfileScreenProps {
//   navigation: { navigate: (routeName: string) => void };
// }

// interface OptionProps {
//   iconName: string;
//   label: string;
//   onPress: () => void;
//   iconColor?: string;
//   showBadge?: boolean;
// }

// const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
//   const { name } = useUserProfile(navigation);
//   const { theme } = useTheme();
//   const { t } = useLanguage();
//   const Styles = getProfileScreenStyles(theme);

//   const handleShare = async () => {
//     try {
//       const result = await Share.share({
//         message:
//           'Check out WorkInSite - the amazing app that helps you manage your work efficiently!',
//         title: 'WorkInSite App',
//       });
//       if (result.action === Share.dismissedAction) return;
//     } catch (error: any) {
//       ToastAndroid.show(error.message, ToastAndroid.SHORT);
//     }
//   };

//   const handleLogout = async () => {
//     Alert.alert(t('Confirm Logout'), t('Are you sure you want to log out?'), [
//       { text: t('Cancel'), style: 'cancel' },
//       {
//         text: t('Confirm'),
//         onPress: async () => {
//           try {
//             await AsyncStorage.clear();
//             await AuthHelper.logout();
//             navigation.navigate(RouteName.LOGIN_SCREEN);
//           } catch {
//             ToastAndroid.show(t('Logout failed'), ToastAndroid.SHORT);
//           }
//         },
//       },
//     ]);
//   };

//   const renderOption = ({ iconName, label, onPress, iconColor, showBadge }: OptionProps) => (
//     <TouchableOpacity style={Styles.optionContainer} onPress={onPress} activeOpacity={0.7}>
//       <View style={Styles.optionLeft}>
//         <View
//           style={[
//             Styles.iconContainer,
//             iconColor && { backgroundColor: iconColor + '15' },
//           ]}
//         >
//           <Icon icon="MaterialIcons" name={iconName} size={22} color={iconColor} />
//           {showBadge && <View style={Styles.badge} />}
//         </View>
//         <Text style={Styles.menuText}>{label}</Text>
//       </View>
//       <Icon icon="MaterialIcons" name="chevron-right" size={24} color={Colors.grayColor} />
//     </TouchableOpacity>
//   );

//   const menuOptions = [
//     { iconName: 'person', label: t('Edit Personal Details'), onPress: () => navigation.navigate(RouteName.EDITPROFILE_SCREEN), iconColor: theme.secondaryColor },
//     { iconName: 'lock', label: t('Change PIN'), onPress: () => navigation.navigate(RouteName.CHANGE_PIN_SCREEN), iconColor: theme.secondaryColor },
//     { iconName: 'share', label: t('Refer A Friend'), onPress: handleShare, iconColor: theme.secondaryColor },
//     { iconName: 'palette', label: t('Theme'), onPress: () => navigation.navigate('ThemeSelectScreen'), iconColor: theme.secondaryColor },
//     { iconName: 'language', label: t('App Language'), onPress: () => navigation.navigate('LanguageChangeScreen'), iconColor: theme.secondaryColor },
//     { iconName: 'logout', label: t('Logout'), onPress: handleLogout },
//   ];

//   return (
//     <View style={commonStyle.container}>
//       <View style={Styles.profileHeader}>
//         <View style={Styles.profileSection}>
//           <CustomAvatar
//             name={name ?? ''}
//             backgroundColor={theme.primaryColor}
//             textColor={theme.secondaryColor}
//             borderRadius
//           />
//           <Text style={Styles.profileText}>{name || t('Guest User')}</Text>
//         </View>
//       </View>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//         style={{ marginTop: 200 }}>
//         <View style={Styles.menuContainer}>
//           <Text style={Styles.sectionTitle}>{t('Account Settings')}</Text>
//           <View style={Styles.menuCard}>
//             {menuOptions.slice(0, 2).map((option, index) => (
//               <View key={index}>
//                 {renderOption(option)}
//                 {index < 1 && <View style={Styles.separator} />}
//               </View>
//             ))}
//           </View>
//           <Text style={Styles.sectionTitle}>{t('General')}</Text>
//           <View style={Styles.menuCard}>
//             {menuOptions.slice(2, 5).map((option, index) => (
//               <View key={index}>
//                 {renderOption(option)}
//                 {index < 2 && <View style={Styles.separator} />}
//               </View>
//             ))}
//           </View>
//           <Text style={Styles.sectionTitle}>{t('Account')}</Text>
//           <View style={Styles.menuCard}>{renderOption(menuOptions[5])}</View>
//         </View>
//         <View style={Styles.footer}>
//           <Text style={Styles.versionText}>WorkInSite v1.0.0</Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default ProfileScreen;


//2

import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Share,
  ToastAndroid,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import { Colors } from '../../utils';
import CustomAvatar from './CustomAvatar';
import RouteName from '../../navigation/RouteName';
import { AuthHelper } from '../../helpers/AuthHelper';
import { useUserProfile } from './useUserProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../../utils/VectorIcons';
import { useTheme } from '../../context/ThemeContext';
import { getProfileScreenStyles } from '../../styles/ProfileScreenStyle';
import { useLanguage } from '../../context/LanguageContext';
import commonStyle from '../../styles/commonStyle';
import { useFocusEffect } from '@react-navigation/native';

interface ProfileScreenProps {
  navigation: { navigate: (routeName: string) => void };
}

interface OptionProps {
  iconName: string;
  label: string;
  onPress: () => void;
  iconColor?: string;
  showBadge?: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { name } = useUserProfile(navigation);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const Styles = getProfileScreenStyles(theme);

  const handleBackPress = () => {
    navigation.navigate(RouteName.Home_SCREEN)
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation]),
  );

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Check out WorkInSite - the amazing app that helps you manage your work efficiently!',
        title: 'WorkInSite App',
      });
      if (result.action === Share.dismissedAction) return;
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const handleLogout = async () => {
    Alert.alert(t('Confirm Logout'), t('Are you sure you want to log out?'), [
      { text: t('Cancel'), style: 'cancel' },
      {
        text: t('Confirm'),
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            await AuthHelper.logout();
            navigation.navigate(RouteName.LOGIN_SCREEN);
          } catch {
            ToastAndroid.show(t('Logout failed'), ToastAndroid.SHORT);
          }
        },
      },
    ]);
  };

  const renderOption = ({ iconName, label, onPress, iconColor, showBadge }: OptionProps) => (
    <TouchableOpacity style={Styles.optionContainer} onPress={onPress} activeOpacity={0.7}>
      <View style={Styles.optionLeft}>
        <View
          style={[
            Styles.iconContainer,
            iconColor && { backgroundColor: iconColor + '15' },
          ]}
        >
          <Icon icon="MaterialIcons" name={iconName} size={22} color={iconColor} />
          {showBadge && <View style={Styles.badge} />}
        </View>
        <Text style={Styles.menuText}>{label}</Text>
      </View>
      <Icon icon="MaterialIcons" name="chevron-right" size={24} color={Colors.grayColor} />
    </TouchableOpacity>
  );

  const menuOptions = [
    { iconName: 'person', label: t('Edit Personal Details'), onPress: () => navigation.navigate(RouteName.EDITPROFILE_SCREEN), iconColor: theme.secondaryColor },
    { iconName: 'lock', label: t('Change PIN'), onPress: () => navigation.navigate(RouteName.CHANGE_PIN_SCREEN), iconColor: theme.secondaryColor },
    { iconName: 'share', label: t('Refer A Friend'), onPress: handleShare, iconColor: theme.secondaryColor },
    { iconName: 'palette', label: t('Theme'), onPress: () => navigation.navigate('ThemeSelectScreen'), iconColor: theme.secondaryColor },
    { iconName: 'language', label: t('App Language'), onPress: () => navigation.navigate('LanguageChangeScreen'), iconColor: theme.secondaryColor },
    { iconName: 'logout', label: t('Logout'), onPress: handleLogout },
  ];

  return (
    <View style={commonStyle.container}>
      <View style={Styles.profileHeader}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={Styles.backButton}
          activeOpacity={9}
        >
          <Icon icon="MaterialIcons" name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={Styles.profileSection}>
          <CustomAvatar
            name={name ?? ''}
            backgroundColor={theme.primaryColor}
            textColor={theme.secondaryColor}
            borderRadius
          />
          <Text style={Styles.profileText}>{name || t('Guest User')}</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ marginTop: 200 }}>
        <View style={Styles.menuContainer}>
          <Text style={Styles.sectionTitle}>{t('Account Settings')}</Text>
          <View style={Styles.menuCard}>
            {menuOptions.slice(0, 2).map((option, index) => (
              <View key={index}>
                {renderOption(option)}
                {index < 1 && <View style={Styles.separator} />}
              </View>
            ))}
          </View>
          <Text style={Styles.sectionTitle}>{t('General')}</Text>
          <View style={Styles.menuCard}>
            {menuOptions.slice(2, 5).map((option, index) => (
              <View key={index}>
                {renderOption(option)}
                {index < 2 && <View style={Styles.separator} />}
              </View>
            ))}
          </View>
          <Text style={Styles.sectionTitle}>{t('Account')}</Text>
          <View style={Styles.menuCard}>{renderOption(menuOptions[5])}</View>
        </View>
        <View style={Styles.footer}>
          <Text style={Styles.versionText}>WorkInSite v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;