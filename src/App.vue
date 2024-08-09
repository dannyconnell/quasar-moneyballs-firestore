<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStoreSettings } from 'src/stores/storeSettings'
import { useStoreAuth } from 'src/stores/storeAuth'

defineOptions({
  name: 'App'
});

const storeSettings = useStoreSettings(),
      storeAuth = useStoreAuth(),
      $q = useQuasar(),
      router = useRouter()

onMounted(() => {
  storeAuth.init()
  storeSettings.loadSettings()

  if ($q.platform.is.electron) {
    ipcRenderer.on('show-settings', () => {
      router.push('/settings')
    })
  }

})

// window.addEventListener('contextmenu', e => {
//   e.preventDefault()
// })
</script>
