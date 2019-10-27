import React, {Component} from 'react';
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

import Swipeout from 'react-native-swipeout';
import school from '../../assets/icons/school.png';
import left from '../../assets/icons/left.png';


const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

var system = firebase.database ().ref ().child ('Manage_Class');

export default class FlatListItem extends Component {
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
    // console.log ('path-urlRef', urlRef.path);
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
          // listStudent,
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
          //  this.showInfoClass()
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
            // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato' ,
            // justifyContent:'space-between',
            // alignItems:'center',
            backgroundColor: 'mediumseagreen',
          }}
        >

          <TouchableOpacity
            style={style.viewFlatList}
            // onPress={() =>
            //   this.props.navigation.navigate ('FollowClass', {
            //     thamso: this.props.item,
            //   })}
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
    // justifyContent: 'center',
    alignItems: 'center',
  },
});