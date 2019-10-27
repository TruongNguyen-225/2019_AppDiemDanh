import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';

import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import Tittle from '../Header/Tittle';
import Global from '../../constants/global/Global';
// const RootRef = firebase.database ().ref ().child ('Manage_Class');
const rootRef = firebase.database().ref();
const system = rootRef.child('Manage_Class');

const { width: WIDTH } = Dimensions.get('window');
const { height: HEIGHT } = Dimensions.get('window');

export default class Update_Manage_Class extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      class: [],
      userData: {},
      newClassName: '',
      subject: '',
      count: '',
      tittle: 'CHỈNH SỬA THÔNG TIN LỚP',
      router: 'CreateClass',
    };
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;
  }
  async componentDidMount() {
    const idType = this.props.navigation.state.params.thamso;
    const { currentUser } = firebase.auth();
    await this.setState({ currentUser });
    await this.getUserData();
    this.setState({
      // subject: idType.subject,
      class: idType.class,
      // count: idType.count,
      // className: idType.className,
    })
  }
  getUserData = async () => {
    await AsyncStorage.getItem('userData').then(value => {
      var userData = JSON.parse(value);

      this.setState({ userData: userData });
    });
  };
  async updateClass() {
    const idType = this.props.navigation.state.params.thamso;
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
      await firebase
        .database()
        .ref()
        .child('Manage_Class')
        .orderByChild('className')
        .equalTo(idType.className)
        .on('child_added', data => {
          data.key;
          firebase
            .database()
            .ref()
            .child('Manage_Class')
            .child(data.key)
            .update({
              class: this.state.newClassName,
              subject: this.state.subject,
              count: this.state.count,
              className: this.state.newClassName
                .concat(' - ')
                .concat(this.state.subject)
                .toUpperCase(),
            })
            .then(
              this.setState({
                count: '',
                subject: '',
                newClassName: '',
              })
            )
            .catch(() => Alert('Có lỗi xảy ra !'));
        })

      Alert.alert('Thông báo', 'Cập nhật thông tin thành công !');
      this.props.navigation.navigate('HomeScreen');
      // }

    } catch (e) {
      window.location.href =
        'http://stackoverflow.com/search?q=[js]+' + e.message;
    }
  }
  render() {
    const idType = this.props.navigation.state.params.thamso;
    return (
      <View style={{ flex: 1 }}>
        <Tittle {...this.props} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0, backgroundColor: 'rgba(112, 119, 127, 0.3)', }}>
          <View style={styles.styleContent}>
            <View style={styles.rowInput}>
              <View style={styles.stylesLable}>
                <Text>Lớp </Text>
              </View>
              <TextInput
                style={styles.viewTextInput}
                keyboardType="default"
                placeholderTextColor="gray"
                fontStyle="italic"
                placeholder={idType.class}
                autoCapitalize="none"
                onChangeText={text => {
                  this.setState({ newClassName: text });
                }}
                value={this.state.newClassName}
              />
            </View>
            <View style={styles.rowInput}>
              <View style={styles.stylesLable}>
                <Text>Môn Học </Text>
              </View>
              <TextInput
                style={styles.viewTextInput}
                keyboardType="default"
                placeholderTextColor="gray"
                fontStyle="italic"
                placeholder={idType.subject}
                autoCapitalize="none"
                onChangeText={text => {
                  this.setState({ subject: text });
                }}
                value={this.state.subject}
              />
            </View>
            <View style={styles.rowInput}>
              <View style={styles.stylesLable}>
                <Text>Sĩ Số</Text>
              </View>
              <TextInput
                style={styles.viewTextInput}
                keyboardType="default"
                placeholderTextColor="gray"
                fontStyle="italic"
                placeholder={idType.count}
                autoCapitalize="none"
                onChangeText={text => {
                  this.setState({ count: text });
                }}
                value={this.state.count}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                height: HEIGHT / 8,
                justifyContent: 'center',
                paddingTop: 220,
              }}>
              <TouchableOpacity
                style={styles.bigButton}
                onPress={() => {
                  this.updateClass();
                }}>
                <Text style={styles.buttonText}>Cập Nhật Thông Tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowInput: {
    flexDirection: 'row',
    height: HEIGHT / 13,
    width: WIDTH * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    marginVertical: 10,
  },
  stylesLable: {
    justifyContent: 'center',
    backgroundColor: 'rgba(112, 119, 127, 0.3)',
    borderBottomLeftRadius: 7,
    borderTopLeftRadius: 7,
    width: WIDTH * 0.22,
    height: HEIGHT / 13,
    paddingLeft: 10,
    borderLeftColor: 'rgba(112, 119, 127, 0.3)',
    borderWidth: 1,
    borderTopColor: '#dddddd',
    borderBottomColor: '#dddddd',
    borderRightWidth: 0,


  },
  styleContent: {
    backgroundColor: '#fff',
    width: WIDTH * 0.96,
    borderRadius: 5,
    alignItems: 'center',
    // justifyContent:'center',
    paddingTop: 60,
    flex: 1,
    marginVertical: 7,

  },
  viewTextInput: {
    height: HEIGHT / 13,
    width: WIDTH * 0.65,
    // margin: 10,
    padding: 10,
    borderColor: 'rgba(112, 119, 127, 0.3)',
    borderWidth: 1,
    // borderBottomWidth:1,
    backgroundColor: '#fff',
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
