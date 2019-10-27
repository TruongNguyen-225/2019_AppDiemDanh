import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, TouchableOpacity, Image, FlatList, TextInput, } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';


import Global from '../../constants/global/Global';
import Tittle from '../Header/Tittle';
import firebase from 'react-native-firebase';
import search from '../../assets/icons/icons8-search-96.png';
import filter from '../../assets/icons/icons8-filter-96.png';
import school from '../../assets/icons/icons8-abc-96.png';

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
  componentDidMount() {
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
          onPress={() => this.props.navigation.navigate('Attendance', { keyClass: this.state.getKey })}
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
                ?
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
    // borderBottomColor: 'gray',
    // borderBottomWidth: 1,
    width: WIDTH,
    // paddingLeft: 10,
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

var datecurrent = year + '/' + month + '/' + date;
var time = hour + ':' + minutes + ':' + seconds;
export default class ExampleThree extends Component {
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
    const keyClass = this.props.navigation.state.params.keyClass;
    const idType = this.props.navigation.state.params.thamso;

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
            });
          }
        });
        this.setState({
          listStudent: listStudent.sort((a, b) => {
            return a.className < b.className;
          }),
        });
        // console.log ('kết quả ', this.state.listStudent);
      }
    });
  }
  render() {
    const state = this.state;
    const tableData = [];
    for (let i = 0; i < 20; i += 1) {
      const rowData = [];
      for (let j = 0; j < 5; j += 1) {
        rowData.push(`${i}${j}`);
      }
      tableData.push(rowData);
    }
    const keyClass = this.props.navigation.state.params.keyClass;
    const idType = this.props.navigation.state.params.thamso;

    return (
      <View style={styles.container}>
        {/* <Tittle onGoBack={() => this.props.navigation.goBack ()} /> */}
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
            onSelectionChange={() => this.onSearchNew()}
          />
          <TouchableOpacity
            style={{ marginRight: 10 }}
            underlayColor="tomato"
            onPress={this.onPressAdd}
          >
            <Image style={{ width: 30, height: 30 }} source={search} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 7 }}>

          <View style={[styles.header, { flexDirection: 'column', justifyContent: 'space-between', height: HEIGHT / 12 }]}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
              <View style={{ width: '62%', borderWidth: 0, height: HEIGHT / 25, paddingLeft: 10 }}>
                <Text>
                  Lớp  : {idType.class}
                </Text>
              </View>
              <View style={{ width: '38%', borderWidth: 0, height: HEIGHT / 25, paddingLeft: 0, }}>
                <Text>
                  Ngày : {this.state.datecurrent}
                </Text>
              </View>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
              <View style={{ width: '62%', borderWidth: 0, height: HEIGHT / 25, paddingLeft: 10 }}>
                <Text>
                  Môn : {idType.subject}
                </Text>
              </View>
              <View style={{ width: '38%', borderWidth: 0, height: HEIGHT / 25, paddingLeft: 0, }}>
                <Text>
                  Sĩ Số : {idType.count}
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
            <Text style={styles.textResult}>Total Student : 30</Text>
            <Text style={styles.textResult}>Student Pass: 25</Text>
          </View>
          <View style={styles.viewResultChild}>
            <Text style={styles.textResult}>Student Fail : 5</Text>
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
    // marginTop: 7,
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
    // width: WIDTH * 0.,
    borderRightWidth: 0.5,
    borderRightColor: 'gray',
    height: HEIGHT / 15,
    justifyContent: 'center',
    // flex:1,
  },

});
