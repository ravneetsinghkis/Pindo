importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyDfe6hs4MF7ncZ5fNvDM8wSHKt7YRxeOv0",
    authDomain: "fir-10f08.firebaseapp.com",
    databaseURL: "https://fir-10f08.firebaseio.com",
    projectId: "fir-10f08",
    storageBucket: "fir-10f08.appspot.com",
    messagingSenderId: "539093034317"
  };
  firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    const title = 'Hello World from SW!';
    console.log('title',title);
    const options = {
        body: payload.data.status
    };
    return self.registration.showNotification(title, options);
});