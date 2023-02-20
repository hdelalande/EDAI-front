<script setup>
import { ref } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useConnectionStateStore } from '@/stores/connection'
import { storeToRefs } from 'pinia'

import startRecording from '@/services/recorder.js'

const store = useConnectionStateStore()
const { connected, loading } = storeToRefs(store)

// Get roomID from URL
const roomID = ref('200')

const ws = ref()

const microphoneMuted = ref(true)
const contextRecord = ref()

const openConnection = () => {
  loading.value = true
  console.log('roomID: ', roomID.value)

  if (roomID.value === '') {
    console.log('roomID is empty')
    return
  }
  ws.value = new WebSocket('ws://127.0.0.1:8000/ws/lecture/speaker/room/' + roomID.value + '/')
  ws.value.addEventListener('open', () => {
        console.log('connected')
        loading.value = false
        connected.value = true
        ws.value.send(JSON.stringify({
          "event": "start_health_check"
        }))
    })
  ws.value.addEventListener('message', (event) => {
      console.log(event.data)
  })
  ws.value.addEventListener('close', () => {
    console.log('Disconnected from WebSocket server')
    connected.value = false
    ws.value.close()
  })
  ws.value.addEventListener('error', (event) => {
    console.error('WebSocket error', event)
    loading.value = false
    connected.value = false
  })
}

const microphoneSwitch = () => {
  if (microphoneMuted.value == true) {
    startRecording(ws.value).then((context) => {
      contextRecord.value = context
      console.log('start recording', contextRecord)
    })
    microphoneMuted.value = false
  } else {
    if (contextRecord.value) {
      contextRecord.value.mediaStream.disconnect()
      contextRecord.value.recorder.disconnect()
      console.log('disconnected')
    }
    microphoneMuted.value = true
  }
}

onMounted(() => {
  openConnection()
})

onBeforeUnmount(() => {
  ws.value.close()
})

</script>

<template>
  <div>
    <v-layout>

      <v-navigation-drawer
        permanent
        location="right"
      >
        <template v-slot:prepend>
          <v-list-item
            lines="two"
            title="Speaker"
          >
          <template v-slot:prepend>
            <v-btn icon size="large" variant="outlined" class="mr-3" :color="microphoneMuted ? 'error' : 'success'" @click="microphoneSwitch()">
              <v-icon :icon="microphoneMuted ? 'mdi-microphone-off': 'mdi-microphone'"></v-icon>
            </v-btn>
          </template>
          <template v-slot:subtitle="{  }">
            <v-chip :color="connected ? 'success' : 'error'"> {{ connected ? '1': '0' }} person in the room</v-chip>
          </template>
        
        </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list density="compact">
          <v-list-item prepend-icon="mdi-account-school" title="Student 1" value="home" :link="false"></v-list-item>
          <v-list-item prepend-icon="mdi-account-school" title="Student 2" value="account" :link="false"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="min-height: 850px;">
      

        <v-card min-height="850">
          
        <v-card-title>Room {{ roomID }}</v-card-title>
        <v-card-subtitle>    

        </v-card-subtitle>
        <v-card-text>

          <div :style=" { 'width': '100%', 'height': '700px', 'background': 'grey' }">

          </div>

        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info"> Exit </v-btn>
        </v-card-actions>

      </v-card>
      
      </v-main>
      
    </v-layout>
  </div>
</template>
