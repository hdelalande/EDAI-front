import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTranscriptionStore = defineStore('transcription', () => {

  const speechSegmentsArray = ref([])
  const lastSpeechSegment = ref('')

  const transcription = computed(() => {
    return speechSegmentsArray.value.join(' ') + lastSpeechSegment.value
  })
  return {
    speechSegmentsArray,
    lastSpeechSegment,
    transcription
  }

})
