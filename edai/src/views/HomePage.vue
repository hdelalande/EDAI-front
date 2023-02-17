<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <h1>Home Page</h1>
        <v-btn><router-link to="/teacher">Teacher</router-link></v-btn>
        <v-btn><router-link to="/student">Student</router-link></v-btn>
    </div>
</template>

<script setup>

</script>

<style>
    .home {
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>