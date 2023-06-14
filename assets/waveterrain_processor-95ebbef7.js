var b=Object.defineProperty;var g=(u,h,s)=>h in u?b(u,h,{enumerable:!0,configurable:!0,writable:!0,value:s}):u[h]=s;var r=(u,h,s)=>(g(u,typeof h!="symbol"?h+"":h,s),s);(function(){"use strict";const d=class{evaluate(e,t){const{centerX:i,centerZ:a,radiusX:n,radiusZ:o,freqX:c,freqZ:f,phaseShift:V}={...d.defaultParams,...t};for(;e<0;)e+=1;for(;e>=1;)e-=1;const P=i+n*Math.sin(d.twoPi*c*e+V),w=a+o*Math.sin(d.twoPi*f*e);return{x:P,z:w}}};let u=d;r(u,"twoPi",2*Math.PI),r(u,"defaultParams",{centerX:0,centerZ:0,radiusX:1,radiusZ:1,freqX:1,freqZ:1,phaseShift:Math.PI/2});class h{evaluate(e,t){for(;e<-1;)e+=2;for(;e>=1;)e-=2;for(;t<-1;)t+=2;for(;t>=1;)t-=2;return(e-t)*(e-1)*(e+1)*(t-1)*(t+1)}}class s{constructor(e,t=.05,i=.001){r(this,"internal");r(this,"target");r(this,"momentum");r(this,"eps");this.internal=e,this.target=e,this.momentum=t,this.eps=i}get value(){return this.internal}set value(e){this.target=e}tick(){return Math.abs(this.internal-this.target)<this.eps?this.internal=this.target:this.internal=this.momentum*this.target+(1-this.momentum)*this.internal,this.internal}setAndTick(e){return this.target=e,this.tick()}}const m=(p,e,t,i,a)=>i+(a-i)*(p-e)/(t-e);class l extends AudioWorkletProcessor{constructor(){super();r(this,"terrainProvider");r(this,"orbitProvider");r(this,"orbitParams",{});r(this,"phase",0);r(this,"centerX",new s(l.parameterDescriptors[0].defaultValue));r(this,"centerZ",new s(l.parameterDescriptors[1].defaultValue));r(this,"radiusX",new s(l.parameterDescriptors[2].defaultValue));r(this,"radiusZ",new s(l.parameterDescriptors[3].defaultValue));r(this,"freqX",new s(l.parameterDescriptors[4].defaultValue));r(this,"freqZ",new s(l.parameterDescriptors[5].defaultValue));r(this,"phaseShift",new s(l.parameterDescriptors[6].defaultValue));this.terrainProvider=new h,this.orbitProvider=new u,this.port.onmessage=this.onMessage.bind(this)}static get parameterDescriptors(){return[{name:"centerX",defaultValue:0,minValue:-1,maxValue:1},{name:"centerZ",defaultValue:0,minValue:-1,maxValue:1},{name:"radiusX",defaultValue:1,minValue:0,maxValue:2},{name:"radiusZ",defaultValue:1,minValue:0,maxValue:2},{name:"freqX",defaultValue:1,minValue:0,maxValue:8},{name:"freqZ",defaultValue:1,minValue:0,maxValue:8},{name:"phaseShift",defaultValue:Math.PI/2,minValue:0,maxValue:2*Math.PI}]}process(t,i,a){const n=i[0],o=n.length,c=o>0?n[0].length:0;this.orbitParams.centerX=this.centerX.setAndTick(a.centerX[0]),this.orbitParams.centerZ=this.centerZ.setAndTick(a.centerZ[0]),this.orbitParams.radiusX=this.radiusX.setAndTick(a.radiusX[0]),this.orbitParams.radiusZ=this.radiusZ.setAndTick(a.radiusZ[0]),this.orbitParams.freqX=this.freqX.setAndTick(a.freqX[0]),this.orbitParams.freqZ=this.freqZ.setAndTick(a.freqZ[0]),this.orbitParams.phaseShift=this.phaseShift.setAndTick(a.phaseShift[0]);for(let f=0;f<c;f++){const{x:V,z:P}=this.orbitProvider.evaluate(this.phase,this.orbitParams),w=this.terrainProvider.evaluate(V,P);for(let X=0;X<o;X++)n[X][f]=w;const Z=120;this.phase+=Z/sampleRate,this.phase%=1}return!0}onMessage(t){t.data.type==="getTerrain"?this.getTerrain(t.data.segments):t.data.type==="getOrbit"&&this.getOrbit(t.data.segments)}getTerrain(t){const i=new Float32Array(t*t);for(let a=0;a<t;a++)for(let n=0;n<t;n++){const o=m(a,0,t,-1,1),c=m(n,0,t,-1,1);i[a*t+n]=this.terrainProvider.evaluate(o,c)}this.port.postMessage({type:"terrain",terrain:i})}getOrbit(t){const i=new Float32Array(t*2);for(let a=0;a<t;a++){const n=m(a,0,t,0,1),{x:o,z:c}=this.orbitProvider.evaluate(n,this.orbitParams);i[a*2+0]=o,i[a*2+1]=c}this.port.postMessage({type:"orbit",orbit:i})}}registerProcessor("waveterrain_processor",l)})();
