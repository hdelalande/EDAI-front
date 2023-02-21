<template>
    <v-btn 
        class="mr-1"
        id="summary-text-btn"
        @click=" $emit('createFlasnote', 'summary', 'text')"
        > 
        Summarize selected text
    </v-btn>
    <v-btn 
        class="mr-1"
        id="keypoint-text-btn"
        @click=" $emit('createFlasnote', 'key_points', 'text')"
        > 
        Extract Key Points from selected text
    </v-btn>
                <v-btn 
                    class="mr-1"
                    id="summary-btn"
                    > 
                    Summarize last minutes
                    <v-menu activator="parent">
                        <v-list>
                            <v-list-item
                                v-for="(item,index) in timeRange"    
                                :key="index"
                                :value="index"
                                @click=" $emit('createFlasnote', 'summary', 'last_minutes', item.value)"
                                >
                                <v-list-item-title>
                                    {{ item.title }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-btn>
                

                <v-btn class="ml-1"> 
                Extract Keypoints on the last minutes
                    <v-menu activator="parent">
                        <v-list>
                            <v-list-item
                                v-for="(item,index) in timeRange"    
                                :key="index"
                                :value="index"
                                @click=" $emit('createFlasnote', 'key_points', 'last_minutes', item.value)"
                                >
                                <v-list-item-title>
                                    {{ item.title }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-btn>
</template>

<script setup>
import { ref } from 'vue'

const timeRange = ref([
    {title: "2 minutes", value: '120'},
    {title: "5 minutes", value: '300'},
    {title: "10 minutes", value: '600'},
    {title: "15 minutes", value: '900'},
    {title: "30 minutes", value: '1800'},
    {title: "45 minutes", value: '2700'},
    ]
)
</script>