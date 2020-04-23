import firebase from 'react-native-firebase';
// Optional flow type
import type, { RemoteMessage } from 'react-native-firebase';
import { Notification,NotificationOpen} from 'react-native-firebase';
export default async (message: RemoteMessage) => {
// handle your message
console.log("Message-", message.toString());
return Promise.resolve();
}
