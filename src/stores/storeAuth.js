import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from 'src/firebase/firebase'
import { useStoreEntries } from 'src/stores/storeEntries'

export const useStoreAuth = defineStore('auth', () => {

  /*
    state
  */

    const authInitialized = ref(false)

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
      const router = useRouter(),
            storeEntries = useStoreEntries()

      onAuthStateChanged(auth, (user) => {
        authInitialized.value = true
        if (user) {
          userDetails.id = user.uid
          userDetails.email = user.email
          router.push('/')
          storeEntries.init()
        } else {
          Object.assign(userDetails, userDetailsDefault)
          router.replace('/auth')
          storeEntries.clearAndStopEntries()
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
      authInitialized,
      userDetails,

      // actions
      init,
      registerUser,
      loginUser,
      logoutUser

    }
    
})