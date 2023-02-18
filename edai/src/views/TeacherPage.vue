<template>
    <div class="teacher">
        <h1>Your Room ID is :{{ RoomID }} <br> Share it to your students </h1>
        <div v-if="currentState === 'waiting'">
            <v-btn @click="startRecording">Start Recording</v-btn>
        </div>
        <div v-else>
            <v-btn @click="stopRecording">Stop Recording</v-btn>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue'
import { useWebSocket } from '@vueuse/core'


const currentState = ref('waiting')
const RoomID = ref(Math.random().toString(36).substring(2, 15)); 

const { status, data, send, open, close } = useWebSocket('ws://127.0.0.1:8000/ws/lecture/speaker/room/100/')
open()
console.log(status)
console.log(data)
send('Hello World')
close()

var context;
var recorder;
var mediaStream;

function startRecording(){
    currentState.value = 'recording'
    // Ask for access to the microphone
    navigator.getUserMedia = navigator.getUserMedia ||     
    navigator.webkitGetUserMedia ||     
    navigator.mozGetUserMedia ||     
    navigator.msGetUserMedia;    

    // lecture of the audio stream
    navigator.getUserMedia({ audio: true },     
    function (e) {     
        // creates the audio context  
        window.AudioContext = window.AudioContext || window.webkitAudioContext;     
        context = new AudioContext();     

        // creates an audio node from the microphone incoming stream     
        mediaStream = context.createMediaStreamSource(e);    
        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor     
        var bufferSize = 2048;     
        var numberOfInputChannels = 2;     
        var numberOfOutputChannels = 2;
        if (context.createScriptProcessor) {     
            recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);     
        } else {     
            recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);     
        }      
        console.log("on audio progress");     

        recorder.onaudioprocess = function (e) {     
            // console.log('recording');
            console.log(e.inputBuffer);
        }
        // we connect the recorder with the input stream     
        mediaStream.connect(recorder);     
        recorder.connect(context.destination);     
    },
    function (e) {     
    // error     
    console.error(e);     
    });
}

function stopRecording(){
    currentState.value = 'waiting'
    // stop recording 
    recorder.disconnect(context.destination);
    mediaStream.disconnect(recorder);
}



</script>

<style>
    .teacher {
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    
</style>