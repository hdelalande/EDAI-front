<template>
    <v-container :style="{ 'text-align': 'center' }">
        <v-row>
            <v-col class="text-center">
                <v-img id="linkToHome" :src="require('@/assets/lectury_logo.png')" :width="500" class="mx-auto"></v-img>
            </v-col>
        </v-row>
        <v-row class="mr-0">
            <v-col cols="4"></v-col>
            <v-col cols="4">
              <v-container>
                <v-text-field
                  v-model="roomIDofStudent"
                  label="Room ID"
                  variant="outlined"
                  density="compact"
                  hide-details
                  color="primary"	
                ></v-text-field>
                <v-btn class="my-2" prepend-icon="mdi-location-enter" block variant="outlined" height="50" color="primary" @click="joinRoom"> Join room (student)</v-btn>
                <v-btn class="my-2" block color="primary" @click="createRoom" :loading="loading"> Create room (Teacher)</v-btn>
              </v-container>
            </v-col>
            <v-col cols="4"></v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/axios'
import router from '@/router'

const roomIDofStudent = ref('')
const loading = ref(false)

function joinRoom() {
    router.push({ path: "/student/room/"+roomIDofStudent.value})
}

function createRoom() {
  loading.value = true

  api.get('/generate/room_id/')
    .then((response) => {
      loading.value = false
      const roomID = response.data.room_id
      router.push({ path: `/teacher/room/${roomID}` })
    })
    .catch((error) => {
      console.log(error)
    })
}

</script>
