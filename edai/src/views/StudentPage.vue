<template>
    <div class="student">
        <v-row>

            <v-col cols="12">
                <h2> Room: {{ roomID }}</h2>
            </v-col>
            <v-col md="8" sm="12">
                    <DisplayTranscription :height="600">  </DisplayTranscription>
                <br>
                <v-btn 
                    class="mr-1"
                    id="summary-btn"
                    > 
                    Summarize last minutes
                    <v-menu activator="parent">
                        <v-list>
                            <v-list-item
                                v-for="(item,index) in timeRange"    
                                :key="index"
                                :value="index"
                                @click="summarizeLastMinutes(item.value)"
                                >
                                <v-list-item-title>
                                    {{ item.title }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-btn>
                

                <v-btn class="ml-1"> 
                Extract Keypoints on the last minutes
                    <v-menu activator="parent">
                        <v-list>
                            <v-list-item
                                v-for="(item,index) in timeRange"    
                                :key="index"
                                :value="index"
                                @click= "generateKeyPointsLastMinutes(item.value)"
                                >
                                <v-list-item-title>
                                    {{ item.title }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-btn>

            </v-col>
            <v-col md="4" sm="12">
                <FlashNotes :flashnotes=flashnotes></FlashNotes>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import api from '@/services/axios'
import { useConnectionStateStore } from '@/stores/connection'
import { useTranscriptionStore } from '@/stores/transcription'
import router from '@/router'
import { storeToRefs } from 'pinia'
import DisplayTranscription from '@/components/DisplayTranscription.vue'
import FlashNotes from '@/components/FlashNotes.vue'


const connectionStore = useConnectionStateStore()
const transcriptionStore = useTranscriptionStore()
const { connected, loading } = storeToRefs(connectionStore)
const { transcription } = storeToRefs(transcriptionStore)

const timeRange = ref([
    {title: "2 minutes", value: '120'},
    {title: "5 minutes", value: '300'},
    {title: "10 minutes", value: '600'},
    {title: "15 minutes", value: '900'},
    {title: "30 minutes", value: '1800'},
    {title: "45 minutes", value: '2700'},
    ]
)

const flashnotes = ref([])

const roomID = ref('')

const ws = ref()

const summarizeLastMinutes = (seconds) => {
    var lenght_flashnotes = flashnotes.value.length
    flashnotes.value.push({
        title: 'Summary',
        last_duration: seconds,
        body: 'Loading...',
        transcript: 'Loading...',
        status: 'loading'
    })
    api.get('/transcription/summarize/?room_id='+ roomID.value +'&last_duration=' + seconds)
    .then((response) => {
        flashnotes.value[lenght_flashnotes] = {
            title: 'Summary',
            last_duration: response.data.last_duration,
            body: response.data.summary,
            transcript: response.data.transcript,
            status: 'loaded'
        }
    })
    .catch((error) => {
      console.log(error)
      flashnotes.value.pop()
    })
}

const generateKeyPointsLastMinutes = (seconds) => {
    var lenght_flashnotes = flashnotes.value.length
    flashnotes.value.push({
        title: 'Key Points',
        last_duration: seconds,
        body: 'Loading...',
        transcript: 'Loading...',
        status: 'loading'
    })
    api.get('/transcription/keypoints/?room_id='+ roomID.value +'&last_duration=' + seconds)
    .then((response) => {
        flashnotes.value[lenght_flashnotes] = {
            title: 'Key Points',
            last_duration: response.data.last_duration,
            body: response.data.keypoints,
            transcript: response.data.transcript
        }
    })
    .catch((error) => {
      console.log(error)
    })
}

onMounted(() => {
  roomID.value = router.currentRoute.value.params.roomID
  openConnection()
})

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
      if (data.completed == true) {
        transcriptionStore.speechSegmentsArray.push(data.text_segment)
      } else {
        transcriptionStore.lastSpeechSegment = data.text_segment
      }
      console.log('transcription', transcription)
    } else if (data.type == 'healthcheck.message') {
      //console.log('healthcheck.message', data)
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


</script>

<style>

</style>