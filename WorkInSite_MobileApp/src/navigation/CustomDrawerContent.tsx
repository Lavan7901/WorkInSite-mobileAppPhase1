import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text,
} from 'react-native';
import { Colors } from '../utils';
import RouteName from './RouteName';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Icon from '../utils/VectorIcons';
import CustomAvatar from '../screens/ProfileScreen/CustomAvatar';
import { useUser } from '../context/UserContext';
import { usePermission } from '../hook/usePermission';
import { useRefresh } from '../context/RefreshContext';

const CustomDrawerContent = (props: any) => {
  const { navigation } = props;
  const drawerStatus = useDrawerStatus();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { canView } = usePermission();
  const { user } = useUser();
  const { triggerRefresh } = useRefresh();

  const initialRouteName = [
    { label: 'Roles & Rights', icon: 'account-multiple-check', screen: RouteName.ROLES_SCREEN },
    { label: 'Users', icon: 'account', screen: RouteName.USER_LIST_SCREEN },
    { label: 'Contacts', icon: 'contacts', screen: RouteName.CONTACT_LIST_SCREEN },
    { label: 'Clients', icon: 'briefcase', screen: RouteName.CLIENT_LIST_SCREEN },
    { label: 'Sites', icon: 'google-maps', screen: RouteName.SITE_LIST_SCREEN },
    {
      label: 'Workers',
      icon: 'account-hard-hat',
      submenus: [
        { label: 'Worker', screen: RouteName.WORKER_LIST_SCREEN },
        { label: 'Worker Category', screen: RouteName.WORKER_CATEGORY_LIST_SCREEN },
        { label: 'Work Rate Abstract', screen: RouteName.WORK_RATE_ABSTRACT_LIST },
        { label: 'Work mode', screen: RouteName.WORK_MODE_CREATION_SCREEN },
        { label: 'Shift', screen: RouteName.SHIFT_CREATION_SCREEN },
      ],
    },
    { label: 'Suppliers', icon: 'truck', screen: RouteName.SUPPLIER_LIST_SCREEN },
    {
      label: 'Materials',
      icon: 'toolbox',
      submenus: [
        { label: 'Unit', screen: RouteName.UNIT_CREATION_SCREEN },
        { label: 'Material', screen: RouteName.MATERIAL_LIST_SCREEN },
        { label: 'Purchase', screen: RouteName.PURCHASE_LIST_SCREEN },
        { label: 'Material Used', screen: RouteName.MATERIALUSED_LIST_SCREEN },
        { label: 'Material Shift', screen: RouteName.MATERIALSHIFT_LIST_SCREEN },
      ],
    },
    { label: 'Attendance', icon: 'calendar-account', screen: RouteName.ATTENDANCE_LIST_SCREEN },
    {
      label: 'Transaction',
      icon: 'bank-transfer',
      submenus: [
        { label: 'Client Transaction', screen: RouteName.CLIENT_TRANSACTION_LIST_SCEEN },
        { label: 'Supplier Transaction', screen: RouteName.SUPPLIER_TRANSACTION_LIST_SCEEN },
        { label: 'Worker Transaction', screen: RouteName.WORKER_TRANSACTION_LIST_SCEEN },
      ],
    },
    {
      label: 'Reports',
      icon: 'file-document',
      submenus: [
        { label: 'Worker Report', screen: RouteName.WORKER_REPORT_SCREEN },
      ],
    },
  ];

  const [drawerItems, setDrawerItems] = useState(initialRouteName);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // 🔒 Filter items by user permission
  useEffect(() => {
    const filteredDrawer = initialRouteName
      .map(item => {
        if (item.submenus) {
          const filteredSubmenus = item.submenus.filter(sub =>
            canView(sub.label)
          );
          if (filteredSubmenus.length === 0) return null;
          return { ...item, submenus: filteredSubmenus };
        }
        return canView(item.label) ? item : null;
      })
      .filter(Boolean);

    setDrawerItems(filteredDrawer as typeof initialRouteName);
  }, [canView]);

  // 🔄 Reset submenu when drawer closes
  useEffect(() => {
    if (drawerStatus !== 'open') setOpenMenu(null);
  }, [drawerStatus]);

  const handleToggleSubMenu = (label: string) => {
    setOpenMenu(prev => (prev === label ? null : label));
  };

  const handleProfileOpen = () => {
    navigation.navigate(RouteName.PROFILE_SCREEN);
  };

  return (
    <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.drawerHeader, { borderColor: theme.primaryColor, backgroundColor: theme.primaryColor + "15" }]}>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={handleProfileOpen}
          activeOpacity={0.8}
        >
          <CustomAvatar
            size={55}
            name={user?.name || ""}
            backgroundColor={theme.primaryColor}
            textColor={theme.secondaryColor}
            borderRadius
          />
          <View style={styles.profileDetails}>
            <Text style={[styles.userName, { color: theme.secondaryColor }]}>{user?.name || t('Guest User')}</Text>
            <Text style={[styles.userRole, { color: theme.secondaryColor }]}>{user?.role?.name || t('No Role')}</Text>
          </View>
          <Icon icon='FontAwesome5' name="user-edit" size={20} style={{ color: theme.secondaryColor }} />
        </TouchableOpacity>
      </View>

      {/* Drawer Menu */}
      {drawerItems.map((item, index) => {
        const scaleAnim = new Animated.Value(1);
        return (
          <View key={index}>
            <TouchableOpacity
              onPress={() => {
                if (item.submenus) handleToggleSubMenu(item.label);
                else {
                  navigation.navigate(item.screen);
                  triggerRefresh(item.screen); // new
                };
              }}
              activeOpacity={1}
            >
              <Animated.View
                style={[
                  styles.drawerItem,
                  { transform: [{ scale: scaleAnim }] },
                  openMenu === item.label ? styles.drawerItemActive : {},
                ]}
              >
                <Icon icon='MaterialCommunityIcons' name={item.icon} size={24} style={[styles.icon, { color: theme.secondaryColor }]} />
                <Text style={[styles.drawerLabel, { color: theme.secondaryColor }]}>{t(item.label)}</Text>
                {item.submenus && (
                  <Icon
                    icon='MaterialCommunityIcons'
                    name={openMenu === item.label ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    style={styles.rightIcon}
                  />
                )}
              </Animated.View>
            </TouchableOpacity>

            {openMenu === item.label && item.submenus && (
              <Animated.View style={styles.submenuContainer}>
                {item.submenus.map((submenu, subIndex) => (
                  <TouchableOpacity
                    key={subIndex}
                    onPress={() => {
                      navigation.navigate(submenu?.screen)
                      triggerRefresh(submenu?.screen); // new
                    }

                    }
                    style={styles.submenuItem}
                  >
                    <View style={[styles.submenuIndicator, { backgroundColor: theme.primaryColor }]} />
                    <Text style={[styles.submenuLabel, { color: theme.secondaryColor }]}>{t(submenu.label)}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </View>
        );
      })}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    paddingVertical: 25,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 3,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDetails: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 16, fontWeight: '500', letterSpacing: 0.3 },
  userRole: { fontSize: 14, opacity: 0.8, marginTop: 2 },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  drawerItemActive: { backgroundColor: Colors.backgroundColor },
  icon: { marginRight: 20 },
  drawerLabel: { fontSize: 16, fontWeight: '600' },
  rightIcon: { marginLeft: 'auto' },
  submenuContainer: { paddingLeft: 40, backgroundColor: '#f9f9f9', borderRadius: 10, marginHorizontal: 10 },
  submenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingLeft: 10 },
  submenuIndicator: { width: 4, height: 20, marginRight: 10, borderRadius: 5 },
  submenuLabel: { fontSize: 16 },
});

export default CustomDrawerContent;
