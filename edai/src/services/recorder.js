function startRecording(ws){

    return new Promise((resolve, reject) => {
        let mediaStream = null;
        let recorder = null;
        let context = null;

        console.log("init");     

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
            let bufferSize = 2048;     
            let numberOfInputChannels = 1;     
            let numberOfOutputChannels = 1;
            if (context.createScriptProcessor) {     
                recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);     
            } else {     
                recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);     
            }      
            console.log("on audio progress");     
            recorder.onaudioprocess = function (e) {     
                // console.log('recording');
                let inputData = e.inputBuffer.getChannelData(0);
                let outputData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    let sample = inputData[i];
                    outputData[i] = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
                }
                if (ws && ws.readyState === 1) {
                    ws.send(outputData);
                }
                // console.log(outputData)
            }
            // we connect the recorder with the input stream     
            mediaStream.connect(recorder);     
            recorder.connect(context.destination);
            context.mediaStream = mediaStream;
            context.recorder = recorder;
            resolve(context)
        },
        function (e) {     
            // error     
            console.error(e); 
            reject(e)
        });

    })

}

export default startRecording

