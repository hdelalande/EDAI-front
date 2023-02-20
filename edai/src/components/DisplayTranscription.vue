<script setup>
import { ref } from 'vue'
import { useTranscriptionStore } from '@/stores/transcription'
import { storeToRefs } from 'pinia'

const transcriptionStore = useTranscriptionStore()
const { transcription } = storeToRefs(transcriptionStore)

</script>


<template>
    <v-card title="Transcription">
        <v-textarea
            v-model="transcription"
            label="Transcription"
            outlined
            :rows="10"
            :auto-grow="true"
            :counter="100"
            :disabled="true">
        </v-textarea>     
    </v-card>

</template>
