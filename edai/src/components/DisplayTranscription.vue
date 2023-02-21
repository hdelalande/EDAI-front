<script setup>
import { ref } from 'vue'
import { useTranscriptionStore } from '@/stores/transcription'
import { storeToRefs } from 'pinia'

const transcriptionStore = useTranscriptionStore()
const { transcription } = storeToRefs(transcriptionStore)

</script>


<template>
    <v-card id="cardTranscription" title="Transcription" :text=transcription v-on:click="$emit('textSelected')" :ripple="false" v-enter>
    </v-card>

</template>

<style>
</style>
