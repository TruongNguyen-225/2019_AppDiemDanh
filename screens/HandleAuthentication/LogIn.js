import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {setItemToAsyncStorage} from './function';

const RootRef = firebase.database ().ref ().child ('members');

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

import logo from '../../assets/images/Logo_login.png';
// import camera from '../../icons/icons8-compact-camera-96.png';
import btnLogin from '../../assets/images/btnSignUp.png';
export default class Login extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {email: '', password: '', errorMessage: null};
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
  getUserFromDB () {
    return new Promise (resolve => {
      RootRef.orderByChild ('email')
        .equalTo (this.state.email)
        .on ('value', childSnapshot => {
          var userData = {};
          childSnapshot.forEach (doc => {
            userData = {
              email: doc.toJSON ().email,
              id: doc.toJSON ().id,
              MSSV: doc.toJSON ().MSSV,
              fullName: doc.toJSON ().fullName,
              address: doc.toJSON ().numberPhone,
              proofs: doc.toJSON ().proofs,
              sex: doc.toJSON ().sex,
              address: doc.toJSON ().address,
              dateBirthday: doc.toJSON ().dateBirthday,
            };
          });
          resolve (userData);
        });
    });
  }

  handleLogin = () => {
    if (this.state.email == '' || this.state.password == '') {
      Alert.alert ('Thông báo', 'Email và Password không được bỏ trống');
      return;
    }
    firebase
      .auth ()
      .signInWithEmailAndPassword (this.state.email, this.state.password)
      .then (async loginUser => {
        const userData = await this.getUserFromDB ();
        setItemToAsyncStorage ('userData', userData);
        console.log (userData);
        Alert.alert ('Thông báo', userData.email);
        this.props.navigation.navigate ('HomeScreen');
      })
      .catch (error => {
        Alert.alert (`${error.toString ().replace ('Error: ', '')}`);
      });
  };

  render () {
    return (
      <View style={styles.container}>
        <Text style={{color: 'red'}}>
          {this.state.errorMessage}
        </Text>
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
          <View style={{marginTop: HEIGHT * 0.02, alignItems: 'center',marginTop:30,}}>
            <TouchableOpacity
              style={styles.bigButton}
              onPress={this.handleLogin}
            >
              <Text style={styles.buttonText}>Log In Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputStyleQuestion}>
            <TouchableOpacity
              style={{width: WIDTH * 0.4}}
              onPress={() => this.props.navigation.navigate ('')}
            >
              <Text style={{fontSize: 13, color: 'blue'}}>Quên mật khẩu ?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: WIDTH * 0.6}}
              onPress={() => this.props.navigation.navigate ('SignUp')}
            >
              <Text style={{fontSize: 13, color: 'blue'}}>
                Bạn chưa có tài khoản ?
              </Text>
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
  content: {
    height: 45,
    backgroundColor: '#03a9f4',
    flexDirection: 'row',
  },
  contentChild: {
    height: 45,
    width: WIDTH / 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  mainInput:{
    paddingVertical:70,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius:10,
    width: WIDTH*0.93,
    marginTop:80,
    paddingBottom:50,
  },
  viewText: {
    height: 45,
    width: 140,
    marginLeft: (WIDTH - WIDTH / 10 - 140 - 40) / 2,
    justifyContent: 'center',
  },
  styleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  uploadAvatar: {
    height: 60,
    backgroundColor: '#f1f1f1',
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    top: -110,
    zIndex: 10,
    position: 'relative',
    left: 60,
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
    // backgroundColor: '#fff',
        // backgroundColor: 'rgba(255,255,255,0.85)',

    marginBottom: 10,
    borderRadius: 30,
    paddingLeft: 30,
    flexDirection: 'row',
    alignItems: 'center',
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
