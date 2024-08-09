<template>
  <q-page class="flex flex-center">
    <q-card
      class="auth bg-primary text-white q-pa-lg"
    >
      <q-card-section>
        <ToolbarTitle />
      </q-card-section>

      <q-card-section>
        <q-tabs
          v-model="tab"
          no-caps
        >
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </q-tabs>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="formSubmit"
        >
          <q-input
            v-model="credentials.email"
            class="q-mb-md"
            :bg-color="useLightOrDark('white', 'black')"
            label="Email"
            type="email"
            autocomplete="email"
            filled
          />
          <q-input
            v-model="credentials.password"
            class="q-mb-md"
            :bg-color="useLightOrDark('white', 'black')"
            label="Password"
            type="password"
            autocomplete="current-password"
            filled
          />
          <q-btn
            class="full-width"
            color="white"
            type="submit"
            :label="submitButtonTitle"
            outline
            no-caps
          />
        </q-form>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>

  /*
    imports
  */
  
    import { ref, computed, reactive } from 'vue'
    import { useQuasar } from 'quasar'
    import { useStoreAuth } from 'src/stores/storeAuth'
    import { useLightOrDark } from 'src/use/useLightOrDark'
    import ToolbarTitle from 'src/components/Layout/ToolbarTitle.vue'


  /*
    quasar
  */
  
    const $q = useQuasar()


  /*
    stores
  */
  
    const storeAuth = useStoreAuth()


  /*
    tabs
  */
  
    const tab = ref('login')


  /*
    submit button title
  */
  
    const submitButtonTitle = computed(() => {
      return tab.value === 'login' ? 'Login' : 'Register'
    })


  /*
    form
  */
  
    const credentials = reactive({
      email: '',
      password: ''
    })

    const formSubmit = () => {
      if (!credentials.email || !credentials.password) {
        $q.dialog({
          title: 'Error',
          message: 'Please enter an email & password motherflipper!'
        })
      }
      else {
        formSubmitSuccess()
      }
    }

    const formSubmitSuccess = () => {
      if (tab.value === 'register') {
        storeAuth.registerUser(credentials)
      }
      else {
        storeAuth.loginUser(credentials)
      }
    }

</script>