import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import logoBack from '../icons/icons8-double-left-96.png';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');
export default class Tittle extends Component {
  render () {
    return (
      <View style={styles.content}>
        <View style={styles.contentChild}>
          <TouchableOpacity
            onPress={() => {
              this.props.onGoBack ();
            }}
            style={{height: 30, width: 30}}
          >
            <Image style={{height: 30, width: 30}} source={logoBack} />
          </TouchableOpacity>
        </View>

        <View style={styles.viewText}>
          <Text style={styles.styleText}>
            Manage Class
          </Text>
        </View>

        <View style={styles.rowAbout} />
      </View>
    );
  }
}
const styles = StyleSheet.create ({
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
  rowAbout: {
    height: 45,
    width: 100,
    backgroundColor: '#03a9f4',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
