<script setup>
import { useConnectionStateStore } from '@/stores/connection'
import { storeToRefs } from 'pinia'

const store = useConnectionStateStore()
const { connected, loading } = storeToRefs(store)

</script>

<template>
  <v-app-bar
    color="white"
    elevation="4"
    :class="[
      'horizontaTopbar',
    ]"
  >
    <!-- ---------------------------------------------- -->
    <!---Logo part -->
    <!-- ---------------------------------------------- -->
    <div class="pa-4 d-none d-md-block">
      <v-img id="linkToHome" :src="require('@/assets/edai-logo.png')" :width="200"></v-img>
    </div>

    <v-app-bar-nav-icon
      class="hidden-md-and-up"
    />

    <v-spacer />

    <v-chip :color="connected ? 'success' : 'error'" class="mr-2"> 

      {{ connected ?  'connected': 'not connected' }} 
      <v-progress-circular
        v-if="loading"
        indeterminate
        :size="10"
        :width="2"
        color="primary"
        class="ml-2"
      ></v-progress-circular>
      <v-badge v-if="!loading" dot inline :color=" connected ? 'success': 'error'"></v-badge>
      
    </v-chip>

  </v-app-bar>
</template>
