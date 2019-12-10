import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
} from 'react-native';
import firebase from 'react-native-firebase';
import Global from '../../../constants/global/Global';
import Tittle from '../../Header/Tittle';

import QRCode from 'react-native-qrcode-svg';
import CountDown from 'react-native-countdown-component';
import {WToast} from 'react-native-smart-tip'

const { width: WIDTH } = Dimensions.get('window');


var thoigian = new Date ();
var date = thoigian.getDate ();
var month = thoigian.getMonth () + 1;
var year = thoigian.getFullYear ();
var hour = thoigian.getHours();
var minutes = thoigian.getMinutes();
var seconds = thoigian.getSeconds();
var getTime = thoigian.getTime();

if( date < 10)
{
  date = '0'+date;
  console.log(date);
}
var datecurrent = date + '-' + month + '-' + year;

var datetime = parseInt(hour) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds);
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
            timeGetQrCode: datetime,
            play:false,
        };
        const idType = this.props.navigation.state.params.thamso;
        Global.tittle = idType.className;
        Global.siso = parseInt(idType.count);
    }
    async changeIDclass() {
        const idType = this.props.navigation.state.params.thamso;
        const keyClass = this.props.navigation.state.params.keyClass;
        var seconds = Date.now();
        try {

            await firebase.database().ref().child('Manage_Class').orderByChild('className')
                .equalTo(Global.tittle)
                .on('child_added', data => {
                    data.key;
                    firebase.database().ref().child('Manage_Class').child(data.key)
                        .update({
                            _id: require('random-string')({ length: 10 }),
                        })
                        .then(
                            firebase.database().ref().child(`Manage_Class/${keyClass}/Attendance/${this.state.datecurrent}/-KHONGDUOCXOACAINAY`)
                                .set({
                                    // _id: require('random-string')({ length: 10 }),
                                    className: `${idType.className}`,
                                    datetime: `${seconds}`,
                                })
                        ).then(
                            firebase.database().ref().child(`Manage_Class/${keyClass}/Attendance/${this.state.datecurrent}`).child(`-KHONGDUOCXOACAINAY`)
                                .update({
                                    datetime: `${seconds}`,
                                })
                        )
                        .catch(() => Alert('Có lỗi xảy ra !'));
                });
            Alert.alert('Thông báo', 'Cập nhật thông tin thành công !');
            this.props.navigation.navigate('HomeScreen');
        }
        catch (e) {
            window.location.href = "http://stackoverflow.com/search?q=[js]+" + e.message;
        }
    }
Play=async ()=>{
    await this.setState({
        play:true,
    })
    await WToast.show({data: 'Bắt đầu tính thời gian , nếu rời khỏi màn hình này , quá trình điểm danh sẽ bị hủy !'})
}
    render() {
        const idType = this.props.navigation.state.params.thamso;
        const keyClass = this.props.navigation.state.params.keyClass;

        return (
            <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0 }}>
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
                                <CountDown
                                    until={0 * 1 + 10}
                                    size={23}
                                    onFinish={() => this.changeIDclass()}
                                    digitStyle={{ backgroundColor: '#FFF' }}
                                    digitTxtStyle={{ color: '#1CC625' }}
                                    timeToShow={['M', 'S']}
                                    timeLabels={{ m: 'Phút', s: 'Giây', }}
                                    running={this.state.play}
                                />
                            </View>
                            <View style={{ flex: 1, }} />
                            <View style={styles.btn}>
                                <View>
                                    <TouchableOpacity style={styles.btn1}>
                                        <Text>
                                            {/* {keyClass} */}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.btn1} 
                                    onPress={this.Play.bind(this)}>
                                        <Text>
                                            Bắt Đầu
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.btn1}>
                                        <Text>
                                            {/* Button1 */}
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
