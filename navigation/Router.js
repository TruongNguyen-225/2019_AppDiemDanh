import {
  // createStackNavigator,
  createAppContainer,
  // createDrawerNavigator,
  createBottomTabNavigator,
  DrawerNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import { createStackNavigator }  from 'react-navigation-stack'
import {  createDrawerNavigator } from 'react-navigation-drawer'
import {Dimensions,Image} from 'react-native';
import React from 'react';


import home from '../assets/icons/icons8-home-page-90.png';
import user from '../assets/icons/icons8-user-menu-male-100.png';
import iconsClass from '../assets/icons/icons8-numbered-list-100.png';

import HomeScreen from '../screens/Home/HomeScreen1';
// import CheckWelcome from '../screens/Home/CheckWelcome';

// AUTHENTICATION
import SignUp from '../screens/HandleAuthentication/SignUp';
import LogIn from '../screens/HandleAuthentication/LogIn';
import Loading from '../screens/HandleAuthentication/Loading';

//HANDLE CLASS
import CreateClass from '../screens/Class/CreateClass';
import Attendance from '../screens/Class/Attendance';
import Detail_Class from '../screens/Class/Detail_Class';
import FollowClass from '../screens/Class/FollowClass';
import ListClass from '../screens/Class/ListClass';
import Main from '../screens/HandleAuthentication/Main';
import Update_Manage_Class from '../screens/Class/Update_Manage_Class';
import ListStudentAttendance from '../screens/Class/ListStudentAttendance';
import InitClass from '../screens/Class/InitClass';
import ClassDone from '../screens/Class/ClassDone';
import QRcode from '../screens/Class/Attendance_handle/QRcode';
import StudentAttendance from '../screens/Class/Attendance_handle/StudentAttendance';
import DownloadExcel from '../screens/Class/DownloadExcel';
import ListCLass_DateTime from '../screens/Class/ListCLass_DateTime';
import ShowAllStudentWithResultSearch from '../screens/Class/ShowAllStudentWithResultSearch';
import My_Profile from '../screens/Class/My_Profile';

// SEARCH
import SearchScreen from '../screens/Search/SearchScreen';

//HANDLE RECOGNITION
import Camera from '../screens/Class/Attendance_handle/Camera';
import Screen_Handle from '../screens/Class/Attendance_handle/Screen_Handle';
 
//HANDLE INFORMATION
import Update_Info from '../screens/Update/Update_Info';
import OpenDrawer from '../screens/Header/OpenDrawer';


// import OpenDrawer from '../screens/Home/HomeScreen';
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
    Detail_Class,
    FollowClass,
    ListClass,
    Attendance,
    Screen_Handle,
    Camera,
    Main,
    Update_Info,
    StudentAttendance,
    InitClass,
    ClassDone,
    QRcode,
    ListStudentAttendance,
    DownloadExcel, 
    ListCLass_DateTime,
    ShowAllStudentWithResultSearch,
    My_Profile,
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
// export const StackManageClass = createStackNavigator (
//   {
//     CreateClass,
//     Detail_Class,
//     FollowClass,
//     ListClass,
//     Attendance,
//     Screen_Handle,
//     Camera,
//     OpenDrawer,
    
    
//   },
//   {
//     // initialRouteName: 'HomeScreen',
//   }
// );
export const StackManageInfo = createStackNavigator (
  {
    Main,
    Update_Info,
    Update_Manage_Class,
    // HomeScreen,
  
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
  //drawerWidth : screenWidth /2,
  drawerPosition: 'left',
  contentOptions: {
    activeTintColor: 'crimson',
  },
  //order: [Welcome, Login, TrangChu, UpLoadImg, Basic, Todo, DBCom]
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
