
class WavetableProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "Release",
        defaultValue: false,
      },
    ];
  }

  constructor(options){
    super();

    WavetableProcessor.wave = options.processorOptions.wave;

    WavetableProcessor.index = options.processorOptions.index;

    this.util = options.processorOptions.util;
    
    this.frequency = options.processorOptions.frequency;
    this.offset = 0

    this.gain = 0
    this.Attack = true
    this.Release = false

    this.previndex = WavetableProcessor.index;
    this.prevwave = [...Array(2048)].map((_,i)=>0);

  }

  process(inputs, outputs, parameters) {

    if (this.util) return false;

    let wave = this.getWaveFromIndex(WavetableProcessor.index);
 
    let MonoOutput = outputs[0][0];

    const length = MonoOutput.length*this.frequency/48000;

    this.Release = parameters["Release"][0];


    if (this.previndex==WavetableProcessor.index){

      for (let i=0; i < MonoOutput.length; i++) {

        if (this.SimpleEnvelope()==false) return false;

        const index = (2048*(this.offset + length*(i/MonoOutput.length))) % 2048

        MonoOutput[i] = this.getAudioFromWave(index, wave)
      }
    }

    //index of wavetable has changed
    else {

      let prevWaveOutput = [...Array(MonoOutput.length)].map((_,i)=>0);

      for (let i=0; i < MonoOutput.length; i++) {

        if (this.SimpleEnvelope()==false) return false;

        const index = (2048*(this.offset + length*(i/MonoOutput.length))) % 2048

        MonoOutput[i] = this.getAudioFromWave(index, wave)

        prevWaveOutput[i] = this.getAudioFromWave(index, this.prevwave)
      }

      MonoOutput = this.smoothing(prevWaveOutput, MonoOutput);
      
    }

    this.offset = (this.offset + length) % 1

    this.previndex = WavetableProcessor.index;

    this.prevwave = wave;

    return true;
  }

  getWaveFromIndex(index){
    const f = Math.floor(index);

    if (f==index) {
        return WavetableProcessor.wave[index];
    }
    else { 
        return WavetableProcessor.wave[f].map( (value, i) =>
            value + (WavetableProcessor.wave[f+1][i] - value)*(index-f) 
        );
    }
  }

  SimpleEnvelope(){
    if (this.Attack) {
      this.gain+=1/(13*WavetableProcessor.Attack);

      if (this.gain>=1/13) this.Attack = false
    }

    else if (this.Release){
      this.Attack=false;
      this.gain-=1/(13*WavetableProcessor.Release);

      if (this.gain<=0) return false

    }

    return true
  }

  getAudioFromWave(index, wave){

    const f = Math.floor(index);

    let value;

    if (index==f) value = wave[index];
      
    // else value = wave[f] + (index-f)*(wave[(f+1)%2048]-wave[f]);
    else value = this.cubic(wave[(f+2047)%2048],wave[f],wave[(f+1)%2048],wave[(f+2)%2048],index%1);

    return value * this.gain;
  }

  smoothing(prev, output ){

    for(let k=0; k<output.length;k++){

      const p = k/output.length

      output[k] = (1-p)*prev[k] + p*output[k];
    } 
    let brend = output;

    for(let k=1; k<output.length-1;k++){
      brend[k] = (output[k-1]+output[k]+output[k+1])/3
    }

    return brend;

  }

  cubic(y0, y1, y2, y3, t){
    
    const t2 = t * t
    const c0 = y1 - y2
    const c1 = (y2 - y0) * 0.5
    const c2 = c0 + c1
    const c3 = c0 + c2 + (y3 - y1) * 0.5

    return c3 * t * t2 - (c2 + c3) * t2 + c1 * t + y1
  }
  
}

console.log(sampleRate);

registerProcessor("wavetable-processor", WavetableProcessor);

WavetableProcessor.wave = [[...Array(2048)].map((_,i)=>Math.sin(2*Math.PI*(i/2048)))];
WavetableProcessor.index = 0

WavetableProcessor.Attack = 100;
WavetableProcessor.Release = 1000;