import { boot } from 'quasar/wrappers'

export default boot(({ router, store }) => {
  router.beforeEach((to, from) => {
    console.log('to: ', to)
  })
})