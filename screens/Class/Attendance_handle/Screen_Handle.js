import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeModules,
  Alert,
  Image
} from 'react-native';
import firebase from 'react-native-firebase';
var ImagePicker = NativeModules.ImageCropPicker;

import Global from '../../../constants/global/Global';
import Tittle from '../../Header/Tittle';

import icons_add from '../../../assets/icons/icons_document.png';
import icons_qr from '../../../assets/icons/icons_qrCode.png';
import icons_picture from '../../../assets/icons/icons_picture.png';
import icons_checked from '../../../assets/icons/camera-circle-blue-128.png';
import icons_check from '../../../assets/icons/icon_check.png';

const { width: WIDTH } = Dimensions.get('window');
const { height: HEIGHT } = Dimensions.get('window');

var thoigian = new Date();
var date = thoigian.getDate();
var month = thoigian.getMonth() + 1;
var year = thoigian.getFullYear();
var datecurrent = year + '-' + month + '-' + date;

export default class CreateClass extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      images: null,
      listStudent: [],
      datecurrent: datecurrent,
      tittle: '',
      router: 'HomeScreen',
      className_Attendance: Global.tittle,
      value_Attdance: [],
      getDateTime: null,
      getTimeArray: 0,
    };
    const idType = this.props.navigation.state.params.thamso;
    Global.router = this.state.router;
    Global.tittle = idType.className;
    console.log('in ra className', this.state.className_Attendance)
  }
  checkGoToQrCode = () => {
var seconds = Date.now();
    
    const keyClass = this.props.navigation.state.params.keyClass;
    const idType = this.props.navigation.state.params.thamso;
    const { className_Attendance, timeCompare } = this.state;
    try {
      firebase.database().ref().child(`Manage_Class/${keyClass}/Attendance/${this.state.datecurrent}`)
        .orderByChild('className').equalTo({ className_Attendance }).once('value', childSnapshot => {
          const { value_Attdance, getTimeArray } = this.state;
          if (childSnapshot.exists()) {
            childSnapshot.forEach(doc => {
              value_Attdance.push({
                key: doc.key,
                className: doc.toJSON().className,
                datetime: doc.toJSON().datetime,
              });
            });
            if ((parseInt(value_Attdance[0].datetime) + 60000) < seconds) {
              this.props.navigation.navigate('QRcode', { thamso: idType, keyClass: keyClass })
            }
            else {
              Alert.alert(
                'Thông báo',
                `Bạn đã điểm danh lớp ${idType.className}, chức năng tạm thời bị vô hiệu hóa !`
              );
              this.props.navigation.navigate('Screen_Handle');
            }
          }
            this.props.navigation.navigate('QRcode', { thamso: idType, keyClass: keyClass })
          })
    } catch (e) {
      console.log('lỗi ở class Screen_Handle đây là ', e)
    }
  }
  pickSingleWithCamera(cropping, mediaType = 'photo') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    })
      .then(image => {
        console.log('received image', image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
          images: null,
        });
      })
      .catch(e => alert(e));
  }
  pickSingle(cropit, circular = false, mediaType = 'photo') {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      includeExif: true,
    })
      .then(image => {
        console.log('received image', image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
          images: null,
        });
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }
  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
    })
      .then(images => {
        this.setState({
          image: null,
          images: images.map(i => {
            console.log('received image', i);
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),
        });
      })
      .catch(e => alert(e));
  }

  onPressAdd = () => {
    if (this.state.newClassName.trim() === '') {
      alert('Tên của lớp không thể trống !');
      return;
    }
    try {
      system.push({
        className: this.state.newClassName,
      });
    } catch (e) {
      alert(e);
    }
  };
  onGoToDetail = () => {
    if (this.state.newClassName != '') {
      alert(this.state.newClassName);
      this.props.navigation.navigate('CLASS_DETAILS', {
        thamso: this.state.newClassName,
      });
    }
  };
  refesh() {
    this.setState({
      refesh: true,
    });
  }
  render() {
    const keyClass = this.props.navigation.state.params.keyClass;
    const idType = this.props.navigation.state.params.thamso;

    return (
      <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0 }}>
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
        <Tittle {...this.props} />
        <View style={styles.content}>
          <View style={styles.content_child}>
            <ScrollView>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                    onPress={() => this.props.navigation.navigate('ListStudent_On_Class', { keyClass: keyClass, thamso: idType })}
                  >
                    <View style={styles.styleImg}>
                      <Image source={icons_add} style={{ width: '80%', height: '80%', }} />
                    </View>
                    <View style={styles.viewLable}>
                      <Text style={{ fontSize: 15 }}>
                        Danh Sách Lớp
                    </Text>
                      <Text style={{ fontSize: 15 }}>

                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                    onPress={() => this.pickSingleWithCamera(false)}
                  >
                    <View style={styles.styleImg}>
                      <Image source={icons_checked} style={{ width: '80%', height: '80%' }} />
                    </View>
                    <View style={styles.viewLable}>
                      <Text style={{ fontSize: 15 }}>
                        Điểm Danh Với
                    </Text>
                      <Text style={{ fontSize: 15 }}>
                        Camera
                    </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                    // onPress={() => this.props.navigation.navigate('QRcode', { thamso: idType, keyClass: keyClass })}
                    onPress={this.checkGoToQrCode.bind(this)}
                  >
                    <View style={styles.styleImg}>
                      <Image source={icons_qr} style={{ width: '80%', height: '80%' }} />
                    </View>
                    <View style={styles.viewLable}>
                      <Text style={{ fontSize: 15 }}>
                        Điểm Danh Với
                    </Text>
                      <Text style={{ fontSize: 15 }}>
                        QR Code
                    </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                    // onPress={()=>this.props.navigation.navigate('NativeBase')}>
                    onPress={this.pickSingle.bind(this)}>
                    <View style={styles.styleImg}>
                      <Image source={icons_picture} style={{ width: '80%', height: '80%' }} />
                    </View>
                    <View style={styles.viewLable}>
                      <Text style={{ fontSize: 15 }}>
                        Điểm Danh Với
                    </Text>
                      <Text style={{ fontSize: 15 }}>
                        Hình Ảnh
                    </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                    onPress={() => this.props.navigation.navigate('ListStudentAttendance', { keyClass: keyClass, thamso: idType })}
                  >
                    <View style={styles.styleImg}>
                      <Image source={icons_check} style={{ width: '80%', height: '80%' }} />
                    </View>
                    <View style={styles.viewLable}>
                      <Text style={{ fontSize: 15 }}>
                        Danh Sách HS
                    </Text>
                      <Text style={{ fontSize: 15 }}>
                       Đã Điểm Danh
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                    onPress={() => this.props.navigation.navigate('')}
                  >
                    <View style={styles.styleImg}>
                      <Image source={icons_picture} style={{ width: '80%', height: '80%' }} />
                    </View>
                    <View style={styles.viewLable}>
                      <Text style={{ fontSize: 15 }}>
                        {/* Test Học Sinh */}
                    </Text>
                      <Text style={{ fontSize: 15 }}>
                        {/* Điểm Danh */}
                    </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(112, 119, 127, 0.3)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content_child: {
    width: WIDTH * 0.96,
    height: 'auto',
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginVertical: 7,
    justifyContent: 'center',
    borderRadius: 7,
  },
  child_row: {
    flexDirection: 'row',
    width: WIDTH * 0.9,
    height: 155,
    marginTop: HEIGHT * 0.04,
    justifyContent: 'center',

  },
  children: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2196f3',
    width: 150,
    height: 155,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: 'rgba(166,216,207, 0.5)',
  },
  styleTouch: {
    flex: 1,
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLable: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    height: 50,
  },
  styleImg: {
    height: 80,
    width: 80,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewHiden: {
    height: HEIGHT * 0.5,
    width: WIDTH,
    alignItems: 'center',
  },
  viewImg: {
    height: HEIGHT / 3 + 10,
    width: WIDTH - 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  follow: {
    height: 43,
    backgroundColor: '#039be5',
    borderColor: '#039be5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH * 0.35,
    marginHorizontal: 10,
    marginVertical: 15,
  },

});
