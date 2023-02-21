<script setup>
import { ref, watchEffect } from 'vue'
import { useTranscriptionStore } from '@/stores/transcription'
import { storeToRefs } from 'pinia'
import { onMounted, computed } from 'vue'

const transcriptionStore = useTranscriptionStore()
const { speechSegmentsArray, lastSpeechSegment, transcription } = storeToRefs(transcriptionStore)

const segmentsArray = computed(() => {
  return speechSegmentsArray.value.concat(lastSpeechSegment)
})

const selectedItems = ref([])
const hoveredItem = ref(null)

let isSelecting = false

function hovering(item) {
  hoveredItem.value = item
}

function startSelection(event) {
  isSelecting = true
  // console.log('starting selection')
}

function updateSelection(event) {
  if (isSelecting) {
    if (selectedItems.value.indexOf(segmentsArray.value.indexOf(hoveredItem.value)) === -1) {
      selectedItems.value.push(segmentsArray.value.indexOf(hoveredItem.value))
      // console.log('updating selection', selectedItems.value)
    }
  }
}

function endSelection(event) {
  isSelecting = false
  // console.log('ending selection')
}


function toggleSelection(index) {
  if (isSelected(index)) {
    selectedItems.value.splice(selectedItems.value.indexOf(index), 1)
  } else {
    selectedItems.value.push(index)
  }
}

function isSelected(index) {
  return selectedItems.value.indexOf(index) !== -1
}

onMounted(() => {
  console.log(speechSegmentsArray)

})

</script>

<template>
    <v-timeline 
      side="end" 
      align="start" 
      density="compact"
      >
      <v-timeline-item
        dot-color="primary"
        size="x-small"
        width="100%"
        rounded="1"
        elevation="3"
        v-for="(item, index)  in segmentsArray"
        :key="index"
        @click="toggleSelection(index)"
        @mousedown="startSelection(event)"
        @mousemove="updateSelection(event)"
        @mouseup="endSelection(event)"
      >
          <div class="d-flex">
            <v-chip 
              class="mr-4" 
              color="info"
              size="small"
              label
            >
              5pm
            </v-chip>
            <v-hover @update:model-value="() => hovering(item)">
              <template v-slot:default="{ isHovering, props }">
                <v-alert 
                  v-bind="props" 
                  :variant="isHovering ? 'tonal': 'tonal'" 
                  density="compact" 
                  :color="isHovering || isSelected(index) ? 'deep-purple-accent-4': 'blue'"
                  :class="{ 'hovered': isHovering }"
                  border="start"
                  v-ripple             
                  >
                  <template v-slot:append>
                    <v-icon size="small" color="primary"> {{ isSelected(index) ? 'mdi-check': '' }}</v-icon>
                  </template>
                  
                  <div 
                    class="text-caption"
                  >
                    <strong>{{ item  }}</strong>
                  </div>
                </v-alert>
              </template>
            </v-hover>
          </div>
      </v-timeline-item>
    </v-timeline>
</template>


<style scoped>
.v-timeline--vertical.v-timeline {
    grid-row-gap: 14px;
    height: 100%;
}
.selected {
    background-color: 'deep-purple-accent-4';
  }

.hovered {
  cursor: pointer;
}

</style>

