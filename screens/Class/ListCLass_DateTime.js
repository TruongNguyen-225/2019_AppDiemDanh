import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity
} from 'react-native';
import firebase from 'react-native-firebase';
import Global from '../../constants/global/Global';
import Tittle from '../Header/Tittle';
import school from '../../assets/icons/clock-icon-5679.jpg';

const { width: WIDTH } = Dimensions.get('window');
const { height: HEIGHT } = Dimensions.get('window');
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
    var urlRef = rootRef.child('Manage_Class/' + this.props.item.key + '/StudentJoin');
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
      }
    });
  }
  render() {
    return (
      <View style={style.viewOneClass}>
        <TouchableOpacity
          style={style.viewFlatList}
          onPress={async () => {
            await this.props.navigation.navigate('ShowAllStudentWithResultSearch', {
              ngaydiemdanh: this.props.item.dateTimeAttendance, keyClass: this.props.item.keyClass, infoClass: this.props.item.infoClass,
            });
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, }}>
            <View style={{ width: 50, height: 50, borderWidth: 0, borderRadius: 999, alignItems: 'center', justifyContent: 'center', }}>
              <Image source={school} style={{ width: 50, height: 50 }} />
            </View>
            <View style={{ justifyContent: 'flex-start', width: WIDTH * 0.73, borderWidth: 0, paddingLeft: 25, }}>
              <Text style={{ fontSize: 14, fontWeight: '700', opacity: .7, }}>
                {this.props.item.dateTimeAttendance}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '700', fontStyle: 'italic', color: '#448aff', }}>
                {this.props.item.infoClass.class}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '700', fontStyle: 'italic', color: '#448aff', }}>
                {this.props.item.infoClass.subject}
              </Text>
            </View>
            {/* <Image
                source={left}
                style={{width: 20, height: 20, tintColor: '#333', marginRight: 15, }} /> */}
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
  }
});

export default class GetListClass_Attendanced extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      router: 'HomeScreen',
      tittle: "DANH SÁCH NGÀY ĐIỂM DANH"
    };
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;
    const mangNgayDiemDanh = this.props.navigation.state.params.mangNgayDiemDanh;
    console.log('NHAN DUOC MANGNGAYDIEMDANH O CONSTRUCTOR', mangNgayDiemDanh);
  }
  render() {
    const mangNgayDiemDanh = this.props.navigation.state.params.mangNgayDiemDanh;

    return (
      <View style={{ flex: 1 }}>
        <Tittle {...this.props} />
        <View style={{ flex: 1, backgroundColor: 'rgba(112, 119, 127, 0.3)', }}>
          <FlatList
            data={mangNgayDiemDanh}
            style={{ margin: 6, }}
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
      </View>
    );
  }
}
