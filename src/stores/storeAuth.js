import { defineStore } from 'pinia'
import { Dialog } from 'quasar'
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'src/firebase/firebase'

export const useStoreAuth = defineStore('auth', () => {

  /*
    actions
  */
  
    const registerUser = ({ email, password }) => {
      createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user
        console.log('user: ', user)
      }).catch((error) => {
        showFirebaseError(error.message)
      })
    }

    const loginUser = ({ email, password }) => {
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user
        console.log('user: ', user)
      }).catch((error) => {
        showFirebaseError(error.message)
      })
    }

    const logoutUser = () => {
      signOut(auth).then(() => {
        console.log('user was logged out')
      }).catch((error) => {
        showFirebaseError(error.message)
      })
    }


  /*
    helpers
  */
  
    const showFirebaseError = message => {
      Dialog.create({
        title: 'Error',
        message
      })
    }


  /*
    return
  */
  
    return { 

      // actions
      registerUser,
      loginUser,
      logoutUser

    }
    
})