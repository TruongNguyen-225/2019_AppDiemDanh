// import React from "react";
// import ReactExport from "react-data-export";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// const dataSet1 = [
//     {
//         name: "Johson",
//         amount: 30000,
//         sex: 'M',
//         is_married: true
//     },
//     {
//         name: "Monika",
//         amount: 355000,
//         sex: 'F',
//         is_married: false
//     },
//     {
//         name: "John",
//         amount: 250000,
//         sex: 'M',
//         is_married: false
//     },
//     {
//         name: "Josef",
//         amount: 450500,
//         sex: 'M',
//         is_married: true
//     }
// ];

// var dataSet2 = [
//     {
//         name: "Johnson",
//         total: 25,
//         remainig: 16
//     },
//     {
//         name: "Josef",
//         total: 25,
//         remainig: 7
//     }
// ];

// export default class Download extends React.Component {
//     render() {
//         return (
//             <ExcelFile element={<button>Download Data</button>}>
//                 <ExcelSheet data={dataSet1} name="Employees">
//                     <ExcelColumn label="Name" value="name"/>
//                     <ExcelColumn label="Wallet Money" value="amount"/>
//                     <ExcelColumn label="Gender" value="sex"/>
//                     <ExcelColumn label="Marital Status"
//                                  value={(col) => col.is_married ? "Married" : "Single"}/>
//                 </ExcelSheet>
//                 <ExcelSheet data={dataSet2} name="Leaves">
//                     <ExcelColumn label="Name" value="name"/>
//                     <ExcelColumn label="Total Leaves" value="total"/>
//                     <ExcelColumn label="Remaining Leaves" value="remaining"/>
//                 </ExcelSheet>
//             </ExcelFile>
//         );
//     }
// }


import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  ProgressBarAndroid,
  ToastAndroid,
  PermissionsAndroid
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      loading: false
    };
  }

  actualDownload = () => {
    this.setState({
      progress: 0,
      loading: true
    });
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      path: dirs.DownloadDir + "/excel1.csv",
      fileCache: true
    })
      .fetch(
        "GET",
        // "http://www.usa-essays.com/blog/wp-content/uploads/2017/09/sample-5-1024x768.jpg"
        // 'https://firebasestorage.googleapis.com/v0/b/facerecognition-6a867.appspot.com/o/B%E1%BA%A3ng%20%C4%90i%E1%BB%83m%20TB.png?alt=media&token=9d0e7844-5854-4681-b90f-fbb6fbba9115'
        'https://firebasestorage.googleapis.com/v0/b/facerecognition-6a867.appspot.com/o/csvjson.csv?alt=media&token=66c379b7-c387-4eaa-a27a-2f1c8683dd0a'
        ,
        {
          //some headers ..
        }
      )
      .progress((received, total) => {
        console.log("progress", received / total);
        this.setState({ progress: received / total });
      })
      .then(res => {
        this.setState({
          progress: 100,
          loading: false
        });
        ToastAndroid.showWithGravity(
          "Your file has been downloaded to downloads folder!",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      });
  };

  async downloadFile() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to memory to download the file "
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload();
      } else {
        Alert.alert(
          "Permission Denied!",
          "You need to give storage permission to download the file"
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }
  render() {
    return (
      <View>
        <Text> Download Files in Android </Text>
        <Button onPress={() => this.downloadFile()} title="Download" />
        {this.state.loading ? (
          <ProgressBarAndroid
            styleAttr="Large"
            indeterminate={false}
            progress={this.state.progress}
          />
        ) : null}
      </View>
    );
  }
}