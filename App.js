//Add these two imports
import React from "react";
import { View, Text, Platform, AsyncStorage, FlatList, StyleSheet } from "react-native";
import * as _ from "lodash";
import { fcmService } from "./pushNotification/FCMService";
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      pushData: [{
        _title: "name",
        _data: "hello"
      }],
    };
  }

  componentDidMount() {
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
  }
  componentWillUnmount() {
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
  }

  onRegister = (token) => {
    console.log("notification", token)
  }

  onNotification(notify) {
    // console.log("notificationDCM", notify)
    const channelObj = {
      channelId: "sampleChannelID",
      channelName: "SampleChannelName",
      channelDes: "SampleChannelDes"
    }

    const channel = fcmService.buildChannel(channelObj)
    // console.log(channel)
    const buildNotify = {
      dataId: notify._notificationId,
      title: notify._title,
      content: notify._body,
      sound: 'default',
      vibrate: notify._vibrate,
      channel: channel,
      data: notify._data,
      colorBgIcon: "#1A243B",
      largeIcon: "ic_launcher",
      smallIcon: "ic_launcher",
    }

    const notification = fcmService.buildNotication(buildNotify)
    fcmService.displayNotification(notification)
  }


  onOpenNotification(notify) {
    console.log("data", notify._data)
    console.log("Title", notify._title)
    console.log("body", notify._body)
    alert("data" + notify._body)
  }



  _addDataToList(data) {
    console.log("view", data);
    let array = this.state.pushData;
    array.push(data);
    this.setState({
      pushData: array
    });
    console.log("stateDate,===>", this.state);
  }

  _renderItem = ({ item }) => {
    console.log("item", item)
    return (
      <View key={item.title}>
        <Text style={styles.title}>{item._title}</Text>
        <Text style={styles.message}>{item._body}</Text>
      </View>
    )
  }


  render() {
    return (
      <View>
        <Text>Hello</Text>
        <View style={styles.body}>
          {(this.state.pushData.length != 0) &&
            <FlatList
              data={this.state.pushData}
              renderItem={(item) => this._renderItem(item)}
              keyextractor={(item, index) => index.tostring()}
              extraData={this.state}
            />
          }
          {(this.state.pushData.length == 0) &&
            <View style={styles.noData}>
              <Text style={styles.noDataText}>You don't have any push notification yet. Send some push to show it in the list</Text>
            </View>}
          {/* <LearnMoreLinks /> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    // backgroundColor: '#f'
  },
  listHeader: {
    backgroundColor: '#eee',
    color: "#222",
    height: 44,
    padding: 12
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10
  },
  noData: {
    paddingVertical: 50,
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    paddingBottom: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    // color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    // color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});