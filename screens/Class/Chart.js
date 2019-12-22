import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Button ,View} from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import Tittle from '../Header/Tittle';
import Global from '../../constants/global/Global';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

var system = firebase.database ().ref('Manage_Class');
const classRoom = [];
const temp =[];
const arr_className = [];
var tenLopVietTat ;
export default class App extends Component {
static navigationOptions = {
      header: null,
};
constructor(props) {
      super(props);
      this.state = {
        tittle: 'BIỂU ĐỒ THỐNG KÊ',
        router: 'HomeScreen',
        arr_className:[],
        false: false,
      };
      Global.router = this.state.router;
      Global.tittle = this.state.tittle;
    }
    async componentDidMount () {
      Global.router = this.state.router;
      await this.getUserData ();
      await system.orderByChild('MSGV').equalTo(this.state.userData.MSGV )
     .on('value', childSnapshot => {
      if(childSnapshot.exists()){
        childSnapshot.forEach(x=>{
          temp.push({key: x.key,
            className: x.toJSON().className,
            class: x.toJSON().class,
            subject: x.toJSON().subject,
            dateFinish:x.toJSON().dateFinish,
            dateStart:x.toJSON().dateStart,
            numberTarget:x.toJSON().numberTarget,
            numberSession:x.toJSON().numberSession,
            status:x.toJSON().status,
          
          });
        })
        for( let i = 0 ; i < temp.length ; i++)
        {
          // TÌM NHỮNG LỚP CÓ STATUS = TRUE = ĐÃ CHỐT 
          if(temp[i].status === true ){
            // HÀM RÚT GỌN CHUỖI LẤY KÍ TỰ ĐÀU TIÊN MỖI TỪ
            let acronym = temp[i].subject.toString().toUpperCase().split(/\s/).reduce((response,Word)=> response+=Word.slice(0,1),'')
            tenLopVietTat = temp[i].class.toString().toUpperCase() +'-'+ acronym;
            classRoom.push(
              temp[i]
            );
            arr_className.push(
              tenLopVietTat
            )
          }
        }
      }
     });
    }
    getUserData = async () => {
      await AsyncStorage.getItem ('userData').then (value => {
        const userData = JSON.parse (value);
        this.setState ({userData: userData});
        console.log('USER',this.state.userData)
      });
    };
    
  option = {
    
    xAxis: {
      type: "category",
      data : arr_className,      
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data:["10","100"],
        type: "bar"
      }
    ]
  };

  additionalCode = `
        chart.on('click', function(param) {
            var obj = {
            type: 'event_clicked',
            data: param.data
            };

            sendData(JSON.stringify(obj));
        });
    `;

  onData = param => {
    const obj = JSON.parse(param);

    if (obj.type === "event_clicked") {
      alert(`Bạn đã hoàn thành được ${obj.data}% của môn học này !`);
    }
  };

  onRef = ref => {
    if (ref) {
      this.chart = ref;
    }
  };

  onButtonClearPressed = () => {
    this.chart.clear();
  };

  render() {
    return (
      <View style={styles.chartContainer}>
        {/* <Button title="Clear" onPress={this.onButtonClearPressed} /> */}
        <Tittle {...this.props} />

        <ECharts
          ref={this.onRef}
          option={this.option}
          additionalCode={this.additionalCode}
          onData={this.onData}
          onLoadEnd={() => {
            this.chart.setBackgroundColor("rgba(93, 169, 81, 0.1)");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});