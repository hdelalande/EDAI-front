<template>
    <v-app>
    <div>
        <h1>Hello {{ userName }}, welcome to Lecture ;)</h1>
        <h2>Retranscrition :</h2>
        <v-card text="..."></v-card>
        <h2>Would you like a summary of the last X minutes?</h2>
        <v-slider
        :ticks="tickLabels"
        :max="10"
        step="1"
        show-ticks="always"
        tick-size="4"
        ></v-slider>
        <v-btn>Generate Summary</v-btn>
        <v-card text="..."></v-card>
    </div>
</v-app>
</template>

<script setup>
const tickLabels = {
    0: '1 min',
    1: '3 min',
    2: '5 min',
    3: '10 min',
    4: '15 min',
    5: '20 min',
    6: '30 min',
    7: '45 min',
    8: '1 h',
    9: '2 h',
    10: '3 h'
}
// import { defineProps } from 'vue'

// const props = defineProps({
//     roomID: {
//         type: String,
//         required: true
//     },
//     userName: {
//         type: String,
//         required: true
//     }
// })
</script>

<style scoped>

</style>