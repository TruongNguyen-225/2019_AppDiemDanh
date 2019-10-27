import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Picker,
  Alert,
  NativeModules,
  FlatList,
} from 'react-native';
import firebase from 'react-native-firebase';
import {setItemToAsyncStorage} from '../HandleAuthentication/function';

import AsyncStorage from '@react-native-community/async-storage';
import Tittle from '../Header/Tittle';
import Global from '../../constants/global/Global';
import uuid from 'uuid/v4'; // Import UUID to generate UUID

var ImagePicker = NativeModules.ImageCropPicker;

const RootRef = firebase.database ().ref ().child ('members');

import DatePicker from 'react-native-datepicker';
import camera from '../../assets/icons/icons8-compact-camera-96.png';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');
const heightViewImg = HEIGHT * 0.21;

var thoigian = new Date ();
var date = thoigian.getDate ();
var month = thoigian.getMonth () + 1;
var year = thoigian.getFullYear ();

var currentDay = year + '-' + month + '-' + date;

export default class Update_Info extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor (props) {
    super (props);
    this.unsubcriber = null;
    this.state = {
      email: '',
      password: '',
      user: null,
      isAuthenticated: false,
      date: currentDay,
      MSSV: '',
      fullName: '',
      numberPhone: '',
      address: '',
      dateBirthday: '',
      sex: '',
      userData: {},
      tittle: 'CẬP NHẬT THÔNG TIN',
      router: 'Main',
      image: null,
      images: null,
      currentUser: null,
      imagePickArrayRef: [],
      imagePickArray: [],
      imageShowArray: [],
      proofs: [],
      avt: '',
      itemData: {},
    };
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;
  }
  async componentDidMount () {
    const {currentUser} = firebase.auth ();
    this.setState ({currentUser});

    await AsyncStorage.getItem ('userData').then (value => {
      const userData = JSON.parse (value);
      this.setState ({
        userData: userData,
        email: this.state.userData.email,
      });
      console.log ('chưa update', userData);
    });
    // this.getDataFromDB();
  }

  getDataFromDB () {
    console.log ('this', this.state.userData.email);
    RootRef.orderByChild ('id')
      .equalTo (this.state.userData.id)
      .on ('value', childSnapshot => {
        const userData = {};
        childSnapshot.forEach (doc => {
          itemData = {
            id: doc.toJSON ().id,
            email: doc.toJSON ().email,
            MSSV: doc.toJSON ().MSSV,
            fullName: doc.toJSON ().fullName,
            address: doc.toJSON ().numberPhone,
            proofs: doc.toJSON ().proofs,
            sex: doc.toJSON ().sex,
            address: doc.toJSON ().address,
            dateBirthday: doc.toJSON ().dateBirthday,
          };
        });
        this.setState ({
          itemData: itemData,
        });
      });
    console.log ('this', this.state.userData);
  }
  // getUserFromDB () {
  //   var userData = {};

  //   return new Promise (resolve => {
  //     RootRef.orderByChild ('email')
  //       .equalTo (this.state.userData.email)
  //       .on ('value', childSnapshot => {
  //         childSnapshot.forEach (doc => {
  //           userData = {
  //         id: doc.toJSON ().id,
  //         email: doc.toJSON ().email,
  //         MSSV: doc.toJSON ().MSSV,
  //         fullName: doc.toJSON ().fullName,
  //         address: doc.toJSON ().numberPhone,
  //         proofs: doc.toJSON ().proofs,
  //         sex: doc.toJSON ().sex,
  //         address: doc.toJSON ().address,
  //         dateBirthday: doc.toJSON ().dateBirthday,
  //           };
  //           resolve (userData);
  //         });

  //         // console.log('---------------',userData)

  //       });

  //   })
  //   .then(alert(JSON.stringify(userData)))
  //   // .then(setItemToAsyncStorage('userData',userData))

  // }
  getUserFromDB () {
    return new Promise (resolve => {
      RootRef.orderByChild ('email')
        .equalTo (this.state.userData.email)
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
          console.log (JSON.stringify (userData));
          resolve (userData);
        });
    });
  }
checkFomart(){
  const {
    fullName,
    numberPhone,
    dateBirthday,
    sex,
  } = this.state;
  var checkRegExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  var checkRegExp_Name = /^([A-Z])+([a-z])*$/;
  if (checkRegExp.test (numberPhone) == false) {
    Alert.alert ('Lỗi', 'Số điện thoại không đúng định dạng  !');
    return;
  }
  else if (checkRegExp_Name.test(fullName)==false)
  {
    Alert.alert ('Lỗi', 'Họ và tên không đúng định dạng  !');
    return;
  }
}
  async update () {
    const {
      MSSV,
      fullName,
      address,
      numberPhone,
      dateBirthday,
      sex,
    } = this.state;
    var checkRegExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    // var checkRegExp_Name = /^([A-Z])+([a-z])*$/;
    // var checkRegExp_Name = /^[a-z ,.'-]+$/i;
    var checkRegExp_Name=  /^[a-z A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/
    try {
      if (
        MSSV != '' &&
        fullName != '' &&
        address != '' &&
        numberPhone != '' &&
        dateBirthday != '' &&
        sex != ''
      ) {
        // if await this.checkFomart()
        if (checkRegExp.test (numberPhone) == false) {
          Alert.alert ('Lỗi', 'Số điện thoại không đúng định dạng  !');
          return;
        }
        else if (checkRegExp_Name.test(fullName)==false)
        {
          Alert.alert ('Lỗi', 'Họ và tên không đúng định dạng  !');
          return;
        }
        else {
          await this.uploadImageArray (this.state.imagePickArray);
          await RootRef.orderByChild ('id')
            .equalTo (this.state.userData.id)
            .on ('child_added', data => {
              data.key;
              RootRef.child (data.key)
                .update ({
                  MSSV: this.state.MSSV,
                  fullName: this.state.fullName,
                  numberPhone: this.state.numberPhone,
                  address: this.state.address,
                  dateBirthday: this.state.dateBirthday,
                  sex: this.state.sex,
                  proofs: this.state.proofs,
                })
                .then (async () => {
                  await AsyncStorage.clear ();
                  var userData = await this.getUserFromDB ();
                  setItemToAsyncStorage ('userData', userData);
                  console.log ('LOL', userData);
                })
                .catch (() => Alert ('Có lỗi xảy ra !'));
            });
          Alert.alert ('Thông báo', 'Cập nhật thông tin thành công !');
          this.props.navigation.navigate ('Main');
        }
        
      } else {
        Alert.alert (
          'Lỗi Cập Nhật',
          ' Vui lòng điền đầy đủ thông tin vào các trường'
        );
      }
    } catch (error) {
      alert (error);
    }
  }
  pickSingleWithCamera (mediaType = 'photo') {
    ImagePicker.openCamera ({
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    })
      //day image vao mang roi lay mang do ra map
      .then (image => {
        console.log (this.state.imagePickArray);
        this.setState ({
          imagePickArrayRef: [...this.state.imagePickArrayRef, image], //day image vao array  imagePickArrayRef
        });
      })
      .then (imagePickArray => {
        this.setState ({
          imagePickArray: this.state.imagePickArrayRef.map (i => {
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),
        });
      })
      .catch (e => alert (e));
  }

  pickMultiple = () => {
    ImagePicker.openPicker ({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
    })
      .then (imagePickArray => {
        ///console.log(imagePickArray);
        this.setState ({
          imagePickArray: imagePickArray.map (i => {
            //tao ra mang moi voi cac phan tu la ket qua tu viec thuc thi 1 ham len tung phan tu của mang dc goi
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),
        });
        console.log (this.state.imagePickArray);
      })
      .catch (e => alert (e));
  };
  setProofs (url, width, height, mime, filename) {
    const proof = {
      filename: filename,
      url: url,
      width: width,
      height: height,
      mime: mime,
    };
    this.setState ({
      proofs: [...this.state.proofs, proof],
    });
  }
  async uploadImageArray (imagePickArray) {
    for (var i = 0; i < imagePickArray.length; i++) {
      var path = imagePickArray[i].uri;
      var width = imagePickArray[i].width;
      var height = imagePickArray[i].height;
      var mime = imagePickArray[i].mime;

      var ext = path.split ('.').pop (); // Extract image extension
      var filename = `${uuid ()}.${ext}`; // Generate unique name

      // Stop loop to wait until this function finished
      await new Promise ((resolve, reject) => {
        const imageRef = firebase.storage ().ref (`ASSETS/${filename}`); // TẠO RA 1 FOLDER CHỨA IMG BÊN STRORAGE

        return imageRef
          .put (path, {contentType: mime})
          .then (() => {
            return imageRef.getDownloadURL ();
          })
          .then (url => {
            resolve (url);
            this.setProofs (url, width, height, mime, filename);
          })
          .catch (error => {
            console.log (`Some files upload failed`);
            reject (error);
            console.log ('Error uploading image: ', error);
          });
      });
    }
    // alert ('All files uploaded successfully');
  }

  pickSingleBase64 (cropit) {
    const avt = {
      image: this.state.image,
    };
    ImagePicker.openPicker ({
      width: 300,
      height: 300,
      cropping: cropit,
      includeBase64: true,
      includeExif: true,
    })
      .then (image => {
        // console.log('received base64 image');
        this.setState ({
          image: {
            uri: `data:${image.mime};base64,` + image.data,
            width: image.width,
            height: image.height,
          },
          images: null,
        });
      })
      .then (this.setState ({avt: [...this.state.avt, avt]}))
      .catch (e => alert (e));
  }
  setAvt (image) {
    const avt = {
      image: image,
    };
    this.setState ({avt: [...this.state.avt, avt]});
  }
  render () {
    const {inputStyle, bigButton, buttonText, inputStyle1} = styles;
    const {email, currentUser} = this.state;
    const viewHiden = (
      <View>
        <FlatList
          horizontal={true}
          // onTouchStart={() => {
          //   this.onEnableScroll (false);
          // }}
          // onMomentumScrollEnd={() => {
          //   this.onEnableScroll (true);
          // }}
          style={{borderWidth: 1, borderColor: 'green'}}
          data={this.state.imagePickArray}
          renderItem={({item, index}) => {
            return (
              <View style={styles.viewImg}>
                <Image
                  source={{uri: item.uri}}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
            );
          }}
          keyExtractor={(item, uri) => item.uri}
        />
      </View>
    );
    const checkView = this.state.imagePickArray ? viewHiden : <View />;

    return (
      <View style={styles.container}>
        <Tittle {...this.props} />
        <View style={styles.containerChild}>
          <ScrollView>
            <View style={{alignItems: 'center'}}>
              <View style={styles.viewHeader}>
                <Image
                  style={{
                    height: 130,
                    width: 130,
                    borderRadius: 65,
                  }}
                  source={this.state.image}
                />
              </View>
              <TouchableOpacity
                style={styles.uploadAvatar}
                onPress={() => this.pickSingleBase64 (true)}
              >
                <Image source={camera} style={{height: 30, width: 30}} />
              </TouchableOpacity>

            </View>
            <View style={styles.viewTextInput}>
              <TextInput
                style={inputStyle1}
                placeholder=""
                value={currentUser && currentUser.email}
                editable={false}
                // onChangeText={text => this.setState ({MSSV: text})}
              />
              <TextInput
                style={inputStyle}
                // placeholder={this.state.userData.MSSV}
                placeholder="Nhập mã số sinh viên của bạn"
                value={this.state.MSSV}
                onChangeText={text => this.setState ({MSSV: text})}
              />
              <TextInput
                style={inputStyle}
                placeholder={this.state.userData.fullName}
                // value={this.state.fullName}
                placeholder="Nhập đầy đủ họ và tên của bạn"
                onChangeText={text => this.setState ({fullName: text})}
              />
              <TextInput
                style={inputStyle}
                // placeholder={this.state.userData.numberPhone}
                placeholder="Nhập mã số điện thoại của bạn"
                value={this.state.numberPhone}
                onChangeText={text => this.setState ({numberPhone: text})}
              />
              <TextInput
                style={inputStyle}
                // placeholder={this.state.userData.address}
                placeholder="Nhập địa chỉ của bạn"
                value={this.state.address}
                onChangeText={text => this.setState ({address: text})}
              />
              <View style={styles.viewPickerBig}>
                <View style={styles.viewDatePicker}>
                  <View style={styles.textDateTime}>
                    <Text style={{color: '#597D9A'}}>Ngày sinh </Text>
                  </View>
                  <View style={{marginLeft: 30}}>
                    <DatePicker
                      style={{
                        width: WIDTH * 0.5,
                        // fontSize: 12,
                        backgroundColor: '#fff',
                      }}
                      date={this.state.date}
                      mode="date"
                      placeholder="select date"
                      format="YYYY-MM-DD"
                      minDate="1900-01-01"
                      maxDate="2030-01-01"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={true}
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          right: 0,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {},

                        // ... You can check the source to find the other keys.
                      }}
                      // onDateChange={date => {
                      //   this.setState ({dateBirthday: date});
                      // }}
                      onDateChange={date => {
                        this.setState ({date: date, dateBirthday: date});
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.viewPicker}>
                <View style={styles.viewTextPicker}>
                  <Text style={{color: '#597D9A'}}>Giới tính </Text>
                </View>
                <View style={styles.viewModalPicker}>
                  <Picker
                    selectedValue={this.state.sex}
                    value={this.state.sex}
                    style={{
                      height: 40,
                      width: WIDTH * 0.5,
                      borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                    }}
                    onValueChange={(value, itemIndex) =>
                      this.setState ({sex: value})}
                  >
                    <Picker.Item label=".: Chọn Giới Tính :." />
                    <Picker.Item label="Nam" value="nam" />
                    <Picker.Item label="Nữ" value="nữ" />
                  </Picker>
                </View>
              </View>

              <View style={styles.viewPicker}>
                <View style={{width: WIDTH * 0.4, paddingLeft: 30}}>
                  <Text style={{color: '#597D9A'}}>Upload Hình </Text>
                </View>

                <TouchableOpacity onPress={this.pickMultiple}>
                  <Text style={{color: '#597D9A'}}>UpLoad Img </Text>
                </TouchableOpacity>
              </View>
              {checkView}
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            alignItems: 'center',
            height: HEIGHT / 8,
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            style={bigButton}
            onPress={() => {
              this.update ();
            }}
          >
            <Text style={buttonText}>Cập Nhật Thông Tin</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    // backgroundColor: '#f1f1f1',
    backgroundColor: 'rgba(112, 119, 127, 0.3)',

  },
  containerChild: {
    backgroundColor: '#fff',
    width: WIDTH - 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    height: HEIGHT - HEIGHT * 0.185 - HEIGHT / 20,
    borderTopLeftRadius:5,
    borderTopRightRadius:5,

  },
  viewHeader: {
    height: 130,
    width: 130,
    borderWidth: 1,
    borderRadius: 65,
    alignItems: 'center',
    marginVertical: HEIGHT / 20,
    zIndex: 1,
  },
  inputStyle: {
    width: WIDTH * 0.9,
    height: 50,
    backgroundColor: '#90caf9',
    marginBottom: 10,
    borderRadius: 30,
    paddingLeft: 30,
  },
  inputStyle1: {
    width: WIDTH * 0.9,
    height: 50,
    backgroundColor: '#90caf9',
    marginBottom: 10,
    borderRadius: 30,
    paddingLeft: 30,
    color: '#666',
    fontWeight: '600',
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
  viewTextInput: {
    marginTop: -HEIGHT / 15,
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
  viewPickerBig: {
    height: 50,
    width: WIDTH * 0.9,
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#90caf9',
  },
  textDateTime: {
    // marginTop: -15,
    paddingLeft: 30,
    width: 100,
  },
  viewDatePicker: {
    borderColor: 'green',
    height: 45,
    width: WIDTH * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewPicker: {
    height: 50,
    width: WIDTH * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: '#90caf9',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
  viewTextPicker: {
    paddingLeft: 30,
    width: 100,
  },
  viewModalPicker: {
    borderWidth: 1,
    borderColor: '#999',
    marginLeft: 30,
  },
  viewHiden: {
    height: heightViewImg,
    width: WIDTH * 0.9,
    alignItems: 'center',
    borderWidth: 1,
  },
  viewImg: {
    margin: 2,
    height: heightViewImg,
    width: WIDTH * 0.23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
