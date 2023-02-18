<template>
    <div class="student">
        <v-form>
            <v-text-field
                v-model="roomID"
                label="Room ID"
                required
            ></v-text-field>
            <v-text-field
                v-model="userName"
                label="Username"
                required
            ></v-text-field>
            <v-btn
                color="primary"
                @click= "RoomIDFunction"
            >Join Room</v-btn>
        </v-form>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const roomID = ref('')
const userName = ref('')
const emit = defineEmits(['FormSubmit'])

function RoomIDFunction() {
    emit('FormSubmit',userName.value, roomID.value)
}


</script>

<style>
</style>