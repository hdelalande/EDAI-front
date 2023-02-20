<template>
    <v-card title="Flashnotes" height="600">
        <v-list>
                <v-card 
                v-for="item in flashnotes"
                :key="item.id"
                :title="item.title" 
                color="grey" 
                height="200">
                    <v-card-item v-if="item.status === 'loading'"
                    class="center-content"
                    >
                        <v-progress-circular
                            :size="50"
                            indeterminate
                            color="primary"
                        ></v-progress-circular>
                    </v-card-item>
                    <v-card-item v-if="item.status === 'loaded'">
                        {{ item.body }}
                    </v-card-item>
                </v-card>
        </v-list>
    
    </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    flashnotes: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
.center-content {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>