import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Button ,View} from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import Tittle from '../Header/Tittle';
import Global from '../../constants/global/Global';

export default class App extends Component {
static navigationOptions = {
      header: null,
};
constructor(props) {
      super(props);
      this.state = {
        tittle: 'BIỂU ĐỒ THỐNG KÊ',
        router: 'HomeScreen',
      };
      Global.router = this.state.router;
      Global.tittle = this.state.tittle;
    }
  option = {
    xAxis: {
      type: "category",
      data: ["LTNC", "DSS", "LTCB", "Thu", "Fri", "Sat", "Sun"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [90, 30, 60, 80, 90, 100, 80],
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