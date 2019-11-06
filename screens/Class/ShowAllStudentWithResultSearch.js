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
    };
  }
  render() {
    const tableData = [];
    for (let i = 0; i < 20; i += 1) {
      const rowData = [];
      for (let j = 0; j < 5; j += 1) {
        rowData.push(`${i}${j}`);
      }
      tableData.push(rowData);
    }
    return (
      <View style={style.viewOneClass}>
        <TouchableOpacity
          style={style.viewFlatList}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, }}>
            <View style={[styles.styleColumn, { flex: 1, borderLeftWidth: 0.5, borderLeftColor: 'gray', }]}>
              <Text>1</Text>
            </View>
            <View style={[styles.styleColumn, { flex: 3, }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', opacity: .7, }}>
                {this.props.item.MSSV}
              </Text>
            </View>
            <View style={[styles.styleColumn, { flex: 5, }]}>
              <Text style={{ fontSize: 14, fontWeight: '700', opacity: .7, }}>
                {this.props.item.email}
              </Text>
            </View>
            <View style={[styles.styleColumn, { flex: 1, }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', opacity: .7, }}>
                ✔
                </Text>
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
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
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
var thoigian = new Date();
var date = thoigian.getDate();
var month = thoigian.getMonth() + 1;
var year = thoigian.getFullYear();
var hour = thoigian.getHours();
var minutes = thoigian.getMinutes();
var seconds = thoigian.getSeconds();

var datecurrent = year + '-' + month + '-' + date;
var time = hour + ':' + minutes + ':' + seconds;
export default class ListStudentAttendance extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      listStudent: [],
      listHistory: [],
      listHistoryChild: [],
      datecurrent: datecurrent,
      tittle: "DANH SÁCH HS ĐÃ ĐIỂM DANH",
      router: 'HomeScreen',
    };
    // const ngaydiemdanh = this.props.navigation.state.params.ngaydiemdanh;
    // const keyClass = this.props.navigation.state.params.keyClass;
    const infoClass = this.props.navigation.state.params.infoClass;
    Global.router = this.state.router;
    Global.tittle = this.state.tittle;
    Global.siso = parseInt (infoClass.count);
  }
  componentDidMount() {
    this.getListStudent();
  }
  getListStudent() {
    const keyClass = this.props.navigation.state.params.keyClass;
    const ngaydiemdanh = this.props.navigation.state.params.ngaydiemdanh;
    var rootRef = firebase.database().ref();
    var urlRef = rootRef.child(`Manage_Class/${keyClass}/Attendance/${ngaydiemdanh}`);
    urlRef.on('value', childSnapshot => {
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
          listStudent: listStudent
        });
      }
    });
  }
  render() {
    const tableData = [];
    for (let i = 0; i < 20; i += 1) {
      const rowData = [];
      for (let j = 0; j < 5; j += 1) {
        rowData.push(`${i}${j}`);
      }
      tableData.push(rowData);
    }
    const ngaydiemdanh = this.props.navigation.state.params.ngaydiemdanh;
    const infoClass = this.props.navigation.state.params.infoClass;
    return (
      <View style={styles.container}>
        <Tittle {...this.props} />
        {/* <View style={styles.viewCreateClass}>
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
            onSelectionChange={() => this.onSearchNew()}
          />
        </View> */}
        <View style={{ marginTop: 7 }}>

          <View style={[styles.header, { flexDirection: 'column', justifyContent: 'space-between', height: HEIGHT / 12 }]}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
              <View style={{ width: '62%', borderWidth: 0, height: HEIGHT / 25, paddingLeft: 10 }}>
                <Text>
                  Lớp  : {infoClass.class}
                </Text>
              </View>
              <View style={{ width: '38%', borderWidth: 0, height: HEIGHT / 25, paddingLeft: 0, }}>
                <Text>
                  Ngày : {ngaydiemdanh}
                </Text>
              </View>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
              <View style={{ width: '62%', borderWidth: 0, height: HEIGHT / 25, paddingLeft: 10 }}>
                <Text>
                  Môn : {infoClass.subject}
                </Text>
              </View>
              <View style={{ width: '38%', borderWidth: 0, height: HEIGHT / 25, paddingLeft: 0, }}>
                <Text>
                  Sĩ Số : {infoClass.count}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.header}>
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
                AT
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
        <View style={styles.viewResult}>
          <View style={styles.viewResultChild}>
            <Text style={styles.textResult}>Sĩ Số : {infoClass.count}</Text>
            <Text style={styles.textResult}>Đã Điểm Danh: {this.state.listStudent.length}</Text>
          </View>
          <View style={styles.viewResultChild}>
            <Text style={[styles.textResult],{width:WIDTH*0.9}}>Vắng/Không Điểm Danh :{Global.siso - this.state.listStudent.length}</Text>
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
    // borderWidth:1,
    height: 40,
    width: WIDTH*0.9 ,
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
    width: WIDTH * 0.5,
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
