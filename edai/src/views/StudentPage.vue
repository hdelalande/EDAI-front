<template>
    <div class="student">
        <img alt="Vue logo" src="../assets/edai-logo.png" />
        <div v-if="currentPage === 'form'">
            <StudentForm @FormSubmit="displayApplication"/>
        </div>
        <div v-else>
            <StudentApplication :roomID="currentRoomID" :userName="currentUserName"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import StudentForm  from '../components/StudentForm.vue'
import StudentApplication from '../components/StudentApplication.vue'

const currentPage = ref('form')
const currentRoomID = ref('')
const currentUserName = ref('')

function displayApplication(userNameResponse, roomIDResponse) {
    currentUserName.value = userNameResponse
    currentRoomID.value = roomIDResponse
    currentPage.value = 'application'
}
</script>

<style>
    .student {
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>