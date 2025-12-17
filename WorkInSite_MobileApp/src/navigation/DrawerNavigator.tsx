import React from 'react';
import RouteName from './RouteName';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import CustomDrawerContent from './CustomDrawerContent';
import { Dimensions } from 'react-native';
import NotificationScreen from '../screens/NotificationScreen/NotificationScreen';
import EditProfileScreen from '../screens/ProfileScreen/EditProfileScreen';
import UserListScreen from '../screens/Users/UserListScreen/UserListScreeen';
import UserCreationScreen from '../screens/Users/UserCreationScreen/UserCreationScreen';
import UserEditScreen from '../screens/Users/UserEditScreen/UserEditScreen';
import ChangePinScreen from '../screens/ProfileScreen/ChangePinScreen';
import ContactListScreen from '../screens/Contacts/ContactListScreen/ContactListScreen';
import ContactCreationScreen from '../screens/Contacts/ContactCreationScreen/ContactCreationScreen';
import ContactEditScreen from '../screens/Contacts/ContactEditScreen/ContactEditScreen';
import SupplierListScreen from '../screens/Suppliers/SupplierListScreen/SupplierListScreen';
import SupplierCreationScreen from '../screens/Suppliers/SupplierCreationScreen/SupplierCreationScreen';
import SupplierEditScreen from '../screens/Suppliers/SupplierEditScreen/SupplierEditScreen';
import WorkerListScreen from '../screens/Workers/WorkerListScreen/WorkerListScreen';
import WorkerCreationScreen from '../screens/Workers/WorkerCreationScreen/WorkerCreationScreen';
import WorkerEditScreen from '../screens/Workers/WorkerEditScreen/WorkerEditScreen';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import { WorkerCategoryCreationPage } from '../screens/Workers/WorkerCategoryCreationScreen/WorkerCategoryCreationPage';
import { WorkerCategoryEditPage } from '../screens/Workers/WorkerCategoryEditScreen/WorkerCategoryEditPage';
import { SiteCreationScreen } from '../screens/Sites/SiteCreationScreen/SiteCreationScreen';
import SiteEditScreen from '../screens/Sites/SiteEditScreen/SiteEditScreen';
import SiteListScreen from '../screens/Sites/SiteListScreen/SiteListScreen';
import ClientListScreen from '../screens/Clients/ClientListScreen/ClientListScreen';
import { ClientCreationScreen } from '../screens/Clients/ClientCreationScreen/ClientCreationScreen';
import ClientEditScreen from '../screens/Clients/ClientEditScreen/ClientEditScreen';
import WorkerCategoryListScreen from '../screens/Workers/WorkerCategoryListScreen/WorkerCategoryListScreen';
import AttendanceCreationScreen from '../screens/Attendance/AttendanceCreationScreen/AttendanceCreationScreen';
import AttendanceListScreen from '../screens/Attendance/AttendanceListScreen/AttendanceListScreen';
import AttendanceEditScreen from '../screens/Attendance/AttendanceEditScreen/AttendanceEditScreen';
import { MaterialCreationScreen } from '../screens/Materials/MaterialCreationScreen/MaterialCreationScreen';
import MaterialListScreen from '../screens/Materials/MaterialListScreen/MaterialListScreen';
import { MaterialEditScreen } from '../screens/Materials/MaterialEditScreen/MaterialEditScreen';
import { MaterialShiftCreationScreen } from '../screens/MaterialShift/MaterialShiftCreationScreen/MaterialShiftCreationScreen';
import { MaterialShiftEditScreen } from '../screens/MaterialShift/MaterialShiftEditScreen/MaterialShiftEditScreen';
import MaterialShiftListScreen from '../screens/MaterialShift/MaterialShiftListScreen/MaterialShiftListScreen';
import { MaterialUsedCreationScreen } from '../screens/MaterialUsed/MaterialUsedCreationScreen/MaterialUsedCreationScreen';
import { MaterialUsedEditScreen } from '../screens/MaterialUsed/MaterialusedEditScreen/MaterialUsedEditScreen';
import MaterialUsedListScreen from '../screens/MaterialUsed/MaterialUsedListScreen/MaterialUsedListScreen';
import { PurchaseCreationScreen } from '../screens/Purchase/PurchaseCreationScreen/PurchaseCreationScreen';
import { PurchaseEditScreen } from '../screens/Purchase/PurchaseEditScreen/PurchaseEditScreen';
import PurchaseListScreen from '../screens/Purchase/PurchaseListScreen/PurchaseListScreen';
import { UnitCreationScreen } from '../screens/Unit/UnitCreationScreen/UnitCreationScreen';
import ThemeSelectScreen from '../screens/ThemeSelectScreen/ThemeSelectScreen';
import ClientTransactionList from '../screens/Transaction/ClientTransaction/ClientTransactionList/ClientTransactionList';
import ClientTransactionCreation from '../screens/Transaction/ClientTransaction/ClientTransactionCreation/ClientTransactionCreation';
import ClientTransactionEdit from '../screens/Transaction/ClientTransaction/ClientTransactionEdit/ClientTransactionEdit';
import SupplierTransactionEdit from '../screens/Transaction/SupplierTransaction/SupplierTransactionEdit/SupplierTransactionEdit';
import SupplierTransactionCreation from '../screens/Transaction/SupplierTransaction/SupplierTransactionCreation/SupplierTransactionCreation';
import SupplierTransactionList from '../screens/Transaction/SupplierTransaction/SupplierTransactionList/SupplierTransactionList';
import WorkerTransactionList from '../screens/Transaction/workerTransaction/WorkerTransactionList/WorkerTransactionList';
import WorkerTransactionCreation from '../screens/Transaction/workerTransaction/WorkerTransactionCreation/WorkerTransactionCreation';
import WorkerTransactionEdit from '../screens/Transaction/workerTransaction/WorkerTransactionEdit/WorkerTransactionEdit';
import LanguageChangeScreen from '../screens/LanguageChangeScreen/LanguageChangeScreen';
import ForgotPinScreen from '../screens/Authantication/ForgotPinScreen';
import WelcomeScreen from '../screens/Authantication/WelcomeScreen';
import { WorkModeCreationScreen } from '../screens/WorkMode/WorkModeCreationScreen/WorkModeCreationScreen';
import { ShiftCreationScreen } from '../screens/Shift/ShiftCreationScreen/ShiftCreationScreen';
import WorkRateAbstractCreation from '../screens/WorkRateAbstract/WorkRateAbstractCreate/WorkRateAbstractCreate';
import WorkRateAbstractListScreen from '../screens/WorkRateAbstract/WorkRateAbstractList/WorkRateAbstractList';
import WorkRateAbstractEdit from '../screens/WorkRateAbstract/WorkRateAbstractEdit/WorkRateAbstractEdit';
import WorkerRoleCostEdit from '../screens/Workers/WorkerRoleCostEdit/WorkerRoleCostEdit';
import WorkerReportScreen from '../screens/Report/WorkerReport/WorkerReportScreen';
import WorkerReportDetails from '../screens/Report/WorkerReport/WorkerReportDetails/WorkerReportDetails';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import PageRole from '../screens/RolesAndRights/PageRole/PageRole';
import RolesScreen from '../screens/RolesAndRights/Role/Role';
import VerificationDoneScreen from '../screens/Authantication/VertificationDoneScreen';
import RegisterScreen from '../screens/Authantication/RegisterScreen/RegisterScreen';
import LoginScreen from '../screens/Authantication/LoginScreen/LoginScreen';
import VerifyOtpScreen from '../screens/Authantication/VerifyOtpScreen/VerifyOtpScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const screenWidth = Math.round(Dimensions.get('window').width);

  return (
    <Drawer.Navigator
      // initialRouteName="HomeTabs"
      initialRouteName={RouteName.SPLASH_SCREEN}
      drawerContent={props => <CustomDrawerContent {...props} />} // Custom Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          flex: 1,
          width: screenWidth - 100,
        },
      }}>
      <Drawer.Screen
        name={RouteName.SPLASH_SCREEN}
        component={SplashScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.Home_SCREEN}
        component={BottomTabNavigator}
      // options={{ title: 'WorkInSite' }}
      />
      <Drawer.Screen
        name={RouteName.WELCOME_SCREEN}
        component={WelcomeScreen}
        options={{ swipeEnabled: false }} />
      <Drawer.Screen
        name={RouteName.LOGIN_SCREEN}
        component={LoginScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.REGISTER_SCREEN}
        component={RegisterScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen name={RouteName.FORGOT_PIN_SCREEN} component={ForgotPinScreen} options={{ swipeEnabled: false }} />
      <Drawer.Screen name={RouteName.VERIFY_OTP_SCREEN}  component={VerifyOtpScreen as React.ComponentType<any>} options={{ swipeEnabled: false }} />
       <Drawer.Screen name={RouteName.VERIFICATION_DONE_SCREEN} component={VerificationDoneScreen} options={{ swipeEnabled: false }} />
      <Drawer.Screen name={RouteName.USER_LIST_SCREEN} component={UserListScreen} />
      <Drawer.Screen
        name={RouteName.USER_CREATION_SCREEN}
        component={UserCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.USER_EDIT_SCREEN}
        component={UserEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.CONTACT_LIST_SCREEN}
        component={ContactListScreen}
      />
      <Drawer.Screen
        name={RouteName.CONTACT_CREATION_SCREEN}
        component={ContactCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.CONTACT_EDIT_SCREEN}
        component={ContactEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.CLIENT_LIST_SCREEN}
        component={ClientListScreen}
      />
      <Drawer.Screen
        name={RouteName.CLIENT_CREATION_SCREEN}
        component={ClientCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.CLIENT_EDIT_SCREEN}
        component={ClientEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.SITE_CREATION_SCREEN}
        component={SiteCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.SITE_EDIT_SCREEN}
        component={SiteEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.SITE_LIST_SCREEN}
        component={SiteListScreen}
      />
      <Drawer.Screen
        name={RouteName.WORKER_LIST_SCREEN}
        component={WorkerListScreen}
      />
      <Drawer.Screen
        name={RouteName.WORKER_CREATION_SCREEN}
        component={WorkerCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.WORKER_EDIT_SCREEN}
        component={WorkerEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.WORKER_CATEGORY_LIST_SCREEN}
        component={WorkerCategoryListScreen}
      />
      <Drawer.Screen
        name={RouteName.WORKER_CATEGORY_CREATION_SCREEN}
        component={WorkerCategoryCreationPage}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.WORKER_CATEGORY_EDIT_SCREEN}
        component={WorkerCategoryEditPage}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.WORK_RATE_ABSTRACT_LIST}
        component={WorkRateAbstractListScreen}
      />
      <Drawer.Screen
        name={RouteName.WORK_RATE_ABSTRACT_CREATION}
        component={WorkRateAbstractCreation}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.WORK_RATE_ABSTRACT_EDIT}
        component={WorkRateAbstractEdit}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.SUPPLIER_LIST_SCREEN}
        component={SupplierListScreen}
      />
      <Drawer.Screen
        name={RouteName.SUPPLIER_CREATION_SCREEN}
        component={SupplierCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.SUPPLIER_EDIT_SCREEN}
        component={SupplierEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.MATERIAL_LIST_SCREEN}
        component={MaterialListScreen}
      />
      <Drawer.Screen
        name={RouteName.MATERIAL_CREATION_SCREEN}
        component={MaterialCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.MATERIAL_EDIT_SCREEN}
        component={MaterialEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.UNIT_CREATION_SCREEN}
        component={UnitCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.WORK_MODE_CREATION_SCREEN}
        component={WorkModeCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.SHIFT_CREATION_SCREEN}
        component={ShiftCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.PURCHASE_LIST_SCREEN}
        component={PurchaseListScreen}
      />
      <Drawer.Screen
        name={RouteName.PURCHASE_CREATION_SCREEN}
        component={PurchaseCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.PURCHASE_EDIT_SCREEN}
        component={PurchaseEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.MATERIALUSED_LIST_SCREEN}
        component={MaterialUsedListScreen}
      />
      <Drawer.Screen
        name={RouteName.MATERIALUSED_CREATION_SCREEN}
        component={MaterialUsedCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.MATERIALUSED_EDIT_SCREEN}
        component={MaterialUsedEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.MATERIALSHIFT_LIST_SCREEN}
        component={MaterialShiftListScreen}
      />
      <Drawer.Screen
        name={RouteName.MATERIALSHIFT_CREATION_SCREEN}
        component={MaterialShiftCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name={RouteName.MATERIALSHIFT_EDIT_SCREEN}
        component={MaterialShiftEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen name={RouteName.ATTENDANCE_LIST_SCREEN}
        component={AttendanceListScreen} />
      <Drawer.Screen name={RouteName.ATTENDANCE_CREATION_SCREEN}
        component={AttendanceCreationScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen name={RouteName.ATTENDANCE_EDIT_SCREEN}
        component={AttendanceEditScreen}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen name={RouteName.CLIENT_TRANSACTION_LIST_SCEEN}
        component={ClientTransactionList} />
      <Drawer.Screen name={RouteName.CLIENT_TRANSACTION_CREATION_SCEEN}
        component={ClientTransactionCreation}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen name={RouteName.CLIENT_TRANSACTION_EDIT_SCEEN}
        component={ClientTransactionEdit}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen name={RouteName.SUPPLIER_TRANSACTION_LIST_SCEEN}
        component={SupplierTransactionList} />
      <Drawer.Screen name={RouteName.SUPPLIER_TRANSACTION_CREATION_SCEEN}
        component={SupplierTransactionCreation}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen name={RouteName.PROFILE_SCREEN} component={ProfileScreen} />
      <Drawer.Screen name={RouteName.SUPPLIER_TRANSACTION_EDIT_SCEEN} component={SupplierTransactionEdit} options={{ swipeEnabled: false }} />
      <Drawer.Screen name={RouteName.WORKER_REPORT_SCREEN} options={{ swipeEnabled: false }} component={WorkerReportScreen} />
      <Drawer.Screen name={RouteName.WORKER_REPORT_DETAILS_SCREEN} options={{ swipeEnabled: false }} component={WorkerReportDetails} />
      <Drawer.Screen name={RouteName.WORKER_TRANSACTION_LIST_SCEEN} options={{ swipeEnabled: false }} component={WorkerTransactionList} />
      <Drawer.Screen name={RouteName.WORKER_TRANSACTION_CREATION_SCEEN} component={WorkerTransactionCreation} options={{ swipeEnabled: false }} />
      <Drawer.Screen name={RouteName.WORKER_TRANSACTION_EDIT_SCEEN} component={WorkerTransactionEdit} options={{ swipeEnabled: false }} />
      <Drawer.Screen name={RouteName.WORKER_ROLE_COST_EDIT} options={{ swipeEnabled: false }} component={WorkerRoleCostEdit} />
      <Drawer.Screen name="LanguageChangeScreen" options={{ swipeEnabled: false }} component={LanguageChangeScreen} />
      <Drawer.Screen name="NotificationScreen" options={{ swipeEnabled: false }} component={NotificationScreen} />
      <Drawer.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ swipeEnabled: false }} />
      <Drawer.Screen name="ChangePinScreen" options={{ swipeEnabled: false }} component={ChangePinScreen} />
      <Drawer.Screen name="ThemeSelectScreen" options={{ swipeEnabled: false }} component={ThemeSelectScreen} />
      <Drawer.Screen name={RouteName.ROLES_SCREEN} options={{ swipeEnabled: false }} component={RolesScreen} />
      <Drawer.Screen name={RouteName.PAGE_ROLE_SCREEN} options={{ swipeEnabled: false }} component={PageRole} />

    </Drawer.Navigator>
  );
}
