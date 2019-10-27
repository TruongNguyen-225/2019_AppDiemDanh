import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
// import QRCode from 'react-native-qrcode';
import {setItemToAsyncStorage,
	getItemFromAsyncStorage,
	getStatusColor} from '../HandleAuthentication/function';
import AsyncStorage from '@react-native-community/async-storage';

import Global from '../../constants/global/Global';
import firebase from 'react-native-firebase';
import Tittle from '../Header/Tittle';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

var system = firebase.database ().ref ().child ('Manage_Class');

export default class Detail_Class extends Component {
  constructor (props) {
    super (props);
    this.state = {
      text_Input: '', 
      text_Output: '',
      tittle:'TẠO MÃ QR CODE',
      router:'CreateClass',
      itemData: {},

    };
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;
  }
  static navigationOptions = {
    header: null,
  };


  getTextInput () {
    this.setState ({text_Output: this.state.itemData._id});
  };
  getOneItemFromDatabase() {
		console.log('getOne running');
		system.orderByChild('_id')
			.equalTo(this.state.currentItemId)
			.on('value', (childSnapshot) => {
				console.log('getOne running INSIDE 1');
				//Get OneItem
				var itemData = {};
				childSnapshot.forEach((doc) => {
					console.log('getOne running INSIDE 2');
					itemData = {
            _id: doc.toJSON()._id,
            className: doc.toJSON ().className,
            class: doc.toJSON ().class,
            subject: doc.toJSON ().subject,
            count: doc.toJSON ().count,
            teacher: doc.toJSON ().teacher,
					};
				});
				this.setState({
					itemData: itemData
        });
        // alert(this.state.itemData)
			});
	}

  async componentDidMount() {
		// await setItemToAsyncStorage('currentScreen', UpLoadImg);
		const currentItemId = await getItemFromAsyncStorage('currentItemId');
		await AsyncStorage.getItem('userData').then((value) => {
			const userData = JSON.parse(value);
			this.setState({
				currentItemId: currentItemId,
				userData: userData
			});
			});
    await this.getOneItemFromDatabase();
    await this.getTextInput();
	}
  render () {
    // const { navigation } = this.props;
    // const itemId = navigation.getParam(thamso, 'NO-ID');
    // const itemId = this.props.navigation.state.params.thamso;

    const {text_Input} = this.state;
    return (
      <View style={styles.container}>
      <Tittle {...this.props}/>
        <Text>
        {this.state.itemData._id}

        </Text>
        <View style={styles.viewQrcode}>
          {/* <QRCode
            value={this.state.text_Output}
            size={500}
            bgColor="black"
            fgColor="white"
          /> */}
        </View>
        <View>
          <TouchableOpacity
            style={styles.follow}
            onPress={() => this.props.navigation.navigate ('FollowClass')}
          >
            <Text style={{color: 'white', fontSize: 16}}>Quan Sát Trạng Thái Lớp</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
    flex: 1,
  },
  viewGetLinks: {
    height: 50,
    width: WIDTH,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewText: {
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getLinks: {
    height: 35,
    backgroundColor: '#039be5',
    borderColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    marginLeft: 40,
    marginVertical: 20,
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
  row1: {
    flexDirection: 'row',
    width: WIDTH,
    height: 70,
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    height: 40,
    borderColor: '#ff6e40',
    borderWidth: 2,
    marginVertical: 20,
    borderRadius: 10,
    paddingLeft: 30,
    width: WIDTH - 150,
  },
  viewQrcode: {
    // paddingVertical: WIDTH * 0.1,
    marginTop: WIDTH / 2 - 125,
    marginLeft: WIDTH / 2 - 125,
    height: 260,
    width: 260,
    marginBottom: 25,
  },
});
