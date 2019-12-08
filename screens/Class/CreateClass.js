import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import Global from '../../constants/global/Global';
import OfflineNotice from '../Header/OfflineNotice';
import Swipeout from 'react-native-swipeout';
import icons_add from '../../assets/icons/icon_plus_big.png';
import school from '../../assets/icons/icons8-abc-96.png';
import left from '../../assets/icons/left.png';
import Tittle from '../Header/Tittle';

const { width: WIDTH } = Dimensions.get('window');
const { height: HEIGHT } = Dimensions.get('window');
var system = firebase.database().ref().child('Manage_Class');
class FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRowKey: null,
      listStudent: [],
      textFail: '',
    };
  }
  render() {
    const swipeSettings = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {
        if (this.state.activeRowKey != null) {
          this.setState({ activeRowKey: null });
        }
      },
      onOpen: (secId, rowId, direction) => {
        this.setState({ activeRowKey: this.props.item.key });
      },
      right: [
        {
          onPress: () => {
            this.props.navigation.navigate('Update_Manage_Class', {thamso: this.props.item, })
          },
          text: 'Edit',
          type: 'primary',
        },
        {
          onPress: () => {
            const deletingRow = this.state.activeRowKey;
            Alert.alert(
              'Thông báo !',
              'Bạn chắc chắn sẽ xóa lớp học này ?',
              [
                {
                  text: 'No',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    system
                      .orderByChild('_id')
                      .equalTo(this.props.item._id)
                      .on('child_added', data => {
                        data.key;
                        system.child(data.key).remove();
                      });
                  },
                },
              ],
              { cancelable: true }
            );
          },
          text: 'Delete',
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
            backgroundColor: '#fff',
          }}
        >
          <TouchableOpacity
            style={style.viewFlatList}
            onPress={async () => {
              await this.props.navigation.navigate ('FollowClass', {
                thamso: this.props.item,
              });
            }}
          >
            <View  style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between',flex: 1,}} >
              <View style= {{ width : 50, height : 50, borderWidth:0, borderRadius:999,alignItems:'center',justifyContent:'center',}}>
                <Image source={school} style={{width: 50, height: 50}} />
              </View>
              <View style={{justifyContent: 'flex-start', width: WIDTH * 0.73 , borderWidth:0,paddingLeft:25,}}>
                <Text
                  style={{fontSize: 14, fontWeight: '700', opacity:.7}}
                >
                  {this.props.item.className}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '700', fontStyle:'italic', color:'#448aff' }}>
                  {this.props.item.isChecked === 0 ? <Text>Đang Xử Lý</Text> : this.props.item.isChecked === 1 ? <Text>Lớp Đã Chốt , Có Thể Điểm Danh</Text> :<Text></Text>}
                </Text>
               <Text style={{fontSize:12, color:'#455a64', fontStyle:'italic'}}>{this.props.item.key}</Text>
              </View>
              <Image
                source={left}
                style={{ width: 20, height: 20, tintColor: '#333', marginRight: 15, }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Swipeout>
    );
  }
}
const style = StyleSheet.create({
  flatListItem: {
    color: 'white',
    padding: 10,
    fontSize: 16,
  },
  viewFlatList: {
    flexDirection: 'row',
    height: HEIGHT / 9,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    width: WIDTH,
    paddingLeft: 10,
    alignItems: 'center',
    width:WIDTH*0.97,
    backgroundColor:'#fff'
  },
  styleText:{
    fontSize:12,
    color:'gray',
  }
});
var thoigian = new Date();
var date = thoigian.getDate();
var month = thoigian.getMonth() + 1;
var year = thoigian.getFullYear();
var hour = thoigian.getHours();
var minutes = thoigian.getMinutes();
var seconds = thoigian.getSeconds();
var datecurrent = year + '-' + month + '-' + date;
var time = hour + ':' + minutes + ':' + seconds;

export default class CreateClass extends Component {
  static navigationOptions = {
    header: null,
  };
  state = { currentUser: null };
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      show: false,
      class: [],
      newClassName: '',
      loading: false,
      status: false, // đang xử lý
      className: '',
      class: '',
      subject: '',
      path: '',
      count: '',
      teacher: '',
      member: null,
      activeRowKey: null,
      router: 'HomeScreen',
      tittle: 'TẠO LỚP MỚI',
      datecurrent: datecurrent,
      time: time,
      isChecked: 0, // 0 là ' Đang xử lý ',
      dateFinish:'',
      dateStart:'',
      numberTarget :0,
    };
    this._onPressAdd = this._onPressAdd.bind(this);
    Global.arrayClass = this.state.class;
    Global.tittle = this.state.tittle;

  }

  async componentDidMount() {
    Global.router = this.state.router;
    this.getUserData();
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
    // lấy xuống các lớp học đang trong quá trình xử lý
    await system.orderByChild('status').equalTo(this.state.status)
      .on('value', childSnapshot => {
        const classRoom = [];
        if(childSnapshot.exists()){
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
              isChecked:doc.toJSON().isChecked,
              MSGV:doc.toJSON().MSGV,
              dateFinish:doc.toJSON().dateFinish,
              dateStart:doc.toJSON().dateStart,
              numberTarget:doc.toJSON().numberTarget,
            });
            this.setState({
              class: classRoom.sort((a, b) => {
                return a.className > b.className;
              }),
              loading: true,
            });
          });
        }
      });
  }
  getUserData = async () => {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({ userData: userData });
    });

  };
  onPressAdd = () => {
    var className = this.state.newClassName.concat(' - ').concat(this.state.subject).toUpperCase();
    var checkRegExp = /^[0-9]*$/;
    if (
      this.state.newClassName.trim() === '' ||
      this.state.subject.trim() === '' ||
      this.state.count.trim() === '' ||
      this.state.numberTarget.trim() === '' ||
      this.state.dateStart.trim() === '' ||
      this.state.dateFinish.trim() === ''
    ) {
      Alert.alert('Lỗi', 'Các trường phải được điền đầy đủ !');
      return;
    } else if (checkRegExp.test(this.state.count) == false) {
      Alert.alert('Lỗi', 'Sĩ số chỉ chấp nhận là chữ số nguyên !');
      return;
    }else if (checkRegExp.test(this.state.numberTarget) == false) {
      Alert.alert('Lỗi', 'Số tín chỉ là chữ số nguyên !');
      return;
    }
    // else if (this.state.dateStart.getTime() > this.state.dateFinish.getTime()) {
    //   Alert.alert('Lỗi', 'Ngày kết thúc không thể nhỏ hơn hoặc bằng ngày bắt đầu học !');
    //   return;
    // }
    try {
      system
        .orderByChild('className')
        .equalTo(
          this.state.newClassName
            .concat(' - ')
            .concat(this.state.subject)
          .toUpperCase ()
        )
        .once('value', snapshot => {
          if (snapshot.exists()) {
            Alert.alert(
              'Thông báo',
              'Lớp học này đã tồn tại , hãy kiểm tra lại !'
            );
          } else {
            system
              .push({
                _id: require('random-string')({ length: 10 }),
                status: this.state.status,
                class: this.state.newClassName,
                subject: this.state.subject,
                className: className,
                count: this.state.count,
                gmail_teacher: this.state.currentUser.email,
                teacher: this.state.userData.fullName,
                member: this.state.member,
                datecurrent: this.state.datecurrent,
                time: this.state.time,
                isChecked: this.state.isChecked,
                MSGV : this.state.userData.MSGV,
                numberTarget: this.state.numberTarget,
                dateStart: this.state.dateStart,
                dateFinish:this.state.dateFinish,
              })
              .then(
                this.setState({
                  count: '',
                  subject: '',
                  newClassName: '',
                  dateStart:'',
                  dateFinish:'',
                  numberTarget:'',
                })
              );
          }
        });
    } catch (e) {
      alert(e);
    }
  };
  _onPressAdd() {
    this.refs.addModal.showAddModal();
  }
  onGoToDetail = () => {
    if (this.state.newClassName != '') {
      alert(this.state.newClassName);
      this.props.navigation.navigate('Detail_Class', {
        thamso: this.state.newClassName,
      });
    }
  };
  render() {
    return (
      <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0 }}>
        <Tittle {...this.props} />
        <View style={styles.styleViewInput}>
          <View style={styles.styleChildViewInput}>
            <View style={styles.viewCreateClass}>
              <TextInput
                style={styles.viewTextInput}
                keyboardType="default"
                placeholderTextColor="gray"
                placeholder="Nhập tên lớp học"
                autoCapitalize="none"
                fontStyle="italic"
                onChangeText={text => {
                  this.setState({ newClassName: text });
                }}
                value={this.state.newClassName}
              />
              <View
                style={{ marginRight: 10, width: 42, height: 42 }}
                underlayColor="tomato"
              >
                <Text />
              </View>
            </View>
            <View style={styles.viewCreateClass}>
              <TextInput
                style={styles.viewTextInput}
                keyboardType="default"
                placeholderTextColor="gray"
                placeholder="Nhập tên môn học"
                autoCapitalize="none"
                fontStyle="italic"
                onChangeText={text => {
                  this.setState({ subject: text });
                }}
                value={this.state.subject}
              />
              <View
                style={{ marginRight: 10, width: 42, height: 42 }}
                underlayColor="tomato"
              >
                <Text />
              </View>
            </View>
            <View style={styles.viewCreateClass}>
              <TextInput
                style={styles.viewTextInput}
                keyboardType="default"
                placeholderTextColor="gray"
                placeholder="Nhập sĩ số lớp học"
                autoCapitalize="none"
                fontStyle="italic"
                onChangeText={text => {
                  this.setState({ count: text });
                }}
                value={this.state.count}
              />
               <View
                style={{ marginRight: 10, width: 42, height: 42 }}
                underlayColor="tomato"
              >
                <Text />
              </View>
            </View>
            <View style={styles.viewCreateClass}>
              <TextInput
                style={styles.viewTextInput}
                keyboardType="default"
                placeholderTextColor="gray"
                placeholder="Nhập số tín chỉ môn học"
                autoCapitalize="none"
                fontStyle="italic"
                onChangeText={text => {
                  this.setState({ numberTarget: text });
                }}
                value={this.state.numberTarget}
              />
               <View
                style={{ marginRight: 10, width: 42, height: 42 }}
                underlayColor="tomato"
              >
                <Text />
              </View>
            </View>
            <View style={styles.viewTime}>
                <View style = { styles.viewTimeChild}>
                    <Text style={{marginBottom:7, fontStyle:'italic',color:'gray'}}>Ngày bắt đầu </Text>
                    <DatePicker
                      style={{
                        width: WIDTH * 0.35,
                        marginHorizontal:3,
                        backgroundColor: '#fff',
                      }}
                      date={this.state.date}
                      mode="date"
                      placeholder="dd/mm/yyyy"
                      format="DD-MM-YYYY"
                      minDate="01-01-2019"
                      maxDate="01-01-2100"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      customStyles={{
                        dateIcon: {position: 'absolute',right: 0,top: 4, marginLeft: 0 },
                        dateInput: {},                    
                      }}
                      onDateChange={date => {
                        this.setState ({date: date, dateStart: date});
                      }}
                    />
                </View>
                <View style = { styles.viewTimeChild}>
                <Text style={{marginBottom:7, fontStyle:'italic',color:'gray'}}>Ngày kết thúc</Text>
                    <DatePicker
                      style={{
                        width: WIDTH * 0.35,
                        marginHorizontal:3,
                        backgroundColor: '#fff',
                      }}
                      date={this.state.date}
                      mode="date"
                      placeholder="dd/mm/yyyy"
                      format="DD-MM-YYYY"
                      minDate="01-01-2019"
                      maxDate="01-01-2100"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      customStyles={{
                        dateIcon: {position: 'absolute',right: 0,top: 4, marginLeft: 0 },
                        dateInput: {},                    
                      }}
                      onDateChange={date => {
                        this.setState ({date: date, dateFinish: date});
                      }}
                    />
                </View>
                <TouchableOpacity
                style={{ marginRight: '1%', lineHeight:75,}}
                underlayColor="tomato"
                onPress={this.onPressAdd}
              >
                <Image style={{ width: 47, height: 45,top:20, }} source={icons_add} />
                <Text/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <FlatList
          data={this.state.class}
          renderItem={({ item, index }) => {
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
      </View>
    );
  }
}
const styles = StyleSheet.create({
  styleViewInput: {
    backgroundColor: 'rgba(112, 119, 127, 0.3)'
    , alignItems: 'center', justifyContent: 'center'
  },
  styleChildViewInput: {
    borderWidth: 0, borderRadius: 5, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', width: WIDTH * 0.97, marginVertical: 5,
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
    paddingLeft:15,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius:5,
  },

  rowCreateClass: {
    flexDirection: 'row',
    height: HEIGHT / 11,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingLeft: 20,
    backgroundColor:'rgba(140, 200, 214,0.8)',
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
 viewTime:{
   width:'100%',
   height:'auto',
   flexDirection:'row',
   paddingVertical:1,
   justifyContent:'flex-start',
   marginBottom:7,
   alignItems:'center',
   justifyContent:'center',
   height:75,

 },
 viewTimeChild:{
   width:'37%',
   height:'auto',
   marginHorizontal:3,
   justifyContent:'center',
   alignItems:'center',
 },
});
