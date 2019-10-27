import React, {Component} from 'react';
import {
  View,
  Dimensions,
  TextInput,
  StyleSheet,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

export default class Search_TextInput extends Component {
  constructor (props) {
    super (props);
    this.state = {
      txtSearch: '',
    };
  }

  render () {
    const {txtSearch} = this.state;
    return (
      <View style={styles.topBar}>

        <TextInput
          style={styles.textInput}
          placeholder={'Nhập tên lớp để tìm kiếm ?'}
          placeholderTextColor={'#333'}
          underlineColorAndroid="transparent"
          value={txtSearch}
          onChangeText={text => {
            this.setState ({txtSearch: text});
          }}
          onFocus={() => this.props.onGoToSearch ()}
          // onSubmitEditing={this.onSearchProduct.bind(this)}
        />

        <View style={{width: 45}}>
          <Text />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  topBar: {
    // flexDirection: 'column',
    width: WIDTH * 0.87,
    height: HEIGHT / 12,
    // backgroundColor: '#03a9f4',
    backgroundColor:'#2196f3',

    paddingTop: (HEIGHT / 12 - HEIGHT / 20) / 2,
    paddingLeft: 10,
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
    backgroundColor: '#0288d1',
    opacity: 0.6,
    paddingLeft: 10,
    paddingVertical: 0,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icons: {
    height: 45,
    width: 45,
    marginLeft: 10,
  },
});
