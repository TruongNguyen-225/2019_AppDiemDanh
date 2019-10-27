import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

//gui du lieu
export const setItemToAsyncStorage1 = async (item, value) => {
  const currentScreen = await AsyncStorage.setItem (item, value);
};
//lay du lieu
export const getItemFromAsyncStorage = async item => {
  var temp, realItem;
  try {
    temp = await AsyncStorage.getItem (item).then (temp => {
      realItem = temp;
    });
  } catch (error) {
    alert (error);
  }
  return realItem;
};

export const getStatusColor = status => {
  if (status === 'Đang chờ xử lý') return 'orange';
  else if (status === 'Đã xử lý') return '#4CC417';
  else return 'red';
};
//neu chuoi nhap vao qua dai thi cat lam 2 va thanh ...
export const replaceHalfString = str => {
  const position = Math.floor (str.length / 3);
  return str.slice (0, position) + '...';
};

export const returnE = str => {
  if (str === 'Vi phạm') return 'violation';
  if (str === 'Xử lý') return 'status';
};
// set du lieu thanh chuoi JSON roi gui len
export const setItemToAsyncStorage = async (item, value) => {
  await AsyncStorage.setItem (item, JSON.stringify (value));
  console.log('set async thành công')
};
