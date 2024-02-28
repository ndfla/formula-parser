const canvas = document.getElementById("waveform");
const canvasCtx = canvas.getContext("2d");

const resize = function() {
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
   
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {

      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
}

const drawCanvas = function(waveData) {

    const samplesize = 2048


    resize(canvas)

    canvasCtx.fillStyle = 'rgba(179,181,238,0.92)';

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;

    canvasCtx.beginPath();

    canvasCtx.moveTo(0, (-waveData[0]+1) * (canvas.height/2)); 

    for (let i = 4; i < samplesize; i+=4) {
        const sample = -waveData[i]; 

        const x = (i / samplesize) * canvas.width; 
        const y = (sample + 1) * (canvas.height / 2); 
        canvasCtx.lineTo(x, y); 
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2)
    canvasCtx.lineTo(0, canvas.height/2)


    canvasCtx.stroke();
    canvasCtx.fill();

    canvasCtx.closePath()

}

export { drawCanvas };