import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
// import ScrollableTabView, {
//   DefaultTabBar,
// } from 'react-native-scrollable-tab-view';
import OpenDrawer from '../Header/OpenDrawer';
import Search_TextInput from '../Header/Search_TextInput';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Global from '../../constants/global/Global';
import OfflineNotice from '../Header/OfflineNotice';
import Swipeout from 'react-native-swipeout';

import icons_add from '../../assets/icons/icon_plus_big.png';
import icons_list from '../../assets/icons/icon_list.png';
import school from '../../assets/icons/school.png';
import left from '../../assets/icons/left.png';
import addClass from '../../assets/images/btnCreateClass.png';
import classLoading from '../../assets/images/btnDangXuLy.png';
const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

var system = firebase.database ().ref ().child ('Manage_Class');

class FlatListItem extends Component {
  constructor (props) {
    super (props);
    this.state = {
      activeRowKey: null,
      listStudent: [],
      textFail: '',
    };
  }
  componentDidMount () {
    this.getListStudent ();
  }
  getListStudent () {
    var rootRef = firebase.database ().ref ();
    var urlRef = rootRef.child ('Manage_Class/' + this.props.item.key);
    urlRef.once ('value', childSnapshot => {
      if (childSnapshot.exists ()) {
        const listStudent = [];
        childSnapshot.forEach (doc => {
          var stt=0;
          if (typeof doc.toJSON().email!= 'undefined') {
            stt=1;
          }
          if (stt==1)
          {
            listStudent.push ({
              email: doc.toJSON ().email,
              MSSV: doc.toJSON ().MSSV,
              id: doc.toJSON ().id,
            });
          }
        });
        this.setState ({
          listStudent: listStudent.sort ((a, b) => {
            return a.className < b.className;
          }),
        });
        console.log ('kết quả ', this.state.listStudent);
      }
    });
  }
  showInfoClass(){
    alert("chưa làm kịp :v")
  }
  render () {
    const swipeSettings = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {
        if (this.state.activeRowKey != null) {
          this.setState ({activeRowKey: null});
        }
      },
      onOpen: (secId, rowId, direction) => {
        this.setState ({activeRowKey: this.props.item.key});
      },
      right: [
        {
          onPress: () => {
          this.props.navigation.navigate('Update_Manage_Class',{thamso:this.props.item})
          },
          text: 'Chỉnh Sửa TT Lớp',
          type: 'primary',
        },
        {
          onPress: () => {
            const deletingRow = this.state.activeRowKey;
            Alert.alert (
              'Alert',
              'Are you sure you want to delete ?',
              [
                {
                  text: 'No',
                  onPress: () => console.log ('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    system
                      .orderByChild ('_id')
                      .equalTo (this.props.item._id)
                      .on ('child_added', data => {
                        data.key;
                        system.child (data.key).remove ();
                      });
                  },
                },
              ],
              {cancelable: true}
            );
          },
          text: 'Xóa Lớp',
          type: 'delete',
        },
        
      ],
      rowId: this.props.index,
      sectionId: 1,
    };

    return (
      <Swipeout {...swipeSettings}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'mediumseagreen',
          }}
        >
          <TouchableOpacity
            style={style.viewFlatList}
            onPress={async () => {
              await this.props.navigation.navigate ('FollowClass', {
                listStudent: this.state.listStudent,
                thamso: this.props.item,
              });
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <Image source={school} style={{width: 50, height: 50}} />
              <View style={{justifyContent: 'flex-start', width: WIDTH * 0.6}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'normal',
                    paddingLeft: 25,
                  }}
                >
                  {this.props.item.className}
                </Text>
              </View>
              <Image
                source={left}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#333',
                  marginRight: 25,
                }}
              />
            </View>

          </TouchableOpacity>
        </View>
      </Swipeout>
    );
  }
}
const style = StyleSheet.create ({
  flatListItem: {
    color: 'white',
    padding: 10,
    fontSize: 16,
  },
  viewFlatList: {
    flexDirection: 'row',
    height: HEIGHT / 9,
    backgroundColor: '#fff',
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    width: WIDTH,
    paddingLeft: 30,
    alignItems: 'center',
  },
});

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super (props);
    this.state = {
      userData: {},
      show: false,
      class: [],
      newClassName: '',
      loading: false,
      status: false,
      className: '',
      class: '',
      subject: '',
      path: '',
      count: '',
      teacher: '',
      member: null,
      activeRowKey: null,
      closeClass:true,
      classClosed:[],
      resultFail:false,
      show: false,
    };
    Global.arrayClass = this.state.class;
  }
  async componentDidMount () {
    Global.router = this.state.router;
    this.getUserData ();
    const {currentUser} = firebase.auth ();
    this.setState ({currentUser});
    await system.orderByChild('status').equalTo(this.state.status)
    .on ('value', childSnapshot => {
      const classRoom = [];
      if (childSnapshot.exists ()) {
        childSnapshot.forEach (doc => {
          classRoom.push ({
                key: doc.key,
          status: doc.toJSON ().status,
          _id: doc.toJSON ()._id,
          className: doc.toJSON ().className,
          class: doc.toJSON ().class,
          subject: doc.toJSON ().subject,
          count: doc.toJSON ().count,
          teacher: doc.toJSON ().teacher,
          student_join: this.state.student_join,
          });
        });
        this.setState ({
          class: classRoom.sort ((a, b) => {
            return a.className < b.className;
          }),
          count: this.state.class.length,
          txtSearch: '',
        });
      } else {
        classRoom.push ({
          textFail: 'Hiện tại chưa có lớp học nào , hãy tạo lớp mới để bắt đầu !',
        });
        this.setState ({
          resultFail: true,
          txtSearch: '',
        });
      }
      console.log ('classRoom ', this.state.class);
      
    });

    await system
    .orderByChild ('status')
    .equalTo (this.state.closeClass)
    .on ('value', childSnapshot => {
      const classClosed = [];
      if (childSnapshot.exists ()) {
        childSnapshot.forEach (doc => {
          classClosed.push ({
            className: doc.toJSON ().className,
            id: doc.toJSON ()._id,
          });
        });
        this.setState ({
          classClosed: classClosed.sort ((a, b) => {
            return a.className < b.className;
          }),
          count: this.state.class.length,
          txtSearch: '',
        });
      } else {
        classClosed.push ({
          textFail: 'Hiện tại chưa có lớp học nào được chốt , vui lòng theo dõi lớp học đang xử lý và chốt nếu đủ lượng học sinh tham gia lớp !',
        });
        this.setState ({
          resultFail: true,
          txtSearch: '',
        });
      }
    });
  }
  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState ({show: false});
    } else {
      this.setState ({show: true});
    }
  };
  getUserData = async () => {
    await AsyncStorage.getItem ('userData').then (value => {
      const userData = JSON.parse (value);
      this.setState ({userData: userData});
    });
  };
  onSetState = () => {
    alert ('hahah');
  };
  onPressAdd = () => {
    var className = this.state.newClassName
      .concat (' - ')
      .concat (this.state.subject)
      .toUpperCase ();
    var checkRegExp = /^[0-9]*$/;
    if (
      this.state.newClassName.trim () === '' ||
      this.state.subject.trim () === '' ||
      this.state.count.trim () === ''
    ) {
      Alert.alert ('Lỗi', 'Các trường phải được điền đầy đủ !');
      return;
    } else if (checkRegExp.test (this.state.count) == false) {
      Alert.alert ('Lỗi', 'Sĩ số không đúng định dạng  !');
      return;
    }
    try {
      system
        .orderByChild ('className')
        .equalTo (
          this.state.newClassName
            .concat (' - ')
            .concat (this.state.subject)
            .toUpperCase ()
        )
        .once ('value', snapshot => {
          if (snapshot.exists ()) {
            Alert.alert (
              'Thông báo',
              'Lớp học này đã tồn tại , hãy kiểm tra lại !'
            );
          } else {
            // var pathKey = system.push().key
            system
              .push ({
                _id: require ('random-string') ({length: 10}),
                status: this.state.status,
                class: this.state.newClassName,
                subject: this.state.subject,
                className: className,
                count: this.state.count,
                gmail_teacher: this.state.currentUser.email,
                teacher: this.state.userData.fullName,
                member: this.state.member,
              })
              // console.log('lopws hojc mowi dc tao cos path la :',pathClass)
              .then (
                this.setState ({
                  count: '',
                  subject: '',
                  newClassName: '',
                })
              );
          }
        });
    } catch (e) {
      alert (e);
    }
  };
  onGoToSearch () {
    () => this.props.navigation.navigate ('Search');
  }
  render () {
    const viewFlatList = (
      <FlatList
        data={this.state.classClosed}
        // numColumns={5}
        renderItem={({item, index}) => {
          return (
            <TouchableHighlight
              style={styles.viewFlatList}
              // onPress={() => this.props.navigation.navigate ('FollowClass')}
              onPress={async () => {
                await this.props.navigation.navigate ('FollowClass', {
                  listStudent: this.state.listStudent,
                  thamso: this.props.item,
                });
              }}
              // onPress={() => {this.props.navigation.navigate ('Screen_Handle',{thamso:item})}}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={school} style={{width: 50, height: 50}} />
                <View style={{paddingLeft: 20}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'normal',
                    }}
                  >
                    {item.className}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          );
        }}
        keyExtractor={(item, id) => item.id}
      />  
    );
    const viewResult = this.state.show ? viewFlatList : null;
    return (
      <View style={{flex: 1}}>
        <OfflineNotice style={{flex: 1}} />
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
        <View style={{flexDirection: 'row'}}>
          <OpenDrawer {...this.props} />
          <Search_TextInput
            // {...this.props}
            onGoToSearch={() => this.props.navigation.navigate ('SearchScreen')}
          />
        </View>
        <View style={styles.viewCreateClass}>
          <TextInput
            style={styles.viewTextInput}
            keyboardType="default"
            placeholderTextColor="black"
            placeholder="Nhập tên lớp học"
            autoCapitalize="none"
            onChangeText={text => {
              this.setState ({newClassName: text});
            }}
            value={this.state.newClassName}
          />
          <View
            style={{marginRight: 10, width: 42, height: 42}}
            underlayColor="tomato"
          >
            <Text />
          </View>
        </View>
        <View style={styles.viewCreateClass}>
          <TextInput
            style={styles.viewTextInput}
            keyboardType="default"
            placeholderTextColor="black"
            placeholder="Nhập tên môn học"
            autoCapitalize="none"
            onChangeText={text => {
              this.setState ({subject: text});
            }}
            value={this.state.subject}
          />
          <View
            style={{marginRight: 10, width: 42, height: 42}}
            underlayColor="tomato"
          >
            <Text />
          </View>
        </View>
        <View style={styles.viewCreateClass}>
          <TextInput
            style={styles.viewTextInput}
            keyboardType="default"
            placeholderTextColor="black"
            placeholder="Nhập sĩ số lớp học"
            autoCapitalize="none"
            onChangeText={text => {
              this.setState ({count: text});
            }}
            value={this.state.count}
          />
          <TouchableOpacity
            style={{marginRight: 10}}
            underlayColor="tomato"
            onPress={this.onPressAdd}
          >
            <Image style={{width: 42, height: 42}} source={icons_add} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.ShowHideComponent}>
            <View style={styles.rowCreateClass}>
              <View style={styles.viewImgIcon}>
                <Image source={icons_list} style={{height: 45, width: 45}} />
              </View>
              <View style={styles.viewText}>
                <Text style={styles.textDirector}>
                  Danh Sách Lớp Đã Chốt
                </Text>
                <View style={{top: 2 * (HEIGHT / 10)}} />
              </View>
            </View>
          </TouchableOpacity>
          {viewResult}
        </View>
        <View>
          <TouchableOpacity>
            <View style={styles.rowCreateClass}>
              <View style={styles.viewImgIcon}>
                <Image source={icons_list} style={{height: 45, width: 45}} />
              </View>
              <View style={styles.viewText}>
                <Text style={styles.textDirector}>
                  Danh Sách Lớp Đang Đợi
                </Text>
                <View style={{top: 2 * (HEIGHT / 10)}} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.class}
          renderItem={({item, index}) => {
            return (
              <FlatListItem
                item={item}
                index={index}
                parentFlatList={this}
                {...this.props}
              />
            );
          }}
          keyExtractor={(item, id) => item.id}
        />
        {/* <ScrollableTabView
          initialPage={0}     
          renderTabBar={() => <DefaultTabBar backgroundColor="#f1f1f1" />}
        >
          <View tabLabel="Các Lớp Hiện Có">
           {viewResultClassClosed}
          </View>
          <View tabLabel="Lớp Đang Xử Lý">
            {viewResult}
          </View>
        </ScrollableTabView> */}
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  viewFlatList: {
    flexDirection: 'row',
    height: HEIGHT / 9,
    backgroundColor: '#fff',
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    width: WIDTH,
    paddingLeft: 30,
    alignItems: 'center',
  },
  viewCreateClass: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 64,
  },
  viewTextInput: {
    height: 40,
    width: 250,
    margin: 10,
    padding: 10,
    borderColor: 'green',
    borderWidth: 1,
  },

  rowCreateClass: {
    flexDirection: 'row',
    height: HEIGHT / 11,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingLeft: 20,
    backgroundColor: '#f1f1f1',
  },
  viewImgIcon: {
    justifyContent: 'center',
  },
  viewText: {
    height: HEIGHT / 11,
    justifyContent: 'center',
  },
  viewHiden: {
    backgroundColor: 'red',
    height: 64,
    width: WIDTH,
  },
  textDirector: {
    fontSize: 15,
    fontWeight: 'normal',
    margin: 10,
    paddingLeft: 10,
    position: 'absolute',
  },

  follow: {
    height: 50,
    backgroundColor: '#039be5',
    borderColor: '#039be5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH * 0.8,
    marginHorizontal: (WIDTH - WIDTH * 0.8) / 2,
    marginVertical: 20,
  },
});

on_Done_all_slides = () => {
  this.setState ({
    show_Main_App: true,
    show_Main: true,
  });
  this.setState ({stateWelcome: true});
};

on_Skip_slides = () => {
  this.setState ({show_Main_App: true, show_Main: true});
  this.setState ({stateWelcome: true});
};

ShowHideComponent = () => {
  if (this.state.show == true) {
    this.setState ({show: false});
  } else {
    this.setState ({show: true});
  }
};

const slides = [
  {
    key: 'k3',
    title: ' Face Recognition',
    text: 'Detect And Recognize Face',
    image: {
      uri: 'https://reactnativecode.com/wp-content/uploads/2019/04/computer.png',
    },
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: '#282C34',
  },
  {
    key: 'k4',
    title: 'Attendance System',
    text: ' Attendance System With Face',
    image: {
      uri: 'https://reactnativecode.com/wp-content/uploads/2019/04/flight.png',
    },
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: '#49a7cc',
  },
  {
    key: 'k5',
    title: 'Smart & Easy',
    text: ' Smarthing :v',
    image: {
      uri: 'https://reactnativecode.com/wp-content/uploads/2019/04/restaurants.png',
    },
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: '#FF3D00',
  },
];
