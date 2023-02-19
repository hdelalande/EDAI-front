<template>
    <div class="teacher">
        <div v-if="currentState === 'finished'">
            <h1>The presentation is finished, you can back home</h1>
            <router-link to="/">
                <v-btn>Back Home</v-btn>
            </router-link>
        </div>
        <div v-else>
            <h1>Your Room ID is :{{ RoomID }} <br> Share it to your students </h1>
            <div v-if="currentState === 'waiting' || currentState === 'stopped'">
                <v-btn @click="startRecording">Start Recording</v-btn>
            </div>
            <div v-if="currentState === 'recording'">
                <v-btn @click="stopRecording">Stop Recording</v-btn>
            </div>
            <v-btn @click="FinishPresentation">Presentation finished</v-btn>
        </div>

    </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'


const currentState = ref('waiting')
const RoomID = ref(Math.random().toString(36).substring(2, 15));
const ws = new WebSocket('ws://127.0.0.1:8000/ws/lecture/speaker/room/'+ RoomID.value +'/')
// const { statusListener, dataListener, sendListener, openListener, closeListener } = useWebSocket('ws://127.0.0.1:8000/ws/lecture/listener/room/'+ RoomID.value +'/')


onMounted(() => {
    ws.addEventListener('open', () => {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setUint32(0, RoomID.value, true);

        ws.send(buffer);
    })

    ws.addEventListener('message', (event) => {
        console.log(event.data)
    })
})

onUnmounted(() => {
    ws.close()
})


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
    navigator.getUserMedia({ audio: { sampleRate: 44100 } },     
    function (e) {     
        // creates the audio context  
        window.AudioContext = window.AudioContext || window.webkitAudioContext;     
        context = new AudioContext();     

        // creates an audio node from the microphone incoming stream     
        mediaStream = context.createMediaStreamSource(e);
        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor     
        var bufferSize = 2048;     
        var numberOfInputChannels = 1;     
        var numberOfOutputChannels = 1;
        if (context.createScriptProcessor) {     
            recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);     
        } else {     
            recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);     
        }      
        console.log("on audio progress");     

        recorder.onaudioprocess = function (e) {     
            // console.log('recording');
            var inputData = e.inputBuffer.getChannelData(0);
            var outputData = new Int16Array(inputData.length);
            for (var i = 0; i < inputData.length; i++) {
                var sample = inputData[i];

                outputData[i] = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
            }
            ws.send(outputData);
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
    currentState.value = 'stopped'
    // stop recording 
    recorder.disconnect(context.destination);
    mediaStream.disconnect(recorder);
}

function FinishPresentation(){
    currentState.value = 'finished'
    ws.close()
}

</script>

<style>
    .teacher {
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    
</style>