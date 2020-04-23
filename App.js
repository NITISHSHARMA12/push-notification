//Add these two imports
import React from "react";
import { View, Text, Platform, AsyncStorage, FlatList, StyleSheet } from "react-native";
import firebase, { RemoteMessage } from 'react-native-firebase';
import type, { Notification, NotificationOpen } from 'react-native-firebase';

//Inside App component
/***
* To check/ask for permission to reaceive the notifications.
*/

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      pushData: [{
        _title:"name",
        _data:"hello"
      }],
    };
  }

  componentWillUnmount() {
    // this.onTokenRefreshListener();
    this.messageListener();
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    console.log("state", this.state)
  }

  async componentDidMount() {
    console.log("===componentDidMount===");
    if (Platform.OS == "android") {
      if (Platform.Version >= 26) {
        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
          .setDescription('My apps test channel');
        // Create the channel
        firebase.notifications().android.createChannel(channel);
      }
    }

    this.chechPermissionForNotification();
    //A message will trigger the onMessage listener when the application receives a message in the foreground.
    this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
      // Process your message as required
      console.log("Message-", message.toString());
    });

    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      console.log("===NOTIFICATION DISPLAYED===   onNotificationDisplayed");
      console.log("===onNotificationDisplayed 1===");
      // Process your notification as required
      console.log("Notification1-- ", notification.title);
      console.log("Notification1-- ", notification.body);
      if (Platform.OS == "android") {
        notification
          .android.setChannelId('test-channel')
          .android.setSmallIcon('ic_launcher');
        this._addDataToList(notification);
      }
      this._addDataToList(notification);
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });


    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Process your notification as required
      console.log("===NOTIFICATION RECEIVED===  onNotification", notification);
      console.log("===onNotificationDisplayed 2===");
      console.log("Notification2-- ", notification.title);
      console.log("Notification2-- ", notification.body);
      // let json = JSON.stringify(notification)
      // console.log("custom data", notification.data.name)
      this._addDataToList(notification);
      const notification2 = new firebase.notifications.Notification()
        .setNotificationId('notificationId')
        .setTitle('My notification title')
        .setBody('My notification body')
        .setData({
          key1: 'value1',
          key2: 'value2',
        });
      console.log("Channel", notification2)
      // AsyncStorage.setItem("notification2", notification2)
      if (Platform.OS == "android") {
        notification
          .android.setChannelId('test-channel')
          .android.setSmallIcon('ic_launcher');
      }
      firebase.notifications().displayNotification(notification);
      firebase.notifications().removeDeliveredNotification(notification.notificationId);
    });

    // when app in forground and clicked on notification
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      console.log("===NOTIFICATION OPENED/ CLICKED===  onNotificationOpened");
      console.log("Notification clicked -- foreground");
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      console.log("for,msg", notification);
    });

    // when app in background and clicked on notification
    firebase.notifications().getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
        console.log("===NOTIFICATION OPENED/ CLICKED===  getInitialNotification");
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          console.log("Notification clicked -- background", action, notificationOpen);
          // Get information about the notification that was opened
          const notification: Notification = notificationOpen.notification;
          console.log("back,msg", notification);
          this._addDataToList(notification);
        }
      });


  }


  chechPermissionForNotification() {
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          // user has permissions
          console.log("==user has permissions==");
        } else {
          // user doesn't have permission
          firebase.messaging().requestPermission()
            .then(() => {
              // User has authorised
            })
            .catch(error => {
              // User has rejected permissions
            });
        }
      });
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log("Device Token-- ", fcmToken);
        } else {
          // user doesn't have a device token yet
          console.log("Device Token-- Not found");
        }
      });
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

  _renderItem = ({item}) => {
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
    color:'#000',
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