import { WavetableProcessor, waveData } from "./Oscillator.js"
import { drawCanvas } from "./drawCanvas.js"

const rangeSlider = document.getElementById("range");

rangeSlider.addEventListener('input', ()=>{

    let changeIndex = WavetableProcessor(0,true)

    const index = parseFloat(rangeSlider.value)

    const f = Math.floor(index)

    let CanvasWave

    // linear interpolation

    if (f==index) CanvasWave = waveData.wavetable[index]
    
    else { 
        CanvasWave = waveData.wavetable[f].map(function(value, i){
            return value + (waveData.wavetable[f+1][i] - value)*(index-f) 
        })
    }
    drawCanvas(CanvasWave)
});
