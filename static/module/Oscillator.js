let transpose = 4;

const initTranspose = 4

const waveSample = 2048

const waveData = {

    interval: Math.pow(2, 1/12),

    pitch: 440/(2**initTranspose),

    frequency: function(i){
        return this.pitch*(this.interval**(i-9))*(2**transpose)
    },

    numOfWaves: 5,
    wavetable: [...Array(5)].map(
            (_,k) => [...Array(waveSample)].map(
                (_,i) => Math.sin(2*Math.PI*(i/waveSample)*(k+1)
                )
            )
        )

}

const audioCtx = new AudioContext();

(async function() {
    await audioCtx.audioWorklet.addModule("static/module/AudioWorkletProcessor/wavetable-processor.js")
    
})()

const WavetableProcessor = function(i, initialize) { 

    // console.log("frequency: ", waveData.frequency(i))
    // console.log("wavetable: ", waveData.wavetable,)
    // console.log("index: ", document.getElementById("range").value)
    return new AudioWorkletNode(audioCtx, "wavetable-processor",{
        processorOptions: {
        frequency: waveData.frequency(i),
        wave: waveData.wavetable,
        index: document.getElementById("range").value,
        util: initialize
        }
    })
}

const OscillatorSources = [...Array(13)]//.map(() => WavetableProcessor(0,true));

const startOscillator = function(i){
    audioCtx.resume();

    endOscillator[i];
 
    OscillatorSources[i] = WavetableProcessor(i,false);

    OscillatorSources[i].connect(audioCtx.destination);
}

const endOscillator = function(i){
    OscillatorSources[i].parameters.get("Release").value = true
}


const addTransposeEvent = function(){

    const transpose_value = document.getElementById('transpose_value');
    transpose_value.innerHTML = transpose;

    const transpose_button = document.querySelectorAll('#transpose_button');

    transpose_button[0].addEventListener('pointerdown', () => downTranspose())

    transpose_button[1].addEventListener('pointerdown', () => upTranspose())

    addEventListener("keydown", event => {
        if (!event.repeat){
            switch(event.key){
                case "z": downTranspose();break;
                case "x": upTranspose();break;
            }
        }
    })
}

const downTranspose = function(){
    if (transpose>=1) {
        transpose-=1;
        transpose_value.innerHTML = transpose
    }
}

const upTranspose = function(){
    if (transpose<=5) {
        transpose+=1;
            transpose_value.innerHTML = transpose;
    }  
}

addTransposeEvent()



export {audioCtx, waveData, startOscillator, endOscillator, WavetableProcessor}
