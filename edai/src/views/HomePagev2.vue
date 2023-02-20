
<script setup>
import api from '@/services/axios'
import router from '@/router'

function createRoom() {
  api.get('/generate/room_id/')
    .then((response) => {
      const roomID = response.data.room_id
      router.push({ path: `/teacher/room/${roomID}` })
    })
    .catch((error) => {
      console.log(error)
    })
}

</script>

<template>
    <v-container :style="{ 'text-align': 'center' }">
        <v-row>
            <v-col class="text-center">
                <v-img id="linkToHome" :src="require('@/assets/edai-logo.png')" :width="300" class="mx-auto"></v-img>
            </v-col>
        </v-row>
        <v-row class="mr-0">
            <v-col cols="4"></v-col>
            <v-col cols="4">
              <v-container>
                <v-text-field
                  label="Room ID"
                  variant="outlined"
                  density="compact"
                  hide-details
                  color="primary"	
                ></v-text-field>
                <v-btn class="my-2" prepend-icon="mdi-location-enter" block variant="outlined" height="50" color="primary"> Join room (student)</v-btn>
                <v-btn class="my-2" block color="primary" @click="createRoom"> Create room (Teacher)</v-btn>
              </v-container>
            </v-col>
            <v-col cols="4"></v-col>
        </v-row>
    </v-container>
</template>

