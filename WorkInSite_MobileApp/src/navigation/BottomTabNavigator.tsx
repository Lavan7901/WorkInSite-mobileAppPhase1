import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet, Image, Keyboard } from 'react-native';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import { Colors, Fonts } from '../utils';
import images from '..';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Icon from '../utils/VectorIcons';
import PurchaseListScreen from '../screens/Purchase/PurchaseListScreen/PurchaseListScreen';
import WorkerReportScreen from '../screens/Report/WorkerReport/WorkerReportScreen';
import AttendanceListScreen from '../screens/Attendance/AttendanceListScreen/AttendanceListScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ navigation }: any) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleOpenDrawer = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      navigation.openDrawer();
    }, 100);
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Attendance':
              iconName = 'calendar-account';
              break;
            case 'Reports':
              iconName = 'file-document';
              break;
            case 'Purchase':
              iconName = 'toolbox';
              break;
          }

          return <Icon icon='MaterialCommunityIcons' name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.primaryColor,
        tabBarInactiveTintColor: theme.secondaryColor,
        tabBarStyle: {
          width: '100%',
          alignSelf: 'center',
          backgroundColor: Colors.white,
          overflow: 'hidden',
          height: 60,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: Fonts.Inter_Bold,
          bottom: 3,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t("Home"),
          title: '',
          headerShown: true,
          tabBarHideOnKeyboard: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <View style={style.headerLeft}>
              <TouchableOpacity onPress={handleOpenDrawer}>
                <Icon icon='MaterialCommunityIcons' name="menu" size={30} color={theme.secondaryColor} />
              </TouchableOpacity>
              <Image source={images.logo} style={style.logo} />
              <Text style={[style.heading, { color: theme.secondaryColor }]}>WorkInSite</Text>
            </View>
          ),
          headerRight: () => (
            <View style={style.headerRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('NotificationScreen')}
              >
                <Icon icon='MaterialCommunityIcons' size={30}
                  style={[{ color: theme.secondaryColor }]}
                  name="bell"
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceListScreen}
        options={{
          headerShown: false,
          tabBarLabel: t("Attendance"),
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={WorkerReportScreen}
        options={{
          headerShown: false,
          tabBarLabel: t("Reports"),
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tab.Screen
        name="Purchase"
        component={PurchaseListScreen}
        options={{
          headerShown: false,
          tabBarLabel: t("Purchase"),
          tabBarHideOnKeyboard: true,
        }}
      />
    </Tab.Navigator>
  );
}

const style = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  headerRight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
  },
  logo: {
    height: 35,
    resizeMode: 'contain',
    width: 40,
  },
  heading: {
    fontSize: 24,
    fontFamily: Fonts.Inter_Bold,
    fontWeight: 'bold',
  },
});