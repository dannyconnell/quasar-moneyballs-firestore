import { defineStore } from 'pinia'
import { Dialog } from 'quasar'
import { createUserWithEmailAndPassword } from 'firebase/auth'
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


  /*
    return
  */
  
    return { 

      // actions
      registerUser

    }
    
})