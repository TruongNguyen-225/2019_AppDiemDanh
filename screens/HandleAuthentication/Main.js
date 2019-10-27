import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Tittle from '../Header/Tittle';
import Global from '../../constants/global/Global';

import icons_logout from '../../assets/icons/icons8-shutdown-96.png';
import settings from '../../assets/icons/icons8-settings-96.png';
import history from '../../assets/icons/icons8-order-history-96.png';
import profile from '../../assets/icons/icons8-contact-details-96.png';
import delete_icons from '../../assets/icons/icons8-denied-96.png';
import gif from '../../assets/icons/giphy.gif';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

const Header_Maximum_Height = 270;
const Header_Minimum_Height = 50;

const RootRef = firebase.database ().ref ().child ('member');

export default class Main extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {currentUser: null};
  constructor () {
    super ();
    this.AnimatedHeaderValue = new Animated.Value (0);
    this.state = {
      userData: {},
      tittle: 'TRANG CÁ NHÂN',
      router:'HomeScreen'
    };
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;

  }
  getUserData = async () => {
    await AsyncStorage.getItem ('userData').then (value => {
      const userData = JSON.parse (value);
      this.setState ({userData: userData});
      console.log('db',this.state.userData)
    });
  };
  componentDidMount () {
    const {currentUser} = firebase.auth ();
    this.setState ({currentUser});
    this.getUserData ();
    // this.alert;
    // Alert.alert ('Thông báo', 'Xóa tài khoản thành công !');
  }
  alert = async () => {
    Alert.alert (
      'Alert Title',
      'My Alert Msg',
      [
        {
          text: 'Ask me later',
          onPress: () => console.log ('Ask me later pressed'),
        },
        {
          text: 'Cancel',
          onPress: () => console.log ('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log ('OK Pressed')},
      ],
      {cancelable: false}
    );
  };
  onSuccess = () => {
    Alert.alert (
      'Notice',
      'Bạn chắc chắn muốn đăng xuất ?',
      [
        {
          text: 'Cancle',
          onPress: () => {
            this.props.navigation.navigate ('Main');
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.onLogOut ();
          },
        },
      ],
      {cancelable: true}
    );
  };
  async onLogOut () {

    await AsyncStorage.clear ();
    Alert.alert(this.state.userData.enail);
    this.props.navigation.navigate ('LogIn');
  }

  onDeleteAlert = () => {
    Alert.alert (
      'Notice',
      'Bạn chắc chắn muốn xóa tài khoản ?',
      [
        {
          text: 'Cancle',
          onPress: () => {
            this.props.navigation.navigate ('Main');
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.deleteUser();
          },
        },
      ],
      {cancelable: true}
    );
  };

 async deleteUser () {
  await  firebase
      .auth ()
      .currentUser.delete ()
      .then (async () => {
        await RootRef.orderByChild ('id')
          .equalTo (this.state.userData.id)
          .on ('child_added', data => {
            data.key;
            RootRef.child (data.key).remove ();
          });
        await AsyncStorage.clear ();
        this.props.navigation.navigate ('LogIn');
        console.log('Thông Báo !',' Đã xóa tài khoản thành công.')

      })
      .then(
        Alert.alert('Thông Báo !',' Đã xóa tài khoản thành công.')
      )
      .catch (error => {
       console.log (`${error.toString ().replace ('Error: ', '')}`);
      });
  }
  render () {
    const {currentUser} = this.state;
    const AnimateHeaderBackgroundColor = this.AnimatedHeaderValue.interpolate ({
      inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
      outputRange: ['#03a9f4', '#00BCD4'],
      extrapolate: 'clamp',
    });

    const AnimateHeaderHeight = this.AnimatedHeaderValue.interpolate ({
      inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
      outputRange: [Header_Maximum_Height, Header_Minimum_Height],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.MainContainer}>
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />

        <Tittle {...this.props} />
<Animated.View
          style={[
            styles.Header,
            {
              height: AnimateHeaderHeight,
              backgroundColor: AnimateHeaderBackgroundColor,
            },
          ]}
        >
          {/* <Text style={styles.HeaderInsideText}>
            {currentUser && currentUser.email}
          </Text> */}
          <Text style={styles.HeaderInsideText}>
            {this.state.userData.email}
          </Text>
          <Image
            source={gif}
            style={{
              height: 270,
              width: WIDTH,
              position: 'absolute',
              opacity: 0.75,
            }}
          />
        </Animated.View>
        <ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{paddingTop: Header_Maximum_Height}}
          onScroll={Animated.event ([
            {nativeEvent: {contentOffset: {y: this.AnimatedHeaderValue}}},
          ])}
        >
          <View>
            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate ('Update_Info')}
              >
                <View style={styles.rowCreateClass}>
                  <View style={styles.viewImgIcon}>
                    <Image source={profile} style={{height: 40, width: 40}} />
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.textDirector}>
                      Cập Nhật Thông Tin
                    </Text>
                    <View style={{top: 2 * (HEIGHT / 10)}} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate('ListClass')}>
                <View style={styles.rowCreateClass}>
                  <View style={styles.viewImgIcon}>
                    <Image source={settings} style={{height: 40, width: 40}} />
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.textDirector}>
                      Gia Nhập Lớp Học
                    </Text>
                    <View style={{top: 2 * (HEIGHT / 10)}} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity 
              onPress={()=> this.props.navigation.navigate('ShowStudentJoin')}
              >
                <View style={styles.rowCreateClass}>
                  <View style={styles.viewImgIcon}>
                    <Image source={history} style={{height: 40, width: 40}} />
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.textDirector}>
                     Danh Sách Lớp Đã Tham Gia
                    </Text>
                    <View style={{top: 2 * (HEIGHT / 10)}} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={this.onSuccess}>
                <View style={styles.rowCreateClass}>
                  <View style={styles.viewImgIcon}>
                    <Image
                      source={icons_logout}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.textDirector}>
                      Đăng Xuất
                    </Text>
                    <View style={{top: 2 * (HEIGHT / 10)}} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={this.onDeleteAlert}>
                <View style={[styles.rowCreateClass, styles.colorView]}>
                  <View style={styles.viewImgIcon}>
                    <Image
                      source={delete_icons}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.textDirector}>
                      Xóa Tài Khoản
                    </Text>
                    <View style={{top: 2 * (HEIGHT / 10)}} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  MainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
  styleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  rowAbout: {
    height: HEIGHT / 20,
    width: 100,
    backgroundColor: '#03a9f4',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  header: {
    height: HEIGHT / 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    width: WIDTH,
  },
  viewTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: WIDTH,
    height: HEIGHT / 5,
  },
  avt: {
    width: 100,
    height: 100,
    borderColor: 'red',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 50,
  },
  username: {
    width: WIDTH - WIDTH * 0.3 - 20,
    fontSize: 22,
    color: 'black',
  },
  list: {
    paddingVertical: 20,
    backgroundColor: '#f1f1f1',
    paddingLeft: 10,
  },
  rowCreateClass: {
    flexDirection: 'row',
    height: HEIGHT / 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingLeft: 20,
    backgroundColor: '#f1f1f1',
  },
  viewImgIcon: {
    justifyContent: 'center',
  },
  viewText: {
    height: HEIGHT / 10,
    justifyContent: 'center',
  },
  textDirector: {
    fontSize: 15,
    fontWeight: 'normal',
    margin: 10,
    paddingLeft: 10,
    position: 'absolute',
  },
  Header: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: Platform.OS == 'ios' ? 20 : 0,
    marginTop: HEIGHT / 20,
  },

  HeaderInsideText: {
    color: '#bb002f',
    fontSize: 21,
    textAlign: 'center',
    top: 50,
    zIndex: 2,
    position: 'relative',
  },

  TextViewStyle: {
    textAlign: 'center',
    color: '#000',
    fontSize: 18,
    margin: 5,
    padding: 7,
  },
  colorView: {
    backgroundColor: '#cb9ca1',
  },
});
