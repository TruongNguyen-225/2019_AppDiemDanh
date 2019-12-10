import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
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
      console.log('aaaa',this.state.userData)
    });
  };
  onGoToSearch() {
    () => this.props.navigation.navigate('Search');
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <OfflineNotice style={{flex: 1}} />
        <StatusBar backgroundColor="#4bb1eb" barStyle="light-content" />
        <View style={{flexDirection: 'row'}}>
          <OpenDrawer {...this.props} />
          <Search_TextInput
            onGoToSearch={() => this.props.navigation.navigate('SearchScreen')}
          />
        </View>
        <View style={styles.content}>
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
                      onPress={()=>this.props.navigation.navigate('')}>
                    <View style={styles.styleImg}>
                      <Image source={icons_add} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Biểu Đồ Thống Kê
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this.props.navigation.navigate('')}>
                    <View style={styles.styleImg}>
                      <Image source={icons_add} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                     Đang Phát Triển
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this.props.navigation.navigate('')}>
                    <View style={styles.styleImg}>
                      <Image source={icons_add} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                    Đang Phát Triển
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