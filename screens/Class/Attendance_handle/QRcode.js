import React, { Component } from 'react';
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
import Global from '../../../constants/global/Global';
import Tittle from '../../Header/Tittle';

import QRCode from 'react-native-qrcode-svg';
import CountDown from 'react-native-countdown-component';

const { width: WIDTH } = Dimensions.get('window');
const { height: HEIGHT } = Dimensions.get('window');

var system = firebase.database().ref().child('members');
var thoigian = new Date();
var date = thoigian.getDate();
var month = thoigian.getMonth() + 1;
var year = thoigian.getFullYear();
var hour = thoigian.getHours();
var minutes = thoigian.getMinutes();
var seconds = thoigian.getSeconds();
var getTime = thoigian.getTime();

var datecurrent = year + '-' + month + '-' + date;
var time = hour + ':' + minutes + ':' + seconds;
// var datetime = 'date and time attendance at ' + datecurrent;
var datetime = parseInt(hour)*60*60 + parseInt(minutes)*60 + parseInt(seconds);
export default class CreateClass extends Component {
    static navigationOptions = {
        header: null,
    }; 
    constructor(props) {
        super(props);
        this.state = {
            datecurrent: datecurrent,
            datetime: getTime,
            keyClassCurrent: null,
            timeGetQrCode:datetime,
            // time:time,
        };
        const idType = this.props.navigation.state.params.thamso;
        const listStudent = this.props.navigation.state.params.listStudent;

        Global.tittle = idType.className;
        Global.siso = parseInt(idType.count);
    }
    componentDidMount() {
        console.log('datetime bằng ',this.state.test);
        console.log('time bằng ',this.state.time);

        const keyClass = this.props.navigation.state.params.keyClass;
        const idType = this.props.navigation.state.params.thamso;
        // console.log('componentDidMount chạy 1');
        // console.log('datetime check xem', this.state.datetime)
        // const { timeGetQrCode } = this.state;
        // firebase.database().ref().child(`Manage_Class/${keyClass}/Attendance/${this.state.datecurrent}`)
        //     .orderByChild('timeGetQrCode').equalTo({ timeGetQrCode }).once('value', childSnapshot => {
        //         if (childSnapshot.exists()) {
        //             Alert.alert(
        //                 'Thông báo',
        //                 `Bạn đã điểm danh lớp ${idType.className}, chức năng tạm thời bị vô hiệu hóa !`
        //             );
        //             this.props.navigation.navigate('Screen_Handle');
        //         }
        //     })
    }
    async changeIDclass() {
        const idType = this.props.navigation.state.params.thamso;
        const keyClass = this.props.navigation.state.params.keyClass;
        const keyPath = this.props.navigation.state.params.key;
        // console.log('keyPath',keyPath);
        // console.log('path',
        //     firebase.database().ref().child(`Manage_Class/${keyClass}/Attendance/${this.state.datecurrent}/${keyPath}`)
        // )
        // var keyNodeTimer = firebase.database().ref().child(`Manage_Class/${keyClass}/Attendance/${this.state.datecurrent}`).push().key
        // console.log(`keyNodeTimer ${keyNodeTimer}`) 
        try {
            await firebase.database().ref().child('Manage_Class').orderByChild('className')
                .equalTo(Global.tittle)
                .once('child_added', data => {
                    data.key;
                    firebase.database().ref().child('Manage_Class').child(data.key)
                        .update({
                            _id: require('random-string')({ length: 10 }),
                        })
                        .catch(() => Alert('Có lỗi xảy ra !'));
                });
                await firebase.database().ref().child('Manage_Class').orderByChild('className')
                .equalTo(Global.tittle)
                .on('child_added', data => {
                    data.key;
                    // firebase.database().ref().child(`Manage_Class/${keyClass}/Attendance/${this.state.datecurrent}/-Ls10dqzJmdR2qXTp6No`)
                    firebase.database().ref().child(`Manage_Class/${keyClass}/Attendance/${this.state.datecurrent}/-KHONGDUOCXOACAINAY`)
                        .set({
                            // _id: require('random-string')({ length: 10 }),
                            className: `${idType.className}`,
                            datetime: this.state.timeGetQrCode,
                        })
                        .catch(() => Alert('Có lỗi xảy ra !'));
                });

                await firebase.database().ref().child('Manage_Class').orderByChild('className')
                .equalTo(Global.tittle)
                .once('child_added', data => {
                    data.key;
                    firebase.database().ref().child(`Manage_Class/${keyClass}/Attendance/${this.state.datecurrent}`).child(`-KHONGDUOCXOACAINAY`)
                        .update({
                            // _id: require('random-string')({ length: 10 }),
                            // className: `${idType.className}`,
                            datetime: this.state.timeGetQrCode,
                        })
                        .catch(() => Alert('Có lỗi xảy ra !'));
                });

            // await firebase.database().ref().child('Manage_Class').orderByChild('className')
            //     .equalTo(Global.tittle)
            //     .once('child_added', data => {
            //         data.key;
            //         firebase.database().ref().child('Manage_Class/' + data.key + `/Attendance/${this.state.datecurrent}`)
            //             .push({
            //                 className: `${idType.className}`,
            //                 datetime: this.state.timeGetQrCode,
            //             })
            //             .catch(() => Alert('Có lỗi xảy ra !'));
            //     });
            //     await firebase.database().ref().child('Manage_Class').orderByChild('className')
            //     .equalTo(Global.tittle)
            //     .on('child_added', data => {
            //         data.key;
            //         if(keyPath === "undefined" || keyPath === null )
            //         {
            //             console.log('CHẲNG LÀM GÌ CẢ')
            //         }
            //         else{
            //             firebase.database().ref().child('Manage_Class/' + data.key + `/Attendance/${this.state.datecurrent}/${keyPath}`)
            //             .update({
            //                 // className: `${idType.className}`,
            //                 datetime: this.state.timeGetQrCode,
            //             })
            //             .catch(() => Alert('Có lỗi xảy ra !'));
            //         }
                    
            //     });


            Alert.alert('Thông báo', 'Đã hết thời gian điểm danh , quay về màn hình Home !');
            this.props.navigation.navigate('Loading');

        } catch (e) {
            window.location.href = "http://stackoverflow.com/search?q=[js]+" + e.message;
        }
    }

    render() {
        const idType = this.props.navigation.state.params.thamso;
        const keyClass = this.props.navigation.state.params.keyClass;

        return (
            <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0 }}>
                <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
                <Tittle {...this.props} />
                <View style={styles.content}>
                    <View style={styles.container}>
                        <View style={styles.viewQRcode}>
                            <QRCode
                                value={`${idType._id}`}
                                logoSize={100}
                                size={260}
                                logoBackgroundColor='transparent'
                            />
                        </View>
                        <View style={styles.viewBtn}>
                            <View style={styles.timer}>
                                {/* <Text style={{fontFamily:'Simplifica'}}>Thời gian còn lại : 4:50:01</Text> */}
                                <CountDown
                                    until={0 * 1 + 10}
                                    size={23}
                                    onFinish={() => { this.changeIDclass() }}
                                    digitStyle={{ backgroundColor: '#FFF' }}
                                    digitTxtStyle={{ color: '#1CC625' }}
                                    timeToShow={['M', 'S']}
                                    timeLabels={{ m: 'Phút', s: 'Giây', }}
                                />
                            </View>
                            <View style={{ flex: 1, }} />
                            <View style={styles.btn}>
                                <View>
                                    <TouchableOpacity style={styles.btn1}>
                                        <Text>
                                            {keyClass}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.btn1}>
                                        <Text>
                                            Button1
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.btn1}>
                                        <Text>
                                            Button1
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        borderWidth: 0,
        backgroundColor: 'rgba(112, 119, 127, 0.3)',
    },
    container: {
        width: WIDTH * 0.97,
        borderWidth: 0,
        borderRadius: 7,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent:'center',
        paddingTop: 20,
        flex: 1,
        marginVertical: 6,
    },
    viewQRcode: {
        flex: 7,
        borderWidth: 0,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewBtn: {
        flex: 3,
        borderWidth: 0,
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: 'rgba(82,154,164,0.7)',
        borderRadius: 7,

    },
    timer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: 10,
    },
    btn: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btn1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth:1,
        // borderColor:'#fff',
        width: WIDTH * 0.27,
        backgroundColor: '#42a5f5',
        borderRadius: 7,
        marginHorizontal: 8,
    }
});
