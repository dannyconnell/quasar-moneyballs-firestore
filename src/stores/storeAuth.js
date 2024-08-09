import { defineStore } from 'pinia'
import { Dialog } from 'quasar'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
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
        Dialog.create({
          title: 'Error',
          message: error.message
        })
      })
    }

    const logoutUser = () => {
      signOut(auth).then(() => {
        console.log('user was logged out')
      }).catch((error) => {
        Dialog.create({
          title: 'Error',
          message: error.message
        })
      })
    }


  /*
    return
  */
  
    return { 

      // actions
      registerUser,
      logoutUser

    }
    
})