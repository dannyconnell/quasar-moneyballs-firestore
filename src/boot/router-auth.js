import { boot } from 'quasar/wrappers'
import { useStoreAuth } from 'src/stores/storeAuth'

export default boot(({ router }) => {
  router.beforeEach((to) => {
    const storeAuth = useStoreAuth()
    // if user not logged in
    if (!storeAuth.userDetails.id && to.path !== '/auth' && storeAuth.authInitialized) {
      return '/auth'
    }
    // if user IS logged in
    if (storeAuth.userDetails.id && to.path === '/auth') {
      return false
    }
  })
})