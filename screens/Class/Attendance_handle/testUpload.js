import React, { Component } from "react";
import { View, Text, StyleSheet, Image, 
  FlatList, TextInput, PermissionsAndroid, 
  ImageBackground , ScrollView, Alert, 
  KeyboardAvoidingView, TouchableHighlight, Modal
      } from "react-native";
import Header from './Header';
import { setItemToAsyncStorage, getItemFromAsyncStorage } from 'Demon/Democode/function';
import ModalDropdown from 'react-native-modal-dropdown';

import ImagePicker from "react-native-image-crop-picker";
import firebase from "react-native-firebase";
import Button from "react-native-button";
import uuid from "uuid/v4"; // Import UUID to generate UUID
import { List, UpLoadImg } from "./Screenname";
import AsyncStorage from '@react-native-community/async-storage';
import {violation1} from 'Demon/Democode/data/OptionArray';

const LearnAppRef = firebase.database().ref('LearnApp/cases');
export default class UpLoadImgComponent extends Component {
  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Thêm phản ánh';
    let drawerIcon = () => (
        <Image 
        source = {require('../icons/paper-airplane-icon.png')}
        style = {{ width: 26, height: 26}}
   >
   </Image>
    );
    
    return { drawerLabel, drawerIcon };
}
  constructor() {
    super();
    this.state = {
      typedEmail: '',
      shortEmail: '',
      imagePickArrayRef: [],
      imagePickArray: [],
      imageShowArray: [],
      image: null,
      description: '',
      violation: '',
      proofs: [],
      isUploading: false,
      userData: {},
      position: '',
      positionInputPH: 'Đang tự tìm vị trí...',
      date: '',
      pickerSelection: 'Nhấp chọn...',// gia tri ban dau cua chu
      pickerDisplayed: false,
      enableScrollViewScroll: true,
      contact: '',
      address: '',
    };
  }
  
  onEnableScroll= (value = boolean) => {
    this.setState({
      enableScrollViewScroll: value,
    });
  };

  time(){
    var that = this;

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes

    that.setState({
      //Setting the value of the date time
      date:
        date + '/' + month + '/' + year + ' ' + hours + ':' + min,
    });
  }


  getAddress = async (latitude, longtitude) => {
		let url =
			'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=GgvdVa8maCACVxbx3j4N&app_code=1BydW29e6_LMvnARCmMUhw&mode=retrieveAddresses&prox=' +
			latitude +
			',' +
			longtitude +
			'&maxresults=1';

		let result = await fetch(url); // lay du lieu tu url
		let jsonResult = await result.json(); // chuyen result sang dang JSON

		//let addressFull = jsonResult.Response.View[0].Result;
		//console.log(addressFull);

		let fullStr = jsonResult.Response.View[0].Result[0].Location.Address.Label;

		headStr = '';
		footStr = '';
		for (let i = 0; i < fullStr.length; i++) {
			if (fullStr[i] === ',') {
				headStr = fullStr.slice(0, i);
				footStr = fullStr.slice(i + 2, fullStr.length);
				break;
			}
		}

		let district = jsonResult.Response.View[0].Result[0].Location.Address.District;
		let subDistrict = jsonResult.Response.View[0].Result[0].Location.Address.Subdistrict;

		let position = headStr + ', ' + subDistrict + ', ' + district + ', ' + footStr;

		this.setState({ position: position });
  };
  
  getPosition = async () => {
		await navigator.geolocation.getCurrentPosition(
			async (position) => {
				await this.getAddress(position.coords.latitude, position.coords.longitude);
				//console.log(position.coords);
			},
			(error) => {
				//console.log(error.message);
				this.setState({ positionInputPH: 'Nhấp vào để ghi...' });
			},
			{ enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
		);
	};

  pickSingleWithCamera(mediaType = "photo") {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      includeExif: true,
      mediaType
    })
      //day image vao mang roi lay mang do ra map
      .then(image => {
        console.log(this.state.imagePickArray);
        this.setState({
          imagePickArrayRef: [...this.state.imagePickArrayRef, image]//day image vao array  imagePickArrayRef
        });
      })
      .then(imagePickArray => {
        this.setState({
          imagePickArray: this.state.imagePickArrayRef.map(i => {
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime
            };
          })
        });
      })
      .catch(e => alert(e));
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true
    })
      .then(imagePickArray => {
        ///console.log(imagePickArray);
        this.setState({
          imagePickArray: imagePickArray.map(i => {//tao ra mang moi voi cac phan tu la ket qua tu viec thuc thi 1 ham len tung phan tu của mang dc goi
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime
            };
          })
        });
        console.log(this.state.imagePickArray);
      })
      .catch(e => alert(e));
  }

  pickVideo(){
    ImagePicker.openPicker({
      mediaType: "video",
    })
    .then(video => {
      console.log(this.state.imagePickArray);
      this.setState({
        imagePickArrayRef: [...this.state.imagePickArrayRef, video]//day image vao array  imagePickArrayRef
      });
    })
    .then(imagePickArray => {
      this.setState({
        imagePickArray: this.state.imagePickArrayRef.map(i => {
          return {
            uri: i.path,
            width: i.width,
            height: i.height,
            mime: i.mime
          };
        })
      });
    })
    .catch(e => alert(e));
  }
  
  setProofs (url, width, height, mime, filename){
    const proof = {
      filename : filename,
      url : url,
      width: width,
      height: height, 
      mime: mime
    };
    this.setState({
      proofs : [...this.state.proofs, proof]
    });
  }
  async uploadImageArray(imagePickArray) {
    for (var i = 0; i < imagePickArray.length; i++) {
      var path = imagePickArray[i].uri;
      var width = imagePickArray[i].width;
      var height = imagePickArray[i].height;
      var mime = imagePickArray[i].mime;

      var ext = path.split(".").pop(); // Extract image extension
      var filename = `${uuid()}.${ext}`; // Generate unique name

      // Stop loop to wait until this function finished
      await new Promise((resolve, reject) => {
        const imageRef = firebase.storage().ref(`LearnApp/${filename}`);

        return imageRef
          .put(path, { contentType: mime })
          .then(() => {
            return imageRef.getDownloadURL();
          })
          .then(url => {
            resolve(url);
            this.setProofs(url, width, height, mime, filename);

          })
          .catch(error => {
            console.log(`Some files upload failed`);
            reject(error);
            console.log("Error uploading image: ", error);
          });
      });
    }
    alert("All files uploaded successfully");
  }

  async submit() {
    if (this.state.description.trim() === '' || this.state.violation.trim() === ''|| this.state.position.trim() === ''
    || this.state.imagePickArray.length === 0 || this.state.contact.trim() ==='' || this.state.address.trim() === '') {
			Alert.alert('Thông báo','Vui lòng cung cấp đầy đủ thông tin...');
			return;
    }
    
		try {
			this.setState({
				isUploading: true
			});
			await this.uploadImageArray(this.state.imagePickArray);
			const truongHop = {
        id: require('random-string')({ length: 10 }),
        uploader: this.state.typedEmail,
        position: this.state.position,
				description: this.state.description,
        violation: this.state.violation,
        status: 'Đang chờ xử lý',
        reason:'chọn...',
        updater: '',
        proofs: this.state.proofs,
        date: this.state.date,
        contact: this.state.contact,
        address: this.state.address,
        report: 'Nhập họ tên người xử lý - hình thức xử lý...',
        datereport: 'Tự động sau khi cập nhật'
			};
			LearnAppRef.push(truongHop);
			this.setState({
				proofs: [],
				isUploading: false,		
			});
      Alert.alert('Thông báo','Gửi thành công, chờ xử lý!');
      this.props.navigation.navigate(List);
		} catch (error) {
			alert(error);
		}
	}
  // Link from storage to Realtime Database
  storageDatabaseRef(url, width, height, mime, filename) {
    const image = {
      name: filename,
      url: url,
      width: width,
      height: height,
      mime: mime
    };
    firebase
      .database()
      .ref("LearnApp")
      .push(image);
  }

  getURLfromDatabse() {
    firebase
      .database()
      .ref("LearnApp")
      .on("value", childSnapshot => {
        const imageShowArray = [];
        childSnapshot.forEach(doc => {
          imageShowArray.push({
            name: doc.toJSON().name,
            url: doc.toJSON().url,
            width: doc.toJSON().width,
            height: doc.toJSON().height,
            mime: doc.toJSON().mime
          });
        });
        this.setState({
          imageShowArray: imageShowArray
        });
        //console.log(JSON.stringify(this.state.imageShowArray, null, 4));
      });
  }
  async requestPermission() {
		try {
			await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
		} catch (err) {
			alert(`${err.toString()}`);
		}
	}
  async componentDidMount() {
    await this.requestPermission();
    this.getPosition();
    await setItemToAsyncStorage('currentScreen', UpLoadImg);
		await AsyncStorage.getItem('userData').then(async (value) => {
		const userData = JSON.parse(value);
    await this.setState({userData: userData});
    console.log(this.state.userData);
    const shortEmail = this.state.userData.email.split('@').shift();
		await this.setState({
      typedEmail: this.state.userData.email,
			shortEmail: shortEmail
		});
    });
     this.time(); 
  }
  
  //thay doi gia tri chu
	setPickerValue(newValue) {
		this.setState({
		  pickerSelection: newValue,
		  violation : newValue
		})
	
		this.togglePicker();
	  }
	 //an hien danh sach
	  togglePicker() {
		this.setState({
		  pickerDisplayed: !this.state.pickerDisplayed
		})
	  }

  render() {
    return (
      <View style = {{flex: 1}}>
      <Header {...this.props} />
      <ScrollView scrollEnabled={this.state.enableScrollViewScroll}>
      <View style={styles.container}>
        {/* <KeyboardAvoidingView behavior = 'padding' style={styles.container}> */}
        <View style={{
           alignItems: "center" ,
          alignSelf: 'center',
          width: "95%",
          /* height: '100%', */
          marginTop: "1%",
          /* backgroundColor:'yellow' */
        }}>
          <View style={{ flexDirection: "column",   alignItems: "center"     }}>
            
          <View style={{flexDirection: "row",  /* alignItems: "center" , */ justifyContent:'space-between' }}>
            <Button
              containerStyle={styles.btnContainer}
              style={styles.text}
              onPress={() => this.pickMultiple()}
            >
              <Image 
			      source = {require('../icons/photo-icon-13.jpg')}
			      style = {{ width: 50, height: 50}}>
	            </Image>
            </Button>
            <Button
              containerStyle={styles.btnContainer}
              style={styles.text}
              onPress={() => this.pickSingleWithCamera()}
            >
             <Image 
			      source = {require('../icons/357-3576881_a-lot-more-fluid-in-camera-blue-ico.png')}
			      style = {{ width: 50, height: 50}}>
	            </Image>
            </Button>
            <Button
              containerStyle={styles.btnContainer}
              style={styles.text}
              onPress={() => this.pickVideo()}
            >
               <Image 
			      source = {require('../icons/video-1364122_960_720.png')}
			      style = {{ width: 50, height: 50}}>
	            </Image>
            </Button>
            </View>

            <View style = {{
            height: 200,
            width: '50%',
            flexDirection: 'row',
             alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'red',
            borderWidth:1,
            }}>
          <FlatList
            horizontal = {true}
            onTouchStart={() => {
              this.onEnableScroll( false );
           }}
           onMomentumScrollEnd={() => {
              this.onEnableScroll( true );
           }}
            data={this.state.imagePickArray}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <Image style={[styles.image, {justifyContent: 'center'}]} source={{ uri: item.uri }} />
                </View>
              );
            }}
            keyExtractor={(item, uri) => item.uri}
          />
          </View>
          </View>
          <Text style = {{fontStyle: 'italic'}}>Trượt ngang để xem ảnh</Text>
          <Text style = {{fontStyle: 'italic', alignSelf:'center'}}>(Nếu tải lên nhiều ảnh hoặc xem đầy đủ kích thước ảnh)
          <Text style = {{color: 'red', fontStyle:'italic'}}>(*)</Text>
          </Text>
          <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, alignSelf: 'stretch',marginBottom:'2%',marginTop:'2%'}} /> 
          </View>

           <KeyboardAvoidingView behavior = 'padding' /* style={{flex:1, alignItems:'flex-start'}} */>
          <View
						style={{ alignSelf: 'flex-start', width:'100%'}}>
              <View style={[styles.propertyValueRowView]}>
						<Text
							style={{
								fontSize: 13,
								color: 'black',
                //textAlign: 'center'
                marginLeft: '2%'
							}}>
							Vi phạm <Text style = {{color: 'red', fontStyle:'italic'}}>(*)</Text>:{' '}
						</Text>

					<Button 
					style={{
						fontSize: 13,
						color: 'red'
					}}
        				onPress={() => this.togglePicker()}
        			> 
					{ this.state.pickerSelection }
					</Button>
        			<Modal visible={this.state.pickerDisplayed} animationType={"slide"} transparent={true}>
          			<View style={{ margin: 20, padding: 20,
            			backgroundColor: '#efefef',
            			bottom: 20,
            			left: 20,
            			right: 20,
            			alignItems: 'center',
            			position: 'absolute' }}>
						<Text style = {{fontWeight: 'bold'}}>--Chọn vi phạm--</Text>
            			{ violation1.map((value, index) => {
              			return <TouchableHighlight key={index} onPress={() => this.setPickerValue(value.title)} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  	<Text>{ value.title }</Text>
                </TouchableHighlight>
            })}

            
            <TouchableHighlight onPress={() => this.togglePicker()} style={{ paddingTop: 4, paddingBottom: 4 }}>
              <Text style={{ fontWeight: 'bold' }}>Thoát</Text>
            </TouchableHighlight>
          </View>
        </Modal>

            </View>
            {/* <KeyboardAvoidingView behavior = 'padding' style={{flex:1, alignContent: 'center'}}> */}
            <View style={[styles.propertyValueRowView, { alignItems:'center'}]}>
							<Text style={[styles.propertyText,{color: 'black', marginLeft: '2%'}]}>
                Vị trí <Text style = {{color: 'red', fontStyle:'italic'}}>(*)</Text>:{' '}
                </Text>
							<TextInput
								style={styles.positionInput}
								placeholder={this.state.positionInputPH}
								placeholderTextColor='black'
								value={this.state.position}
								onChangeText={(text) => {
									this.setState({ position: text });
								}}
							/>
						</View>
            <Text style={[styles.propertyText,{color: 'grey', marginLeft: '2%',fontStyle:'italic'}]}>
                (Cần phải bật định vị để tự động định vị trí vi phạm, tự định vị có thể không chính xác,
                người dùng có thể nhấp kéo để kiểm tra và sửa.)
                </Text>
             <View style={[styles.propertyValueRowView]}><TextInput
						style={styles.multilineBox }
						placeholder='Nhập số điện thoại liên hệ (*)...'
						multiline={true}
						editable={true}
						maxLength={500}
						onChangeText={(text) => {
							this.setState({ contact: text });
						}}
					/></View> 
            <View style={[styles.propertyValueRowView]}><TextInput
						style={styles.multilineBox }
						placeholder='Nhập địa chỉ liên hệ (*)...'
						multiline={true}
						editable={true}
						maxLength={500}
						onChangeText={(text) => {
							this.setState({ address: text });
						}}
					/></View> 
          <View style={[styles.propertyValueRowView]}>
        <TextInput
						style={[styles.multilineBox] }
						placeholder='Mô tả ngắn gọn nội dung phản ánh (*)...' 
						multiline={true}
						editable={true}
						maxLength={500}
						onChangeText={(text) => {
							this.setState({ description: text });
						}}
					/>
        </View>
					</View >
          
        <View style={styles.subViewContainer}>
          {/*<Button
            containerStyle={styles.btnContainer}
            style={styles.text}
            onPress={() => this.uploadImageArray(this.state.imagePickArray)}
          >
            Upload
          </Button>*/}
          <Button
          //thuoc tinh nut
					containerStyle={{
						width: 250,
						height: 50,
						marginTop: 2,
						marginBottom: '1%',
						alignSelf: 'center',
						/* justifyContent: 'center',
            alignItems: 'center', */
            backgroundColor: '#7FFF00',
          }}
          //thuoc tinh chu dang bai truoc khi them anh
					style={{
						fontSize: 19,
						fontWeight: 'bold',
						color: 'white',
            marginTop: 10,
            marginBottom: 10,
						textAlign: 'center',
            textAlignVertical: 'center',
					}}
					onPress={() => {
						this.submit();
					}}>
					Gửi phản ánh
				</Button>
        <View><Text style = {{fontStyle: 'italic', color: 'red', alignSelf:'center'}}>(*) là bắt buộc</Text></View>
        </View>
        </KeyboardAvoidingView>
        </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    /*  flex: 1, */
    alignItems: 'center',
    //justifyContent: 'center',
    alignSelf: 'center'
    //backgroundColor:'white'
  },
  //thuoc tinh chu dang bai sau khi them anh
  subViewContainer: {
    alignSelf: 'center',
    width: "95%",
    height: "45%",
    marginTop: "5%",
  },
  btnContainer: {
    margin: "1%",
    padding: "1%",
    //backgroundColor: "rgb(120, 10, 260)",
    //width: 100
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center"
  },
  image: {
      width: 300,
      height: 200,
      resizeMode: 'contain'
  },
  multilineBox: {
		width: '96%',
		height: 70,
		marginTop: 20,
		borderColor: 'red',
		borderWidth: 2,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    marginLeft: '2%'
  },
  propertyValueRowView: {
		flexDirection: 'row',
    justifyContent: 'flex-start',
		//alignItems: 'center',
		marginTop: 0,
		marginBottom: 0
  },
  propertyValueRowView1: {
		flexDirection: 'row',
    justifyContent: 'flex-start',
		/* alignItems: 'center', */
		marginTop: 0,
		marginBottom: 0
  },
  propertyText: {
		fontSize: 13,
		color: 'grey',
		//textAlign: 'justify'
  },
  positionInput: {
		width: '60%',
		height: 46,
		fontSize: 13,
		color: 'red',
    fontWeight: 'bold',
   

	},
});
