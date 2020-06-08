import * as firebase from 'firebase'

firebase.initializeApp(Expo.Constants.manifest.extra.firebase);

send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {text, user, createdAt: this.timestamp, };
      this.ref.push(message);
    }
  };

export default firebase;