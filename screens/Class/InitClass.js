import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Global from '../../constants/global/Global';
import OfflineNotice from '../Header/OfflineNotice';

import Swipeout from 'react-native-swipeout';
import search from '../../assets/icons/icons8-search-96.png';
import filter from '../../assets/icons/icons8-filter-96.png';

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
  componentDidMount() {
    this.getListStudent();
  }
  getListStudent() {
    var rootRef = firebase.database().ref();
    var urlRef = rootRef.child('Manage_Class/' + this.props.item.key+'/StudentJoin');
    console.log ('path-urlRef', urlRef.path);
    urlRef.once('value', childSnapshot => {
      if (childSnapshot.exists()) {
        const listStudent = [];
        childSnapshot.forEach(doc => {
          var stt = 0;
          if (typeof doc.toJSON().email != 'undefined') {
            stt = 1;
          }
          if (stt == 1) {
            listStudent.push({
              email: doc.toJSON().email,
              MSSV: doc.toJSON().MSSV,
              id: doc.toJSON().id,
            });
          }
        });
        this.setState({
          listStudent: listStudent.sort((a, b) => {
            return a.className < b.className;
          }),
        });
        console.log('kết quả ', this.state.listStudent);
      }
    });
  }
  showInfoClass() {
    alert("chưa làm kịp :v")
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
            //  this.showInfoClass()
            this.props.navigation.navigate('Update_Manage_Class', { thamso: this.props.item })
          },
          text: 'Chỉnh Sửa TT Lớp',
          type: 'primary',
        },
        {
          onPress: () => {
            const deletingRow = this.state.activeRowKey;
            Alert.alert(
              'Alert',
              'Are you sure you want to delete ?',
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
            // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato' ,
            // justifyContent:'space-between',
            // alignItems:'center',
            backgroundColor: "#fff",
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            style={style.viewFlatList}
            onPress={async () => {
              await this.props.navigation.navigate('FollowClass', {
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
              <View style={{ width: 50, height: 50, borderWidth: 0, borderRadius: 999, alignItems: 'center', justifyContent: 'center', }}>
                <Image source={school} style={{ width: 50, height: 50 }} />
              </View>
              <View style={{ justifyContent: 'flex-start', width: WIDTH * 0.73, borderWidth: 0, paddingLeft: 25, }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    opacity: .7,
                  }}
                >
                  {this.props.item.className}
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '700',
                  fontStyle: 'italic',
                  color: '#448aff',
                }}>
                  {this.props.item.isChecked}
                </Text>
                <Text style={{ fontSize: 12, color: '#455a64', fontStyle: 'italic' }}>{this.props.item.time}</Text>

              </View>
              {/* <View style={{justifyContent: 'flex-start', width: WIDTH * 0.25 , borderWidth:0,paddingLeft:5,}}>
               <Text style={{fontSize:12, color:'#455a64',fontWeight:'700'}}>{this.props.item.datecurrent}</Text>
               <Text style={{fontSize:12, color:'#455a64',}}>{this.props.item.time}</Text>
              </View> */}
              <Image
                source={left}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#333',
                  marginRight: 15,
                }}
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
    width: WIDTH * 0.97,
    backgroundColor: '#fff'
  },
  styleText: {
    fontSize: 12,
    color: 'gray',
    // paddingLeft:15,
  }
});
var pathClass = null;
var count = 0;
var ListClass = [];

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
      status: false,
      className: '',
      subject: '',
      path: '',
      count: '',
      teacher: '',
      member: null,
      txtSearch: '',
      activeRowKey: null,
      listClassNew:[],
      router: 'HomeScreen',
      tittle: 'DANH SÁCH LỚP ĐANG XỬ LÝ',
    };
    // this._onPressAdd = this._onPressAdd.bind (this);
    Global.arrayClass = this.state.class;
    Global.tittle = this.state.tittle;
  }

  async componentDidMount() {
    Global.router = this.state.router;
    this.getUserData();
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
    //lấy danh sách lớp đang xử lý về
    await system.orderByChild('status').equalTo(this.state.status)
      .on('value', childSnapshot => {
        const classRoom = [];
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
            datecurrent: doc.toJSON().datecurrent,
            time: doc.toJSON().time,
            isChecked: doc.toJSON().isChecked,
          });
          this.setState({
            class: classRoom.sort((a, b) => {
              return a.className > b.className;
            }),
            loading: true,
          });
        });
        // console.log('classRoom ', this.state.class);
      });
  }
  getUserData = async () => {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({ userData: userData });
    });
  };
  async onSearch() {
    await this.setState({ resultFail: false });
    var dataResult = [];
    var txtSearch_Split = this.state.txtSearch.split(' ');
    await system
      .orderByChild('class')
      .equalTo(this.state.txtSearch)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(doc => {
            dataResult.push({
              // text:`Kết quả tìm kiếm của ${txtSearch_Split} :`,
              className: doc.toJSON().className,
            });
          });
          this.setState({
            dataResult: dataResult.sort((a, b) => {
              return a.date < b.date;
            }),
            // stateEmpty:false,
            textInputSearch: this.state.txtSearch,
            count: dataResult.length,
            txtSearch: '',

          });
        } else {
          dataResult.push({
            // img: <Image source={loser} style={{width:200, height:300}}/>,
            textFail: `Không thấy kết quả nào phù hợp với ${this.state.txtSearch}!`,
          });
          this.setState({
            textInputSearch: this.state.txtSearch,
            // stateEmpty:false,
            resultFail: true,
            txtSearch: '',
          });
        }
      });
  }
  onSearchNew(){
    var arrayInitClass = this.state.class;
    var key = this.state.txtSearch.toUpperCase ();
    var arrSearch = [];
    console.log('in ra arrayInitClass', arrayInitClass)
    for(let i = 0 ; i<arrayInitClass.length ; i++)
    {
      if( arrayInitClass[i].className.toString().includes(key))
      {
        // arrSearch.push(arrayInitClass[i]);
        arrayInitClass = arrayInitClass[i];
        // this.state.class = this.state.class[i];
        console.log('kết quả tìm kiếm là ', arrayInitClass)
      }
      else
      {
        console.log('fail')
      }
      this.state.class= arrayInitClass;
      console.log('log thử xem lào', this.state.class)
      const flatListSearch = (
        <FlatList
        data={this.state.class}
        // data={arrayInitClass}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.viewFlatList}
              // onPress={() =>
              //   this.props.navigation.navigate ('FollowClass', {thamso: item})}
            >
              <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',flex:1}}>
                <View>
                {/* <Image source={school} style={{width: 50, height: 50}} /> */}

                </View>
                <View style={{justifyContent:'flex-start',width:WIDTH*0.6}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'normal',
                    }}
                  >
                    {item.className}
                  </Text>
                </View>
                <View>
                {/* <Image source={goto} style={{width: 20, height: 20,tintColor:'#333',marginRight:25}} /> */}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, id) => item.id}
      />
      )
      // console.log('set ngược lại cho class', this.state.listClassNew)
    }
    console.log("key =========",arrayInitClass);

  }
//   $(document).ready(function() {
//     $('#myInput').on('keyup', function(event) {
//        event.preventDefault();
//        /* Act on the event */
//        var tukhoa = $(this).val().toLowerCase();
//        $('#myTable tr').filter(function() {
//           $(this).toggle($(this).text().toLowerCase().indexOf(tukhoa)>-1);
//        });
//     });
//  });
  render() {
    const { currentUser } = this.state;
    return (
      <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0 }}>
        {/* <StatusBar backgroundColor="#03a9f4" barStyle="light-content" /> */}
        <OfflineNotice />
        <Tittle {...this.props} />
        <View style={styles.viewCreateClass}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            underlayColor="tomato"
            onPress={this.onPressAdd}
          >
            <Image style={{ tintColor: 'blue', width: 30, height: 30 }} source={filter} />
          </TouchableOpacity>
          <TextInput
            style={styles.viewTextInput}
            keyboardType="default"
            placeholderTextColor="gray"
            fontStyle="italic"
            placeholder="Hãy nhập gì đó "
            autoCapitalize="none"
            onChangeText={text => {
              this.setState({ txtSearch: text });
            }}
            value={this.state.txtSearch}
            onSelectionChange={()=> this.onSearchNew()}
          />
          <TouchableOpacity
            style={{ marginRight: 10 }}
            underlayColor="tomato"
            onPress={this.onPressAdd}
          >
            <Image style={{ width: 30, height: 30 }} source={search} />
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ width: WIDTH * 0.97, borderWidth: 0, marginVertical: 5, marginHorizontal: 5 }}
          data={this.state.class}
          // data={arrayInitClass}
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
        <TouchableOpacity 
        // onPress={() =>
          // this.onSearchNew()
        // }
        >
          <Text>Test</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  // viewCreateClass: {
  //   backgroundColor: '#fff',
  //   flexDirection: 'row',
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  //   height: 64,
  // },
  viewTextInput: {
    height: 40,
    width: WIDTH * 0.65,
    margin: 10,
    padding: 10,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
  },
  viewCreateClass: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 20,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    backgroundColor: 'rgba(140, 200, 214,0.8)',
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
    paddingLeft: 5,
    // alignSelf:'flex-start',
    // position: 'absolute',

  },

  follow: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#039be5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH * 0.8,
    marginHorizontal: (WIDTH - WIDTH * 0.8) / 2,
    marginVertical: 20,
  },
});
