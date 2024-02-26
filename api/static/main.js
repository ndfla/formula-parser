
var wavetableJSON = '';
var transpose = 4;

const r = Math.pow(2, 1/12);

var pitch = 440/(2**transpose);

let ratio = [...Array(13)].map((_,i) => r**(i-9))

var wavetableData = [...Array(5)].map((p,k)=> 
    [...Array(2048)].map((_,i)=>
        Math.sin(2*Math.PI*(i/2048)*(k+1)))
)

var CanvasWave = [...Array(2048)].map((_,i)=>
            Math.sin(2*Math.PI*(i/2048)));

const canvas = document.getElementById("waveform");
const canvasContext = canvas.getContext("2d");

var push = 0
var pushkey = [...Array(13)].map( (_,i)=> 0 )
var keySound = [...Array(13)].map( (_,i)=> 0 )

var keys = document.querySelectorAll('#piano div');

const waveSlider = document.getElementById("range");

const input_num = document.getElementById("input_num");

const sources = [...Array(13)];

function downloadWavetable(){

    var link = document.getElementById("download");
    if (wavetableJSON=='') {
        link.removeAttribute('download');
        return
    }

    link.setAttribute('download', "parser.vitaltable");

    var blob = new Blob([ wavetableJSON ], { "type" : "text/plain" });

    if (window.navigator.msSaveBlob) { 
        window.navigator.msSaveBlob(blob, "parser.vitaltable"); 

        window.navigator.msSaveOrOpenBlob(blob, "parser.vitaltable"); 
    } else {
        link.href = window.URL.createObjectURL(blob);
    }

}


input_num.addEventListener('keydown',(event) => {
    if (!event.repeat){
        if (event.key=='Enter') runScript();
        }
})

const transpose_value = document.getElementById('transpose_value');
transpose_value.innerHTML = transpose;

const transpose_button = document.querySelectorAll('#transpose_button');


function downTranspose(){
    if (transpose>=1) {
        transpose-=1;
        transpose_value.innerHTML = transpose
    }
}

function upTranspose(){
    if (transpose<=5) {
        transpose+=1;
        transpose_value.innerHTML = transpose;
    }
}

const audioCtx = new AudioContext();


setWavetableProcessor = async () => {
    
    await audioCtx.audioWorklet.addModule("static/wavetable-processor.js")

}

setWavetableProcessor();

WavetableProcessor = function(i) { 
    return new AudioWorkletNode(audioCtx, "wavetable-processor",{
        processorOptions: {
        frequency: pitch*ratio[i]*(2**transpose),
        wave: wavetableData,
        index: waveSlider.value,
        util: false
        }
    })
}

load_sound(wavetableData);

waveSlider.addEventListener('input', ()=>{

    let changeIndex = new AudioWorkletNode(audioCtx, "wavetable-processor",{
        processorOptions: {
        frequency: 0,
        wave: wavetableData,
        index: waveSlider.value,
        util: true
        }
    })
    changeIndex = null;



    index = waveSlider.value;

    const f = Math.floor(index);


    if (f==index) {
        CanvasWave = wavetableData[index];
        draw(CanvasWave);
    }
    else { 
        CanvasWave = wavetableData[f].map(function(value, i){
            return value + (wavetableData[f+1][i] - value)*(index-f) 
        });
        draw(CanvasWave);
    }
});

transpose_button[0].addEventListener('pointerdown', (e) => downTranspose())

transpose_button[1].addEventListener('pointerdown', (e) => upTranspose())

addEventListener("keydown", (event) => {
    if (!event.repeat){
        switch(event.key){
            case "a": keydownev(0);break;
            case "w": keydownev(1);break;
            case "s": keydownev(2);break;
            case "e": keydownev(3);break;
            case "d": keydownev(4);break;
            case "f": keydownev(5);break;
            case "t": keydownev(6);break;
            case "g": keydownev(7);break;
            case "y": keydownev(8);break;
            case "h": keydownev(9);break;
            case "u": keydownev(10);break;
            case "j": keydownev(11);break;
            case "k": keydownev(12);break;

            case "z": downTranspose();break;
            case "x": upTranspose();break;
        }
    }
});
    
addEventListener("keyup", (event) => {
    switch(event.key){
        case "a": keyupev(0);break;
        case "w": keyupev(1);break;
        case "s": keyupev(2);break;
        case "e": keyupev(3);break;
        case "d": keyupev(4);break;
        case "f": keyupev(5);break;
        case "t": keyupev(6);break;
        case "g": keyupev(7);break;
        case "y": keyupev(8);break;
        case "h": keyupev(9);break;
        case "u": keyupev(10);break;
        case "j": keyupev(11);break;
        case "k": keyupev(12);break;
    }
});
    
    
keys.forEach(function(elem) {
    elem.addEventListener("mouseleave", e => {leave(e)})
});

keys.forEach(function(elem) {
    elem.addEventListener("mouseover", e => {over(e)})
});
    
keys.forEach(function(elem) {
    elem.addEventListener('mousedown',  e => {down(e)})
});
    
keys.forEach(function(elem) {
    elem.addEventListener('mouseup',  e => {up(e)})
});

keys.forEach(function(elem) {
    elem.addEventListener("touchcancel", e => {

        e.changedTouches.forEach((value,i)=> {
            keyupev(parseInt(value.currentTarget.dataset.num))})
        })
});


piano = document.getElementById("piano")

function disableScroll(event) {
    event.preventDefault();
}


keys.forEach(function(elem) {
    elem.addEventListener("touchstart", e => {

        if (e.touches.length == 1) piano.addEventListener('touchmove', disableScroll, { passive: false });

        let i = parseInt(e.currentTarget.dataset.num)

        keys[i].classList.add("hov");

        startSound(i)
    })
});
keys.forEach(function(elem) {
    elem.addEventListener("touchend", e => {

        if (e.touches.length == 0) piano.removeEventListener('touchmove', disableScroll, { passive: false });

        let i = parseInt(e.currentTarget.dataset.num)

        keys[i].classList.remove("hov");

        endSound(i)
    })
});


function resize(canvas) {
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
   
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {

      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
}

function draw(waveData) {

    resize(canvas)

    canvasContext.fillStyle = 'rgba(179,181,238,0.92)';

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    canvasContext.lineWidth = 1;

    canvasContext.beginPath();

    canvasContext.moveTo(0, (-waveData[0]+1) * (canvas.height/2)); 

    for (let i = 4; i < 2048; i+=4) {
        const sample = -waveData[i]; 

        const x = (i / 2048) * canvas.width; 
        const y = (sample + 1) * (canvas.height / 2); 
        canvasContext.lineTo(x, y); 
    }
    const sample = -waveData[2047]; 

    const x = (2047 / 2048) * canvas.width; 
    const y = (sample + 1) * (canvas.height / 2); 
    canvasContext.lineTo(x, y); 


    canvasContext.lineTo(canvas.width, canvas.height/2)
    canvasContext.lineTo(0, canvas.height/2)


    canvasContext.stroke();
    canvasContext.fill();

    canvasContext.closePath()

    CanvasWave = waveData; 

  }

function load_sound(wavetableData){

    CanvasWave = wavetableData[0];

    draw(CanvasWave);

    waveSlider.setAttribute('max', String(wavetableData.length-1))
    waveSlider.value=0;
    
}

async function runScript() {

    let formula = document.getElementById('input_formula').value;

    let num = document.getElementById('input_num').value;

    const response = await fetch('/run_script', {
        method: 'POST', 
        body: JSON.stringify({'values':[formula,num]})
    });

    const data = await response.json();

    wavetableData = JSON.parse(JSON.stringify(data)).result;

    wavetableJSON = JSON.parse(JSON.stringify(data)).wavetable;

    load_sound(wavetableData)

}

function startSound(i){
    audioCtx.resume();

    if (keySound[i]==1) endSound[i];
 
    sources[i] = WavetableProcessor(i);

    sources[i].connect(audioCtx.destination);

}

function endSound(i){
    sources[i].parameters.get("Release").value = true

}

function over(event) {

    i = parseInt(event.currentTarget.dataset.num)

    event.currentTarget.classList.add("hov");

    if ((push==1) && ((pushkey[i] || keySound[i])==0)) {     

        event.currentTarget.classList.add("press");
        startSound(i);

        pushkey[i]=1;
    }
    else if (push==1 && keySound[i]==1) pushkey[i]=1;
}

function leave(event) {

    i = parseInt(event.currentTarget.dataset.num)

    event.currentTarget.classList.remove("press");
    if (keySound[i]==0) event.currentTarget.classList.remove("hov");

    if ((push==1) && (keySound[i]==0)){
        endSound(i);
        
    }

    pushkey[i]=0;
}

function down(event) {
    
    push=1;

    i = parseInt(event.currentTarget.dataset.num)


    event.currentTarget.classList.add("press");

    // if (keySound[i]==1) endSound(i);

    if (keySound[i]==0) {     

        event.currentTarget.classList.add("press");
        startSound(i);
    }
    pushkey[i]=1;
}

function up(event) {

    i = parseInt(event.currentTarget.dataset.num);

    push=0;

    event.currentTarget.classList.remove("press");

    if (pushkey[i] ^ keySound[i]) {
        endSound(i); 
    }

    pushkey[i]=0;

}

document.addEventListener('mouseover', e => {
    if ((push==1 && !e.target.closest("#whiteKey")) 
                 && !e.target.closest("#blackKey")){

        pushkey = pushkey.map( (_,i)=> 0 );
        push=0;
    }
});


function keydownev(i){

    if (keySound[i]==1) return;

    if (pushkey[i]==1) endSound(i); ;
    keys[i].classList.add("hov");
    startSound(i); 
    keySound[i] = 1;
    // console.log('down', keySound)
}

function keyupev(i){

    keys[i].classList.remove("hov");

    if (pushkey[i]==0) {
        endSound(i); 
    }
    else keys[i].classList.add("hov");

    keySound[i] = 0;
    // console.log('up', keySound)


}


