import { drawCanvas } from "./module/drawCanvas.js";
import { waveData } from "./module/Oscillator.js"
import {} from "./module/waveIndexSlider.js"
import {} from "./module/keyboardEvent.js"

const main = function(){
        
    let  wavetableJSON = '';


    document.getElementById("download").onclick = function(){

        if (wavetableJSON=='') {
            this.removeAttribute('download');
            return
        }

        this.setAttribute('download', "parser.vitaltable");

        var blob = new Blob([ wavetableJSON ], { "type" : "text/plain" });

        if (window.navigator.msSaveBlob) { 
            window.navigator.msSaveBlob(blob, "parser.vitaltable"); 

            window.navigator.msSaveOrOpenBlob(blob, "parser.vitaltable"); 
        } else {
            this.href = window.URL.createObjectURL(blob);
        }

    }

    document.getElementById("send").onclick =  async function() {

        const formula = document.getElementById('input_formula').value;

        const num = document.getElementById('input_num').value;

        const response = await fetch('/run_script', {
            method: 'POST', 
            body: JSON.stringify({'values':[formula,num]})
        });

        const data = await response.json();

        waveData.wavetable = JSON.parse(JSON.stringify(data)).result;

        wavetableJSON = JSON.parse(JSON.stringify(data)).wavetable;

        load_sound(waveData.wavetable)

    }

    load_sound(waveData.wavetable)
}

const load_sound = function(wavetableData){

    const rangeSlider = document.getElementById("range")

    drawCanvas(wavetableData[0]);

    rangeSlider.setAttribute('max', String(wavetableData.length-1))
    rangeSlider.value=0; 
}

main()
