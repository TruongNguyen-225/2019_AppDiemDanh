import React, {Component} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

import icons_menu from '../../assets/icons/menu.png';
export default class OpenDrawer extends Component {
  constructor (props) {
    super (props);
    this.state = {};
  }

  render () {
    return (
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.icons}
          // onPress={() => this.onOpenDrawer ()}
          onPress={()=> this.props.navigation.openDrawer()}
          // onPress= {() => this.props.navigation.navigate(drawera)}
        >
          <Image source={icons_menu} style={{height: 40, width: 40, tintColor:'#fff',bottom:5}} />
        </TouchableOpacity>
        <View style={{width: 45}}>
          <Text />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  topBar: {
    flexDirection: 'column',
    width: WIDTH * 0.13,
    height: HEIGHT / 12,
    // backgroundColor: '#03a9f4',
    backgroundColor:'#2196f3',
    // paddingBottom: 8,
    paddingTop: (HEIGHT / 12 - HEIGHT / 20) / 2,

  },
  topBar2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInput: {
    height: HEIGHT / 20,
    width: WIDTH * 0.75,
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingVertical: 0,
    borderRadius: 20,
  },
  icons: {
    height: 45,
    width: 45,
    marginLeft: 10,
  },
});
