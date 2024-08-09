<template>
  <q-layout view="hHh lpR lFf">
    <q-header
      :elevated="useLightOrDark(true, false)"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <ToolbarTitle />

        <q-btn 
          v-if="$route.fullPath === '/'"
          @click="storeEntries.options.sort = !storeEntries.options.sort"
          :label="!storeEntries.options.sort ? 'Sort' : 'Done'"
          flat
          no-caps
          dense
        />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-primary"
      :width="250"
      :breakpoint="767"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          class="text-white"
          header
        >
          Navigation
        </q-item-label>

        <NavLink
          v-for="link in navLinks"
          :key="link.title"
          v-bind="link"
        />

        <q-separator spaced />

        <q-item
          @click="storeAuth.logoutUser"
          clickable
          class="text-white"
          tag="a"
        >
          <q-item-section
            avatar
          >
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Log out</q-item-label>
            <q-item-label
              v-if="storeAuth.userDetails.email"
              class="text-white"
              caption
            >
              {{ storeAuth.userDetails.email }}
            </q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item
          v-if="$q.platform.is.electron"
          @click="quitApp"
          clickable
          class="text-white absolute-bottom"
          tag="a"
        >
          <q-item-section
            avatar
          >
            <q-icon name="power_settings_new" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Quit</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useStoreEntries } from 'src/stores/storeEntries'
import { useStoreAuth } from 'src/stores/storeAuth'
import { useLightOrDark } from 'src/use/useLightOrDark'
import ToolbarTitle from 'components/Layout/ToolbarTitle.vue'
import NavLink from 'components/Nav/NavLink.vue'

defineOptions({
  name: 'MainLayout'
})

const $q = useQuasar(),
      storeEntries = useStoreEntries(),
      storeAuth = useStoreAuth()

const navLinks = [
  {
    title: 'Entries',
    icon: 'savings',
    link: '/'
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const quitApp = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Really quit Moneyballs?',
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      label: 'Quit',
      color: 'negative',
      noCaps: true
    },
    cancel: {
      color: 'primary',
      noCaps: true
    }
  }).onOk(() => {
    if ($q.platform.is.electron) ipcRenderer.send('quit-app')
  })
}
</script>
