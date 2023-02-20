import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConnectionStateStore = defineStore('connectionState', () => {

    const connected = ref(false)
    const loading = ref(false)
    
    return { connected, loading }
})
