<script setup>

</script>

<template>
  <v-app-bar
    color="white"
    elevation="4"
    :class="[
      'horizontaTopbar',
    ]"
  >
    <!-- ---------------------------------------------- -->
    <!---Logo part -->
    <!-- ---------------------------------------------- -->
    <div class="pa-4 d-none d-md-block">
      <v-img id="linkToHome" :src="require('@/assets/edai-logo.png')" :width="200"></v-img>
    </div>

    <v-app-bar-nav-icon
      class="hidden-md-and-up"
    />

    <v-spacer />

    <v-chip class="mx-2">
      <v-badge color="error" dot inline>
        <span class="mr-2"> not connected </span>
      </v-badge>
    </v-chip>

  </v-app-bar>
</template>
