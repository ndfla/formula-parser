
let wavetable = [[...Array(2048)].map((_,i)=>Math.sin(2*Math.PI*(i/2048)))];
let wavetableindex = 0

const attack = 100
const release = 1000
const maxgain = 1/13

const samplesize = 2048

const cubicInterpolation = function(y0, y1, y2, y3, t){

  const t2 = t * t
  const c0 = y1 - y2
  const c1 = (y2 - y0) * 0.5
  const c2 = c0 + c1
  const c3 = c0 + c2 + (y3 - y1) * 0.5
  return c3 * t * t2 - (c2 + c3) * t2 + c1 * t + y1

}

const getAudioFromWave = function(index, wave){

  const f = Math.floor(index);

  let value;

  if (index==f) value = wave[index];
    
  else value = cubicInterpolation( wave[(f+samplesize-1)%samplesize], 
                      wave[f],wave[(f+1)%samplesize],
                      wave[(f+2)%samplesize],
                      index%1);
  return value;
}


class Envelope{
  constructor(){
    this.attackFlag = true
    this.releaseFlag = false
    this.gain = 0
  }

  SimpleEnvelope(){
    if (this.attackFlag) {
      this.gain+=maxgain/attack;

      if (this.gain>=maxgain) this.attackFlag = false
    }

    else if (this.releaseFlag){
      this.attackFlag=false;
      this.gain-=maxgain/release;

      if (this.gain<=0) return false
    }
    return true
  }
}

class IndexSlider{
  constructor(){
    this.index = wavetableindex

    this.wave = this.getWaveFromIndex()
    this.prevwave = this.wave
  }

  getWaveFromIndex(){
    
    const index = wavetableindex

    const f = Math.floor(index)

    if (f==index) {
      return wavetable[index];
    }
    else { 
      return wavetable[f].map( (value, i) =>
            value + (wavetable[f+1][i] - value)*(index-f) 
        );
    }
  }

  smoothing(prev, output){

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
 
  isValueChanged(){
    if (this.index==wavetableindex) return 1

    this.prevwave = this.wave
    this.wave = this.getWaveFromIndex()

    this.index = wavetableindex

    return 0
    
  }
}

class ConstantWaveProcessor extends AudioWorkletProcessor {
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
    this.offset = 0

    wavetable = options.processorOptions.wave;

    wavetableindex = options.processorOptions.index
 
    this.frequency = options.processorOptions.frequency

    this.util = options.processorOptions.util

    this.env = new Envelope()

    this.wave = wavetable[0];
  }

  process(inputs, outputs, parameters) { 

    if (this.util) return false

    let MonoOutput = outputs[0][0]

    const length = MonoOutput.length*this.frequency/48000

    if (parameters["Release"][0]) this.env.releaseFlag = true

    for (let i=0; i < MonoOutput.length; i++) {

      if (this.env.SimpleEnvelope()==0) return false

      const index = (samplesize*(this.offset + length*(i/MonoOutput.length))) % samplesize

      MonoOutput[i] = getAudioFromWave(index, this.wave)*this.env.gain
    }

    this.offset = (this.offset + length) % 1

    return true
  }
}

class WavetableProcessor extends ConstantWaveProcessor{

  constructor(options){
    super(options)
    this.slider = new IndexSlider()

    this.wave = this.slider.wave
  }
  process(inputs, outputs, parameters) { 

    if (this.slider.isValueChanged()){
      this.wave = this.slider.wave
      return super.process(inputs, outputs, parameters)
    }
    else{
      if (this.util) return false

      let MonoOutput = outputs[0][0]

      let prevMonoOutput = [...Array(MonoOutput.length)]

      const length = MonoOutput.length*this.frequency/48000

      if (parameters["Release"][0]) this.env.releaseFlag = true

      for (let i=0; i < MonoOutput.length; i++) {

        if (this.env.SimpleEnvelope()==0) return false

        const index = (samplesize*(this.offset + length*(i/MonoOutput.length))) % samplesize

        MonoOutput[i] = getAudioFromWave(index, this.slider.wave)*this.env.gain
        prevMonoOutput[i] = getAudioFromWave(index, this.slider.prevwave)*this.env.gain
      }

      this.offset = (this.offset + length) % 1

      MonoOutput = this.slider.smoothing(prevMonoOutput,MonoOutput)

      return true
    }
  }
}

registerProcessor("wavetable-processor", WavetableProcessor);
