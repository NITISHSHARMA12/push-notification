/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import firebase from 'react-native-firebase';
import {name as appName} from './app.json';
import bgMessaging from './pushNotification/bgMessaging'

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundNotificationAction', bgMessaging);
