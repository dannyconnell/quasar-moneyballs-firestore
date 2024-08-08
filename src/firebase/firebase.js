import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDfH3zGn8105ao6uXAy-hQzcXSDmg4ooVc',
  authDomain: 'moneyballs---firestore-6d986.firebaseapp.com',
  projectId: 'moneyballs---firestore-6d986',
  storageBucket: 'moneyballs---firestore-6d986.appspot.com',
  messagingSenderId: '480300453984',
  appId: '1:480300453984:web:b7553ca734fafe704b7305'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {
  db
}