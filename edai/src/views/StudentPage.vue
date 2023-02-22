<template>
    <div class="student">
        <v-row>

            <v-col cols="12">
                <h2> Room: {{ roomID }}</h2>
            </v-col>
            <v-col md="8" sm="12">
                    <TranscriptionDisplay :height="600">  </TranscriptionDisplay>
                <br>
            </v-col>
            <v-col md="4" sm="12">
                <FlashNotes :flashnotes=flashnotes></FlashNotes>
            </v-col>
        </v-row>
        <SelectFlashnoteType @createFlasnote="createFlasnote"></SelectFlashnoteType>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import api from '@/services/axios'
import { useConnectionStateStore } from '@/stores/connection'
import { useTranscriptionStore } from '@/stores/transcription'
import router from '@/router'
import { storeToRefs } from 'pinia'
import TranscriptionDisplay from '@/components/TranscriptionDisplay.vue'
import FlashNotes from '@/components/FlashNotes.vue'
import SelectFlashnoteType from '@/components/SelectFlashnoteType.vue'


const connectionStore = useConnectionStateStore()
const transcriptionStore = useTranscriptionStore()
const { connected, loading } = storeToRefs(connectionStore)
const { transcription } = storeToRefs(transcriptionStore)

const flashnotes = ref([])
const roomID = ref('')
const ws = ref()
const text = ref('')

const createFlasnote = (type, input, seconds) => {
  if (type === 'summary' && input === 'last_minutes') {
    summarizeLastMinutes(seconds)
  }
  if (type === 'key_points' && input === 'last_minutes') {
    generateKeyPointsLastMinutes(seconds)
  }
  if (type === 'summary' && input === 'text') {
    summarizeFromText(text.value)
  }
  if (type === 'key_points' && input === 'text') {
    generateKeyPointsFromText(text.value)
  }
}

const updateText = () => {
    text.value = text.value + "\n" + document.getSelection().toString()
    console.log(text.value)
}

const summarizeFromText = (text) => {
    var lenght_flashnotes = flashnotes.value.length
    flashnotes.value.push({
        title: 'Summary',
        body: 'Loading...',
        status: 'loading'
    })
    api.get('/text/summarize/?text=' + text)
    .then((response) => {
        flashnotes.value[lenght_flashnotes] = {
            title: 'Summary',
            body: response.data.summary,
            status: 'loaded'
        }
    })
    .catch((error) => {
      console.log(error)
      flashnotes.value.pop()
    })
}

const generateKeyPointsFromText = (text) => {
    var lenght_flashnotes = flashnotes.value.length
    flashnotes.value.push({
        title: 'Key Points',
        body: 'Loading...',
        status: 'loading'
    })
    api.get('/text/extract-keypoints/?text=' + text)
    .then((response) => {
        flashnotes.value[lenght_flashnotes] = {
            title: 'Key Points',
            body: response.data.keypoints,
            status: 'loaded'
        }
    })
    .catch((error) => {
      console.log(error)
      flashnotes.value.pop()
    })
}

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

onUnmounted(() => {
  ws.value.close()
})

const openConnection = () => {
  loading.value = true
  console.log('roomID: ', roomID.value)

  if (roomID.value === '') {
    console.log('roomID is empty')
    return
  }
  ws.value = new WebSocket('ws://127.0.0.1:8000/ws/lecture/listener/room/' + roomID.value + '/')
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
