<script setup>
import { RouterView } from "vue-router";
import HorizontalHeader from "./horizontal-header/HorizontalHeader.vue";

</script>

<template>
  <v-app>
    <v-layout>
        <HorizontalHeader />

        <v-main>
          <v-container fluid class="page-wrapper">
            <RouterView />
          </v-container>
        </v-main>
    </v-layout>
  </v-app>
</template>
