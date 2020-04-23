//Add these two imports
import firebase, { RemoteMessage } from ‘react-native-firebase’;
import type, { Notification, NotificationOpen } from ‘react-native-firebase’;

//Inside App component
/***
* To check/ask for permission to reaceive the notifications.
*/
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
async componentDidMount() {
console.log("===componentDidMount===");
if (Platform.OS == "android") {
if(Platform.Version >= 26) {
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
}
// ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
});
this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
// Process your notification as required
console.log("===NOTIFICATION RECEIVED===  onNotification");
console.log("===onNotificationDisplayed 2===");
console.log("Notification2-- ", notification.title);
console.log("Notification2-- ", notification.body);
const notification2 = new firebase.notifications.Notification()
.setNotificationId('notificationId')
.setTitle('My notification title')
.setBody('My notification body')
.setData({
key1: 'value1',
key2: 'value2',
});
if (Platform.OS == "android") {
notification
.android.setChannelId('test-channel')
.android.setSmallIcon('ic_launcher');
}
firebase.notifications().displayNotification(notification);
// firebase.notifications().removeDeliveredNotification(notification.notificationId);
});
// when app in forground and clicked on notification
this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
// Get the action triggered by the notification being opened
const action = notificationOpen.action;
console.log("===NOTIFICATION OPENED/ CLICKED===  onNotificationOpened");
console.log("Notification clicked -- foreground");
// Get information about the notification that was opened
const notification: Notification = notificationOpen.notification;
});
// when app in background and clicked on notification
firebase.notifications().getInitialNotification()
.then((notificationOpen: NotificationOpen) => {
console.log("===NOTIFICATION OPENED/ CLICKED===  getInitialNotification");
if (notificationOpen) {
// App was opened by a notification
// Get the action triggered by the notification being opened
const action = notificationOpen.action;
console.log("Notification clicked -- background");
// Get information about the notification that was opened
const notification: Notification = notificationOpen.notification;
}
});
componentWillUnmount() {
this.onTokenRefreshListener();
this.messageListener();
this.notificationDisplayedListener();
this.notificationListener();
this.notificationOpenedListener();
}