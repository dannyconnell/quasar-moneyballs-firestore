import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { Dialog } from 'quasar'
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from 'src/firebase/firebase'
import { useStoreEntries } from 'src/stores/storeEntries'

export const useStoreAuth = defineStore('auth', () => {

  /*
    state
  */

    const userDetailsDefault = {
      id: null,
      email: null
    }

    const userDetails = reactive({
      ...userDetailsDefault
    })


  /*
    actions
  */
  
    const init = () => {
      const storeEntries = useStoreEntries()

      onAuthStateChanged(auth, (user) => {
        if (user) {
          userDetails.id = user.uid
          userDetails.email = user.email
          storeEntries.loadEntries()
        } else {
          Object.assign(userDetails, userDetailsDefault)
        }
      })
    }

    const registerUser = ({ email, password }) => {
      createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // const user = userCredential.user
        // console.log('user: ', user)
      }).catch((error) => {
        showFirebaseError(error.message)
      })
    }

    const loginUser = ({ email, password }) => {
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // const user = userCredential.user
        // console.log('user: ', user)
      }).catch((error) => {
        showFirebaseError(error.message)
      })
    }

    const logoutUser = () => {
      signOut(auth).then(() => {
        // console.log('user was logged out')
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

      // state
      userDetails,

      // actions
      init,
      registerUser,
      loginUser,
      logoutUser

    }
    
})