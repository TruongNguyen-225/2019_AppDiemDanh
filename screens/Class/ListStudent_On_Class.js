import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, FlatList, } from 'react-native';
import Global from '../../constants/global/Global';
import Tittle from '../Header/Tittle';
import firebase from 'react-native-firebase';

const { width: WIDTH } = Dimensions.get('window');
const { height: HEIGHT } = Dimensions.get('window');
class FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRowKey: null,
      listStudent: [],
      textFail: '',
      getKey: null,
      listHistoryChild:[],
      arrListAttendance:[],
      tongsongaydiemdanh:null,
      songaydiemdanh:null,
    };
  }
  componentDidMount() {
    const idType = this.props.navigation.state.params.thamso;
    firebase.database().ref('Manage_Class/'+idType.key+'/Attendance').on('value',(value)=>{
      if(value.exists()){
        console.log('numberChild',value.numChildren());
        const arrListAttendance = [];
        const listHistoryChild = [];
        value.forEach(doc => {
          arrListAttendance.push({
            dateTimeAttendance: doc.key,
          })
        });
        this.setState({ arrListAttendance: arrListAttendance })
        arrListAttendance.forEach(x=>{
            var ngaydiemdanh = x.dateTimeAttendance ;
            firebase.database().ref('Manage_Class/'+idType.key+'/Attendance/'+ngaydiemdanh).orderByChild('MSSV').equalTo(this.props.item.MSSV).on('value',(value)=>{
                if(value.exists()){
                  listHistoryChild.push(value);
                }
                this.setState({listHistoryChild:listHistoryChild,songaydiemdanh:listHistoryChild.length})
            })
        })
      }
      this.setState({tongsongaydiemdanh :(value.numChildren())})
    })
  }

  render() {
    const { tongsongaydiemdanh,songaydiemdanh ,arrListAttendance,listHistoryChild} = this.state;
  var songayvang =  tongsongaydiemdanh - songaydiemdanh ;
    return (
      <View style={style.viewOneClass}>
        <TouchableOpacity
          style={style.viewFlatList}
          onPress={() => this.props.navigation.navigate('Student_Profile', { info: this.props.item ,infoClass: this.props.navigation.state.params.thamso,listHistoryChild:listHistoryChild,arrListAttendance:arrListAttendance})}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, }}>
            <View style={[styles.styleColumn, { flex: 1, borderLeftWidth: 0.5, borderLeftColor: 'gray', }]}>
            <Text>{this.props.index+1}</Text>
            </View>
            <View style={[styles.styleColumn, { flex: 3, }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', opacity: .7, }}>
                {this.props.item.MSSV}
              </Text>
            </View>
            <View style={[styles.styleColumn, { flex: 5, }]}>
              <Text style={{ fontSize: 14, fontWeight: '700', opacity: .7, }}>
                {this.props.item.fullName}
              </Text>
            </View>
               {songayvang>=3 ? <View style={[styles.styleColumn, { flex: 1, backgroundColor:'yellow',color:'white'}]}>
               <Text style={{ fontSize: 12, fontWeight: '700', opacity: .7, }}>{songayvang}</Text></View>: <View style={[styles.styleColumn, { flex: 1}]}><Text>{songayvang}</Text></View>}
            </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const style = StyleSheet.create({
  viewOneClass: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    width: WIDTH * 0.97,
  },
  viewFlatList: {
    flexDirection: 'row',
    height: HEIGHT / 15,
    width: WIDTH,
    alignItems: 'center',
    width: WIDTH * 0.97,
    backgroundColor: '#fff',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  styleText: {
    fontSize: 12,
    color: 'gray',
  },
  styleColumn: { alignItems: 'center', width: WIDTH * 0.1, borderRightWidth: 0.5, borderRightColor: 'gray', height: HEIGHT / 15, justifyContent: 'center' },

});
var thoigian = new Date ();
var date = thoigian.getDate ();
var month = thoigian.getMonth () + 1;
var year = thoigian.getFullYear ();
var hour = thoigian.getHours();
var minutes = thoigian.getMinutes();
var seconds = thoigian.getSeconds();
var getTime = thoigian.getTime();

if( date < 10)
{
  date = '0'+date;
  console.log(date);
}
var datecurrent = date + '-' + month + '-' + year;
export default class ListStudent_On_Class extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      listStudent: [],
      datecurrent: datecurrent,
      tittle: '',
      router: 'HomeScreen',
    };
    const idType = this.props.navigation.state.params.thamso;
    Global.siso = idType.count;
    Global.router = this.state.router;
    Global.tittle = idType.className;
  }
  componentDidMount() {
    this.getListStudent();
  }
  getListStudent() {
    const keyClass = this.props.navigation.state.params.keyClass;
    var rootRef = firebase.database().ref();
    var urlRef = rootRef.child('Manage_Class/' + keyClass + '/StudentJoin');
    console.log('key truyền qua là', keyClass)
    console.log('path-urlRef', urlRef.path);
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
              address: doc.toJSON().address,
              dateBirthday:doc.toJSON().dateBirthday,
              fullName:doc.toJSON().fullName,
              numberPhone:doc.toJSON().numberPhone,
              sex:doc.toJSON().sex,
              avt:doc.toJSON().proofs[0]["url"],
            });
          }
        });
        this.setState({
          listStudent: listStudent.sort((a, b) => {
            return a.className < b.className;
          }),
        });
      }
    });
  }
  render() {
    const idType = this.props.navigation.state.params.thamso;
    return (
      <View style={styles.container}>
        <Tittle {...this.props} />
        <View style={{ marginTop: 7 }}>

        <View style={[styles.header, { flexDirection: 'column', justifyContent: 'space-between', height: HEIGHT / 22 }]}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row',height: HEIGHT / 25,borderWidth: 0,}}>
              <View style={{ width: '38%', borderWidth: 0, height: HEIGHT / 25, paddingLeft: 0, }}>
                <Text>
                  Ngày : {this.state.datecurrent}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.header,{opacity:.8,}]}>
            <View style={[styles.styleColumn, { flex: 1, }]}>
              <Text >STT</Text>
            </View>
            <View style={[styles.styleColumn, { flex: 3, }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', opacity: .7, }}>
                MSSV
                </Text>
            </View>
            <View style={[styles.styleColumn, { flex: 5 }]}>
              <Text style={{ fontSize: 14, fontWeight: '700', opacity: .7, }}>
                Họ Và Tên
                </Text>
            </View>
            <View style={[styles.styleColumn, { flex: 1 }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', opacity: .7, }}>
                Vắng (Ca)
                </Text>
            </View>
          </View>
        </View>

        <FlatList
          data={this.state.listStudent}
          style={{ marginVertical: 0, }}
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
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(112, 119, 127, 0.3)',
    alignItems: 'center',
  },
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
    borderBottomWidth: 0,
    backgroundColor: 'rgba(140, 200, 214,0.8)',
  },
  viewResult: {
    zIndex: 10,
    backgroundColor: '#4bacb8',
    height: HEIGHT / 9,
    width: WIDTH,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  textResult: {
    marginVertical: 5,
    fontSize: 15,
    width: WIDTH * 0.4,
  },
  viewResultChild: {
    flexDirection: 'row',
    marginHorizontal: WIDTH / 14,
  },
  header: {
    height: HEIGHT / 15,
    backgroundColor: '#537791',
    width: WIDTH * 0.97,
    borderLeftWidth: 0.5, borderLeftColor: 'gray',
    borderTopColor: 'gray',
    borderTopWidth: 0.5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',

  },
  text: {
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: '100',
  },
  styleColumn: {
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: 'gray',
    height: HEIGHT / 15,
    justifyContent: 'center',
  },

});
