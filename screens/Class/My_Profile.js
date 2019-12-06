import React, { Component } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    TouchableOpacity,
    Image,
    Dimensions,
    Linking,
} from 'react-native';
import Tittle from '../Header/Tittle';
import Global from '../../constants/global/Global';
import email from '../../assets/icons/icons8-email-64.png';
import sex from '../../assets/icons/icons8-gender-64.png';
import phone from '../../assets/icons/icons8-call-64.png';
import address from '../../assets/icons/icons8-marker-64.png';
import birthday from '../../assets/icons/icons8-birthday-64.png';
import mssv from '../../assets/icons/icons8-identification-documents-64.png';
import name from '../../assets/icons/icons8-name-64.png';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 40;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class My_Profile extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            tittle: 'THÔNG TIN CÁ NHÂN',
            router: 'List_Student_Join',
            scrollY: new Animated.Value(
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            refreshing: false,
            loading: false,
            refesh: false,
            userData:{},
        };
        Global.router = this.state.router;
        Global.tittle = this.state.tittle
    }
    _renderScrollViewContent() {
        const info = this.props.navigation.state.params.info;
        console.log('user',info.email)
        // const data = Array.from({ length: 30 });
        return (
            <View style={styles.scrollViewContent}>
                <View style={styles.row}>
                    <Image source={email} style={{height:30,width:30,}}/> 
                    <Text style={{paddingHorizontal:20,color:'black',opacity:.8}}>{info.email}</Text>
                </View>
                <View style={styles.row}>
                    <Image source={mssv} style={{height:30,width:30,}}/> 
                    <Text style={{paddingHorizontal:20,color:'black',opacity:.8}}>{info.MSSV}</Text>
                </View>
                <View style={styles.row}>
                    <Image source={name} style={{height:30,width:30,}}/> 
                    <Text style={{paddingHorizontal:20,color:'black',opacity:.8}}>{info.fullName}</Text>
                </View>
                <View style={styles.row}>
                    <Image source={address} style={{height:30,width:30,}}/> 
                    <Text style={{paddingHorizontal:20,color:'black',opacity:.8}}>{info.address}</Text>
                </View>
                <View style={styles.row}>
                    <Image source={birthday} style={{height:30,width:30,}}/> 
                    <Text style={{paddingHorizontal:20,color:'black',opacity:.8}}>{info.dateBirthday}</Text>
                </View>
                <View style={styles.row}>
                    <Image source={phone} style={{height:30,width:30,}}/> 
                    {/* <TouchableOpacity onPress={this.makeCall}> */}
                        <Text style={{paddingHorizontal:20,color:'blue',opacity:.8}}>{info.numberPhone}</Text>
                     {/* </TouchableOpacity> */}
                </View>
                <View style={styles.row}>
                    <Image source={sex} style={{height:30,width:30,}}/> 
                    <Text style={{paddingHorizontal:20,color:'black',opacity:.8}}>{info.sex}</Text>
                </View>
            </View>
        );
    }
    // makeCall = () => {
    // const infoStudent = this.props.navigation.state.params.infoStudent;
    // let phoneNumber = ''
    // if (Platform.OS === 'android') {
    //     phoneNumber = `tel:${infoStudent.numberPhone}`;
    //   } else {
    //     phoneNumber = `telprompt:${infoStudent.numberPhone}`;
    //   }
    //     Linking.openURL(phoneNumber);
    //   };
    render() {
        const info = this.props.navigation.state.params.info;
        const scrollY = Animated.add(
            this.state.scrollY,
            Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
        );
        const headerTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
        });

        const imageOpacity = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        const titleScale = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0.8],
            extrapolate: 'clamp',
        });
        const titleTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 0, -8],
            extrapolate: 'clamp',
        });

        return (
            <View style={{ flex: 1 }}>
                <Tittle {...this.props} />
                <View style={styles.fill}>
                    <Animated.ScrollView
                        style={styles.fill}
                        scrollEventThrottle={1}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                            { useNativeDriver: true },
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.setState({ refreshing: true });
                                    setTimeout(() => this.setState({ refreshing: false }), 1000);
                                }}
                                progressViewOffset={HEADER_MAX_HEIGHT}
                            />
                        }
                        contentInset={{
                            top: HEADER_MAX_HEIGHT,
                        }}
                        contentOffset={{
                            y: -HEADER_MAX_HEIGHT,
                        }}
                    >
                        {this._renderScrollViewContent()}
                        
                    </Animated.ScrollView>
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.header,
                            { transform: [{ translateY: headerTranslate }] },
                        ]}
                    >
                        <Animated.Image
                            style={[
                                styles.backgroundImage,
                                {
                                    opacity: imageOpacity,
                                    transform: [{ translateY: imageTranslate }],
                                },
                            ]}
                            source={require('../../assets/images/samesamemon.jpg')}
                        />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.bar,
                            {
                                transform: [
                                    { scale: titleScale },
                                    { translateY: titleTranslate },
                                ],
                            },
                        ]}
                    >
                        {/* <Text style={styles.title}>{info.email}</Text> */}
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#03A9F4',
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    bar: {
        backgroundColor: 'transparent',
        marginTop: Platform.OS === 'ios' ? 28 : 0,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        color: 'white',
        fontSize: 18,
    },
    scrollViewContent: {
        // iOS uses content inset, which acts like padding.
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
    },
    row:{
        flexDirection:'row',
        height:HEIGHT/10,
        paddingLeft:35,
        alignItems:'center',
        borderBottomColor:'#dddddd',
        borderBottomWidth:0.5,
    },
    touchableButton: {
        width: '80%',
        padding: 10,
        backgroundColor: '#9c27b0',
      },
      TextStyle: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
      }  
});