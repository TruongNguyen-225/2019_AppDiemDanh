import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';

import LogIn from './LogIn';
import SignUp from './SignUp';

export default class Authentication extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super (props);
    this.state = {isSignIn: true};
  }

  gotoSignIn () {
    this.setState ({isSignIn: true});
  }

  signIn () {
    this.setState ({isSignIn: true});
  }

  signUp () {
    this.setState ({isSignIn: false});
  }
  onFail () {
    Alert.alert ('Notice', 'Email has been used by other', [{text: 'OK'}], {
      cancelable: false,
    });
  }
  goBackToMain () {
    return this.props.goBackToMain ();
  }
  render () {
    const {
      row1,
      iconStyle,
      titleStyle,
      container,
      controlStyle,
      signInStyle,
      signUpStyle,
      activeStyle,
      inactiveStyle,
    } = styles;

    const {isSignIn} = this.state;
    const mainJSX = isSignIn
      ? <LogIn goBackToMain={this.goBackToMain.bind (this)} />
      : <SignUp gotoSignIn={this.gotoSignIn.bind (this)} />;
    return (
      <View style={container}>
        <View style={row1}>

          {/* <Text style={titleStyle}>FACE RECOGNITION APP</Text> */}

        </View>
        {mainJSX}
        <View style={controlStyle}>
          <TouchableOpacity
            style={signInStyle}
            onPress={this.signIn.bind (this)}
          >
            <Text style={isSignIn ? activeStyle : inactiveStyle}>SIGN IN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={signUpStyle}
            onPress={this.signUp.bind (this)}
          >
            <Text style={!isSignIn ? activeStyle : inactiveStyle}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleStyle: {color: '#FFF', fontFamily: 'Avenir', fontSize: 30},
  iconStyle: {width: 30, height: 30},
  controlStyle: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  inactiveStyle: {
    color: '#fff',
  },
  activeStyle: {
    color: '#c30000',
  },
  signInStyle: {
    backgroundColor: '#448aff',
    alignItems: 'center',
    paddingVertical: 15,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    marginRight: 1,
  },
  signUpStyle: {
    backgroundColor: '#448aff',
    paddingVertical: 15,
    alignItems: 'center',
    flex: 1,
    marginLeft: 1,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
});
