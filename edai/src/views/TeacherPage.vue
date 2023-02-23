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

        <v-row class="mt-1 ml-2" align="center">
            <v-col cols="6" class="">
              <v-chip color="primary" label size="small"> Sleep time (ms) </v-chip>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="sleepTime"
                variant="outlined"
                type="number"
                min="0"
                density="compact"
                hide-details="true"
              ></v-text-field>
            </v-col>
        </v-row>

        <v-row class="my-0 ml-2" align="center">
            <v-col cols="6" class="">
              <v-chip color="primary" label size="small"> Timeout (ms) </v-chip>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="segmentTimeout"
                variant="outlined"
                type="number"
                min="0"
                density="compact"
                hide-details="true"
              ></v-text-field>
            </v-col>
        </v-row>

        <v-row class="my-0 ml-2" align="center">
            <v-col cols="6" class="">
              <v-chip color="primary" label size="small"> Language </v-chip>
            </v-col>
            <v-col cols="6">
              <v-select
                :items="languageOptions"
                v-model="language"
                density="compact"
                variant="underlined"
                hide-details="true"
              >

              </v-select>
            </v-col>
        </v-row>

        <v-row class="my-0 ml-2" align="center">
            <v-col cols="6" class="">
              <v-btn variant="text" color="primary" size="small" @click="updateParameters"> Save </v-btn>
            </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item prepend-icon="mdi-account-school" title="Student 1" value="home" :link="false"></v-list-item>
          <v-list-item prepend-icon="mdi-account-school" title="Student 2" value="account" :link="false"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="min-height: 850px;">
      
        
        
        <v-alert variant="tonal" color="info" icon="mdi-human-male-board">
          <h3> Room {{ roomID }} </h3>
        </v-alert>

        <v-card max-height="650" class="overflow-auto">
          <v-card-text>
              <TranscriptionDisplay> hey </TranscriptionDisplay>
          </v-card-text>
        </v-card>
      <br>
      <v-btn @click="clearSelection" :variant="selectedItems.length > 0 ? 'tonal': 'plain'" color="primary"> Clear selection </v-btn>
      <v-btn color="info" to="/" variant="text"> Exit </v-btn>
      
      </v-main>
      
    </v-layout>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useConnectionStateStore } from '@/stores/connection'
import { useTranscriptionStore } from '@/stores/transcription'
import { storeToRefs } from 'pinia'
import router from '@/router'
import startRecording from '@/services/recorder.js'
import TranscriptionDisplay from '@/components/TranscriptionDisplay.vue'

const connectionStore = useConnectionStateStore()
const transcriptionStore = useTranscriptionStore()
const { connected, loading } = storeToRefs(connectionStore)
const { transcription, selectedItems } = storeToRefs(transcriptionStore)

const roomID = ref('')

const ws = ref()

const microphoneMuted = ref(true)
const contextRecord = ref()

const sleepTime = ref(1000)
const segmentTimeout = ref(1000)
const languageOptions = ref(['en', 'fr'])
const language = ref('en')


function updateParameters() {
  console.log('update parameters', sleepTime.value, segmentTimeout.value, language.value)
  ws.value.send(JSON.stringify({
    "event": "update_parameters",
    "sleep_time": sleepTime.value,
    "segment_timeout": segmentTimeout.value,
    "language": language.value
  }))
}

function clearSelection() {
  selectedItems.value = []
  console.log('clear selection', selectedItems.value)
}

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
    let data = JSON.parse(event.data)
    if (data.type == 'transcription.message') {
      console.log('transcription.message', data)
      if (data.completed) {
        transcriptionStore.speechSegmentsArray.push(data.text_segment)
      } else {
        transcriptionStore.lastSpeechSegment = data.text_segment
      }
      console.log('transcription', transcription)
    } else if (data.type == 'healthcheck.message') {
    //   console.log('healthcheck.message', data)
    }
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
  roomID.value = router.currentRoute.value.params.roomID
  openConnection()
})

onBeforeUnmount(() => {
  ws.value.close()
})

</script>

