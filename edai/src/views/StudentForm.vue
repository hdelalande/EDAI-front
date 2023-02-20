<template>
    <div class="student">
        <div>
            <StudentForm @FormSubmit="displayApplication"/>
        </div>
    </div>
</template>

<script setup>
import StudentForm  from '../components/StudentForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function displayApplication(roomIDResponse) {
    router.push('/studentApplication/'+roomIDResponse)
}
</script>

<style>
    .student {
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>