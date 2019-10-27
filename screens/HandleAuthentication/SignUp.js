import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import firebase from 'react-native-firebase';
import {setItemToAsyncStorage} from './function';
import logo from '../../assets/images/Logo_login.png';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

const RootRef = firebase.database ().ref ().child ('members');
let id = require ('random-string') ({length: 10});
export default class SignUp extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    id: require ('random-string') ({length: 10}),
    email: '',
    password: '',
    errorMessage: null,
    MSSV: '',
    fullName: '',
    numberPhone: '',
    address: '',
    dateBirthday: '',
    sex: '',
    avt: [],
    proofs: [{_id: id}],
  };
  componentDidMount () {
    this.unsubcriber = firebase.auth ().onAuthStateChanged (changedUser => {
      this.setState ({
        user: changedUser,
      });
    });
  }

  componentWillUnmount () {
    if (this.unsubcriber) {
      this.unsubcriber ();
    }
  }
  handleSignUp = () => {
    if (this.state.email == '' || this.state.password == '') {
      Alert.alert ('Thông báo', 'Email, Password không được bỏ trống');
      return;
    }
    firebase
      .auth ()
      .createUserWithEmailAndPassword (this.state.email, this.state.password)
      .then (async () => {
        const {
          email,
          id,
          MSSV,
          fullName,
          numberPhone,
          address,
          dateBirthday,
          sex,
          avt,
          proofs,
        } = this.state;
        const userData = {
          email,
          id,
          MSSV,
          fullName,
          numberPhone,
          address,
          dateBirthday,
          sex,
          avt,
          proofs,
        };
        RootRef.push (userData);
        await setItemToAsyncStorage ('userData', userData);
        Alert.alert ('Thông báo', 'Đăng ký thành công\nTự động đăng nhập...');
        this.props.navigation.navigate ('HomeScreen');
      })
      //dang ky that bai
      .catch (error => {
        alert (`${error.toString ().replace ('Error: ', '')}`);
      });
  };
  render () {
    return (
      <View style={styles.container}>
        {this.state.errorMessage &&
          <Text style={{color: 'red'}}>
            {this.state.errorMessage}
          </Text>}
           <View style ={{borderWidth:0}}>
          <Image source={logo} style={{borderWidth:0}}/>
          {/* <Text style={{fontFamily:'Anson'}}>Welcome</Text> */}
        </View>
        <View style={styles.mainInput}>
          <View style={styles.viewTextInput}>
            <TextInput
              style={styles.inputStyle}
              autoCapitalize="none"
              placeholder="Email"
              onChangeText={email => this.setState ({email})}
              value={this.state.email}
            />
            <TextInput
              secureTextEntry
              style={styles.inputStyle}
              autoCapitalize="none"
              placeholder="Password"
              onChangeText={password => this.setState ({password})}
              value={this.state.password}
            />
          </View>
          <View style={{marginTop: HEIGHT * 0.02, alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.bigButton}
              onPress={this.handleSignUp}
            >
              <Text style={styles.buttonText}>Sign Up Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputStyleQuestion}>
            <TouchableOpacity
              style={{width: WIDTH * 0.4}}
              onPress={() => this.props.navigation.navigate ('LogIn')}
            >
              <Text style={{fontSize: 13, color: 'blue'}}>
                Bạn đã có tài khoản ?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: WIDTH * 0.4}}
              onPress={() => this.props.navigation.navigate ('')}
            >
              <Text style={{fontSize: 13, color: 'blue'}} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    backgroundColor: 'rgba(62, 145, 228,0.7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    mainInput:{
    paddingVertical:70,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius:10,
    width: WIDTH*0.93,
    marginTop:80,
    paddingBottom:50,
  },
 inputStyle: {
    width: WIDTH * 0.85,
    height: 50,
    backgroundColor: '#90caf9',
    marginBottom: 10,
    borderRadius: 30,
    paddingLeft: 30,
  },
  inputStyleQuestion: {
    width: WIDTH * 0.9,
    height: 50,
    marginBottom: 10,
    borderRadius: 30,
    paddingLeft: 30,
    alignItems:'center',
    justifyContent: 'center',
  },
   bigButton: {
    
    width: WIDTH * 0.75,
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
  viewTextInput: {
    // borderColor: 'red',
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
