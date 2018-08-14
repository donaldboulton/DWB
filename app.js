import { config, database } from 'firebase-functions';
import { initializeApp, database as _database, messaging } from 'firebase-admin';

initializeApp(config().firebase);

const serviceAccount = require("/serviceAccountKey.json");
const pushBtn = document.getElementById('push-button');
const userToken = null;
const isSubscribed = false;

export const sendCommentNotification = database.ref('/comments/{commentID}').onWrite(event => {
    const commentID    = event.params.commentID;
    const commentTitle = event.data.val();

    if (!commentTitle) return console.log('Comment', commentID, 'deleted');

    const getDeviceTokensPromise = _database().ref('device_ids').once('value').then(snapshots => {

        if (!snapshots) {
            return console.log('No device IDs to send notifications to.');
        }

        const payload = {
            notification: {
                title: `New Comment: ${commentTitle}`,
                body: 'Click to read new comment.',
                icon: 'https://donboulton.com/assets/images/push-icon.png'
            }
        };

        snapshots.forEach(childSnapshot => {
            const token = childSnapshot.val();

            messaging().sendToDevice(token, payload).then(response => {

                response.results.forEach(result => {
                    const error = result.error;

                    if (error) {
                        console.error('Failed delivery to', token, error);

                        if (error.code === 'messaging/invalid-registration-token' ||
                            error.code === 'messaging/registration-token-not-registered') {
                            childSnapshot.ref.remove();
                            console.info('Was removed:', token);
                        }
                    } else {
                        console.info('Notification sent to', token);
                    }
                });
            });
        });
    });
});

window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                messaging.useServiceWorker(registration);

                initializePush();
            })
            .catch(err => console.log('Service Worker Error', err));
    } else {
        pushBtn.textContent = 'Push not supported.';
    }
});

const gcmServerKey = 'AIzaSyC5itnz9jHmpvQRhq8sJUCFUy2SYUPanGs';
webpush.setGCMAPIKey(gcmServerKey);

const vapidKeys = {
  publicKey: 'BOew5Tx7fTX51GzJ7tpF3dDLNS54OvUST_dGGqzJEy54jqW2qghIRTiK7BfOpCPp8xNfMH7Mtprl3hp_WGjgslU',
  privateKey: 'ymblNrJSzlXdRMhFYdXh1Hda8HkIO76aVs85X93wAjc'
};

webpush.setVapidDetails(
  'mailto:donaldboulton@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

function initializePush() {
    userToken = localStorage.getItem('pushToken');

    isSubscribed = userToken !== null;
    updateBtn();

    pushBtn.addEventListener('click', () => {
        pushBtn.disabled = true;

        if (isSubscribed) return unsubscribeUser();

        return subscribeUser();
    });
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushBtn.textContent = 'Subscription blocked';
        return;
    }

    pushBtn.textContent = isSubscribed ? 'Unsubscribe' : 'Subscribe';
    pushBtn.disabled = false;
}

function updateSubscriptionOnServer(token) {
    if (isSubscribed) {
        return database.ref('device_ids')
            .equalTo(token)
            .on('child_added', snapshot => snapshot.ref.remove());
    }

    database.ref('device_ids').once('value')
        .then((snapshots) => {
            let deviceExists = false;

            snapshots.forEach((childSnapshot) => {
                if (childSnapshot.val() === token) {
                    deviceExists = true;
                    return console.log('Device already registered.');
                }
            });

            if (!deviceExists) {
                console.log('Device subscribed');
                return database.ref('device_ids').push(token);
            }
        });
}

function unsubscribeUser() {
    messaging.deleteToken(userToken)
        .then(() => {
            updateSubscriptionOnServer(userToken);
            isSubscribed = false;
            userToken = null;
            localStorage.removeItem('pushToken');
            updateBtn();
        })
        .catch(err => console.log('Error unsubscribing', err));
}

messaging.requestPermission()
    .then(function() {
        return messaging.getToken();
    })
    .then(function(token) {
        // send rest call to add to database
        $.ajax('https://airy-office-413.firebaseio.com/pushtokens/'+token+'.json', {
            method: 'PUT',
            data: 'true',
            error: function(err) {
            }
        });
    })
    .catch(function(err) {
        console.log('Permission denied');
});