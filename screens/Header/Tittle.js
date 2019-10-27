import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import logoBack from '../../assets/icons/back.png'
import Global from '../../constants/global/Global';
import OfflineNotice from '../Header/OfflineNotice';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');
export default class Tittle extends Component {
  render () {
    return (
      <View style={styles.content}>
        <StatusBar backgroundColor="#2196f3" barStyle="light-content" />
        <OfflineNotice />
        <View style={styles.contentChild}>
          <TouchableOpacity
            onPress={() => {
              // this.props.navigation.push(Global.router);
              this.props.navigation.goBack();
            }}
            style={{height: 30, width: 30}}
          >
            <Image style={{height: 30, width: 30, tintColor:'white'}} source={logoBack} />
          </TouchableOpacity>
        </View>

        <View style={styles.viewTextTittle}>
          <Text style={styles.styleText}>
            {Global.tittle}
          </Text>
        </View>

        <View style={styles.rowAbout} />
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  content: {
    height: HEIGHT / 20,
    // backgroundColor: '#03a9f4',
    backgroundColor:'#2196f3',

    flexDirection: 'row',
    alignItems:'center',
    // justifyContent:'space-between'

  },
  contentChild: {
    height: 45,
    width: WIDTH *0.18,
    paddingHorizontal: 20,
    alignItems:'center',
    justifyContent: 'center',
    // borderWidth:1
  },
  viewTextTittle: {
    height: 45,
    width: WIDTH*0.64,
    // marginLeft: (WIDTH - WIDTH / 10 - 140 - 40) / 2,
    justifyContent: 'center',
    alignItems:'center'
  },
  styleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  rowAbout: {
    height: HEIGHT / 20,
    width:WIDTH *0.18,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
