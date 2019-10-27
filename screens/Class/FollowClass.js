import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import firebase from 'react-native-firebase';
import Global from '../../constants/global/Global';
import Tittle from '../Header/Tittle';
import AddModal from './AddModal';
import * as Animatable from 'react-native-animatable';

import samesame from '../../assets/images/samesamemon.jpg';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

var system = firebase.database ().ref ().child ('members');
export default class CreateClass extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super (props);
    this.state = {
      dataArray: [],
      class: [],
      newClassName: '',
      loading: false,
      className: '',
      refesh: false,
      tittle: '',
      router: 'InitClass',
      arrayClass: null,
      sendIdToModal: '',
      chuathamgia: 0,
      siso: 0,
      count: 0,
      fullStudent:false,
    };
    const idType = this.props.navigation.state.params.thamso;
    const listStudent = this.props.navigation.state.params.listStudent;

    // Global.router = this.state.router;
    Global.tittle = idType.className;
    // Global.tittle = listStudent.email
    Global.siso = parseInt (idType.count);
    this._onPressAdd = this._onPressAdd.bind (this);
    // alert(idType.count)
  }
  componentDidMount () {

    // Global.router = this.state.router;
    this.getDataFromDB ();
    const listStudent = this.props.navigation.state.params.listStudent;
  //  console.log('nhận listStudent',listStudent.length)
  //  console.log('siso tai đây',Global.siso)
   if( listStudent.length == Global.siso)
   {
     this.setState({
      fullStudent: true,
     })
   }
  }
  getDataFromDB () {
    system.on ('value', childSnapshot => {
      const dataArray = [];
      childSnapshot.forEach (doc => {
        dataArray.push ({
          id: doc.toJSON ().id,
          fullName: doc.toJSON ().fullName,
          email: doc.toJSON ().email,
          MSSV: doc.toJSON ().MSSV,
          numberPhone: doc.toJSON ().numberPhone,
          proofs: doc.toJSON ().proofs,
          sex: doc.toJSON ().sex,
          address: doc.toJSON ().address,
          dateBirthday: doc.toJSON ().dateBirthday,
        });
      });
      this.setState ({
        dataArray: dataArray.sort ((a, b) => {
          return a.date < b.date;
        }),
        count: dataArray.length,
      });
    });
  }

  onPressAdd = () => {
    if (this.state.newClassName.trim () === '') {
      alert ('class name is blank');
      return;
    }
    try {
      system.push ({
        className: this.state.newClassName,
      });
    } catch (e) {
      alert (e);
    }
  };
  onGoToDetail = () => {
    const {className} = this.state.class;
    if (this.state.newClassName != '') {
      alert (this.state.newClassName);
      this.props.navigation.navigate ('CLASS_DETAILS', {
        thamso: this.state.newClassName,
      });
    }
  };
  refesh () {
    this.setState ({
      refesh: true,
    });
  }
  _onPressAdd () {
    this.refs.addModal.showAddModal ();
  }
 async closeClass(){
  const idType = this.props.navigation.state.params.thamso;
  // console.log('path',firebase.database().ref().child(`Manage_Class/`+Global.tittle).path)
try{
  await firebase.database().ref().child('Manage_Class').orderByChild ('className')
  .equalTo (Global.tittle)
  .on ('child_added', data => {
    data.key;
    firebase.database().ref().child('Manage_Class').child (data.key)
      .update ({
        status:true,
        isChecked:'Đã Chốt Lớp , Lớp Có Thể Điểm Danh'
      })
      .catch (() => Alert ('Có lỗi xảy ra !'));
  });
Alert.alert ('Thông báo', 'Cập nhật thông tin thành công !');
this.props.navigation.navigate ('Loading');
}catch(e)
{
  window.location.href="http://stackoverflow.com/search?q=[js]+"+e.message;
}
  }
  render () {
    const viewFullStudent = (
      <View>
        <Text style={{alignItems:'center',justifyContent:'center'}}>Lớp Đã Đủ HS Tham Gia , Vui Lòng Chốt Lớp !</Text>
        <View
          style={{
            alignItems: 'center',
            height: HEIGHT / 8,
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            style={styles.bigButton}
            onPress={() => {
              this.closeClass ();
            }}
          >
            <Text style={styles.buttonText}>CHỐT LỚP</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
    const showBtnCloseClass = this.state.fullStudent ? viewFullStudent : null
    const idType = this.props.navigation.state.params.thamso;
    const listStudent = this.props.navigation.state.params.listStudent;

    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0}}>
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
        <Tittle {...this.props} />
        <ScrollView>
          <View style={{zIndex: 1}}>
            <FlatList
              refreshing={this.state.refesh} // 2 hàm cần thiết để làm fullFresh
              onRefresh={() => {
                this.refesh ();
              }}
              onEndReachedThreshold={-0.2} //2 hàm cần để khi lướt đến cuối trang thì sẽ load thêm dữ liệu :v
              onEndReached={() => {
                this.refesh ();
              }}
              // data={this.state.dataArray}
              data={listStudent}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    // onPress={() =>
                    //   this.props.navigation.navigate ('Attendance',{infoPerson:item})}
                  >
                    <View style={styles.row}>
                      <View style={styles.left}>
                        <Image
                          style={{
                            width: HEIGHT / 10,
                            height: HEIGHT / 10,
                            borderRadius: HEIGHT / 20,
                          }}
                          source={samesame}
                        />
                      </View>
                      <View style={styles.right}>
                       
                      <Text style={{fontSize: 14, fontWeight: '600'}}>
                          MSSV : {item.MSSV}
                        </Text>
                        <Text style={{fontSize: 14, fontWeight: '600'}}>
                          Email : {item.email}
                        </Text>
                        {/* <Text style={{fontSize: 14, fontWeight: '600'}}>
                          Name : {item.fullName}
                        </Text> */}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, id) => item.id}
            />
            {showBtnCloseClass}
          </View>
        </ScrollView>
        <Animatable.View
          animation="rubberBand"
          iterationCount={10000}
          direction="alternate"
          // style={{alignItems:'center',width: '90%',height: '7%',}}
          style={styles.btnRubberBand}
        >
          <TouchableOpacity
            onPress={this._onPressAdd}
            style={{width: '100%', height: '100%', justifyContent: 'center'}}
          >
            <Text style={{textAlign: 'center'}}>Lấy QRCode</Text>
          </TouchableOpacity>
        </Animatable.View>
        <View style={styles.viewResult}>
          <View style={styles.viewResultChild}>
            <Text style={styles.textResult}>Sĩ Số :{Global.siso}</Text>
            <Text style={styles.textResult}>
              Đã tham gia: {this.state.count}
            </Text>
          </View>
          <View style={styles.viewResultChild}>
            <Text style={styles.textResult}>
              Chưa tham gia : {Global.siso - this.state.count}
            </Text>
          </View>
        </View>
        <AddModal ref={'addModal'} parentFlatList={this} {...this.props} />
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  viewText: {
    height: 'auto',
    justifyContent: 'center',
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: '#03a9f4',
  },
  textDirector: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#fff',
  },
  row: {
    // padding: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    height: HEIGHT / 8,
    // width: 'auto',
    color: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    height: HEIGHT / 10,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 2,
    height: HEIGHT / 10,
    width: 'auto',
    justifyContent: 'center',
    marginLeft: 15,
  },
  viewResult: {
    // flex:1,
    zIndex: 10,
    backgroundColor: '#4bacb8',
    height: HEIGHT / 9,
    // width: WIDTH,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  textResult: {marginVertical: 5, fontSize: 15, width: WIDTH * 0.4},
  viewResultChild: {flexDirection: 'row', marginHorizontal: WIDTH / 14},
  viewQrcode: {
    // paddingVertical: WIDTH * 0.1,
    marginTop: WIDTH / 2 - 125,
    marginLeft: WIDTH / 2 - 125,
    height: 260,
    width: 260,
    marginBottom: 25,
  },
  btnRubberBand: {
    backgroundColor: 'tomato',
    opacity: 0.9,
    color: '#fff',
    width: '100%',
    height: '7%',
    // borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    // marginHorizontal: '5%',
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
