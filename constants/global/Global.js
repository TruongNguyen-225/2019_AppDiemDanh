import AsyncStorage from '@react-native-community/async-storage';

export const setItemToAsyncStorage = async (item, value) => {
  await AsyncStorage.setItem (item, JSON.stringify (value));
};

export const saveStateWelcome = async (item, value) => {
  await AsyncStorage.setItem (item, value);
};
export var stateWelcome = false;
module.exports ={
  // addProductToCart : null,
  // onSignIn: null,    // tạm gọi biến này là null nghĩa là chưa sign in  , sau đó import ở menuDrawer
  // arraySearch : null,
  show_Main_App:null,
  show_Main:null,
  tittle :null,
  router:null,
  imgHeight:400,
  imgWidth:500,
  arrayClass: null,
  siso : null,
  chuathamgia:null,
  dathamgia: null,
  listClassJoined:null,
  getKeyClassDone_Pass_Attendance:null,
};