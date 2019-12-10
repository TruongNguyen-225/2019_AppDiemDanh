import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, FlatList, TextInput, Picker } from 'react-native';
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
      datecurrent:datecurrent,
      list_MSSV_Joined:[],
      listHistoryChild_Attendanced:[],
      check:false,
    };
  }
  componentDidMount() {
    const idType = this.props.navigation.state.params.thamso;
    const keyClass = this.props.navigation.state.params.keyClass;
    var rootRef = firebase.database().ref();
    var urlRef = rootRef.child('Manage_Class/' + keyClass + '/StudentJoin');
    urlRef.once('value', childSnapshot => {
      if (childSnapshot.exists()) {
        const listHistoryChild_Attendanced = [];
        const list_MSSV_Joined = [];
        childSnapshot.forEach(doc => {
          var stt = 0;
          if (typeof doc.toJSON().email != 'undefined') {
            stt = 1;
          }
          if (stt == 1) {
            list_MSSV_Joined.push(doc.toJSON().MSSV);
          }
        });
        this.setState({
          list_MSSV_Joined:list_MSSV_Joined,
        });
        firebase.database().ref('Manage_Class/'+idType.key+'/Attendance/'+this.state.datecurrent).orderByChild('MSSV').on('value',(value)=>{
          if(value.exists()){
            value.forEach(element =>{
              if( typeof element.val().MSSV != 'undefined'){
                listHistoryChild_Attendanced.push(element.val().MSSV)
              }
            })
            this.setState({listHistoryChild_Attendanced:listHistoryChild_Attendanced})
          }
      })
      }
    });

  }

  render() {
    return (
      <View style={style.viewOneClass}>
        <TouchableOpacity
          style={style.viewFlatList}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1,borderBottomWidth:1 ,borderBottomColor: 'gray'}}>
            <View style={[styles.styleColumn, { flex: 1, borderLeftWidth: 0.5, borderLeftColor: 'gray', }]}>
              <Text>{(this.props.index)+1}</Text>
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
            <View style={[styles.styleColumn, { flex: 1, }]}>
            {this.state.listHistoryChild_Attendanced.includes(this.props.item.MSSV)?
              <Text style={{ fontSize: 12, fontWeight: '700', opacity: .7, }}>✔</Text> :<Text>❌</Text>}
            </View>
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
    // borderBottomColor: 'gray',
    // borderBottomWidth: 0.5,
  },
  viewFlatList: {
    flexDirection: 'row',
    height: HEIGHT / 15,
    width: WIDTH,
    alignItems: 'center',
    width: WIDTH * 0.97,
    backgroundColor: '#fff'
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

export default class ListStudentAttendance extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      listStudent: [],
      listStudent_Joined:[],
      list_MSSV_Joined:[],
      listHistory: [],
      listHistoryChild: [],
      listHistoryChild_Attendanced:[],
      datecurrent: datecurrent,
      tittle: '',
      router: 'HomeScreen',
      keyClass:"",
    };
    const idType = this.props.navigation.state.params.thamso;
    Global.router = this.state.router;
    Global.tittle = idType.className;
  }
  componentDidMount() {
    this.getListStudent_Attendanced();
    this.getListHistory();
    this.getListStudent_Joined();
  }
  getListHistory() {
    const keyClass = this.props.navigation.state.params.keyClass;
    var rootRef = firebase.database().ref();
    var urlRef = rootRef.child(`Manage_Class/${keyClass}/Attendance`);

    urlRef.once('value').then((snapshot) => {
      const listHistory = [];
      snapshot.forEach(doc => {
        const listHistoryChild = [];
        listHistory.push({
          dateTimeAttendance: doc.key,
          keyClass:this.props.navigation.state.params.keyClass,
          infoClass: this.props.navigation.state.params.thamso,
        })
        doc.forEach(e => {
          listHistoryChild.push({
            email: e.toJSON().email,
          })
        })
        this.setState({
          listHistoryChild
        })
      });
      this.setState({ listHistory: listHistory })
    },
    );
  }
  getListStudent_Joined() {
    const keyClass = this.props.navigation.state.params.keyClass;
    var rootRef = firebase.database().ref();
    var urlRef = rootRef.child('Manage_Class/' + keyClass + '/StudentJoin');
    urlRef.once('value', childSnapshot => {
      if (childSnapshot.exists()) {
        const listStudent_Joined = [];
        const list_MSSV_Joined = [];
        childSnapshot.forEach(doc => {
          var stt = 0;
          if (typeof doc.toJSON().email != 'undefined') {
            stt = 1;
          }
          if (stt == 1) {
            list_MSSV_Joined.push(doc.toJSON().MSSV);
            listStudent_Joined.push({
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
          listStudent_Joined: listStudent_Joined.sort((a, b) => {
            return a.className < b.className;
          }),
          list_MSSV_Joined:list_MSSV_Joined,
        });
      }
    });
  }
  getListStudent_Attendanced() {
    const idType = this.props.navigation.state.params.thamso;
    const keyClass = this.props.navigation.state.params.keyClass;
    var rootRef = firebase.database().ref();
    var urlRef = rootRef.child('Manage_Class/' + keyClass + '/StudentJoin');
    urlRef.once('value', childSnapshot => {
      if (childSnapshot.exists()) {
        const listHistoryChild_Attendanced = [];
        const list_MSSV_Joined = [];
        childSnapshot.forEach(doc => {
          var stt = 0;
          if (typeof doc.toJSON().email != 'undefined') {
            stt = 1;
          }
          if (stt == 1) {
            list_MSSV_Joined.push(doc.toJSON().MSSV);
          }
        });
        this.setState({
          list_MSSV_Joined:list_MSSV_Joined,
        });
        firebase.database().ref('Manage_Class/'+idType.key+'/Attendance/'+this.state.datecurrent).orderByChild('MSSV').on('value',(value)=>{
          if(value.exists()){
            value.forEach(element =>{
              if( typeof element.val().MSSV != 'undefined'){
                listHistoryChild_Attendanced.push(element.val().MSSV)
              }
            })
            this.setState({listHistoryChild_Attendanced:listHistoryChild_Attendanced})
          }
      })
      }
    });
  }
  render() {
    const idType = this.props.navigation.state.params.thamso;
    const { listHistory,listHistoryChild_Attendanced } = this.state;
    let vang = idType.count - listHistoryChild_Attendanced.length;
    return (
      <View style={styles.container}>
        <Tittle {...this.props} />
        <View style={styles.viewCreateClass}>
        <TouchableOpacity
            onPress={()=>this.props.navigation.navigate('ListCLass_DateTime',{mangNgayDiemDanh:listHistory})}
    style={{width: '100%', height: '100%', justifyContent: 'center'}}
          >
            <Text style={{textAlign: 'center'}}>Danh sách những ngày điểm danh trước đó</Text>
          </TouchableOpacity>
        
        </View>
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
          <View style={[styles.header,{opacity:.8}]}>
            <View style={[styles.styleColumn, { flex: 1, borderLeftWidth: 0.5, borderLeftColor: 'gray', }]}>
              <Text >STT</Text>
            </View>
            <View style={[styles.styleColumn, { flex: 3,borderLeftWidth: 0.5, borderLeftColor: '#666',  }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', opacity: .7, }}>
                MSSV
                </Text>
            </View>
            <View style={[styles.styleColumn, { flex: 5 ,borderLeftWidth: 0.5, borderLeftColor: '#666', }]}>
              <Text style={{ fontSize: 14, fontWeight: '700', opacity: .7, }}>
                Họ Và Tên
                </Text>
            </View>
            <View style={[styles.styleColumn, { flex: 1,borderLeftWidth: 0.5, borderLeftColor: '#666',  }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', opacity: .7, }}>
                AT
                </Text>
            </View>
          </View>
        </View>

        <FlatList
          data={this.state.listStudent_Joined}
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
        <View style={styles.viewResult}>
          <View style={styles.viewResultChild}>
            <Text style={styles.textResult}>Sĩ số : {idType.count} </Text>
            <Text style={styles.textResult}>Vắng : {vang}</Text>
          </View>
        </View>
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
    width: WIDTH * 0.25,
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
    height: 34,
    paddingHorizontal: 20,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 0,
    backgroundColor: 'rgba(140, 200, 214,0.6)',
  },
  viewResult: {
    zIndex: 10,
    backgroundColor: '#4bacb8',
    height: HEIGHT / 14,
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
    justifyContent:'center',
    alignItems:'center'
  },
  header: {
    height: HEIGHT / 15,
    backgroundColor: '#537791',
    width: WIDTH * 0.97,
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
  bigButton: {
    width: WIDTH * 0.9,
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0093c4',
  },
  buttonText: {
    fontFamily: 'Avenir',
    color: '#fff',
    fontWeight: '400',
  },
});
