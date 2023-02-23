import { defineStore } from 'pinia'

// Composition API Style
//    ref()s become state properties
//    computed()s become getters
//    function()s become actions


export const useStudentStore = defineStore('student',{
  state: () => ({ roomID: '', username: '' })
})

export const useTeacherStore = defineStore('teacher',{
    state: () => ({roomID: ''})
})