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
  TouchableOpacity,
} from 'react-native';

import OpenDrawer from '../Header/OpenDrawer';
import Search_TextInput from '../Header/Search_TextInput';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Global from '../../constants/global/Global';
import OfflineNotice from '../Header/OfflineNotice';

import icons_add from '../../assets/icons/icons8-add-file-99.png';
import icons_load from '../../assets/icons/icons8-refresh-document-96.png';
import icons_checked from '../../assets/icons/icons8-check-file-96.png';
import logoapp  from '../../assets/images/logo_dep_18.png'
import school from '../../assets/icons/school.png';
const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');

var system = firebase.database().ref().child('Manage_Class');
export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
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
      closeClass: true,
      classClosed: [],
      resultFail: false,
      show: false,
    };
    Global.arrayClass = this.state.class;
  }
  async componentDidMount() {
    Global.router = this.state.router;
    this.getUserData();
    const {currentUser} = firebase.auth();
    this.setState({currentUser});
    //lấy danh sách lớp đang xử lý xuống ( this.state.status = false )
    await system
      .orderByChild('status')
      .equalTo(this.state.status)
      .on('value', childSnapshot => {
        const classRoom = [];
        if (childSnapshot.exists()) {
          childSnapshot.forEach(doc => {
            classRoom.push({
              key: doc.key,
              status: doc.toJSON().status,
              _id: doc.toJSON()._id,
              className: doc.toJSON().className,
              class: doc.toJSON().class,
              subject: doc.toJSON().subject,
              count: doc.toJSON().count,
              teacher: doc.toJSON().teacher,
              student_join: this.state.student_join,
            });
          });
          this.setState({
            class: classRoom.sort((a, b) => {
              return a.className < b.className;
            }),
            count: this.state.class.length,
            txtSearch: '',
          });
          // console.log('show ra mảng class',this.state.class)
        } else {
          classRoom.push({
            textFail:
              'Hiện tại chưa có lớp học nào , hãy tạo lớp mới để bắt đầu !',
          });
          this.setState({
            resultFail: true,
            txtSearch: '',
          });
        }
        console.log('classRoom ', this.state.class);
      });
    //lấy danh sách lớp đã chốt ( this.state.closeClass = true )
    await system
      .orderByChild('status')
      .equalTo(this.state.closeClass)
      .on('value', childSnapshot => {
        const classClosed = [];
        if (childSnapshot.exists()) {
          childSnapshot.forEach(doc => {
            classClosed.push({
              className: doc.toJSON().className,
              id: doc.toJSON()._id,
            });
          });
          this.setState({
            classClosed: classClosed.sort((a, b) => {
              return a.className < b.className;
            }),
            count: this.state.class.length,
            txtSearch: '',
          });
        } else {
          classClosed.push({
            textFail:
              'Hiện tại chưa có lớp học nào được chốt , vui lòng theo dõi lớp học đang xử lý và chốt nếu đủ lượng học sinh tham gia lớp !',
          });
          this.setState({
            resultFail: true,
            txtSearch: '',
          });
        }
      });
  }
  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({show: false});
    } else {
      this.setState({show: true});
    }
  };
  getUserData = async () => {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({userData: userData});
    });
  };
  onSetState = () => {
    alert('hahah');
  };
  onPressAdd = () => {
    var className = this.state.newClassName
      .concat(' - ')
      .concat(this.state.subject)
      .toUpperCase();
    var checkRegExp = /^[0-9]*$/;
    if (
      this.state.newClassName.trim() === '' ||
      this.state.subject.trim() === '' ||
      this.state.count.trim() === ''
    ) {
      Alert.alert('Lỗi', 'Các trường phải được điền đầy đủ !');
      return;
    } else if (checkRegExp.test(this.state.count) == false) {
      Alert.alert('Lỗi', 'Sĩ số không đúng định dạng  !');
      return;
    }
    try {
      system
        .orderByChild('className')
        .equalTo(
          this.state.newClassName
            .concat(' - ')
            .concat(this.state.subject)
            .toUpperCase(),
        )
        .once('value', snapshot => {
          if (snapshot.exists()) {
            Alert.alert(
              'Thông báo',
              'Lớp học này đã tồn tại , hãy kiểm tra lại !',
            );
          } else {
            // var pathKey = system.push().key
            system
              .push({
                _id: require('random-string')({length: 10}),
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
              .then(
                this.setState({
                  count: '',
                  subject: '',
                  newClassName: '',
                }),
              );
          }
        });
    } catch (e) {
      alert(e);
    }
  };
  onGoToSearch() {
    () => this.props.navigation.navigate('Search');
  }
  render() {
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
                await this.props.navigation.navigate('FollowClass', {
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
                    }}>
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
        <StatusBar backgroundColor="#2196f3" barStyle="light-content" />
        <View style={{flexDirection: 'row'}}>
          <OpenDrawer {...this.props} />
          <Search_TextInput
            // {...this.props}
            onGoToSearch={() => this.props.navigation.navigate('SearchScreen')}
          />
        </View>
        <View style={styles.content}>
         {/* <Image source ={logoapp} style={{width:'100%',height:'20%',marginTop:10,}}/> */}
          <View style={styles.content_child}>
            <ScrollView>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this.props.navigation.navigate('CreateClass')}>
                    <View style={styles.styleImg}>
                      <Image source={icons_add} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Tạo Lớp Mới
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this.props.navigation.navigate('InitClass')}>
                    <View style={styles.styleImg}>
                      <Image source={icons_load} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Lớp Đang Xử Lý
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this.props.navigation.navigate('ClassDone')}>
                    <View style={styles.styleImg}>
                      <Image source={icons_checked} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Lớp Đã Chốt
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this.props.navigation.navigate('CreateClass')}>
                    <View style={styles.styleImg}>
                      <Image source={icons_add} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Lịch Sử Điểm Danh
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this.props.navigation.navigate('Screen_Handle')}>
                    <View style={styles.styleImg}>
                      <Image source={icons_add} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Điểm Danh Nhanh
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this.props.navigation.navigate('NativeBase')}>
                    <View style={styles.styleImg}>
                      <Image source={icons_add} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Tạo Lớp Mới
                    </Text>
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
    marginVertical: 8,
    marginBottom:0,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
    borderRadius: 10,
  },
  child_row: {
    flexDirection: 'row',
    width: WIDTH * 0.9,
    height: 155,
    marginTop: HEIGHT * 0.03,
    justifyContent: 'center',

  },
  children: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 150,
    height: 155,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: 'rgba(166,216,207, 0.5)',
  },
 styleTouch:{
  width: 170,
  height: 170,
  alignItems: 'center',
  justifyContent: 'center',
 },
 styleImg:{
  height: 80,
  width: 80,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
},
});
