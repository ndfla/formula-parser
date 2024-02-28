import { endOscillator, startOscillator } from "./Oscillator.js";

const keys = document.querySelectorAll('#piano div');

let push = 0
let pushkey = [...Array(13)].map( (_,i)=> 0 )
let keySound = [...Array(13)].map( (_,i)=> 0 )

const piano = document.getElementById("piano")

const keyboardArray = ["a","w","s","e","d","f","t","g","y","h","u","j","k"]

const controller = new AbortController()

const initializePianoEvent = function(){

    addPianoEvents()
    
    keys.forEach(function(elem) {

        elem.addEventListener("touchstart", e => {

            if (e.touches.length == 1) {
                piano.addEventListener('touchmove', disableScroll, { passive: false });

                resetPianoEvents()
            }

            let i = parseInt(e.currentTarget.dataset.num)
            keys[i].classList.add("hov");

            if (e.targetTouches.length==1) startOscillator(i)

        })
    });
    keys.forEach(function(elem) {
        elem.addEventListener("touchend", e => {

            let i = parseInt(e.currentTarget.dataset.num)
            keys[i].classList.remove("hov");

            if (e.targetTouches.length==0) endOscillator(i)

            if (e.touches.length == 0) {
                

                piano.removeEventListener('touchmove', disableScroll, { passive: false });
            }

        })
    });

    keys.forEach(function(elem) {
        elem.addEventListener("touchcancel", e => {
    
            e.changedTouches.forEach((value,i)=> {
                keyupev(parseInt(value.target.dataset.num))})
            })
    });
}

const addPianoEvents = function(){

    addEventListener("keydown",(event)=>{
        if (!event.repeat){
            keyboardArray.forEach((key, index) => {
                if (event.key===key) keydownev(index); return
                
            });
        }
    }, {signal: controller.signal})

    addEventListener("keyup",(event)=>{
        if (!event.repeat){
            keyboardArray.forEach((key, index) => {
                if (event.key===key) keyupev(index); return
                
            });
        }
    }, {signal: controller.signal})

    keys.forEach(function(elem) {
        elem.addEventListener("mouseleave", e => leave(e), {signal: controller.signal})
    });

    keys.forEach(function(elem) {
        elem.addEventListener("mouseover", e => over(e), {signal: controller.signal})
    });
        
    keys.forEach(function(elem) {
        elem.addEventListener('mousedown',  e => down(e), {signal: controller.signal})
    });
        
    keys.forEach(function(elem) {
        elem.addEventListener('mouseup',  e => up(e), {signal: controller.signal})
    });

    document.addEventListener('mouseover', e => {
        if ((push==1 && !e.target.closest("#whiteKey")) 
                     && !e.target.closest("#blackKey")){
    
            pushkey = pushkey.map( (_,i)=> 0 );
            push=0;
        }
    });
}


const keydownev = function(i){

    if (keySound[i]==1) return;

    if (pushkey[i]==1) endOscillator(i); ;
    keys[i].classList.add("hov");
    startOscillator(i); 
    keySound[i] = 1;
    // console.log('down', keySound)
}

const keyupev = function (i){

    keys[i].classList.remove("hov");

    if (pushkey[i]==0) {
        endOscillator(i); 
    }
    else keys[i].classList.add("hov");

    keySound[i] = 0;
    // console.log('up', keySound)

}

const over = function(event) {

    const i = parseInt(event.currentTarget.dataset.num)

    event.currentTarget.classList.add("hov");

    if ((push==1) && ((pushkey[i] || keySound[i])==0)) {     

        event.currentTarget.classList.add("press");
        startOscillator(i);

        pushkey[i]=1;
    }
    else if (push==1 && keySound[i]==1) pushkey[i]=1;
}

const leave = function(event) {

    const i = parseInt(event.currentTarget.dataset.num)

    event.currentTarget.classList.remove("press");
    if (keySound[i]==0) event.currentTarget.classList.remove("hov");

    if ((push==1) && (keySound[i]==0)){
        endOscillator(i);
        
    }

    pushkey[i]=0;
}

const down = function(event) {
    
    push=1;

    const i = parseInt(event.currentTarget.dataset.num)


    event.currentTarget.classList.add("press");

    // if (keySound[i]==1) endSound(i);

    if (keySound[i]==0) {     

        event.currentTarget.classList.add("press");
        startOscillator(i);
    }
    pushkey[i]=1;
}

const up = function(event) {

    const i = parseInt(event.currentTarget.dataset.num);

    push=0;

    event.currentTarget.classList.remove("press");

    if (pushkey[i] ^ keySound[i]) {
        endOscillator(i); 
    }

    pushkey[i]=0;

}



const disableScroll = function(event) {
    if (event.cancelable) event.preventDefault();
}


const resetPianoEvents = function(){

    pushkey.forEach((value,i) => {
        keys[i].classList.remove("hov");
        if (value==1) {
            keys[i].classList.remove("press");
                
            if ((push==1) && (keySound[i]==0)){
                endOscillator(i);   
            }     
            pushkey[i]=0;
            push=0
        }
    }) 
        
    keySound.forEach((value,i) => {
        if (value==1) keyupev(i)
    }) 
        
    controller.abort()
}

initializePianoEvent()