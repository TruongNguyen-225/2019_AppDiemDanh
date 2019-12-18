import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import { createStackNavigator }  from 'react-navigation-stack'
import {  createDrawerNavigator } from 'react-navigation-drawer'
import {Dimensions,Image} from 'react-native';
import React from 'react';
import home from '../assets/icons/icons8-home-page-90.png';
import user from '../assets/icons/icons8-user-menu-male-100.png';
import iconsClass from '../assets/icons/icons8-numbered-list-100.png';
import HomeScreen from '../screens/Home/HomeScreen';

// AUTHENTICATION
import SignUp from '../screens/HandleAuthentication/SignUp';
import LogIn from '../screens/HandleAuthentication/LogIn';
import Loading from '../screens/HandleAuthentication/Loading';

//HANDLE CLASS
import CreateClass from '../screens/Class/CreateClass';
import ListStudent_On_Class from '../screens/Class/ListStudent_On_Class';
import FollowClass from '../screens/Class/FollowClass';
import Main from '../screens/HandleAuthentication/Main';
import Update_Manage_Class from '../screens/Class/Update_Manage_Class';
import ListStudentAttendance from '../screens/Class/ListStudentAttendance';
import InitClass from '../screens/Class/InitClass';
import ClassDone from '../screens/Class/ClassDone';
import QRcode from '../screens/Class/Attendance_handle/QRcode';
import ListCLass_DateTime from '../screens/Class/ListCLass_DateTime';
import ShowAllStudentWithResultSearch from '../screens/Class/ShowAllStudentWithResultSearch';
import Student_Profile from '../screens/Class/Student_Profile';
import My_Profile from '../screens/Update/My_Profile';
import Chart from '../screens/Class/Chart';
// SEARCH
import SearchScreen from '../screens/Search/SearchScreen';

//HANDLE RECOGNITION
import Camera from '../screens/Class/Attendance_handle/Camera';
import Screen_Handle from '../screens/Class/Attendance_handle/Screen_Handle';
 
//HANDLE INFORMATION
import Update_Info from '../screens/Update/Update_Info';
// import OpenDrawer from '../screens/Header/OpenDrawer';
export const AuthenticationStack = createStackNavigator (
  {
    LogIn,
    SignUp,
  },
  {
    initialRouteName: 'LogIn',
  }
);

export const RootStack = createStackNavigator (
  {
    HomeScreen,
    Update_Manage_Class,
    SearchScreen,
    CreateClass,
    FollowClass,
    ListStudent_On_Class,
    Screen_Handle,
    Camera,
    Main,
    Update_Info,
    InitClass,
    ClassDone,
    QRcode,
    ListStudentAttendance,
    ListCLass_DateTime,
    ShowAllStudentWithResultSearch,
    Student_Profile,
    My_Profile,
    Chart,
  },
  {
    initialRouteName: 'HomeScreen',
  }
);
export const StackLoading = createSwitchNavigator (
  {
    Loading: Loading,
    AuthenticationStack,
    RootStack,
  },
  {
    initialRouteName: 'Loading',
  }
);
export const StackManageInfo = createStackNavigator (
  {
    Main,
    Update_Info,
    Update_Manage_Class,
    My_Profile
  
  },
  {
    // initialRouteName: 'HomeScreen',
  }
);
export const StackSearch = createStackNavigator ({
  SearchScreen,
});

export const StackSearchBig = createSwitchNavigator ({
  RootStack,
  // StackManageClass,
  StackSearch,
  // StackManageInfo,
  
});
let RouteConfigs = {
  'Trang Chủ' : {
    screen: RootStack,
    navigationOptions: {drawerIcon: <Image 
			source = {home}
			style = {{ width: 26, height: 26, tintColor:'blue'}}>
	   </Image>  }
  },
  'Quản Lý Tài Khoản': {
    screen: StackManageInfo,
    navigationOptions: { drawerIcon: <Image 
    source = {user}
    style = {{ width: 26, height: 26, tintColor:'blue'}}>
   </Image>  }
  },
  'Quản Lý Lớp Học': {
    screen: Update_Manage_Class,
    navigationOptions: { drawerIcon: <Image 
      source = {iconsClass}
      style = {{ width: 26, height: 26, tintColor:'blue'}}>
     </Image>  }
  },
};
let DrawerNavigatorConfig = {
  unmountInactiveRoutes: true,
  drawerPosition: 'left',
  contentOptions: {
    activeTintColor: 'crimson',
  },
};
const drawera = createDrawerNavigator(RouteConfigs, DrawerNavigatorConfig);
//----------------Switch Navigation----------------------------------------
const SwithNav = createSwitchNavigator (
  {
    Loading,
    Auth: AuthenticationStack,
    App: drawera,
    StackSearchBig,
    
  },
  {
    initialRouteName: 'Loading',
  }
);
export const AppContainer = createAppContainer (SwithNav);
