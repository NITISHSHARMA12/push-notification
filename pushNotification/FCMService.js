import firebase, { RemoteMessage } from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';
class FCMService {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
    }

    checkPermission = (onRegister) => {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.getToken(onRegister)

                } else {
                    this.requestPermission(onRegister)
                }
            }).catch(error => {
                console.log("Permission rejected", error);
            })
    }

    getToken = (onRegister) => {
        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    onRegister(fcmToken)
                } else {
                    console.log("user does not have a token")
                }
            }).catch(error => {
                console.log("getToken rejected", error)
            })
    }

    requestPermission = (onRegister) => {
        firebase.messaging().requestPermission()
            .then(() => {
                this.getToken(onRegister)
            }).catch(error => {
                console.log("Request Permission rejected", error);
            })
    }

    deleteToken = () => {
        firebase.messaging().deleteToken()
            .then(() => {
                this.getToken(onRegister)
            }).catch(error => {
                console.log("Delete token error", error);
            })

    }
    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {

        this.notificationListener = firebase.notifications()
            .onNotification((notification: Notification) => {
                onNotification(notification)
            })

        // when app in forground and clicked on notification
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            console.log("===NOTIFICATION OPENED/ CLICKED===  onNotificationOpened");
            console.log("Notification clicked -- foreground");
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            console.log("for,msg", notification);
            onOpenNotification(notification)
            this.removeDeliveredNotification(notification);
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
                    console.log("back,msg", notification);
                    onOpenNotification(notification)
                    this.removeDeliveredNotification(notification);
                }
            });




        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            // Process your message as required
            console.log("formate", message)
            onNotification(message);
        });

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            console.log("new token", fcmToken)
            onRegister(fcmToken)
        })


    }

    unRegister = () => {
        this.notificationListener();
        this.notificationOpendListener();
        this.messageListener();
        this.onTokenRefreshListener();
    }

    buildChannel = (obj) => {
        // console.log("buidChannel", obj)
        return new firebase.notifications.Android.Channel(
            obj.channelId, obj.channelName,
            firebase.notifications.Android.Importance.Max
        )
            .setDescription(obj.channelDes)
    }

    buildNotication = (obj) => {
        // console.log("buildNotification", obj)
        firebase.notifications().android.createChannel(obj.channel);

        return new firebase.notifications.Notification()
            .setSound(obj.sound)
            .setNotificationId(obj.dataId)
            .setTitle(obj.title)
            .setBody(obj.content)
            .setData(obj.data)
            .android.setChannelId(obj.channel.channelId)
            .android.setLargeIcon(obj.largeIcon)
            .android.setSmallIcon(obj.smallIcon)
            .android.setColor(obj.colorBgIcon)
            .android.setPriority(firebase.notifications.Android.Priority.High)
            .android.setVibrate(obj.vibrate)
        // .android.setAutoCancel(true)

    }

    displayNotification = (notification) => {
        firebase.notifications().displayNotification(notification)
            .catch(error => {
                console.log("Display Notification error", error)
            })

    }

    removeDeliveredNotification = (notification) => {
        firebase.notifications().removeDeliveredNotification(notification.notificationId)
    }



}

export const fcmService = new FCMService();