import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTranscriptionStore = defineStore('transcription', () => {

  const speechSegmentsArray = ref(['This is the first segment', 'This is the second segment', 'This is the third segment', 'This is the 4th segment', 'This is the 5th segment', 'This is the 6th segment', 'This is the 7th segment', 'This is the 8th segment', 'This is the 9th segment', 'This is the 10th segment', 'This is the 11th segment', 'This is the 12th segment'])
  const lastSpeechSegment = ref('This is the last segment')

  const transcription = computed(() => {
    return speechSegmentsArray.value.join('. ') + '. ' + lastSpeechSegment.value
  })
  return {
    speechSegmentsArray,
    lastSpeechSegment,
    transcription
  }

})
