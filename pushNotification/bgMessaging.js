import firebase from 'react-native-firebase';
// Optional flow type
import type, { RemoteMessage } from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';

export default async message => {
    alert("firbase")
    const localNotification = new firebase.notifications.Notification()
      .setNotificationId(message.messageId)
      .setTitle(message.data.author_name)
      .setSubtitle('backgroundTest')
      .setBody(message.data.body)
      .setData(message.data)
      .android.setChannelId('all')
      .android.setAutoCancel(true)
      .android.setPriority(firebase.notifications.Android.Priority.High);
  
    firebase.notifications().displayNotification(localNotification);
    return Promise.resolve();
  };
