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
        <q-form>
          <q-input
            class="q-mb-md"
            :bg-color="useLightOrDark('white', 'black')"
            label="Email"
            type="email"
            autocomplete="email"
            filled
          />
          <q-input
            class="q-mb-md"
            :bg-color="useLightOrDark('white', 'black')"
            label="Password"
            type="password"
            autocomplete="current-password"
            filled
          />
          <q-btn
            to="/"
            class="full-width"
            color="white"
            label="Submit"
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
  
    import { ref } from 'vue'
    import { useLightOrDark } from 'src/use/useLightOrDark'
    import ToolbarTitle from 'src/components/Layout/ToolbarTitle.vue'

  
  /*
    tabs
  */
  
    const tab = ref('login')

</script>