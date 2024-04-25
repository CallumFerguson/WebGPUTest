var dr=Object.defineProperty;var pr=(t,e,r)=>e in t?dr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var I=(t,e,r)=>(pr(t,typeof e!="symbol"?e+"":e,r),r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=r(s);fetch(s.href,i)}})();const Q=`struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
    position: vec3f,
    viewDirectionProjectionInverse: mat4x4f,
}
`,mr=`struct TimeData {\r
    deltaTime: f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> timeData: TimeData;\r
\r
@group(1) @binding(0) var<storage, read_write> positions: array<vec3f>;\r
@group(1) @binding(1) var<storage, read_write> velocities: array<vec3f>;\r
\r
@compute @workgroup_size(128) fn computeSomething(@builtin(global_invocation_id) id: vec3u) {\r
    let i = id.x;\r
\r
    velocities[i] += getGravityForce(vec3(0.05, -0.05, -0.5), id) * timeData.deltaTime;\r
    velocities[i] += getGravityForce(vec3(-0.02, -0.04, 0), id) * timeData.deltaTime;\r
    velocities[i] += getGravityForce(vec3(0.03, 0.01, 0.5), id) * timeData.deltaTime;\r
\r
    positions[i] += velocities[i] * timeData.deltaTime;\r
}\r
\r
fn getGravityForce(position: vec3f, id: vec3u) -> vec3f {\r
    let i = id.x;\r
\r
    var gravityForceDirection = position - positions[i];\r
    var gravityForceDirectionNormalized = normalize(gravityForceDirection);\r
    var distance = length(gravityForceDirection);\r
\r
    var force = gravityForceDirectionNormalized / (distance * distance);\r
\r
    return force;\r
}`;var Ae=1e-6,R=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)});function _r(){var t=new R(9);return R!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function z(){var t=new R(16);return R!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function Yt(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function gr(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Pe(t,e){var r=e[0],n=e[1],s=e[2],i=e[3],o=e[4],u=e[5],h=e[6],f=e[7],d=e[8],m=e[9],_=e[10],g=e[11],x=e[12],v=e[13],w=e[14],k=e[15],T=r*u-n*o,y=r*h-s*o,b=r*f-i*o,S=n*h-s*u,E=n*f-i*u,B=s*f-i*h,F=d*v-m*x,U=d*w-_*x,$=d*k-g*x,O=m*w-_*v,D=m*k-g*v,j=_*k-g*w,P=T*j-y*D+b*O+S*$-E*U+B*F;return P?(P=1/P,t[0]=(u*j-h*D+f*O)*P,t[1]=(s*D-n*j-i*O)*P,t[2]=(v*B-w*E+k*S)*P,t[3]=(_*E-m*B-g*S)*P,t[4]=(h*$-o*j-f*U)*P,t[5]=(r*j-s*$+i*U)*P,t[6]=(w*b-x*B-k*y)*P,t[7]=(d*B-_*b+g*y)*P,t[8]=(o*D-u*$+f*F)*P,t[9]=(n*$-r*D-i*F)*P,t[10]=(x*E-v*b+k*T)*P,t[11]=(m*b-d*E-g*T)*P,t[12]=(u*U-o*O-h*F)*P,t[13]=(r*O-n*U+s*F)*P,t[14]=(v*y-x*S-w*T)*P,t[15]=(d*S-m*y+_*T)*P,t):null}function yr(t,e,r){var n=e[0],s=e[1],i=e[2],o=e[3],u=e[4],h=e[5],f=e[6],d=e[7],m=e[8],_=e[9],g=e[10],x=e[11],v=e[12],w=e[13],k=e[14],T=e[15],y=r[0],b=r[1],S=r[2],E=r[3];return t[0]=y*n+b*u+S*m+E*v,t[1]=y*s+b*h+S*_+E*w,t[2]=y*i+b*f+S*g+E*k,t[3]=y*o+b*d+S*x+E*T,y=r[4],b=r[5],S=r[6],E=r[7],t[4]=y*n+b*u+S*m+E*v,t[5]=y*s+b*h+S*_+E*w,t[6]=y*i+b*f+S*g+E*k,t[7]=y*o+b*d+S*x+E*T,y=r[8],b=r[9],S=r[10],E=r[11],t[8]=y*n+b*u+S*m+E*v,t[9]=y*s+b*h+S*_+E*w,t[10]=y*i+b*f+S*g+E*k,t[11]=y*o+b*d+S*x+E*T,y=r[12],b=r[13],S=r[14],E=r[15],t[12]=y*n+b*u+S*m+E*v,t[13]=y*s+b*h+S*_+E*w,t[14]=y*i+b*f+S*g+E*k,t[15]=y*o+b*d+S*x+E*T,t}function vr(t,e,r){var n=Math.sin(r),s=Math.cos(r),i=e[4],o=e[5],u=e[6],h=e[7],f=e[8],d=e[9],m=e[10],_=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=i*s+f*n,t[5]=o*s+d*n,t[6]=u*s+m*n,t[7]=h*s+_*n,t[8]=f*s-i*n,t[9]=d*s-o*n,t[10]=m*s-u*n,t[11]=_*s-h*n,t}function wr(t,e,r){var n=Math.sin(r),s=Math.cos(r),i=e[0],o=e[1],u=e[2],h=e[3],f=e[8],d=e[9],m=e[10],_=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=i*s-f*n,t[1]=o*s-d*n,t[2]=u*s-m*n,t[3]=h*s-_*n,t[8]=i*n+f*s,t[9]=o*n+d*s,t[10]=u*n+m*s,t[11]=h*n+_*s,t}function Wt(t,e,r){var n=Math.sin(r),s=Math.cos(r),i=e[0],o=e[1],u=e[2],h=e[3],f=e[4],d=e[5],m=e[6],_=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=i*s+f*n,t[1]=o*s+d*n,t[2]=u*s+m*n,t[3]=h*s+_*n,t[4]=f*s-i*n,t[5]=d*s-o*n,t[6]=m*s-u*n,t[7]=_*s-h*n,t}function qe(t,e,r){var n=e[0],s=e[1],i=e[2],o=e[3],u=n+n,h=s+s,f=i+i,d=n*u,m=n*h,_=n*f,g=s*h,x=s*f,v=i*f,w=o*u,k=o*h,T=o*f;return t[0]=1-(g+v),t[1]=m+T,t[2]=_-k,t[3]=0,t[4]=m-T,t[5]=1-(d+v),t[6]=x+w,t[7]=0,t[8]=_+k,t[9]=x-w,t[10]=1-(d+g),t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function Jt(t,e,r,n,s){var i=1/Math.tan(e/2),o;return t[0]=i/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,s!=null&&s!==1/0?(o=1/(n-s),t[10]=s*o,t[14]=s*n*o):(t[10]=-1,t[14]=-n),t}function ae(t,e,r,n){var s,i,o,u,h,f,d,m,_,g,x=e[0],v=e[1],w=e[2],k=n[0],T=n[1],y=n[2],b=r[0],S=r[1],E=r[2];return Math.abs(x-b)<Ae&&Math.abs(v-S)<Ae&&Math.abs(w-E)<Ae?gr(t):(d=x-b,m=v-S,_=w-E,g=1/Math.hypot(d,m,_),d*=g,m*=g,_*=g,s=T*_-y*m,i=y*d-k*_,o=k*m-T*d,g=Math.hypot(s,i,o),g?(g=1/g,s*=g,i*=g,o*=g):(s=0,i=0,o=0),u=m*o-_*i,h=_*s-d*o,f=d*i-m*s,g=Math.hypot(u,h,f),g?(g=1/g,u*=g,h*=g,f*=g):(u=0,h=0,f=0),t[0]=s,t[1]=u,t[2]=d,t[3]=0,t[4]=i,t[5]=h,t[6]=m,t[7]=0,t[8]=o,t[9]=f,t[10]=_,t[11]=0,t[12]=-(s*x+i*v+o*w),t[13]=-(u*x+h*v+f*w),t[14]=-(d*x+m*v+_*w),t[15]=1,t)}var _e=yr;function it(){var t=new R(3);return R!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function xr(t){var e=t[0],r=t[1],n=t[2];return Math.hypot(e,r,n)}function G(t,e,r){var n=new R(3);return n[0]=t,n[1]=e,n[2]=r,n}function br(t,e){var r=e[0],n=e[1],s=e[2],i=r*r+n*n+s*s;return i>0&&(i=1/Math.sqrt(i)),t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t}function kr(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function He(t,e,r){var n=e[0],s=e[1],i=e[2],o=r[0],u=r[1],h=r[2];return t[0]=s*h-i*u,t[1]=i*o-n*h,t[2]=n*u-s*o,t}var Tr=xr;(function(){var t=it();return function(e,r,n,s,i,o){var u,h;for(r||(r=3),n||(n=0),s?h=Math.min(s*r+n,e.length):h=e.length,u=n;u<h;u+=r)t[0]=e[u],t[1]=e[u+1],t[2]=e[u+2],i(t,t,o),e[u]=t[0],e[u+1]=t[1],e[u+2]=t[2];return e}})();function Zt(){var t=new R(4);return R!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function Sr(t,e){var r=e[0],n=e[1],s=e[2],i=e[3],o=r*r+n*n+s*s+i*i;return o>0&&(o=1/Math.sqrt(o)),t[0]=r*o,t[1]=n*o,t[2]=s*o,t[3]=i*o,t}function Er(t,e,r){var n=e[0],s=e[1],i=e[2],o=e[3];return t[0]=r[0]*n+r[4]*s+r[8]*i+r[12]*o,t[1]=r[1]*n+r[5]*s+r[9]*i+r[13]*o,t[2]=r[2]*n+r[6]*s+r[10]*i+r[14]*o,t[3]=r[3]*n+r[7]*s+r[11]*i+r[15]*o,t}(function(){var t=Zt();return function(e,r,n,s,i,o){var u,h;for(r||(r=4),n||(n=0),s?h=Math.min(s*r+n,e.length):h=e.length,u=n;u<h;u+=r)t[0]=e[u],t[1]=e[u+1],t[2]=e[u+2],t[3]=e[u+3],i(t,t,o),e[u]=t[0],e[u+1]=t[1],e[u+2]=t[2],e[u+3]=t[3];return e}})();function ge(){var t=new R(4);return R!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function Ar(t,e,r){r=r*.5;var n=Math.sin(r);return t[0]=n*e[0],t[1]=n*e[1],t[2]=n*e[2],t[3]=Math.cos(r),t}function Mr(t,e,r){r*=.5;var n=e[0],s=e[1],i=e[2],o=e[3],u=Math.sin(r),h=Math.cos(r);return t[0]=n*h-i*u,t[1]=s*h+o*u,t[2]=i*h+n*u,t[3]=o*h-s*u,t}function Xe(t,e,r,n){var s=e[0],i=e[1],o=e[2],u=e[3],h=r[0],f=r[1],d=r[2],m=r[3],_,g,x,v,w;return g=s*h+i*f+o*d+u*m,g<0&&(g=-g,h=-h,f=-f,d=-d,m=-m),1-g>Ae?(_=Math.acos(g),x=Math.sin(_),v=Math.sin((1-n)*_)/x,w=Math.sin(n*_)/x):(v=1-n,w=n),t[0]=v*s+w*h,t[1]=v*i+w*f,t[2]=v*o+w*d,t[3]=v*u+w*m,t}function Pr(t,e){var r=e[0]+e[4]+e[8],n;if(r>0)n=Math.sqrt(r+1),t[3]=.5*n,n=.5/n,t[0]=(e[5]-e[7])*n,t[1]=(e[6]-e[2])*n,t[2]=(e[1]-e[3])*n;else{var s=0;e[4]>e[0]&&(s=1),e[8]>e[s*3+s]&&(s=2);var i=(s+1)%3,o=(s+2)%3;n=Math.sqrt(e[s*3+s]-e[i*3+i]-e[o*3+o]+1),t[s]=.5*n,n=.5/n,t[3]=(e[i*3+o]-e[o*3+i])*n,t[i]=(e[i*3+s]+e[s*3+i])*n,t[o]=(e[o*3+s]+e[s*3+o])*n}return t}function Br(t,e,r,n){var s=.5*Math.PI/180;e*=s,r*=s,n*=s;var i=Math.sin(e),o=Math.cos(e),u=Math.sin(r),h=Math.cos(r),f=Math.sin(n),d=Math.cos(n);return t[0]=i*h*d-o*u*f,t[1]=o*u*d+i*h*f,t[2]=o*h*f-i*u*d,t[3]=o*h*d+i*u*f,t}var Qt=Sr;(function(){var t=it(),e=G(1,0,0),r=G(0,1,0);return function(n,s,i){var o=kr(s,i);return o<-.999999?(He(t,e,s),Tr(t)<1e-6&&He(t,r,s),br(t,t),Ar(n,t,Math.PI),n):o>.999999?(n[0]=0,n[1]=0,n[2]=0,n[3]=1,n):(He(t,s,i),n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=1+o,Qt(n,n))}})();(function(){var t=ge(),e=ge();return function(r,n,s,i,o,u){return Xe(t,n,o,u),Xe(e,s,i,u),Xe(r,t,e,2*u*(1-u)),r}})();(function(){var t=_r();return function(e,r,n,s){return t[0]=n[0],t[3]=n[1],t[6]=n[2],t[1]=s[0],t[4]=s[1],t[7]=s[2],t[2]=-r[0],t[5]=-r[1],t[8]=-r[2],Qt(e,Pr(e,t))}})();async function Ir(){const t=navigator.gpu;if(!t)throw console.log("browser does not support WebGPU"),alert("browser does not support WebGPU"),new Error("browser does not support WebGPU");const e=await(t==null?void 0:t.requestAdapter({powerPreference:"high-performance"}));if(!e)throw console.log("browser does not support WebGPU"),alert("browser does not support WebGPU"),new Error("browser does not support WebGPU");const r=[],n=e.features.has("timestamp-query");n&&r.push("timestamp-query");const s=await e.requestDevice({requiredFeatures:r});if(!s)throw console.log("browser does not support WebGPU"),alert("browser does not support WebGPU"),new Error("browser does not support WebGPU");return{gpu:t,device:s,optionalFeatures:{canTimestamp:n}}}function Z(t,e,r){const n=t.createBuffer({size:e.byteLength,usage:r,mappedAtCreation:!0}),s=n.getMappedRange();return e instanceof ArrayBuffer?new Uint8Array(s).set(new Uint8Array(e)):new e.constructor(s).set(e),n.unmap(),n}async function Gr(t){const e=await assimpjs();let r=[t];const n=await new Promise((g,x)=>{Promise.all(r.map(v=>fetch(v))).then(v=>Promise.all(v.map(w=>w.arrayBuffer()))).then(v=>{let w=new e.FileList;for(let S=0;S<r.length;S++)w.AddFile(r[S],new Uint8Array(v[S]));let k=e.ConvertFileList(w,"assjson");if(!k.IsSuccess()||k.FileCount()==0){console.log(k.GetErrorCode()),x(k.GetErrorCode());return}let T=k.GetFile(0),y=new TextDecoder().decode(T.GetContent()),b=JSON.parse(y);g(b)})});let s=n.meshes[0];const i=Float32Array.from(s.vertices),o=Float32Array.from(s.normals);let u;s.texturecoords.length>1&&(console.log("mesh has multiple sets of texturecoords"),console.log(s.texturecoords)),s.texturecoords.length>0&&(u=Float32Array.from(s.texturecoords[0]));const h=Uint32Array.from(s.faces.flat());let f=n.textures,d=[];if(f)for(let g=0;g<f.length;g++){const x=f[g];d.push(`data:image/${x.formathint};base64,${x.data}`)}let m;s.tangents&&(m=new Float32Array(s.tangents));let _;return s.bitangents&&(_=new Float32Array(s.bitangents)),{vertices:i,indices:h,normals:o,uvs:u,textureURIs:d,tangents:m,bitangents:_}}function Pt(t,e,r){return Math.min(Math.max(t,e),r)}function Nr(t){for(let e=t.length-1;e>0;e--){const r=Math.floor(Math.random()*(e+1));[t[e],t[r]]=[t[r],t[e]]}return t}const at=(t,e)=>((t+e-1)/e|0)*e;function Vr(t){return Object.keys(t)}function zr(t,e){return new Array(t).fill(0).map((r,n)=>e(n))}const Qe=t=>t&&typeof t.length=="number"&&t.buffer instanceof ArrayBuffer&&typeof t.byteLength=="number",M={i32:{numElements:1,align:4,size:4,type:"i32",View:Int32Array},u32:{numElements:1,align:4,size:4,type:"u32",View:Uint32Array},f32:{numElements:1,align:4,size:4,type:"f32",View:Float32Array},f16:{numElements:1,align:2,size:2,type:"u16",View:Uint16Array},vec2f:{numElements:2,align:8,size:8,type:"f32",View:Float32Array},vec2i:{numElements:2,align:8,size:8,type:"i32",View:Int32Array},vec2u:{numElements:2,align:8,size:8,type:"u32",View:Uint32Array},vec2h:{numElements:2,align:4,size:4,type:"u16",View:Uint16Array},vec3i:{numElements:3,align:16,size:12,type:"i32",View:Int32Array},vec3u:{numElements:3,align:16,size:12,type:"u32",View:Uint32Array},vec3f:{numElements:3,align:16,size:12,type:"f32",View:Float32Array},vec3h:{numElements:3,align:8,size:6,type:"u16",View:Uint16Array},vec4i:{numElements:4,align:16,size:16,type:"i32",View:Int32Array},vec4u:{numElements:4,align:16,size:16,type:"u32",View:Uint32Array},vec4f:{numElements:4,align:16,size:16,type:"f32",View:Float32Array},vec4h:{numElements:4,align:8,size:8,type:"u16",View:Uint16Array},mat2x2f:{numElements:4,align:8,size:16,type:"f32",View:Float32Array},mat2x2h:{numElements:4,align:4,size:8,type:"u16",View:Uint16Array},mat3x2f:{numElements:6,align:8,size:24,type:"f32",View:Float32Array},mat3x2h:{numElements:6,align:4,size:12,type:"u16",View:Uint16Array},mat4x2f:{numElements:8,align:8,size:32,type:"f32",View:Float32Array},mat4x2h:{numElements:8,align:4,size:16,type:"u16",View:Uint16Array},mat2x3f:{numElements:8,align:16,size:32,pad:[3,1],type:"f32",View:Float32Array},mat2x3h:{numElements:8,align:8,size:16,pad:[3,1],type:"u16",View:Uint16Array},mat3x3f:{numElements:12,align:16,size:48,pad:[3,1],type:"f32",View:Float32Array},mat3x3h:{numElements:12,align:8,size:24,pad:[3,1],type:"u16",View:Uint16Array},mat4x3f:{numElements:16,align:16,size:64,pad:[3,1],type:"f32",View:Float32Array},mat4x3h:{numElements:16,align:8,size:32,pad:[3,1],type:"u16",View:Uint16Array},mat2x4f:{numElements:8,align:16,size:32,type:"f32",View:Float32Array},mat2x4h:{numElements:8,align:8,size:16,type:"u16",View:Uint16Array},mat3x4f:{numElements:12,align:16,size:48,pad:[3,1],type:"f32",View:Float32Array},mat3x4h:{numElements:12,align:8,size:24,pad:[3,1],type:"u16",View:Uint16Array},mat4x4f:{numElements:16,align:16,size:64,type:"f32",View:Float32Array},mat4x4h:{numElements:16,align:8,size:32,type:"u16",View:Uint16Array},bool:{numElements:0,align:1,size:0,type:"bool",View:Uint32Array}},le={...M,"atomic<i32>":M.i32,"atomic<u32>":M.u32,"vec2<i32>":M.vec2i,"vec2<u32>":M.vec2u,"vec2<f32>":M.vec2f,"vec2<f16>":M.vec2h,"vec3<i32>":M.vec3i,"vec3<u32>":M.vec3u,"vec3<f32>":M.vec3f,"vec3<f16>":M.vec3h,"vec4<i32>":M.vec4i,"vec4<u32>":M.vec4u,"vec4<f32>":M.vec4f,"vec4<f16>":M.vec4h,"mat2x2<f32>":M.mat2x2f,"mat2x2<f16>":M.mat2x2h,"mat3x2<f32>":M.mat3x2f,"mat3x2<f16>":M.mat3x2h,"mat4x2<f32>":M.mat4x2f,"mat4x2<f16>":M.mat4x2h,"mat2x3<f32>":M.mat2x3f,"mat2x3<f16>":M.mat2x3h,"mat3x3<f32>":M.mat3x3f,"mat3x3<f16>":M.mat3x3h,"mat4x3<f32>":M.mat4x3f,"mat4x3<f16>":M.mat4x3h,"mat2x4<f32>":M.mat2x4f,"mat2x4<f16>":M.mat2x4h,"mat3x4<f32>":M.mat3x4f,"mat3x4<f16>":M.mat3x4h,"mat4x4<f32>":M.mat4x4f,"mat4x4<f16>":M.mat4x4h},Lr=Vr(le);function Fr(t=[],e){const r=new Set;for(const n of Lr){const s=le[n];r.has(s)||(r.add(s),s.flatten=t.includes(n)?e:!e)}}Fr();function Ur(t){const e=t;if(e.elementType)return e.size;{const n=t,s=e.numElements||1;if(n.fields)return t.size*s;{const i=t,{align:o}=le[i.type];return s>1?at(t.size,o)*s:t.size}}}function Bt(t,e,r,n){const{size:s,type:i}=t;try{const{View:o,align:u}=le[i],h=n!==void 0,f=h?at(s,u):s,d=f/o.BYTES_PER_ELEMENT,m=h?n===0?(e.byteLength-r)/f:n:1;return new o(e,r,d*m)}catch{throw new Error(`unknown type: ${i}`)}}function Cr(t){return!t.fields&&!t.elementType}function Dr(t,e,r){const n=r||0,s=e||new ArrayBuffer(Ur(t)),i=(o,u)=>{const h=o,f=h.elementType;if(f){if(Cr(f)&&le[f.type].flatten)return Bt(f,s,u,h.numElements);{const{size:d}=Kt(o),m=h.numElements===0?(s.byteLength-u)/d:h.numElements;return zr(m,_=>i(f,u+d*_))}}else{if(typeof o=="string")throw Error("unreachable");{const d=o.fields;if(d){const m={};for(const[_,{type:g,offset:x}]of Object.entries(d))m[_]=i(g,u+x);return m}else return Bt(o,s,u)}}};return{views:i(t,n),arrayBuffer:s}}function Ke(t,e){if(t!==void 0)if(Qe(e)){const r=e;if(r.length===1&&typeof t=="number")r[0]=t;else if(Array.isArray(t[0])||Qe(t[0])){const n=t[0].length,s=n===3?4:n;for(let i=0;i<t.length;++i){const o=i*s;r.set(t[i],o)}}else r.set(t)}else if(Array.isArray(e)){const r=e;t.forEach((n,s)=>{Ke(n,r[s])})}else{const r=e;for(const[n,s]of Object.entries(t)){const i=r[n];i&&Ke(s,i)}}}function Be(t,e,r=0){const n=t,s=n.group===void 0?t:n.typeDefinition,i=Dr(s,e,r);return{...i,set(o){Ke(o,i.views)}}}function et(t){const r=t.elementType;if(r)return et(r);const s=t.fields;if(s)return Object.values(s).reduce((u,{type:h})=>Math.max(u,et(h)),0);const{type:i}=t,{align:o}=le[i];return o}function Kt(t){const r=t.elementType;if(r){const i=r.size,o=et(r);return{unalignedSize:i,align:o,size:at(i,o)}}const s=t.fields;if(s){const i=Object.values(s).pop();if(i.type.size===0)return Kt(i.type)}return{size:0,unalignedSize:0,align:1}}class Or{constructor(){this.constants=new Map,this.aliases=new Map,this.structs=new Map}}class W{constructor(){}get isAstNode(){return!0}get astNodeType(){return""}evaluate(e){throw new Error("Cannot evaluate node")}evaluateString(e){return this.evaluate(e).toString()}search(e){}searchBlock(e,r){if(e){r(Ie.instance);for(const n of e)n instanceof Array?this.searchBlock(n,r):n.search(r);r(Ge.instance)}}}class Ie extends W{}Ie.instance=new Ie;class Ge extends W{}Ge.instance=new Ge;class N extends W{constructor(){super()}}class tt extends N{constructor(e,r,n,s){super(),this.name=e,this.args=r,this.returnType=n,this.body=s}get astNodeType(){return"function"}search(e){this.searchBlock(this.body,e)}}class Rr extends N{constructor(e){super(),this.expression=e}get astNodeType(){return"staticAssert"}search(e){this.expression.search(e)}}class qr extends N{constructor(e,r){super(),this.condition=e,this.body=r}get astNodeType(){return"while"}search(e){this.condition.search(e),this.searchBlock(this.body,e)}}class Hr extends N{constructor(e){super(),this.body=e}get astNodeType(){return"continuing"}search(e){this.searchBlock(this.body,e)}}class Xr extends N{constructor(e,r,n,s){super(),this.init=e,this.condition=r,this.increment=n,this.body=s}get astNodeType(){return"for"}search(e){var r,n,s;(r=this.init)===null||r===void 0||r.search(e),(n=this.condition)===null||n===void 0||n.search(e),(s=this.increment)===null||s===void 0||s.search(e),this.searchBlock(this.body,e)}}class re extends N{constructor(e,r,n,s,i){super(),this.name=e,this.type=r,this.storage=n,this.access=s,this.value=i}get astNodeType(){return"var"}search(e){var r;e(this),(r=this.value)===null||r===void 0||r.search(e)}}class er extends N{constructor(e,r,n){super(),this.name=e,this.type=r,this.value=n}get astNodeType(){return"override"}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}}class rt extends N{constructor(e,r,n,s,i){super(),this.name=e,this.type=r,this.storage=n,this.access=s,this.value=i}get astNodeType(){return"let"}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}}class It extends N{constructor(e,r,n,s,i){super(),this.name=e,this.type=r,this.storage=n,this.access=s,this.value=i}get astNodeType(){return"const"}evaluate(e){return this.value.evaluate(e)}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}}var ce;(function(t){t.increment="++",t.decrement="--"})(ce||(ce={}));(function(t){function e(r){const n=r;if(n=="parse")throw new Error("Invalid value for IncrementOperator");return t[n]}t.parse=e})(ce||(ce={}));class $r extends N{constructor(e,r){super(),this.operator=e,this.variable=r}get astNodeType(){return"increment"}search(e){this.variable.search(e)}}var ve;(function(t){t.assign="=",t.addAssign="+=",t.subtractAssin="-=",t.multiplyAssign="*=",t.divideAssign="/=",t.moduloAssign="%=",t.andAssign="&=",t.orAssign="|=",t.xorAssign="^=",t.shiftLeftAssign="<<=",t.shiftRightAssign=">>="})(ve||(ve={}));(function(t){function e(r){const n=r;if(n=="parse")throw new Error("Invalid value for AssignOperator");return n}t.parse=e})(ve||(ve={}));class jr extends N{constructor(e,r,n){super(),this.operator=e,this.variable=r,this.value=n}get astNodeType(){return"assign"}search(e){this.value.search(e)}}class Yr extends N{constructor(e,r){super(),this.name=e,this.args=r}get astNodeType(){return"call"}}class Wr extends N{constructor(e,r){super(),this.body=e,this.continuing=r}get astNodeType(){return"loop"}}class Jr extends N{constructor(e,r){super(),this.condition=e,this.body=r}get astNodeType(){return"body"}}class Zr extends N{constructor(e,r,n,s){super(),this.condition=e,this.body=r,this.elseif=n,this.else=s}get astNodeType(){return"if"}search(e){this.condition.search(e),this.searchBlock(this.body,e),this.searchBlock(this.elseif,e),this.searchBlock(this.else,e)}}class Qr extends N{constructor(e){super(),this.value=e}get astNodeType(){return"return"}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}}class Kr extends N{constructor(e){super(),this.name=e}get astNodeType(){return"enable"}}class tr extends N{constructor(e,r){super(),this.name=e,this.type=r}get astNodeType(){return"alias"}}class en extends N{constructor(){super()}get astNodeType(){return"discard"}}class tn extends N{constructor(){super()}get astNodeType(){return"break"}}class rn extends N{constructor(){super()}get astNodeType(){return"continue"}}class ne extends N{constructor(e){super(),this.name=e}get astNodeType(){return"type"}get isStruct(){return!1}get isArray(){return!1}}class te extends ne{constructor(e,r){super(e),this.members=r}get astNodeType(){return"struct"}get isStruct(){return!0}getMemberIndex(e){for(let r=0;r<this.members.length;r++)if(this.members[r].name==e)return r;return-1}}class rr extends ne{constructor(e,r,n){super(e),this.format=r,this.access=n}get astNodeType(){return"template"}}class nn extends ne{constructor(e,r,n,s){super(e),this.storage=r,this.type=n,this.access=s}get astNodeType(){return"pointer"}}class nr extends ne{constructor(e,r,n,s){super(e),this.attributes=r,this.format=n,this.count=s}get astNodeType(){return"array"}get isArray(){return!0}}class pe extends ne{constructor(e,r,n){super(e),this.format=r,this.access=n}get astNodeType(){return"sampler"}}class X extends W{constructor(){super()}}class Gt extends X{constructor(e){super(),this.value=e}get astNodeType(){return"stringExpr"}toString(){return this.value}evaluateString(){return this.value}}class me extends X{constructor(e,r){super(),this.type=e,this.args=r}get astNodeType(){return"createExpr"}}class sr extends X{constructor(e,r){super(),this.name=e,this.args=r}get astNodeType(){return"callExpr"}evaluate(e){switch(this.name){case"abs":return Math.abs(this.args[0].evaluate(e));case"acos":return Math.acos(this.args[0].evaluate(e));case"acosh":return Math.acosh(this.args[0].evaluate(e));case"asin":return Math.asin(this.args[0].evaluate(e));case"asinh":return Math.asinh(this.args[0].evaluate(e));case"atan":return Math.atan(this.args[0].evaluate(e));case"atan2":return Math.atan2(this.args[0].evaluate(e),this.args[1].evaluate(e));case"atanh":return Math.atanh(this.args[0].evaluate(e));case"ceil":return Math.ceil(this.args[0].evaluate(e));case"clamp":return Math.min(Math.max(this.args[0].evaluate(e),this.args[1].evaluate(e)),this.args[2].evaluate(e));case"cos":return Math.cos(this.args[0].evaluate(e));case"degrees":return this.args[0].evaluate(e)*180/Math.PI;case"distance":return Math.sqrt(Math.pow(this.args[0].evaluate(e)-this.args[1].evaluate(e),2));case"dot":case"exp":return Math.exp(this.args[0].evaluate(e));case"exp2":return Math.pow(2,this.args[0].evaluate(e));case"floor":return Math.floor(this.args[0].evaluate(e));case"fma":return this.args[0].evaluate(e)*this.args[1].evaluate(e)+this.args[2].evaluate(e);case"fract":return this.args[0].evaluate(e)-Math.floor(this.args[0].evaluate(e));case"inverseSqrt":return 1/Math.sqrt(this.args[0].evaluate(e));case"log":return Math.log(this.args[0].evaluate(e));case"log2":return Math.log2(this.args[0].evaluate(e));case"max":return Math.max(this.args[0].evaluate(e),this.args[1].evaluate(e));case"min":return Math.min(this.args[0].evaluate(e),this.args[1].evaluate(e));case"mix":return this.args[0].evaluate(e)*(1-this.args[2].evaluate(e))+this.args[1].evaluate(e)*this.args[2].evaluate(e);case"modf":return this.args[0].evaluate(e)-Math.floor(this.args[0].evaluate(e));case"pow":return Math.pow(this.args[0].evaluate(e),this.args[1].evaluate(e));case"radians":return this.args[0].evaluate(e)*Math.PI/180;case"round":return Math.round(this.args[0].evaluate(e));case"sign":return Math.sign(this.args[0].evaluate(e));case"sin":return Math.sin(this.args[0].evaluate(e));case"sinh":return Math.sinh(this.args[0].evaluate(e));case"saturate":return Math.min(Math.max(this.args[0].evaluate(e),0),1);case"smoothstep":return this.args[0].evaluate(e)*this.args[0].evaluate(e)*(3-2*this.args[0].evaluate(e));case"sqrt":return Math.sqrt(this.args[0].evaluate(e));case"step":return this.args[0].evaluate(e)<this.args[1].evaluate(e)?0:1;case"tan":return Math.tan(this.args[0].evaluate(e));case"tanh":return Math.tanh(this.args[0].evaluate(e));case"trunc":return Math.trunc(this.args[0].evaluate(e));default:throw new Error("Non const function: "+this.name)}}search(e){for(const r of this.args)r.search(e);e(this)}}class ir extends X{constructor(e){super(),this.name=e}get astNodeType(){return"varExpr"}search(e){e(this)}}class Nt extends X{constructor(e,r){super(),this.name=e,this.initializer=r}get astNodeType(){return"constExpr"}evaluate(e){var r,n;if(this.initializer instanceof me){const s=(r=this.postfix)===null||r===void 0?void 0:r.evaluateString(e),i=(n=this.initializer.type)===null||n===void 0?void 0:n.name,o=e.structs.get(i),u=o==null?void 0:o.getMemberIndex(s);if(u!=-1)return this.initializer.args[u].evaluate(e);console.log(u)}return this.initializer.evaluate(e)}search(e){this.initializer.search(e)}}class Vt extends X{constructor(e){super(),this.value=e}get astNodeType(){return"literalExpr"}evaluate(){return this.value}}class sn extends X{constructor(e,r){super(),this.type=e,this.value=r}get astNodeType(){return"bitcastExpr"}search(e){this.value.search(e)}}class an extends X{constructor(e,r){super(),this.type=e,this.args=r}get astNodeType(){return"typecastExpr"}evaluate(e){return this.args[0].evaluate(e)}search(e){this.searchBlock(this.args,e)}}class zt extends X{constructor(e){super(),this.contents=e}get astNodeType(){return"groupExpr"}evaluate(e){return this.contents[0].evaluate(e)}search(e){this.searchBlock(this.contents,e)}}class ar extends X{constructor(){super()}}class on extends ar{constructor(e,r){super(),this.operator=e,this.right=r}get astNodeType(){return"unaryOp"}evaluate(e){switch(this.operator){case"+":return this.right.evaluate(e);case"-":return-this.right.evaluate(e);case"!":return this.right.evaluate(e)?0:1;case"~":return~this.right.evaluate(e);default:throw new Error("Unknown unary operator: "+this.operator)}}search(e){this.right.search(e)}}class H extends ar{constructor(e,r,n){super(),this.operator=e,this.left=r,this.right=n}get astNodeType(){return"binaryOp"}evaluate(e){switch(this.operator){case"+":return this.left.evaluate(e)+this.right.evaluate(e);case"-":return this.left.evaluate(e)-this.right.evaluate(e);case"*":return this.left.evaluate(e)*this.right.evaluate(e);case"/":return this.left.evaluate(e)/this.right.evaluate(e);case"%":return this.left.evaluate(e)%this.right.evaluate(e);case"==":return this.left.evaluate(e)==this.right.evaluate(e)?1:0;case"!=":return this.left.evaluate(e)!=this.right.evaluate(e)?1:0;case"<":return this.left.evaluate(e)<this.right.evaluate(e)?1:0;case">":return this.left.evaluate(e)>this.right.evaluate(e)?1:0;case"<=":return this.left.evaluate(e)<=this.right.evaluate(e)?1:0;case">=":return this.left.evaluate(e)>=this.right.evaluate(e)?1:0;case"&&":return this.left.evaluate(e)&&this.right.evaluate(e)?1:0;case"||":return this.left.evaluate(e)||this.right.evaluate(e)?1:0;default:throw new Error(`Unknown operator ${this.operator}`)}}search(e){this.left.search(e),this.right.search(e)}}class or extends W{constructor(){super()}}class un extends or{constructor(e,r){super(),this.selector=e,this.body=r}get astNodeType(){return"case"}search(e){this.searchBlock(this.body,e)}}class cn extends or{constructor(e){super(),this.body=e}get astNodeType(){return"default"}search(e){this.searchBlock(this.body,e)}}class ln extends W{constructor(e,r,n){super(),this.name=e,this.type=r,this.attributes=n}get astNodeType(){return"argument"}}class hn extends W{constructor(e,r){super(),this.condition=e,this.body=r}get astNodeType(){return"elseif"}search(e){this.condition.search(e),this.searchBlock(this.body,e)}}class fn extends W{constructor(e,r,n){super(),this.name=e,this.type=r,this.attributes=n}get astNodeType(){return"member"}}class Lt extends W{constructor(e,r){super(),this.name=e,this.value=r}get astNodeType(){return"attribute"}}var p,c;(function(t){t[t.token=0]="token",t[t.keyword=1]="keyword",t[t.reserved=2]="reserved"})(c||(c={}));class l{constructor(e,r,n){this.name=e,this.type=r,this.rule=n}toString(){return this.name}}class a{}p=a;a.none=new l("",c.reserved,"");a.eof=new l("EOF",c.token,"");a.reserved={asm:new l("asm",c.reserved,"asm"),bf16:new l("bf16",c.reserved,"bf16"),do:new l("do",c.reserved,"do"),enum:new l("enum",c.reserved,"enum"),f16:new l("f16",c.reserved,"f16"),f64:new l("f64",c.reserved,"f64"),handle:new l("handle",c.reserved,"handle"),i8:new l("i8",c.reserved,"i8"),i16:new l("i16",c.reserved,"i16"),i64:new l("i64",c.reserved,"i64"),mat:new l("mat",c.reserved,"mat"),premerge:new l("premerge",c.reserved,"premerge"),regardless:new l("regardless",c.reserved,"regardless"),typedef:new l("typedef",c.reserved,"typedef"),u8:new l("u8",c.reserved,"u8"),u16:new l("u16",c.reserved,"u16"),u64:new l("u64",c.reserved,"u64"),unless:new l("unless",c.reserved,"unless"),using:new l("using",c.reserved,"using"),vec:new l("vec",c.reserved,"vec"),void:new l("void",c.reserved,"void")};a.keywords={array:new l("array",c.keyword,"array"),atomic:new l("atomic",c.keyword,"atomic"),bool:new l("bool",c.keyword,"bool"),f32:new l("f32",c.keyword,"f32"),i32:new l("i32",c.keyword,"i32"),mat2x2:new l("mat2x2",c.keyword,"mat2x2"),mat2x3:new l("mat2x3",c.keyword,"mat2x3"),mat2x4:new l("mat2x4",c.keyword,"mat2x4"),mat3x2:new l("mat3x2",c.keyword,"mat3x2"),mat3x3:new l("mat3x3",c.keyword,"mat3x3"),mat3x4:new l("mat3x4",c.keyword,"mat3x4"),mat4x2:new l("mat4x2",c.keyword,"mat4x2"),mat4x3:new l("mat4x3",c.keyword,"mat4x3"),mat4x4:new l("mat4x4",c.keyword,"mat4x4"),ptr:new l("ptr",c.keyword,"ptr"),sampler:new l("sampler",c.keyword,"sampler"),sampler_comparison:new l("sampler_comparison",c.keyword,"sampler_comparison"),struct:new l("struct",c.keyword,"struct"),texture_1d:new l("texture_1d",c.keyword,"texture_1d"),texture_2d:new l("texture_2d",c.keyword,"texture_2d"),texture_2d_array:new l("texture_2d_array",c.keyword,"texture_2d_array"),texture_3d:new l("texture_3d",c.keyword,"texture_3d"),texture_cube:new l("texture_cube",c.keyword,"texture_cube"),texture_cube_array:new l("texture_cube_array",c.keyword,"texture_cube_array"),texture_multisampled_2d:new l("texture_multisampled_2d",c.keyword,"texture_multisampled_2d"),texture_storage_1d:new l("texture_storage_1d",c.keyword,"texture_storage_1d"),texture_storage_2d:new l("texture_storage_2d",c.keyword,"texture_storage_2d"),texture_storage_2d_array:new l("texture_storage_2d_array",c.keyword,"texture_storage_2d_array"),texture_storage_3d:new l("texture_storage_3d",c.keyword,"texture_storage_3d"),texture_depth_2d:new l("texture_depth_2d",c.keyword,"texture_depth_2d"),texture_depth_2d_array:new l("texture_depth_2d_array",c.keyword,"texture_depth_2d_array"),texture_depth_cube:new l("texture_depth_cube",c.keyword,"texture_depth_cube"),texture_depth_cube_array:new l("texture_depth_cube_array",c.keyword,"texture_depth_cube_array"),texture_depth_multisampled_2d:new l("texture_depth_multisampled_2d",c.keyword,"texture_depth_multisampled_2d"),texture_external:new l("texture_external",c.keyword,"texture_external"),u32:new l("u32",c.keyword,"u32"),vec2:new l("vec2",c.keyword,"vec2"),vec3:new l("vec3",c.keyword,"vec3"),vec4:new l("vec4",c.keyword,"vec4"),bitcast:new l("bitcast",c.keyword,"bitcast"),block:new l("block",c.keyword,"block"),break:new l("break",c.keyword,"break"),case:new l("case",c.keyword,"case"),continue:new l("continue",c.keyword,"continue"),continuing:new l("continuing",c.keyword,"continuing"),default:new l("default",c.keyword,"default"),discard:new l("discard",c.keyword,"discard"),else:new l("else",c.keyword,"else"),enable:new l("enable",c.keyword,"enable"),fallthrough:new l("fallthrough",c.keyword,"fallthrough"),false:new l("false",c.keyword,"false"),fn:new l("fn",c.keyword,"fn"),for:new l("for",c.keyword,"for"),function:new l("function",c.keyword,"function"),if:new l("if",c.keyword,"if"),let:new l("let",c.keyword,"let"),const:new l("const",c.keyword,"const"),loop:new l("loop",c.keyword,"loop"),while:new l("while",c.keyword,"while"),private:new l("private",c.keyword,"private"),read:new l("read",c.keyword,"read"),read_write:new l("read_write",c.keyword,"read_write"),return:new l("return",c.keyword,"return"),storage:new l("storage",c.keyword,"storage"),switch:new l("switch",c.keyword,"switch"),true:new l("true",c.keyword,"true"),alias:new l("alias",c.keyword,"alias"),type:new l("type",c.keyword,"type"),uniform:new l("uniform",c.keyword,"uniform"),var:new l("var",c.keyword,"var"),override:new l("override",c.keyword,"override"),workgroup:new l("workgroup",c.keyword,"workgroup"),write:new l("write",c.keyword,"write"),r8unorm:new l("r8unorm",c.keyword,"r8unorm"),r8snorm:new l("r8snorm",c.keyword,"r8snorm"),r8uint:new l("r8uint",c.keyword,"r8uint"),r8sint:new l("r8sint",c.keyword,"r8sint"),r16uint:new l("r16uint",c.keyword,"r16uint"),r16sint:new l("r16sint",c.keyword,"r16sint"),r16float:new l("r16float",c.keyword,"r16float"),rg8unorm:new l("rg8unorm",c.keyword,"rg8unorm"),rg8snorm:new l("rg8snorm",c.keyword,"rg8snorm"),rg8uint:new l("rg8uint",c.keyword,"rg8uint"),rg8sint:new l("rg8sint",c.keyword,"rg8sint"),r32uint:new l("r32uint",c.keyword,"r32uint"),r32sint:new l("r32sint",c.keyword,"r32sint"),r32float:new l("r32float",c.keyword,"r32float"),rg16uint:new l("rg16uint",c.keyword,"rg16uint"),rg16sint:new l("rg16sint",c.keyword,"rg16sint"),rg16float:new l("rg16float",c.keyword,"rg16float"),rgba8unorm:new l("rgba8unorm",c.keyword,"rgba8unorm"),rgba8unorm_srgb:new l("rgba8unorm_srgb",c.keyword,"rgba8unorm_srgb"),rgba8snorm:new l("rgba8snorm",c.keyword,"rgba8snorm"),rgba8uint:new l("rgba8uint",c.keyword,"rgba8uint"),rgba8sint:new l("rgba8sint",c.keyword,"rgba8sint"),bgra8unorm:new l("bgra8unorm",c.keyword,"bgra8unorm"),bgra8unorm_srgb:new l("bgra8unorm_srgb",c.keyword,"bgra8unorm_srgb"),rgb10a2unorm:new l("rgb10a2unorm",c.keyword,"rgb10a2unorm"),rg11b10float:new l("rg11b10float",c.keyword,"rg11b10float"),rg32uint:new l("rg32uint",c.keyword,"rg32uint"),rg32sint:new l("rg32sint",c.keyword,"rg32sint"),rg32float:new l("rg32float",c.keyword,"rg32float"),rgba16uint:new l("rgba16uint",c.keyword,"rgba16uint"),rgba16sint:new l("rgba16sint",c.keyword,"rgba16sint"),rgba16float:new l("rgba16float",c.keyword,"rgba16float"),rgba32uint:new l("rgba32uint",c.keyword,"rgba32uint"),rgba32sint:new l("rgba32sint",c.keyword,"rgba32sint"),rgba32float:new l("rgba32float",c.keyword,"rgba32float"),static_assert:new l("static_assert",c.keyword,"static_assert")};a.tokens={decimal_float_literal:new l("decimal_float_literal",c.token,/((-?[0-9]*\.[0-9]+|-?[0-9]+\.[0-9]*)((e|E)(\+|-)?[0-9]+)?f?)|(-?[0-9]+(e|E)(\+|-)?[0-9]+f?)|([0-9]+f)/),hex_float_literal:new l("hex_float_literal",c.token,/-?0x((([0-9a-fA-F]*\.[0-9a-fA-F]+|[0-9a-fA-F]+\.[0-9a-fA-F]*)((p|P)(\+|-)?[0-9]+f?)?)|([0-9a-fA-F]+(p|P)(\+|-)?[0-9]+f?))/),int_literal:new l("int_literal",c.token,/-?0x[0-9a-fA-F]+|0i?|-?[1-9][0-9]*i?/),uint_literal:new l("uint_literal",c.token,/0x[0-9a-fA-F]+u|0u|[1-9][0-9]*u/),ident:new l("ident",c.token,/[a-zA-Z][0-9a-zA-Z_]*/),and:new l("and",c.token,"&"),and_and:new l("and_and",c.token,"&&"),arrow:new l("arrow ",c.token,"->"),attr:new l("attr",c.token,"@"),attr_left:new l("attr_left",c.token,"[["),attr_right:new l("attr_right",c.token,"]]"),forward_slash:new l("forward_slash",c.token,"/"),bang:new l("bang",c.token,"!"),bracket_left:new l("bracket_left",c.token,"["),bracket_right:new l("bracket_right",c.token,"]"),brace_left:new l("brace_left",c.token,"{"),brace_right:new l("brace_right",c.token,"}"),colon:new l("colon",c.token,":"),comma:new l("comma",c.token,","),equal:new l("equal",c.token,"="),equal_equal:new l("equal_equal",c.token,"=="),not_equal:new l("not_equal",c.token,"!="),greater_than:new l("greater_than",c.token,">"),greater_than_equal:new l("greater_than_equal",c.token,">="),shift_right:new l("shift_right",c.token,">>"),less_than:new l("less_than",c.token,"<"),less_than_equal:new l("less_than_equal",c.token,"<="),shift_left:new l("shift_left",c.token,"<<"),modulo:new l("modulo",c.token,"%"),minus:new l("minus",c.token,"-"),minus_minus:new l("minus_minus",c.token,"--"),period:new l("period",c.token,"."),plus:new l("plus",c.token,"+"),plus_plus:new l("plus_plus",c.token,"++"),or:new l("or",c.token,"|"),or_or:new l("or_or",c.token,"||"),paren_left:new l("paren_left",c.token,"("),paren_right:new l("paren_right",c.token,")"),semicolon:new l("semicolon",c.token,";"),star:new l("star",c.token,"*"),tilde:new l("tilde",c.token,"~"),underscore:new l("underscore",c.token,"_"),xor:new l("xor",c.token,"^"),plus_equal:new l("plus_equal",c.token,"+="),minus_equal:new l("minus_equal",c.token,"-="),times_equal:new l("times_equal",c.token,"*="),division_equal:new l("division_equal",c.token,"/="),modulo_equal:new l("modulo_equal",c.token,"%="),and_equal:new l("and_equal",c.token,"&="),or_equal:new l("or_equal",c.token,"|="),xor_equal:new l("xor_equal",c.token,"^="),shift_right_equal:new l("shift_right_equal",c.token,">>="),shift_left_equal:new l("shift_left_equal",c.token,"<<=")};a.storage_class=[p.keywords.function,p.keywords.private,p.keywords.workgroup,p.keywords.uniform,p.keywords.storage];a.access_mode=[p.keywords.read,p.keywords.write,p.keywords.read_write];a.sampler_type=[p.keywords.sampler,p.keywords.sampler_comparison];a.sampled_texture_type=[p.keywords.texture_1d,p.keywords.texture_2d,p.keywords.texture_2d_array,p.keywords.texture_3d,p.keywords.texture_cube,p.keywords.texture_cube_array];a.multisampled_texture_type=[p.keywords.texture_multisampled_2d];a.storage_texture_type=[p.keywords.texture_storage_1d,p.keywords.texture_storage_2d,p.keywords.texture_storage_2d_array,p.keywords.texture_storage_3d];a.depth_texture_type=[p.keywords.texture_depth_2d,p.keywords.texture_depth_2d_array,p.keywords.texture_depth_cube,p.keywords.texture_depth_cube_array,p.keywords.texture_depth_multisampled_2d];a.texture_external_type=[p.keywords.texture_external];a.any_texture_type=[...p.sampled_texture_type,...p.multisampled_texture_type,...p.storage_texture_type,...p.depth_texture_type,...p.texture_external_type];a.texel_format=[p.keywords.r8unorm,p.keywords.r8snorm,p.keywords.r8uint,p.keywords.r8sint,p.keywords.r16uint,p.keywords.r16sint,p.keywords.r16float,p.keywords.rg8unorm,p.keywords.rg8snorm,p.keywords.rg8uint,p.keywords.rg8sint,p.keywords.r32uint,p.keywords.r32sint,p.keywords.r32float,p.keywords.rg16uint,p.keywords.rg16sint,p.keywords.rg16float,p.keywords.rgba8unorm,p.keywords.rgba8unorm_srgb,p.keywords.rgba8snorm,p.keywords.rgba8uint,p.keywords.rgba8sint,p.keywords.bgra8unorm,p.keywords.bgra8unorm_srgb,p.keywords.rgb10a2unorm,p.keywords.rg11b10float,p.keywords.rg32uint,p.keywords.rg32sint,p.keywords.rg32float,p.keywords.rgba16uint,p.keywords.rgba16sint,p.keywords.rgba16float,p.keywords.rgba32uint,p.keywords.rgba32sint,p.keywords.rgba32float];a.const_literal=[p.tokens.int_literal,p.tokens.uint_literal,p.tokens.decimal_float_literal,p.tokens.hex_float_literal,p.keywords.true,p.keywords.false];a.literal_or_ident=[p.tokens.ident,p.tokens.int_literal,p.tokens.uint_literal,p.tokens.decimal_float_literal,p.tokens.hex_float_literal];a.element_count_expression=[p.tokens.int_literal,p.tokens.uint_literal,p.tokens.ident];a.template_types=[p.keywords.vec2,p.keywords.vec3,p.keywords.vec4,p.keywords.mat2x2,p.keywords.mat2x3,p.keywords.mat2x4,p.keywords.mat3x2,p.keywords.mat3x3,p.keywords.mat3x4,p.keywords.mat4x2,p.keywords.mat4x3,p.keywords.mat4x4,p.keywords.atomic,p.keywords.bitcast,...p.any_texture_type];a.attribute_name=[p.tokens.ident,p.keywords.block];a.assignment_operators=[p.tokens.equal,p.tokens.plus_equal,p.tokens.minus_equal,p.tokens.times_equal,p.tokens.division_equal,p.tokens.modulo_equal,p.tokens.and_equal,p.tokens.or_equal,p.tokens.xor_equal,p.tokens.shift_right_equal,p.tokens.shift_left_equal];a.increment_operators=[p.tokens.plus_plus,p.tokens.minus_minus];class Ft{constructor(e,r,n){this.type=e,this.lexeme=r,this.line=n}toString(){return this.lexeme}isTemplateType(){return a.template_types.indexOf(this.type)!=-1}isArrayType(){return this.type==a.keywords.array}isArrayOrTemplateType(){return this.isArrayType()||this.isTemplateType()}}class dn{constructor(e){this._tokens=[],this._start=0,this._current=0,this._line=1,this._source=e??""}scanTokens(){for(;!this._isAtEnd();)if(this._start=this._current,!this.scanToken())throw`Invalid syntax at line ${this._line}`;return this._tokens.push(new Ft(a.eof,"",this._line)),this._tokens}scanToken(){let e=this._advance();if(e==`
`)return this._line++,!0;if(this._isWhitespace(e))return!0;if(e=="/"){if(this._peekAhead()=="/"){for(;e!=`
`;){if(this._isAtEnd())return!0;e=this._advance()}return this._line++,!0}else if(this._peekAhead()=="*"){this._advance();let n=1;for(;n>0;){if(this._isAtEnd())return!0;if(e=this._advance(),e==`
`)this._line++;else if(e=="*"){if(this._peekAhead()=="/"&&(this._advance(),n--,n==0))return!0}else e=="/"&&this._peekAhead()=="*"&&(this._advance(),n++)}return!0}}let r=a.none;for(;;){let n=this._findType(e);const s=this._peekAhead();if(e==">"&&(s==">"||s=="=")){let i=!1,o=this._tokens.length-1;for(let u=0;u<5&&o>=0;++u,--o)if(this._tokens[o].type===a.tokens.less_than){o>0&&this._tokens[o-1].isArrayOrTemplateType()&&(i=!0);break}if(i)return this._addToken(n),!0}if(n===a.none){let i=e,o=0;const u=2;for(let h=0;h<u;++h)if(i+=this._peekAhead(h),n=this._findType(i),n!==a.none){o=h;break}if(n===a.none)return r===a.none?!1:(this._current--,this._addToken(r),!0);e=i,this._current+=o+1}if(r=n,this._isAtEnd())break;e+=this._advance()}return r===a.none?!1:(this._addToken(r),!0)}_findType(e){for(const r in a.keywords){const n=a.keywords[r];if(this._match(e,n.rule))return n}for(const r in a.tokens){const n=a.tokens[r];if(this._match(e,n.rule))return n}return a.none}_match(e,r){if(typeof r=="string"){if(r==e)return!0}else{const n=r.exec(e);if(n&&n.index==0&&n[0]==e)return!0}return!1}_isAtEnd(){return this._current>=this._source.length}_isWhitespace(e){return e==" "||e=="	"||e=="\r"}_advance(e=0){let r=this._source[this._current];return e=e||0,e++,this._current+=e,r}_peekAhead(e=0){return e=e||0,this._current+e>=this._source.length?"\0":this._source[this._current+e]}_addToken(e){const r=this._source.substring(this._start,this._current);this._tokens.push(new Ft(e,r,this._line))}}class pn{constructor(){this._tokens=[],this._current=0,this._context=new Or}parse(e){this._initialize(e);let r=[];for(;!this._isAtEnd();){const n=this._global_decl_or_directive();if(!n)break;r.push(n)}return r}_initialize(e){if(e)if(typeof e=="string"){const r=new dn(e);this._tokens=r.scanTokens()}else this._tokens=e;else this._tokens=[];this._current=0}_error(e,r){return console.error(e,r),{token:e,message:r,toString:function(){return`${r}`}}}_isAtEnd(){return this._current>=this._tokens.length||this._peek().type==a.eof}_match(e){if(e instanceof l)return this._check(e)?(this._advance(),!0):!1;for(let r=0,n=e.length;r<n;++r){const s=e[r];if(this._check(s))return this._advance(),!0}return!1}_consume(e,r){if(this._check(e))return this._advance();throw this._error(this._peek(),r)}_check(e){if(this._isAtEnd())return!1;const r=this._peek();if(e instanceof Array){let n=r.type;return e.indexOf(n)!=-1}return r.type==e}_advance(){return this._isAtEnd()||this._current++,this._previous()}_peek(){return this._tokens[this._current]}_previous(){return this._tokens[this._current-1]}_global_decl_or_directive(){for(;this._match(a.tokens.semicolon)&&!this._isAtEnd(););if(this._match(a.keywords.alias)){const r=this._type_alias();return this._consume(a.tokens.semicolon,"Expected ';'"),r}if(this._match(a.keywords.enable)){const r=this._enable_directive();return this._consume(a.tokens.semicolon,"Expected ';'"),r}const e=this._attribute();if(this._check(a.keywords.var)){const r=this._global_variable_decl();return r!=null&&(r.attributes=e),this._consume(a.tokens.semicolon,"Expected ';'."),r}if(this._check(a.keywords.override)){const r=this._override_variable_decl();return r!=null&&(r.attributes=e),this._consume(a.tokens.semicolon,"Expected ';'."),r}if(this._check(a.keywords.let)){const r=this._global_let_decl();return r!=null&&(r.attributes=e),this._consume(a.tokens.semicolon,"Expected ';'."),r}if(this._check(a.keywords.const)){const r=this._global_const_decl();return r!=null&&(r.attributes=e),this._consume(a.tokens.semicolon,"Expected ';'."),r}if(this._check(a.keywords.struct)){const r=this._struct_decl();return r!=null&&(r.attributes=e),r}if(this._check(a.keywords.fn)){const r=this._function_decl();return r!=null&&(r.attributes=e),r}return null}_function_decl(){if(!this._match(a.keywords.fn))return null;const e=this._consume(a.tokens.ident,"Expected function name.").toString();this._consume(a.tokens.paren_left,"Expected '(' for function arguments.");const r=[];if(!this._check(a.tokens.paren_right))do{if(this._check(a.tokens.paren_right))break;const i=this._attribute(),o=this._consume(a.tokens.ident,"Expected argument name.").toString();this._consume(a.tokens.colon,"Expected ':' for argument type.");const u=this._attribute(),h=this._type_decl();h!=null&&(h.attributes=u,r.push(new ln(o,h,i)))}while(this._match(a.tokens.comma));this._consume(a.tokens.paren_right,"Expected ')' after function arguments.");let n=null;if(this._match(a.tokens.arrow)){const i=this._attribute();n=this._type_decl(),n!=null&&(n.attributes=i)}const s=this._compound_statement();return new tt(e,r,n,s)}_compound_statement(){const e=[];for(this._consume(a.tokens.brace_left,"Expected '{' for block.");!this._check(a.tokens.brace_right);){const r=this._statement();r!==null&&e.push(r)}return this._consume(a.tokens.brace_right,"Expected '}' for block."),e}_statement(){for(;this._match(a.tokens.semicolon)&&!this._isAtEnd(););if(this._check(a.keywords.if))return this._if_statement();if(this._check(a.keywords.switch))return this._switch_statement();if(this._check(a.keywords.loop))return this._loop_statement();if(this._check(a.keywords.for))return this._for_statement();if(this._check(a.keywords.while))return this._while_statement();if(this._check(a.keywords.continuing))return this._continuing_statement();if(this._check(a.keywords.static_assert))return this._static_assert_statement();if(this._check(a.tokens.brace_left))return this._compound_statement();let e=null;return this._check(a.keywords.return)?e=this._return_statement():this._check([a.keywords.var,a.keywords.let,a.keywords.const])?e=this._variable_statement():this._match(a.keywords.discard)?e=new en:this._match(a.keywords.break)?e=new tn:this._match(a.keywords.continue)?e=new rn:e=this._increment_decrement_statement()||this._func_call_statement()||this._assignment_statement(),e!=null&&this._consume(a.tokens.semicolon,"Expected ';' after statement."),e}_static_assert_statement(){if(!this._match(a.keywords.static_assert))return null;let e=this._optional_paren_expression();return new Rr(e)}_while_statement(){if(!this._match(a.keywords.while))return null;let e=this._optional_paren_expression();const r=this._compound_statement();return new qr(e,r)}_continuing_statement(){if(!this._match(a.keywords.continuing))return null;const e=this._compound_statement();return new Hr(e)}_for_statement(){if(!this._match(a.keywords.for))return null;this._consume(a.tokens.paren_left,"Expected '('.");const e=this._check(a.tokens.semicolon)?null:this._for_init();this._consume(a.tokens.semicolon,"Expected ';'.");const r=this._check(a.tokens.semicolon)?null:this._short_circuit_or_expression();this._consume(a.tokens.semicolon,"Expected ';'.");const n=this._check(a.tokens.paren_right)?null:this._for_increment();this._consume(a.tokens.paren_right,"Expected ')'.");const s=this._compound_statement();return new Xr(e,r,n,s)}_for_init(){return this._variable_statement()||this._func_call_statement()||this._assignment_statement()}_for_increment(){return this._func_call_statement()||this._increment_decrement_statement()||this._assignment_statement()}_variable_statement(){if(this._check(a.keywords.var)){const e=this._variable_decl();if(e===null)throw this._error(this._peek(),"Variable declaration expected.");let r=null;return this._match(a.tokens.equal)&&(r=this._short_circuit_or_expression()),new re(e.name,e.type,e.storage,e.access,r)}if(this._match(a.keywords.let)){const e=this._consume(a.tokens.ident,"Expected name for let.").toString();let r=null;if(this._match(a.tokens.colon)){const s=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=s)}this._consume(a.tokens.equal,"Expected '=' for let.");const n=this._short_circuit_or_expression();return new rt(e,r,null,null,n)}if(this._match(a.keywords.const)){const e=this._consume(a.tokens.ident,"Expected name for const.").toString();let r=null;if(this._match(a.tokens.colon)){const s=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=s)}this._consume(a.tokens.equal,"Expected '=' for const.");const n=this._short_circuit_or_expression();return new It(e,r,null,null,n)}return null}_increment_decrement_statement(){const e=this._current,r=this._unary_expression();if(r==null)return null;if(!this._check(a.increment_operators))return this._current=e,null;const n=this._consume(a.increment_operators,"Expected increment operator");return new $r(n.type===a.tokens.plus_plus?ce.increment:ce.decrement,r)}_assignment_statement(){let e=null;if(this._check(a.tokens.brace_right))return null;let r=this._match(a.tokens.underscore);if(r||(e=this._unary_expression()),!r&&e==null)return null;const n=this._consume(a.assignment_operators,"Expected assignment operator."),s=this._short_circuit_or_expression();return new jr(ve.parse(n.lexeme),e,s)}_func_call_statement(){if(!this._check(a.tokens.ident))return null;const e=this._current,r=this._consume(a.tokens.ident,"Expected function name."),n=this._argument_expression_list();return n===null?(this._current=e,null):new Yr(r.lexeme,n)}_loop_statement(){if(!this._match(a.keywords.loop))return null;this._consume(a.tokens.brace_left,"Expected '{' for loop.");const e=[];let r=this._statement();for(;r!==null;){if(Array.isArray(r))for(let s of r)e.push(s);else e.push(r);r=this._statement()}let n=null;return this._match(a.keywords.continuing)&&(n=this._compound_statement()),this._consume(a.tokens.brace_right,"Expected '}' for loop."),new Wr(e,n)}_switch_statement(){if(!this._match(a.keywords.switch))return null;const e=this._optional_paren_expression();this._consume(a.tokens.brace_left,"Expected '{' for switch.");const r=this._switch_body();if(r==null||r.length==0)throw this._error(this._previous(),"Expected 'case' or 'default'.");return this._consume(a.tokens.brace_right,"Expected '}' for switch."),new Jr(e,r)}_switch_body(){const e=[];if(this._match(a.keywords.case)){const r=this._case_selectors();this._match(a.tokens.colon),this._consume(a.tokens.brace_left,"Exected '{' for switch case.");const n=this._case_body();this._consume(a.tokens.brace_right,"Exected '}' for switch case."),e.push(new un(r,n))}if(this._match(a.keywords.default)){this._match(a.tokens.colon),this._consume(a.tokens.brace_left,"Exected '{' for switch default.");const r=this._case_body();this._consume(a.tokens.brace_right,"Exected '}' for switch default."),e.push(new cn(r))}if(this._check([a.keywords.default,a.keywords.case])){const r=this._switch_body();e.push(r[0])}return e}_case_selectors(){var e,r,n,s;const i=[(r=(e=this._shift_expression())===null||e===void 0?void 0:e.evaluate(this._context).toString())!==null&&r!==void 0?r:""];for(;this._match(a.tokens.comma);)i.push((s=(n=this._shift_expression())===null||n===void 0?void 0:n.evaluate(this._context).toString())!==null&&s!==void 0?s:"");return i}_case_body(){if(this._match(a.keywords.fallthrough))return this._consume(a.tokens.semicolon,"Expected ';'"),[];let e=this._statement();if(e==null)return[];e instanceof Array||(e=[e]);const r=this._case_body();return r.length==0?e:[...e,r[0]]}_if_statement(){if(!this._match(a.keywords.if))return null;const e=this._optional_paren_expression(),r=this._compound_statement();let n=[];this._match_elseif()&&(n=this._elseif_statement(n));let s=null;return this._match(a.keywords.else)&&(s=this._compound_statement()),new Zr(e,r,n,s)}_match_elseif(){return this._tokens[this._current].type===a.keywords.else&&this._tokens[this._current+1].type===a.keywords.if?(this._advance(),this._advance(),!0):!1}_elseif_statement(e=[]){const r=this._optional_paren_expression(),n=this._compound_statement();return e.push(new hn(r,n)),this._match_elseif()&&this._elseif_statement(e),e}_return_statement(){if(!this._match(a.keywords.return))return null;const e=this._short_circuit_or_expression();return new Qr(e)}_short_circuit_or_expression(){let e=this._short_circuit_and_expr();for(;this._match(a.tokens.or_or);)e=new H(this._previous().toString(),e,this._short_circuit_and_expr());return e}_short_circuit_and_expr(){let e=this._inclusive_or_expression();for(;this._match(a.tokens.and_and);)e=new H(this._previous().toString(),e,this._inclusive_or_expression());return e}_inclusive_or_expression(){let e=this._exclusive_or_expression();for(;this._match(a.tokens.or);)e=new H(this._previous().toString(),e,this._exclusive_or_expression());return e}_exclusive_or_expression(){let e=this._and_expression();for(;this._match(a.tokens.xor);)e=new H(this._previous().toString(),e,this._and_expression());return e}_and_expression(){let e=this._equality_expression();for(;this._match(a.tokens.and);)e=new H(this._previous().toString(),e,this._equality_expression());return e}_equality_expression(){const e=this._relational_expression();return this._match([a.tokens.equal_equal,a.tokens.not_equal])?new H(this._previous().toString(),e,this._relational_expression()):e}_relational_expression(){let e=this._shift_expression();for(;this._match([a.tokens.less_than,a.tokens.greater_than,a.tokens.less_than_equal,a.tokens.greater_than_equal]);)e=new H(this._previous().toString(),e,this._shift_expression());return e}_shift_expression(){let e=this._additive_expression();for(;this._match([a.tokens.shift_left,a.tokens.shift_right]);)e=new H(this._previous().toString(),e,this._additive_expression());return e}_additive_expression(){let e=this._multiplicative_expression();for(;this._match([a.tokens.plus,a.tokens.minus]);)e=new H(this._previous().toString(),e,this._multiplicative_expression());return e}_multiplicative_expression(){let e=this._unary_expression();for(;this._match([a.tokens.star,a.tokens.forward_slash,a.tokens.modulo]);)e=new H(this._previous().toString(),e,this._unary_expression());return e}_unary_expression(){return this._match([a.tokens.minus,a.tokens.bang,a.tokens.tilde,a.tokens.star,a.tokens.and])?new on(this._previous().toString(),this._unary_expression()):this._singular_expression()}_singular_expression(){const e=this._primary_expression(),r=this._postfix_expression();return r&&(e.postfix=r),e}_postfix_expression(){if(this._match(a.tokens.bracket_left)){const e=this._short_circuit_or_expression();this._consume(a.tokens.bracket_right,"Expected ']'.");const r=this._postfix_expression();return r&&(e.postfix=r),e}if(this._match(a.tokens.period)){const e=this._consume(a.tokens.ident,"Expected member name."),r=this._postfix_expression(),n=new Gt(e.lexeme);return r&&(n.postfix=r),n}return null}_getStruct(e){return this._context.aliases.has(e)?this._context.aliases.get(e).type:this._context.structs.has(e)?this._context.structs.get(e):null}_primary_expression(){if(this._match(a.tokens.ident)){const n=this._previous().toString();if(this._check(a.tokens.paren_left)){const s=this._argument_expression_list(),i=this._getStruct(n);return i!=null?new me(i,s):new sr(n,s)}if(this._context.constants.has(n)){const s=this._context.constants.get(n);return new Nt(n,s.value)}return new ir(n)}if(this._match(a.const_literal))return new Vt(parseFloat(this._previous().toString()));if(this._check(a.tokens.paren_left))return this._paren_expression();if(this._match(a.keywords.bitcast)){this._consume(a.tokens.less_than,"Expected '<'.");const n=this._type_decl();this._consume(a.tokens.greater_than,"Expected '>'.");const s=this._paren_expression();return new sn(n,s)}const e=this._type_decl(),r=this._argument_expression_list();return new an(e,r)}_argument_expression_list(){if(!this._match(a.tokens.paren_left))return null;const e=[];do{if(this._check(a.tokens.paren_right))break;const r=this._short_circuit_or_expression();e.push(r)}while(this._match(a.tokens.comma));return this._consume(a.tokens.paren_right,"Expected ')' for agument list"),e}_optional_paren_expression(){this._match(a.tokens.paren_left);const e=this._short_circuit_or_expression();return this._match(a.tokens.paren_right),new zt([e])}_paren_expression(){this._consume(a.tokens.paren_left,"Expected '('.");const e=this._short_circuit_or_expression();return this._consume(a.tokens.paren_right,"Expected ')'."),new zt([e])}_struct_decl(){if(!this._match(a.keywords.struct))return null;const e=this._consume(a.tokens.ident,"Expected name for struct.").toString();this._consume(a.tokens.brace_left,"Expected '{' for struct body.");const r=[];for(;!this._check(a.tokens.brace_right);){const s=this._attribute(),i=this._consume(a.tokens.ident,"Expected variable name.").toString();this._consume(a.tokens.colon,"Expected ':' for struct member type.");const o=this._attribute(),u=this._type_decl();u!=null&&(u.attributes=o),this._check(a.tokens.brace_right)?this._match(a.tokens.comma):this._consume(a.tokens.comma,"Expected ',' for struct member."),r.push(new fn(i,u,s))}this._consume(a.tokens.brace_right,"Expected '}' after struct body.");const n=new te(e,r);return this._context.structs.set(e,n),n}_global_variable_decl(){const e=this._variable_decl();return e&&this._match(a.tokens.equal)&&(e.value=this._const_expression()),e}_override_variable_decl(){const e=this._override_decl();return e&&this._match(a.tokens.equal)&&(e.value=this._const_expression()),e}_global_const_decl(){if(!this._match(a.keywords.const))return null;const e=this._consume(a.tokens.ident,"Expected variable name");let r=null;if(this._match(a.tokens.colon)){const i=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=i)}let n=null;if(this._match(a.tokens.equal)){const i=this._short_circuit_or_expression();if(i instanceof me)n=i;else if(i instanceof Nt&&i.initializer instanceof me)n=i.initializer;else try{const o=i.evaluate(this._context);n=new Vt(o)}catch{n=i}}const s=new It(e.toString(),r,"","",n);return this._context.constants.set(s.name,s),s}_global_let_decl(){if(!this._match(a.keywords.let))return null;const e=this._consume(a.tokens.ident,"Expected variable name");let r=null;if(this._match(a.tokens.colon)){const s=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=s)}let n=null;return this._match(a.tokens.equal)&&(n=this._const_expression()),new rt(e.toString(),r,"","",n)}_const_expression(){if(this._match(a.const_literal))return new Gt(this._previous().toString());const e=this._type_decl();this._consume(a.tokens.paren_left,"Expected '('.");let r=[];for(;!this._check(a.tokens.paren_right)&&(r.push(this._const_expression()),!!this._check(a.tokens.comma));)this._advance();return this._consume(a.tokens.paren_right,"Expected ')'."),new me(e,r)}_variable_decl(){if(!this._match(a.keywords.var))return null;let e="",r="";this._match(a.tokens.less_than)&&(e=this._consume(a.storage_class,"Expected storage_class.").toString(),this._match(a.tokens.comma)&&(r=this._consume(a.access_mode,"Expected access_mode.").toString()),this._consume(a.tokens.greater_than,"Expected '>'."));const n=this._consume(a.tokens.ident,"Expected variable name");let s=null;if(this._match(a.tokens.colon)){const i=this._attribute();s=this._type_decl(),s!=null&&(s.attributes=i)}return new re(n.toString(),s,e,r,null)}_override_decl(){if(!this._match(a.keywords.override))return null;const e=this._consume(a.tokens.ident,"Expected variable name");let r=null;if(this._match(a.tokens.colon)){const n=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=n)}return new er(e.toString(),r,null)}_enable_directive(){const e=this._consume(a.tokens.ident,"identity expected.");return new Kr(e.toString())}_type_alias(){const e=this._consume(a.tokens.ident,"identity expected.");this._consume(a.tokens.equal,"Expected '=' for type alias.");let r=this._type_decl();if(r===null)throw this._error(this._peek(),"Expected Type for Alias.");this._context.aliases.has(r.name)&&(r=this._context.aliases.get(r.name).type);const n=new tr(e.toString(),r);return this._context.aliases.set(n.name,n),n}_type_decl(){if(this._check([a.tokens.ident,...a.texel_format,a.keywords.bool,a.keywords.f32,a.keywords.i32,a.keywords.u32])){const n=this._advance(),s=n.toString();return this._context.structs.has(s)?this._context.structs.get(s):this._context.aliases.has(s)?this._context.aliases.get(s).type:new ne(n.toString())}let e=this._texture_sampler_types();if(e)return e;if(this._check(a.template_types)){let n=this._advance().toString(),s=null,i=null;return this._match(a.tokens.less_than)&&(s=this._type_decl(),i=null,this._match(a.tokens.comma)&&(i=this._consume(a.access_mode,"Expected access_mode for pointer").toString()),this._consume(a.tokens.greater_than,"Expected '>' for type.")),new rr(n,s,i)}if(this._match(a.keywords.ptr)){let n=this._previous().toString();this._consume(a.tokens.less_than,"Expected '<' for pointer.");const s=this._consume(a.storage_class,"Expected storage_class for pointer");this._consume(a.tokens.comma,"Expected ',' for pointer.");const i=this._type_decl();let o=null;return this._match(a.tokens.comma)&&(o=this._consume(a.access_mode,"Expected access_mode for pointer").toString()),this._consume(a.tokens.greater_than,"Expected '>' for pointer."),new nn(n,s.toString(),i,o)}const r=this._attribute();if(this._match(a.keywords.array)){let n=null,s=-1;const i=this._previous();if(this._match(a.tokens.less_than)){n=this._type_decl(),this._context.aliases.has(n.name)&&(n=this._context.aliases.get(n.name).type);let o="";this._match(a.tokens.comma)&&(o=this._shift_expression().evaluate(this._context).toString()),this._consume(a.tokens.greater_than,"Expected '>' for array."),s=o?parseInt(o):0}return new nr(i.toString(),r,n,s)}return null}_texture_sampler_types(){if(this._match(a.sampler_type))return new pe(this._previous().toString(),null,null);if(this._match(a.depth_texture_type))return new pe(this._previous().toString(),null,null);if(this._match(a.sampled_texture_type)||this._match(a.multisampled_texture_type)){const e=this._previous();this._consume(a.tokens.less_than,"Expected '<' for sampler type.");const r=this._type_decl();return this._consume(a.tokens.greater_than,"Expected '>' for sampler type."),new pe(e.toString(),r,null)}if(this._match(a.storage_texture_type)){const e=this._previous();this._consume(a.tokens.less_than,"Expected '<' for sampler type.");const r=this._consume(a.texel_format,"Invalid texel format.").toString();this._consume(a.tokens.comma,"Expected ',' after texel format.");const n=this._consume(a.access_mode,"Expected access mode for storage texture type.").toString();return this._consume(a.tokens.greater_than,"Expected '>' for sampler type."),new pe(e.toString(),r,n)}return null}_attribute(){let e=[];for(;this._match(a.tokens.attr);){const r=this._consume(a.attribute_name,"Expected attribute name"),n=new Lt(r.toString(),null);if(this._match(a.tokens.paren_left)){if(n.value=this._consume(a.literal_or_ident,"Expected attribute value").toString(),this._check(a.tokens.comma)){this._advance();do{const s=this._consume(a.literal_or_ident,"Expected attribute value").toString();n.value instanceof Array||(n.value=[n.value]),n.value.push(s)}while(this._match(a.tokens.comma))}this._consume(a.tokens.paren_right,"Expected ')'")}e.push(n)}for(;this._match(a.tokens.attr_left);){if(!this._check(a.tokens.attr_right))do{const r=this._consume(a.attribute_name,"Expected attribute name"),n=new Lt(r.toString(),null);if(this._match(a.tokens.paren_left)){if(n.value=[this._consume(a.literal_or_ident,"Expected attribute value").toString()],this._check(a.tokens.comma)){this._advance();do{const s=this._consume(a.literal_or_ident,"Expected attribute value").toString();n.value.push(s)}while(this._match(a.tokens.comma))}this._consume(a.tokens.paren_right,"Expected ')'")}e.push(n)}while(this._match(a.tokens.comma));this._consume(a.tokens.attr_right,"Expected ']]' after attribute declarations")}return e.length==0?null:e}}class ue{constructor(e,r){this.name=e,this.attributes=r,this.size=0}get isArray(){return!1}get isStruct(){return!1}get isTemplate(){return!1}}class Ut{constructor(e,r,n){this.name=e,this.type=r,this.attributes=n,this.offset=0,this.size=0}get isArray(){return this.type.isArray}get isStruct(){return this.type.isStruct}get isTemplate(){return this.type.isTemplate}get align(){return this.type.isStruct?this.type.align:0}get members(){return this.type.isStruct?this.type.members:null}get format(){return this.type.isArray?this.type.format:this.type.isTemplate?this.type.format:null}get count(){return this.type.isArray?this.type.count:0}get stride(){return this.type.isArray?this.type.stride:this.size}}class Te extends ue{constructor(e,r){super(e,r),this.members=[],this.align=0}get isStruct(){return!0}}class $e extends ue{constructor(e,r){super(e,r),this.count=0,this.stride=0}get isArray(){return!0}}class Ct extends ue{constructor(e,r,n,s){super(e,n),this.format=r,this.access=s}get isTemplate(){return!0}}var L;(function(t){t[t.Uniform=0]="Uniform",t[t.Storage=1]="Storage",t[t.Texture=2]="Texture",t[t.Sampler=3]="Sampler",t[t.StorageTexture=4]="StorageTexture"})(L||(L={}));class Se{constructor(e,r,n,s,i,o,u){this.name=e,this.type=r,this.group=n,this.binding=s,this.attributes=i,this.resourceType=o,this.access=u}get isArray(){return this.type.isArray}get isStruct(){return this.type.isStruct}get isTemplate(){return this.type.isTemplate}get size(){return this.type.size}get align(){return this.type.isStruct?this.type.align:0}get members(){return this.type.isStruct?this.type.members:null}get format(){return this.type.isArray?this.type.format:this.type.isTemplate?this.type.format:null}get count(){return this.type.isArray?this.type.count:0}get stride(){return this.type.isArray?this.type.stride:this.size}}class mn{constructor(e,r){this.name=e,this.type=r}}class Ee{constructor(e,r){this.align=e,this.size=r}}class _n{constructor(e,r,n,s){this.name=e,this.type=r,this.locationType=n,this.location=s,this.interpolation=null}}class Dt{constructor(e,r,n,s){this.name=e,this.type=r,this.locationType=n,this.location=s}}class gn{constructor(e,r=null){this.stage=null,this.inputs=[],this.outputs=[],this.resources=[],this.name=e,this.stage=r}}class yn{constructor(){this.vertex=[],this.fragment=[],this.compute=[]}}class vn{constructor(e,r,n,s){this.name=e,this.type=r,this.attributes=n,this.id=s}}class wn{constructor(e){this.resources=null,this.node=e}}class Y{constructor(e){this.uniforms=[],this.storage=[],this.textures=[],this.samplers=[],this.aliases=[],this.overrides=[],this.structs=[],this.entry=new yn,this._types=new Map,this._functions=new Map,e&&this.update(e)}_isStorageTexture(e){return e.name=="texture_storage_1d"||e.name=="texture_storage_2d"||e.name=="texture_storage_2d_array"||e.name=="texture_storage_3d"}update(e){const n=new pn().parse(e);for(const s of n)s instanceof tt&&this._functions.set(s.name,new wn(s));for(const s of n){if(s instanceof te){const i=this._getTypeInfo(s,null);i instanceof Te&&this.structs.push(i);continue}if(s instanceof tr){this.aliases.push(this._getAliasInfo(s));continue}if(s instanceof er){const i=s,o=this._getAttributeNum(i.attributes,"id",0),u=i.type!=null?this._getTypeInfo(i.type,i.attributes):null;this.overrides.push(new vn(i.name,u,i.attributes,o));continue}if(this._isUniformVar(s)){const i=s,o=this._getAttributeNum(i.attributes,"group",0),u=this._getAttributeNum(i.attributes,"binding",0),h=this._getTypeInfo(i.type,i.attributes),f=new Se(i.name,h,o,u,i.attributes,L.Uniform,i.access);this.uniforms.push(f);continue}if(this._isStorageVar(s)){const i=s,o=this._getAttributeNum(i.attributes,"group",0),u=this._getAttributeNum(i.attributes,"binding",0),h=this._getTypeInfo(i.type,i.attributes),f=this._isStorageTexture(h),d=new Se(i.name,h,o,u,i.attributes,f?L.StorageTexture:L.Storage,i.access);this.storage.push(d);continue}if(this._isTextureVar(s)){const i=s,o=this._getAttributeNum(i.attributes,"group",0),u=this._getAttributeNum(i.attributes,"binding",0),h=this._getTypeInfo(i.type,i.attributes),f=this._isStorageTexture(h),d=new Se(i.name,h,o,u,i.attributes,f?L.StorageTexture:L.Texture,i.access);f?this.storage.push(d):this.textures.push(d);continue}if(this._isSamplerVar(s)){const i=s,o=this._getAttributeNum(i.attributes,"group",0),u=this._getAttributeNum(i.attributes,"binding",0),h=this._getTypeInfo(i.type,i.attributes),f=new Se(i.name,h,o,u,i.attributes,L.Sampler,i.access);this.samplers.push(f);continue}if(s instanceof tt){const i=this._getAttribute(s,"vertex"),o=this._getAttribute(s,"fragment"),u=this._getAttribute(s,"compute"),h=i||o||u;if(h){const f=new gn(s.name,h==null?void 0:h.name);f.inputs=this._getInputs(s.args),f.outputs=this._getOutputs(s.returnType),f.resources=this._findResources(s),this.entry[h.name].push(f)}continue}}}_findResource(e){for(const r of this.uniforms)if(r.name==e)return r;for(const r of this.storage)if(r.name==e)return r;for(const r of this.textures)if(r.name==e)return r;for(const r of this.samplers)if(r.name==e)return r;return null}_findResources(e){const r=[],n=this,s=[];return e.search(i=>{if(i instanceof Ie)s.push({});else if(i instanceof Ge)s.pop();else if(i instanceof re){if(s.length>0){const o=i;s[s.length-1][o.name]=o}}else if(i instanceof rt){if(s.length>0){const o=i;s[s.length-1][o.name]=o}}else if(i instanceof ir){const o=i;if(s.length>0&&s[s.length-1][o.name])return;const u=n._findResource(o.name);u&&r.push(u)}else if(i instanceof sr){const o=i,u=n._functions.get(o.name);u&&(u.resources===null&&(u.resources=n._findResources(u.node)),r.push(...u.resources))}}),[...new Map(r.map(i=>[i.name,i])).values()]}getBindGroups(){const e=[];function r(n,s){n>=e.length&&(e.length=n+1),e[n]===void 0&&(e[n]=[]),s>=e[n].length&&(e[n].length=s+1)}for(const n of this.uniforms){r(n.group,n.binding);const s=e[n.group];s[n.binding]=n}for(const n of this.storage){r(n.group,n.binding);const s=e[n.group];s[n.binding]=n}for(const n of this.textures){r(n.group,n.binding);const s=e[n.group];s[n.binding]=n}for(const n of this.samplers){r(n.group,n.binding);const s=e[n.group];s[n.binding]=n}return e}_getOutputs(e,r=void 0){if(r===void 0&&(r=[]),e instanceof te)this._getStructOutputs(e,r);else{const n=this._getOutputInfo(e);n!==null&&r.push(n)}return r}_getStructOutputs(e,r){for(const n of e.members)if(n.type instanceof te)this._getStructOutputs(n.type,r);else{const s=this._getAttribute(n,"location")||this._getAttribute(n,"builtin");if(s!==null){const i=this._getTypeInfo(n.type,n.type.attributes),o=this._parseInt(s.value),u=new Dt(n.name,i,s.name,o);r.push(u)}}}_getOutputInfo(e){const r=this._getAttribute(e,"location")||this._getAttribute(e,"builtin");if(r!==null){const n=this._getTypeInfo(e,e.attributes),s=this._parseInt(r.value);return new Dt("",n,r.name,s)}return null}_getInputs(e,r=void 0){r===void 0&&(r=[]);for(const n of e)if(n.type instanceof te)this._getStructInputs(n.type,r);else{const s=this._getInputInfo(n);s!==null&&r.push(s)}return r}_getStructInputs(e,r){for(const n of e.members)if(n.type instanceof te)this._getStructInputs(n.type,r);else{const s=this._getInputInfo(n);s!==null&&r.push(s)}}_getInputInfo(e){const r=this._getAttribute(e,"location")||this._getAttribute(e,"builtin");if(r!==null){const n=this._getAttribute(e,"interpolation"),s=this._getTypeInfo(e.type,e.attributes),i=this._parseInt(r.value),o=new _n(e.name,s,r.name,i);return n!==null&&(o.interpolation=this._parseString(n.value)),o}return null}_parseString(e){return e instanceof Array&&(e=e[0]),e}_parseInt(e){e instanceof Array&&(e=e[0]);const r=parseInt(e);return isNaN(r)?e:r}_getAlias(e){for(const r of this.aliases)if(r.name==e)return r.type;return null}_getAliasInfo(e){return new mn(e.name,this._getTypeInfo(e.type,null))}_getTypeInfo(e,r){if(this._types.has(e))return this._types.get(e);if(e instanceof nr){const s=e,i=this._getTypeInfo(s.format,s.attributes),o=new $e(s.name,r);return o.format=i,o.count=s.count,this._types.set(e,o),this._updateTypeInfo(o),o}if(e instanceof te){const s=e,i=new Te(s.name,r);for(const o of s.members){const u=this._getTypeInfo(o.type,o.attributes);i.members.push(new Ut(o.name,u,o.attributes))}return this._types.set(e,i),this._updateTypeInfo(i),i}if(e instanceof pe){const s=e,i=s.format instanceof ne,o=s.format?i?this._getTypeInfo(s.format,null):new ue(s.format,null):null,u=new Ct(s.name,o,r,s.access);return this._types.set(e,u),this._updateTypeInfo(u),u}if(e instanceof rr){const s=e,i=s.format?this._getTypeInfo(s.format,null):null,o=new Ct(s.name,i,r,s.access);return this._types.set(e,o),this._updateTypeInfo(o),o}const n=new ue(e.name,r);return this._types.set(e,n),this._updateTypeInfo(n),n}_updateTypeInfo(e){var r,n;const s=this._getTypeSize(e);if(e.size=(r=s==null?void 0:s.size)!==null&&r!==void 0?r:0,e instanceof $e){const i=this._getTypeSize(e.format);e.stride=(n=i==null?void 0:i.size)!==null&&n!==void 0?n:0,this._updateTypeInfo(e.format)}e instanceof Te&&this._updateStructInfo(e)}_updateStructInfo(e){var r;let n=0,s=0,i=0,o=0;for(let u=0,h=e.members.length;u<h;++u){const f=e.members[u],d=this._getTypeSize(f);if(!d)continue;(r=this._getAlias(f.type.name))!==null&&r!==void 0||f.type;const m=d.align,_=d.size;n=this._roundUp(m,n+s),s=_,i=n,o=Math.max(o,m),f.offset=n,f.size=_,this._updateTypeInfo(f.type)}e.size=this._roundUp(o,i+s),e.align=o}_getTypeSize(e){var r;if(e==null)return null;const n=this._getAttributeNum(e.attributes,"size",0),s=this._getAttributeNum(e.attributes,"align",0);if(e instanceof Ut&&(e=e.type),e instanceof ue){const i=this._getAlias(e.name);i!==null&&(e=i)}{const i=Y._typeInfo[e.name];if(i!==void 0){const o=e.format==="f16"?2:1;return new Ee(Math.max(s,i.align/o),Math.max(n,i.size/o))}}{const i=Y._typeInfo[e.name.substring(0,e.name.length-1)];if(i){const o=e.name[e.name.length-1]==="h"?2:1;return new Ee(Math.max(s,i.align/o),Math.max(n,i.size/o))}}if(e instanceof $e){let i=e,o=8,u=8;const h=this._getTypeSize(i.format);h!==null&&(u=h.size,o=h.align);const f=i.count,d=this._getAttributeNum((r=e==null?void 0:e.attributes)!==null&&r!==void 0?r:null,"stride",this._roundUp(o,u));return u=f*d,n&&(u=n),new Ee(Math.max(s,o),Math.max(n,u))}if(e instanceof Te){let i=0,o=0,u=0,h=0,f=0;for(const d of e.members){const m=this._getTypeSize(d.type);m!==null&&(i=Math.max(m.align,i),u=this._roundUp(m.align,u+h),h=m.size,f=u)}return o=this._roundUp(i,f+h),new Ee(Math.max(s,i),Math.max(n,o))}return null}_isUniformVar(e){return e instanceof re&&e.storage=="uniform"}_isStorageVar(e){return e instanceof re&&e.storage=="storage"}_isTextureVar(e){return e instanceof re&&e.type!==null&&Y._textureTypes.indexOf(e.type.name)!=-1}_isSamplerVar(e){return e instanceof re&&e.type!==null&&Y._samplerTypes.indexOf(e.type.name)!=-1}_getAttribute(e,r){const n=e;if(!n||!n.attributes)return null;const s=n.attributes;for(let i of s)if(i.name==r)return i;return null}_getAttributeNum(e,r,n){if(e===null)return n;for(let s of e)if(s.name==r){let i=s!==null&&s.value!==null?s.value:n;return i instanceof Array&&(i=i[0]),typeof i=="number"?i:typeof i=="string"?parseInt(i):n}return n}_roundUp(e,r){return Math.ceil(r/e)*e}}Y._typeInfo={f16:{align:2,size:2},i32:{align:4,size:4},u32:{align:4,size:4},f32:{align:4,size:4},atomic:{align:4,size:4},vec2:{align:8,size:8},vec3:{align:16,size:12},vec4:{align:16,size:16},mat2x2:{align:8,size:16},mat3x2:{align:8,size:24},mat4x2:{align:8,size:32},mat2x3:{align:16,size:32},mat3x3:{align:16,size:48},mat4x3:{align:16,size:64},mat2x4:{align:16,size:32},mat3x4:{align:16,size:48},mat4x4:{align:16,size:64}};Y._textureTypes=a.any_texture_type.map(t=>t.name);Y._samplerTypes=a.sampler_type.map(t=>t.name);function oe(t,e){return Object.fromEntries(e.map(r=>{const n=Sn(t,r,0);return[r.name,{typeDefinition:n,group:r.group,binding:r.binding,size:n.size}]}))}function ur(t,e,r){return{fields:Object.fromEntries(e.members.map(s=>[s.name,{offset:s.offset,type:ot(t,s.type,0)}])),size:e.size,offset:r}}function xn(t){var e;if(t.name.includes("depth"))return"depth";switch((e=t.format)==null?void 0:e.name){case"f32":return"float";case"i32":return"sint";case"u32":return"uint";default:throw new Error("unknown texture sample type")}}function Ot(t){return t.name.includes("2d_array")?"2d-array":t.name.includes("cube_array")?"cube-array":t.name.includes("3d")?"3d":t.name.includes("1d")?"1d":t.name.includes("cube")?"cube":"2d"}function bn(t){switch(t.access){case"read":return"read-only";case"write":return"write-only";case"read_write":return"read-write";default:throw new Error("unknonw storage texture access")}}function kn(t){return t.name.endsWith("_comparison")?"comparison":"filtering"}function Tn(t,e){const{binding:r,access:n,type:s}=t;switch(t.resourceType){case L.Uniform:return{binding:r,visibility:e,buffer:{}};case L.Storage:return{binding:r,visibility:e,buffer:{type:n===""||n==="read"?"read-only-storage":"storage"}};case L.Texture:{if(s.name==="texture_external")return{binding:r,visibility:e,externalTexture:{}};const i=s.name.includes("multisampled");return{binding:r,visibility:e,texture:{sampleType:xn(s),viewDimension:Ot(s),multisampled:i}}}case L.Sampler:return{binding:r,visibility:e,sampler:{type:kn(s)}};case L.StorageTexture:return{binding:r,visibility:e,storageTexture:{access:bn(s),format:s.format.name,viewDimension:Ot(s)}};default:throw new Error("unknown resource type")}}function je(t,e){const r={};for(const n of t)r[n.name]={stage:e,resources:n.resources.map(s=>{const{name:i,group:o}=s;return{name:i,group:o,entry:Tn(s,e)}})};return r}function Ne(t){const e=new Y(t),r=Object.fromEntries(e.structs.map(d=>[d.name,ur(e,d,0)])),n=oe(e,e.uniforms),s=oe(e,e.storage.filter(d=>d.resourceType===L.Storage)),i=oe(e,e.storage.filter(d=>d.resourceType===L.StorageTexture)),o=oe(e,e.textures.filter(d=>d.type.name!=="texture_external")),u=oe(e,e.textures.filter(d=>d.type.name==="texture_external")),h=oe(e,e.samplers),f={...je(e.entry.vertex,GPUShaderStage.VERTEX),...je(e.entry.fragment,GPUShaderStage.FRAGMENT),...je(e.entry.compute,GPUShaderStage.COMPUTE)};return{externalTextures:u,samplers:h,structs:r,storages:s,storageTextures:i,textures:o,uniforms:n,entryPoints:f}}function Ye(t,e=""){if(!t)throw new Error(e)}function Sn(t,e,r){switch(e.resourceType){case L.Uniform:case L.Storage:case L.StorageTexture:return ot(t,e.type,r);default:return{size:0,type:e.type.name}}}function ot(t,e,r){if(e.isArray){Ye(!e.isStruct,"struct array is invalid"),Ye(!e.isStruct,"template array is invalid");const n=e;return{size:n.size,elementType:ot(t,n.format,r),numElements:n.count}}else{if(e.isStruct)return Ye(!e.isTemplate,"template struct is invalid"),ur(t,e,r);{const n=e,s=e.isTemplate?`${n.name}<${n.format.name}>`:e.name;return{size:e.size,type:s}}}}function En(t){switch(t.dimension){case"1d":return"1d";case"3d":return"3d";default:case"2d":return t.depthOrArrayLayers>1?"2d-array":"2d"}}function An(t){return[t.width,t.height||1,t.depthOrArrayLayers||1]}function Mn(t){return Array.isArray(t)||Qe(t)?[...t,1,1].slice(0,3):An(t)}function Pn(t,e){const r=Mn(t),n=Math.max(...r.slice(0,e==="3d"?3:2));return 1+Math.log2(n)|0}function Bn(t){let e,r;switch(t){case"2d":e="texture_2d<f32>",r="textureSample(ourTexture, ourSampler, fsInput.texcoord)";break;case"2d-array":e="texture_2d_array<f32>",r=`
          textureSample(
              ourTexture,
              ourSampler,
              fsInput.texcoord,
              uni.layer)`;break;case"cube":e="texture_cube<f32>",r=`
          textureSample(
              ourTexture,
              ourSampler,
              faceMat[uni.layer] * vec3f(fract(fsInput.texcoord), 1))`;break;case"cube-array":e="texture_cube_array<f32>",r=`
          textureSample(
              ourTexture,
              ourSampler,
              faceMat[uni.layer] * vec3f(fract(fsInput.texcoord), 1), uni.layer)`;break;default:throw new Error(`unsupported view: ${t}`)}return`
        const faceMat = array(
          mat3x3f( 0,  0,  -2,  0, -2,   0,  1,  1,   1),   // pos-x
          mat3x3f( 0,  0,   2,  0, -2,   0, -1,  1,  -1),   // neg-x
          mat3x3f( 2,  0,   0,  0,  0,   2, -1,  1,  -1),   // pos-y
          mat3x3f( 2,  0,   0,  0,  0,  -2, -1, -1,   1),   // neg-y
          mat3x3f( 2,  0,   0,  0, -2,   0, -1,  1,   1),   // pos-z
          mat3x3f(-2,  0,   0,  0, -2,   0,  1,  1,  -1));  // neg-z

        struct VSOutput {
          @builtin(position) position: vec4f,
          @location(0) texcoord: vec2f,
        };

        @vertex fn vs(
          @builtin(vertex_index) vertexIndex : u32
        ) -> VSOutput {
          var pos = array<vec2f, 3>(
            vec2f(-1.0, -1.0),
            vec2f(-1.0,  3.0),
            vec2f( 3.0, -1.0),
          );

          var vsOutput: VSOutput;
          let xy = pos[vertexIndex];
          vsOutput.position = vec4f(xy, 0.0, 1.0);
          vsOutput.texcoord = xy * vec2f(0.5, -0.5) + vec2f(0.5);
          return vsOutput;
        }

        struct Uniforms {
          layer: u32,
        };

        @group(0) @binding(0) var ourSampler: sampler;
        @group(0) @binding(1) var ourTexture: ${e};
        @group(0) @binding(2) var<uniform> uni: Uniforms;

        @fragment fn fs(fsInput: VSOutput) -> @location(0) vec4f {
          _ = uni.layer; // make sure this is used so all pipelines have the same bindings
          return ${r};
        }
      `}const Rt=new WeakMap;function In(t,e,r){let n=Rt.get(t);n||(n={pipelineByFormatAndView:{},moduleByViewType:{}},Rt.set(t,n));let{sampler:s,uniformBuffer:i,uniformValues:o}=n;const{pipelineByFormatAndView:u,moduleByViewType:h}=n;r=r||En(e);let f=h[r];if(!f){const _=Bn(r);f=t.createShaderModule({label:`mip level generation for ${r}`,code:_}),h[r]=f}s||(s=t.createSampler({minFilter:"linear",magFilter:"linear"}),i=t.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=new Uint32Array(1),Object.assign(n,{sampler:s,uniformBuffer:i,uniformValues:o}));const d=`${e.format}.${r}`;u[d]||(u[d]=t.createRenderPipeline({label:`mip level generator pipeline for ${r}`,layout:"auto",vertex:{module:f,entryPoint:"vs"},fragment:{module:f,entryPoint:"fs",targets:[{format:e.format}]}}));const m=u[d];for(let _=1;_<e.mipLevelCount;++_)for(let g=0;g<e.depthOrArrayLayers;++g){o[0]=g,t.queue.writeBuffer(i,0,o);const x=t.createBindGroup({layout:m.getBindGroupLayout(0),entries:[{binding:0,resource:s},{binding:1,resource:e.createView({dimension:r,baseMipLevel:_-1,mipLevelCount:1})},{binding:2,resource:{buffer:i}}]}),v={label:"mip gen renderPass",colorAttachments:[{view:e.createView({dimension:"2d",baseMipLevel:_,mipLevelCount:1,baseArrayLayer:g,arrayLayerCount:1}),loadOp:"clear",storeOp:"store"}]},w=t.createCommandEncoder({label:"mip gen encoder"}),k=w.beginRenderPass(v);k.setPipeline(m),k.setBindGroup(0,x),k.draw(3),k.end();const T=w.finish();t.queue.submit([T])}}const Gn=new Map([[Int8Array,{formats:["sint8","snorm8"],defaultForType:1}],[Uint8Array,{formats:["uint8","unorm8"],defaultForType:1}],[Int16Array,{formats:["sint16","snorm16"],defaultForType:1}],[Uint16Array,{formats:["uint16","unorm16"],defaultForType:1}],[Int32Array,{formats:["sint32","snorm32"],defaultForType:0}],[Uint32Array,{formats:["uint32","unorm32"],defaultForType:0}],[Float32Array,{formats:["float32","float32"],defaultForType:0}]]);new Map([...Gn.entries()].map(([t,{formats:[e,r]}])=>[[e,t],[r,t]]).flat());const Nn=100,ye=1/Nn,Vn=1/30,qt=5,we=4;class nt{constructor(e=100){I(this,"samples",[]);I(this,"numSamples");I(this,"total",0);I(this,"_average",0);if(e<1)throw new Error("numSamples should be larger than 0");this.numSamples=e}addSample(e){if(this.samples.push(e),this.total+=e,this.samples.length>this.numSamples){const r=this.samples.shift();this.total-=r}this._average=this.total/this.samples.length}average(){return this._average}}class st{constructor(e,r){I(this,"_canTimestamp");I(this,"querySet");I(this,"resolveBuffer");I(this,"resultBuffer");I(this,"gpuTimeMS",new nt);I(this,"newResultCallback");this._canTimestamp=e.features.has("timestamp-query"),this._canTimestamp&&(this.querySet=e.createQuerySet({type:"timestamp",count:2}),this.resolveBuffer=e.createBuffer({size:this.querySet.count*8,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),this.resultBuffer=e.createBuffer({size:this.resolveBuffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1})}storeTime(e){this._canTimestamp&&(e.resolveQuerySet(this.querySet,0,this.querySet.count,this.resolveBuffer,0),this.resultBuffer.mapState==="unmapped"&&e.copyBufferToBuffer(this.resolveBuffer,0,this.resultBuffer,0,this.resultBuffer.size))}recordTime(){this._canTimestamp&&this._canTimestamp&&this.resultBuffer.mapState==="unmapped"&&this.resultBuffer.mapAsync(GPUMapMode.READ).then(()=>{const e=new BigInt64Array(this.resultBuffer.getMappedRange()),r=Number(e[1]-e[0])/(1e3*1e3);this.gpuTimeMS.addSample(r),this.resultBuffer.unmap(),this.newResultCallback&&this.newResultCallback(r)})}canTimestamp(){return this._canTimestamp}averageMS(){return this.gpuTimeMS.average()}}const zn=`@group(0) @binding(0) var texture: texture_cube<f32>;\r
@group(0) @binding(1) var textureSampler: sampler;\r
@group(0) @binding(2) var<uniform> cameraData: CameraData;\r
\r
struct VertexInput {\r
    @builtin(vertex_index) vertexIndex: u32,\r
}\r
\r
struct VertexOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) pos: vec4f,\r
}\r
\r
@vertex\r
fn vert(i: VertexInput) -> VertexOutput {\r
    let positions = array<vec2f, 3>(\r
      vec2f(-1, 3),\r
      vec2f(-1,-1),\r
      vec2f( 3,-1),\r
    );\r
\r
    var o: VertexOutput;\r
\r
    o.position = vec4(positions[i.vertexIndex], 1, 1);\r
    o.pos = o.position;\r
\r
    return o;\r
}\r
\r
@fragment\r
fn frag(i: VertexOutput) -> @location(0) vec4f {\r
    let t = cameraData.viewDirectionProjectionInverse * i.pos;\r
    var color = textureSampleLevel(texture, textureSampler, normalize(t.xyz / t.w) * vec3f(-1, 1, 1), 0).rgb;\r
\r
    const gamma: f32 = 2.2;\r
    const exposure: f32 = 1;\r
    color = vec3(1.0) - exp(-color * exposure);\r
    color = pow(color, vec3(1.0 / gamma));\r
\r
    return vec4(color, 1);\r
}\r
`;class Ln{constructor(){I(this,"render")}async init(e,r,n,s){const i=e.createShaderModule({code:Q+zn}),o=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}},{binding:2,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{}}]}),h={layout:e.createPipelineLayout({bindGroupLayouts:[o]}),vertex:{module:i,entryPoint:"vert",buffers:[]},fragment:{module:i,entryPoint:"frag",targets:[{format:r}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:we},depthStencil:{depthWriteEnabled:!0,depthCompare:"less-equal",format:"depth24plus"}},f=e.createRenderPipeline(h),d=e.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"});let m=e.createBindGroup({layout:o,entries:[{binding:0,resource:n.createView({dimension:"cube"})},{binding:1,resource:d},{binding:2,resource:{buffer:s}}]});this.render=_=>{_.setPipeline(f),_.setBindGroup(0,m),_.draw(3)}}}const cr=new Float32Array(1),Fn=new Int32Array(cr.buffer);function Me(t){cr[0]=t;var e=Fn[0],r=e>>16&32768,n=e>>12&2047,s=e>>23&255;return s<103?r:s>142?(r|=31744,r|=(s==255?0:1)&&e&8388607,r):s<113?(n|=2048,r|=(n>>114-s)+(n>>113-s&1),r):(r|=s-112<<10|n>>1,r+=n&1,r)}const Un=Me(1);let Cn="#\\?RADIANCE",Dn="#.*",On="EXPOSURE=\\s*([0-9]*[.][0-9]*)",Rn="FORMAT=32-bit_rle_rgbe",qn="-Y ([0-9]+) \\+X ([0-9]+)";async function Hn(t){const r=await(await fetch(t)).arrayBuffer(),n=new Uint8Array(r);let s=0;const i=n.length,o=10;function u(){let T="";for(;++s<i;){let y=n[s];if(y==o){s+=1;break}T+=String.fromCharCode(y)}return T}let h=0,f=0,d=1,m=1;for(let T=0;T<20;T+=1){let y=u(),b;if(!(b=y.match(Cn))){if(!(b=y.match(Rn))){if(b=y.match(On))d=Number(b[1]);else if(!(b=y.match(Dn))){if(b=y.match(qn)){f=Number(b[1]),h=Number(b[2]);break}}}}}let _=new Uint8Array(h*f*4);Xn(n,_,0,s,h,f);let v=0;const w=4;let k=new Uint16Array(h*f*w);for(let T=0;T<_.length;T+=4){let y=_[T]/255,b=_[T+1]/255,S=_[T+2]/255;const E=_[T+3],B=Math.pow(2,E-128);y*=B,b*=B,S*=B;const F=T;k[F]=Me(y),k[F+1]=Me(b),k[F+2]=Me(S),k[F+3]=Un;const U=(y+b+S)/3;U>v&&(v=U)}return v>25&&(console.log("hdr image has very high intensities. the intensity will be clamped to 25 for the irradiance map."),console.log("max intensity: "+v)),{width:h,height:f,exposure:d,gamma:m,data:k}}function Xn(t,e,r,n,s,i){const o=new Array(4);let u=null,h,f,d;const m=new Array(2),_=t.length;function g(w){let k=0;do w[k++]=t[n],n+=1;while(n<_&&k<w.length);return k}function x(w,k,T){let y=0;do w[k+y]=t[n],y+=1,n+=1;while(n<_&&y<T);return y}function v(w,k,T){const y=4*T;let b=x(w,k,y);if(b<y)throw new Error("Error reading raw pixels: got "+b+" bytes, expected "+y)}for(;i>0;){if(g(o)<o.length)throw new Error("Error reading bytes: expected "+o.length);if(o[0]!=2||o[1]!=2||o[2]&128){e[r+0]=o[0],e[r+1]=o[1],e[r+2]=o[2],e[r+3]=o[3],r+=4,v(e,r,s*i-1);return}if(((o[2]&255)<<8|o[3]&255)!=s)throw new Error("Wrong scanline width "+((o[2]&255)<<8|o[3]&255)+", expected "+s);u==null&&(u=new Array(4*s)),h=0;for(let w=0;w<4;w+=1)for(f=(w+1)*s;h<f;){if(g(m)<m.length)throw new Error("Error reading 2-byte buffer");if((m[0]&255)>128){if(d=(m[0]&255)-128,d==0||d>f-h)throw new Error("Bad scanline data");for(;d-- >0;)u[h++]=m[1]}else{if(d=m[0]&255,d==0||d>f-h)throw new Error("Bad scanline data");if(u[h++]=m[1],--d>0){if(x(u,h,d)<d)throw new Error("Error reading non-run data");h+=d}}}for(let w=0;w<s;w+=1)e[r+0]=u[w],e[r+1]=u[w+s],e[r+2]=u[w+2*s],e[r+3]=u[w+3*s],r+=4;i-=1}}const $n=`@group(0) @binding(0) var texture: texture_2d<f32>;\r
@group(0) @binding(1) var textureSampler: sampler;\r
\r
@group(1) @binding(0) var<uniform> cameraData: CameraData;\r
\r
struct VertexInput {\r
    @builtin(vertex_index) vertexIndex: u32,\r
}\r
\r
struct VertexOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) pos: vec4f,\r
}\r
\r
@vertex\r
fn vert(i: VertexInput) -> VertexOutput {\r
    let positions = array<vec2f, 3>(\r
      vec2f(-1, 3),\r
      vec2f(-1,-1),\r
      vec2f( 3,-1),\r
    );\r
\r
    var o: VertexOutput;\r
\r
    o.position = vec4(positions[i.vertexIndex], 1, 1);\r
    o.pos = o.position;\r
\r
    return o;\r
}\r
\r
fn sampleSphericalMap(v: vec3f) -> vec2f {\r
    const invAtan = vec2(0.1591, 0.3183);\r
    var uv = vec2(atan2(v.z, v.x), asin(v.y));\r
    uv *= invAtan;\r
    uv += 0.5;\r
    return uv;\r
}\r
\r
@fragment\r
fn frag(i: VertexOutput) -> @location(0) vec4f {\r
//    const gamma: f32 = 2.2;\r
//    const exposure: f32 = 1;\r
\r
    let t = cameraData.viewDirectionProjectionInverse * i.pos;\r
    var direction = normalize(t.xyz / t.w) * vec3f(1, -1, 1);\r
    direction = vec3(-direction.z, direction.y, direction.x);\r
    let uv = sampleSphericalMap(direction);\r
    var colorLinear = textureSample(texture, textureSampler, uv).rgb;\r
\r
//    colorLinear = vec3(1.0) - exp(-colorLinear * exposure);\r
//    let color = pow(colorLinear, vec3(1.0 / gamma));\r
\r
    return vec4(colorLinear, 1);\r
}\r
`,jn=`const PI = 3.14159265359;\r
\r
@group(0) @binding(0) var texture: texture_cube<f32>;\r
@group(0) @binding(1) var textureSampler: sampler;\r
\r
@group(1) @binding(0) var<uniform> cameraData: CameraData;\r
\r
struct VertexInput {\r
    @builtin(vertex_index) vertexIndex: u32,\r
}\r
\r
struct VertexOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) pos: vec4f,\r
}\r
\r
@vertex\r
fn vert(i: VertexInput) -> VertexOutput {\r
    let positions = array<vec2f, 3>(\r
      vec2f(-1, 3),\r
      vec2f(-1,-1),\r
      vec2f( 3,-1),\r
    );\r
\r
    var o: VertexOutput;\r
\r
    o.position = vec4(positions[i.vertexIndex], 1, 1);\r
    o.pos = o.position;\r
\r
    return o;\r
}\r
\r
@fragment\r
fn frag(i: VertexOutput) -> @location(0) vec4f {\r
    const gamma: f32 = 2.2;\r
    const exposure: f32 = 1;\r
\r
    let t = cameraData.viewDirectionProjectionInverse * i.pos;\r
    let direction = normalize(t.xyz / t.w) * vec3f(-1, 1, 1);\r
\r
    var irradiance = vec3f(0, 0, 0);\r
\r
    var up = vec3(0.0, 1.0, 0.0);\r
    let right = normalize(cross(up, direction));\r
    up = normalize(cross(direction, right));\r
\r
    const sampleDelta = 0.025;\r
    var nrSamples = 0;\r
    for(var phi = 0.0; phi < 2.0 * PI; phi += sampleDelta)\r
    {\r
        for(var theta = 0.0; theta < 0.5 * PI; theta += sampleDelta)\r
        {\r
            // spherical to cartesian (in tangent space)\r
            let tangentSample = vec3(sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta));\r
            // tangent space to world\r
            let sampleVec = tangentSample.x * right + tangentSample.y * up + tangentSample.z * direction;\r
\r
            let linearColorSample = textureSample(texture, textureSampler, sampleVec).rgb * cos(theta) * sin(theta);\r
            irradiance += min(linearColorSample, vec3(25, 25, 25));\r
            nrSamples++;\r
        }\r
    }\r
    irradiance = PI * irradiance * (1.0 / f32(nrSamples));\r
\r
    return vec4(irradiance, 1);\r
}\r
`,Yn=`const PI = 3.14159265359;\r
\r
@group(0) @binding(0) var texture: texture_cube<f32>;\r
@group(0) @binding(1) var textureSampler: sampler;\r
\r
@group(1) @binding(0) var<uniform> cameraData: CameraData;\r
\r
@group(2) @binding(0) var<uniform> roughness: f32;\r
\r
struct VertexInput {\r
    @builtin(vertex_index) vertexIndex: u32,\r
}\r
\r
struct VertexOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) pos: vec4f,\r
}\r
\r
@vertex\r
fn vert(i: VertexInput) -> VertexOutput {\r
    let positions = array<vec2f, 3>(\r
      vec2f(-1, 3),\r
      vec2f(-1,-1),\r
      vec2f( 3,-1),\r
    );\r
\r
    var o: VertexOutput;\r
\r
    o.position = vec4(positions[i.vertexIndex], 1, 1);\r
    o.pos = o.position;\r
\r
    return o;\r
}\r
\r
@fragment\r
fn frag(i: VertexOutput) -> @location(0) vec4f {\r
    const gamma: f32 = 2.2;\r
    const exposure: f32 = 1;\r
\r
    let t = cameraData.viewDirectionProjectionInverse * i.pos;\r
    let direction = normalize(t.xyz / t.w) * vec3f(-1, 1, 1);\r
\r
    let N = direction;\r
    let R = N;\r
    let V = R;\r
\r
    const SAMPLE_COUNT: u32 = 1024;\r
    var totalWeight = 0.0;\r
    var prefilteredColor = vec3(0.0);\r
    for(var i = 0u; i < SAMPLE_COUNT; i++)\r
    {\r
        let Xi = hammersley(i, SAMPLE_COUNT);\r
        let H = importanceSampleGGX(Xi, N, roughness);\r
        let L = normalize(2.0 * dot(V, H) * H - V);\r
\r
        let NdotL = max(dot(N, L), 0.0);\r
\r
        // sample from the environment's mip level based on roughness/pdf\r
        let D = distributionGGX(N, H, roughness);\r
        let NdotH = max(dot(N, H), 0.0);\r
        let HdotV = max(dot(H, V), 0.0);\r
        let pdf = D * NdotH / (4.0 * HdotV) + 0.0001;\r
\r
        let resolution: f32 = 2048; // resolution of source cubemap (per face)\r
        let saTexel  = 4.0 * PI / (6.0 * resolution * resolution);\r
        let saSample = 1.0 / (f32(SAMPLE_COUNT) * pdf + 0.0001);\r
\r
        let mipLevel = select(0.5 * log2(saSample / saTexel), 0.0, roughness == 0.0);\r
        let sampleColor = textureSampleLevel(texture, textureSampler, L, mipLevel).rgb;\r
\r
        if(NdotL > 0.0)\r
        {\r
            prefilteredColor += sampleColor * NdotL;\r
            totalWeight += NdotL;\r
        }\r
    }\r
    prefilteredColor = prefilteredColor / totalWeight;\r
\r
    return vec4(prefilteredColor, 1);\r
}\r
\r
fn radicalInverse_VdC(bits: u32) -> f32 {\r
    var bitsOut = bits;\r
    bitsOut = (bitsOut << 16u) | (bitsOut >> 16u);\r
    bitsOut = ((bitsOut & 0x55555555u) << 1u) | ((bitsOut & 0xAAAAAAAAu) >> 1u);\r
    bitsOut = ((bitsOut & 0x33333333u) << 2u) | ((bitsOut & 0xCCCCCCCCu) >> 2u);\r
    bitsOut = ((bitsOut & 0x0F0F0F0Fu) << 4u) | ((bitsOut & 0xF0F0F0F0u) >> 4u);\r
    bitsOut = ((bitsOut & 0x00FF00FFu) << 8u) | ((bitsOut & 0xFF00FF00u) >> 8u);\r
    return f32(bitsOut) * 2.3283064365386963e-10; // / 0x100000000\r
}\r
\r
fn hammersley(i: u32, N: u32) -> vec2f {\r
    return vec2(f32(i) / f32(N), radicalInverse_VdC(i));\r
}\r
\r
fn importanceSampleGGX(Xi: vec2f, N: vec3f, roughness: f32) -> vec3f{\r
    let a = roughness * roughness;\r
\r
    let phi = 2.0 * PI * Xi.x;\r
    let cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));\r
    let sinTheta = sqrt(1.0 - cosTheta * cosTheta);\r
\r
    // from spherical coordinates to cartesian coordinates\r
    var H: vec3f;\r
    H.x = cos(phi) * sinTheta;\r
    H.y = sin(phi) * sinTheta;\r
    H.z = cosTheta;\r
\r
    // from tangent-space vector to world-space sample vector\r
    let up = select(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), abs(N.z) < 0.999);\r
    let tangent = normalize(cross(up, N));\r
    let bitangent = cross(N, tangent);\r
\r
    let sampleVec = tangent * H.x + bitangent * H.y + N * H.z;\r
    return normalize(sampleVec);\r
}\r
\r
fn distributionGGX(N: vec3f, H: vec3f, roughness: f32) -> f32 {\r
    let a = roughness * roughness;\r
    let a2 = a * a;\r
    let NdotH = max(dot(N, H), 0.0);\r
    let NdotH2 = NdotH * NdotH;\r
\r
    let num = a2;\r
    var denom = (NdotH2 * (a2 - 1.0) + 1.0);\r
    denom = PI * denom * denom;\r
\r
    return num / denom;\r
}\r
`,Wn=[ae(z(),G(0,0,0),G(-1,0,0),G(0,1,0)),ae(z(),G(0,0,0),G(1,0,0),G(0,1,0)),ae(z(),G(0,0,0),G(0,1,0),G(0,0,-1)),ae(z(),G(0,0,0),G(0,-1,0),G(0,0,1)),ae(z(),G(0,0,0),G(0,0,1),G(0,1,0)),ae(z(),G(0,0,0),G(0,0,-1),G(0,1,0))];let We;function Ve(t){return We||(We=Jn(t)),We}function Jn(t){return t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{}}]})}let Je;function ut(t){return Je||(Je=Zn(t)),Je}function Zn(t){const e=Ne(Q);return Wn.map(r=>{const n=Be(e.structs.CameraData),s=t.createBuffer({size:n.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let i=z();Jt(i,Math.PI/180*90,1,.01,1e3);let o=z();return Yt(o,r),_e(o,i,o),Pe(o,o),n.set({viewDirectionProjectionInverse:o}),t.queue.writeBuffer(s,0,n.arrayBuffer),t.createBindGroup({layout:Ve(t),entries:[{binding:0,resource:{buffer:s}}]})})}const Ht=2048,Xt=32,$t=512,Ze=5;async function Qn(t,e){const r=t.createShaderModule({code:Q+$n}),n=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),s=t.createPipelineLayout({bindGroupLayouts:[n,Ve(t)]}),i="rgba16float",o={layout:s,vertex:{module:r,entryPoint:"vert",buffers:[]},fragment:{module:r,entryPoint:"frag",targets:[{format:i}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:1}},u=t.createRenderPipeline(o),h=t.createSampler({magFilter:"linear",minFilter:"linear"}),f=[Ht,Ht,6],d=Pn(f),m=t.createTexture({size:f,mipLevelCount:d,format:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),_=t.createCommandEncoder();let g=t.createBindGroup({layout:n,entries:[{binding:0,resource:e.createView()},{binding:1,resource:h}]});const x=ut(t);for(let v=0;v<x.length;v++){const w={colorAttachments:[{view:m.createView({dimension:"2d",baseArrayLayer:v,arrayLayerCount:1,baseMipLevel:0,mipLevelCount:1}),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},k=_.beginRenderPass(w);k.setPipeline(u),k.setBindGroup(0,g),k.setBindGroup(1,x[v]),k.draw(3),k.end()}return t.queue.submit([_.finish()]),In(t,m),m}async function Kn(t,e){const r=t.createShaderModule({code:Q+jn}),n=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),s=t.createPipelineLayout({bindGroupLayouts:[n,Ve(t)]}),i="rgba16float",o={layout:s,vertex:{module:r,entryPoint:"vert",buffers:[]},fragment:{module:r,entryPoint:"frag",targets:[{format:i}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:1}},u=t.createRenderPipeline(o),h=t.createSampler({magFilter:"linear",minFilter:"linear"}),f=t.createTexture({size:[Xt,Xt,6],format:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=t.createCommandEncoder();let m=t.createBindGroup({layout:n,entries:[{binding:0,resource:e.createView({dimension:"cube"})},{binding:1,resource:h}]});const _=ut(t);for(let g=0;g<_.length;g++){const x={colorAttachments:[{view:f.createView({dimension:"2d",baseArrayLayer:g,arrayLayerCount:1}),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},v=d.beginRenderPass(x);v.setPipeline(u),v.setBindGroup(0,m),v.setBindGroup(1,_[g]),v.draw(3),v.end()}return t.queue.submit([d.finish()]),f}async function es(t,e){const r=t.createShaderModule({code:Q+Yn}),n=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),s=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{}}]}),i=t.createPipelineLayout({bindGroupLayouts:[n,Ve(t),s]}),o="rgba16float",u={layout:i,vertex:{module:r,entryPoint:"vert",buffers:[]},fragment:{module:r,entryPoint:"frag",targets:[{format:o}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:1}},h=t.createRenderPipeline(u),f=t.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"}),d=t.createTexture({size:[$t,$t,6],mipLevelCount:Ze,format:o,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=t.createCommandEncoder();let _=t.createBindGroup({layout:n,entries:[{binding:0,resource:e.createView({dimension:"cube"})},{binding:1,resource:f}]});const g=ut(t);for(let x=0;x<Ze;x++){const v=x/(Ze-1),w=t.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(w,0,new Float32Array([v]));let k=t.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:w}}]});for(let T=0;T<g.length;T++){const y={colorAttachments:[{view:d.createView({dimension:"2d",baseArrayLayer:T,arrayLayerCount:1,baseMipLevel:x,mipLevelCount:1}),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},b=m.beginRenderPass(y);b.setPipeline(h),b.setBindGroup(0,_),b.setBindGroup(1,g[T]),b.setBindGroup(2,k),b.draw(3),b.end()}}return t.queue.submit([m.finish()]),d}class ts{constructor(){I(this,"equirectangularTexture");I(this,"cubeMapTexture");I(this,"irradianceCubeMapTexture");I(this,"prefilterCubeMapTexture")}async init(e,r){const n=await Hn(r),s=e.createTexture({size:{width:n.width,height:n.height},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});this.equirectangularTexture=s,e.queue.writeTexture({texture:s},n.data.buffer,{bytesPerRow:8*n.width},{width:n.width,height:n.height}),this.cubeMapTexture=await Qn(e,s),this.irradianceCubeMapTexture=await Kn(e,this.cubeMapTexture),this.prefilterCubeMapTexture=await es(e,this.cubeMapTexture)}}const jt=`struct SimulationInfo {\r
    boundsSize: vec3f,\r
    fixedDeltaTime: f32,\r
    boundsCenter: vec3f,\r
    workgroupCount: u32,\r
    collisionResolveStepMultiplier: f32,\r
    boundsRotation: mat4x4f,\r
    boundsRotationInverse: mat4x4f,\r
}\r
\r
struct Body {\r
    position: vec3f,\r
    radius: f32,\r
    velocity: vec3f,\r
    restitution: f32,\r
    color: vec3f,\r
    mass: f32,\r
    metallic: f32,\r
    roughness: f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> simulationInfo: SimulationInfo;\r
@group(1) @binding(0) var<storage, read> bodies: array<Body>;\r
@group(2) @binding(0) var<storage, read_write> nextBodies: array<Body>;\r
\r
@compute @workgroup_size(64) fn applyVelocity(@builtin(global_invocation_id) id: vec3u) {\r
    let bodyIndex = id.x;\r
\r
    var body = bodies[bodyIndex];\r
    var nextBody = body;\r
\r
    nextBody.velocity.y -= 9.8 * simulationInfo.fixedDeltaTime;\r
\r
    nextBody.position += nextBody.velocity * simulationInfo.fixedDeltaTime;\r
\r
    nextBodies[bodyIndex] = nextBody;\r
}\r
\r
@compute @workgroup_size(64) fn handleCollisions(@builtin(global_invocation_id) id: vec3u) {\r
    let bodyIndex = id.x;\r
\r
    var body = bodies[bodyIndex];\r
    var nextBody = body;\r
\r
    for (var i = 0u; i < 64 * simulationInfo.workgroupCount; i++) {\r
        if (i != bodyIndex) {\r
            var otherBody = bodies[i];\r
            var toOther = otherBody.position - body.position;\r
            var distance = length(toOther);\r
            if (distance < body.radius + otherBody.radius) {\r
                var normal = toOther / distance;\r
                var relativeVelocity = otherBody.velocity - body.velocity;\r
                var velocityAlongNormal = dot(relativeVelocity, normal);\r
\r
                if (velocityAlongNormal <= 0) {\r
                    var restitution = min(body.restitution, otherBody.restitution);\r
\r
                    // calculate impulse scalar\r
                    var j = -(1 + restitution) * velocityAlongNormal;\r
                    j /= 1 / body.mass + 1 / otherBody.mass;\r
                    j /= 2;\r
\r
                    var impulse = normal * j;\r
                    nextBody.velocity -= impulse * (1 / body.mass) * simulationInfo.collisionResolveStepMultiplier;\r
                }\r
\r
                nextBody.position -= (toOther * ((body.radius + otherBody.radius) - distance) * 0.5) * simulationInfo.collisionResolveStepMultiplier;\r
            }\r
        }\r
    }\r
\r
    body = nextBody;\r
\r
    var boundsMin = -simulationInfo.boundsSize / 2;\r
    var boundsMax = simulationInfo.boundsSize / 2;\r
\r
    var bodyLocalPosition = (simulationInfo.boundsRotationInverse * vec4(body.position - simulationInfo.boundsCenter, 1)).xyz;\r
    var newBodyLocalPosition = bodyLocalPosition;\r
\r
    var bodyLocalVelocity = (simulationInfo.boundsRotationInverse * vec4(body.velocity, 1)).xyz;\r
    var newBodyLocalVelocity = bodyLocalVelocity;\r
\r
    for (var i = 0; i < 3; i++) {\r
        // lower bounds\r
        var distInLowerBounds = -(bodyLocalPosition[i] - body.radius - boundsMin[i]);\r
        var inLowerBounds = step(0, distInLowerBounds);\r
\r
        newBodyLocalPosition[i] += inLowerBounds * distInLowerBounds;\r
\r
        var newVelocityForLowerCollision = -newBodyLocalVelocity[i] * body.restitution;\r
        newBodyLocalVelocity[i] += inLowerBounds * (newVelocityForLowerCollision - newBodyLocalVelocity[i]);\r
\r
        // upper bounds\r
        var distInUpperBounds = bodyLocalPosition[i] + body.radius - boundsMax[i];\r
        var inUpperBounds = step(0, distInUpperBounds);\r
\r
        newBodyLocalPosition[i] -= inUpperBounds * distInUpperBounds;\r
\r
        var newVelocityForUpperCollision = -newBodyLocalVelocity[i] * body.restitution;\r
        newBodyLocalVelocity[i] += inUpperBounds * (newVelocityForUpperCollision - newBodyLocalVelocity[i]);\r
    }\r
\r
    nextBody.position = (simulationInfo.boundsRotation * vec4(newBodyLocalPosition, 1)).xyz + simulationInfo.boundsCenter;\r
    nextBody.velocity = (simulationInfo.boundsRotation * vec4(newBodyLocalVelocity, 1)).xyz;\r
\r
    nextBodies[bodyIndex] = nextBody;\r
}\r
\r
fn getGravityForce(position: vec3f, gravityPosition: vec3f) -> vec3f {\r
    var gravityForceDirection = gravityPosition - position;\r
    var gravityForceDirectionNormalized = normalize(gravityForceDirection);\r
    var distance = length(gravityForceDirection);\r
\r
    var force = gravityForceDirectionNormalized / (distance * distance);\r
\r
    return force;\r
}\r
`;class rs{constructor(e,r,n,s){I(this,"simulationInfoBuffer");I(this,"updateBounds");I(this,"compute");const i=e.createShaderModule({code:jt}),o=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{}}]}),u=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}}]}),h=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),f=e.createPipelineLayout({bindGroupLayouts:[o,u,h]}),d=e.createComputePipeline({layout:f,compute:{module:i,entryPoint:"applyVelocity"}}),m=e.createComputePipeline({layout:f,compute:{module:i,entryPoint:"handleCollisions"}}),_=Ne(jt),g=Be(_.uniforms.simulationInfo);this.simulationInfoBuffer=e.createBuffer({size:g.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let x=n/64;Number.isInteger(x)||(x=Math.ceil(x),console.log("Until I feel like looking into this, numObjects should probably be a multiple of the workgroup size.")),g.set({fixedDeltaTime:ye,workgroupCount:x,collisionResolveStepMultiplier:1/qt});const v=this.simulationInfoBuffer;this.updateBounds=()=>{const y=z();Pe(y,s.rotation),g.set({boundsSize:s.size,boundsCenter:s.center,boundsRotation:s.rotation,boundsRotationInverse:y}),e.queue.writeBuffer(v,0,g.arrayBuffer)},this.updateBounds();const w=e.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:this.simulationInfoBuffer}}]});r[0].bindGroups.push(e.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:r[0].buffer}}]})),r[0].bindGroups.push(e.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:r[0].buffer}}]})),r[1].bindGroups.push(e.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:r[1].buffer}}]})),r[1].bindGroups.push(e.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:r[1].buffer}}]}));function k(){[r[0],r[1]]=[r[1],r[0]]}function T(y){y.setBindGroup(1,r[0].bindGroups[1]),y.setBindGroup(2,r[1].bindGroups[2])}this.compute=(y,b)=>{y.setBindGroup(0,w);const S=z();Wt(S,S,Math.PI/180*-20*ye*b),_e(s.rotation,S,s.rotation),this.updateBounds();for(let E=0;E<b;E++){y.setPipeline(d),T(y),y.dispatchWorkgroups(x),k();for(let B=0;B<qt;B++)y.setPipeline(m),T(y),y.dispatchWorkgroups(x),k()}}}}const ns=`const PI = 3.14159265359;\r
\r
//struct VertexInput {\r
//    @builtin(instance_index) instanceIndex: u32,\r
//    @location(0) position: vec3f,\r
//    @location(1) normal: vec3f,\r
//}\r
//\r
//struct VertexOutput {\r
//    @builtin(position) position: vec4f,\r
//    @location(0) normal: vec3f,\r
//    @location(1) color: vec3f,\r
//}\r
\r
struct Body {\r
    position: vec3f,\r
    radius: f32,\r
    velocity: vec3f,\r
    restitution: f32,\r
    color: vec3f,\r
    mass: f32,\r
    metallic: f32,\r
    roughness: f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> cameraData: CameraData;\r
\r
@group(1) @binding(0) var textureSampler: sampler;\r
@group(1) @binding(1) var environmentIrradianceCubeMapTexture: texture_cube<f32>;\r
@group(1) @binding(2) var environmentPrefilterCubeMapTexture: texture_cube<f32>;\r
@group(1) @binding(3) var brdfLUT: texture_2d<f32>;\r
\r
@group(2) @binding(0) var<storage, read> bodies: array<Body>;\r
\r
struct VertexInput {\r
    @builtin(instance_index) instanceIndex: u32,\r
    @location(0) position: vec3f,\r
    @location(1) normal: vec3f,\r
    @location(2) uv: vec2f,\r
    @location(3) tangent: vec3f,\r
    @location(4) bitangent: vec3f,\r
}\r
\r
struct VertexOutput {\r
    @builtin(position) fragPosition: vec4f,\r
    @location(0) worldPosition: vec3f,\r
    @location(1) uv: vec2f,\r
    @location(2) tangnet: vec3f,\r
    @location(3) bitangent: vec3f,\r
    @location(4) normal: vec3f,\r
    @location(5) metallic: f32,\r
    @location(6) roughness: f32,\r
    @location(7) albedo: vec3f,\r
}\r
\r
@vertex\r
fn vert(i: VertexInput) -> VertexOutput {\r
    let body = bodies[i.instanceIndex];\r
\r
    var o: VertexOutput;\r
\r
    let worldPosition = vec4(i.position * 0.5 * body.radius * 2 + body.position, 1);\r
\r
    o.fragPosition = cameraData.projection * cameraData.view * worldPosition;\r
    o.worldPosition = worldPosition.xyz;\r
    o.uv = i.uv;\r
    o.tangnet = i.tangent;\r
    o.bitangent = i.bitangent;\r
    o.normal = i.normal;\r
    o.metallic = body.metallic;\r
    o.roughness = body.roughness;\r
    o.albedo = body.color;\r
\r
    return o;\r
}\r
\r
@fragment\r
fn frag(i: VertexOutput) -> @location(0) vec4f {\r
    const gamma: f32 = 2.2;\r
    const exposure: f32 = 1;\r
\r
//    let albedo = pow(textureSample(albedoTexture, textureSampler, i.uv).rgb, vec3(gamma));\r
//    let albedo: vec3f = vec3(0.5, 0, 0);\r
    let albedo = i.albedo;\r
\r
//    let emission = pow(textureSample(emissionTexture, textureSampler, i.uv).rgb, vec3(gamma));\r
    let emission: vec3f = vec3(0, 0, 0);\r
\r
//    let occlusionRoughnessMetalic = textureSample(occlusionRoughnessMetalicTexture, textureSampler, i.uv).rgb;\r
    let occlusionRoughnessMetalic: vec3f = vec3(1, i.roughness, i.metallic);\r
\r
    let TBN = mat3x3(i.tangnet, i.bitangent, i.normal);\r
//    let tangentSpaceNormal = textureSample(normalTexture, textureSampler, i.uv).rgb * 2 - 1;\r
    let tangentSpaceNormal: vec3f = vec3(0, 0, 1);\r
    let worldNormal = normalize(TBN * tangentSpaceNormal);\r
\r
    const lightPositions = array<vec3f, 4>(\r
        vec3f(-10, 10, 10),\r
        vec3f(10, 10, 10),\r
        vec3f(-10, -10, 10),\r
        vec3f(10, -10, 10)\r
    );\r
\r
    const lightColors = array<vec3f, 4>(\r
        vec3f(300, 300, 300),\r
        vec3f(300, 300, 300),\r
        vec3f(300, 300, 300),\r
        vec3f(300, 300, 300)\r
    );\r
\r
    let metallic = occlusionRoughnessMetalic.b;\r
    let roughness = occlusionRoughnessMetalic.g;\r
    let ao = occlusionRoughnessMetalic.r;\r
\r
    let N = worldNormal;\r
    let V = normalize(cameraData.position - i.worldPosition);\r
\r
    var F0 = vec3(0.04);\r
    F0 = mix(F0, albedo, metallic);\r
\r
    // reflectance equation\r
    var Lo = vec3(0.0);\r
    for (var n = 0; n < 0; n++)\r
    {\r
        // calculate per-light radiance\r
        let L = normalize(lightPositions[n] - i.worldPosition);\r
        let H = normalize(V + L);\r
        let distance = length(lightPositions[n] - i.worldPosition);\r
        let attenuation = 1.0 / (distance * distance);\r
        let radiance = lightColors[n] * attenuation;\r
\r
        // cook-torrance brdf\r
        let NDF = distributionGGX(N, H, roughness);\r
        let G = geometrySmith(N, V, L, roughness);\r
        let F = fresnelSchlick(max(dot(H, V), 0.0), F0);\r
\r
        let kS = F;\r
        var kD = vec3(1.0) - kS;\r
        kD *= 1.0 - metallic;\r
\r
        let numerator = NDF * G * F;\r
        let denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;\r
        let specular = numerator / denominator;\r
\r
        // add to outgoing radiance Lo\r
        let NdotL = max(dot(N, L), 0.0);\r
        Lo += (kD * albedo / PI + specular) * radiance * NdotL;\r
    }\r
\r
    let F = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);\r
\r
    let kS = F;\r
    var kD = 1.0 - kS;\r
    kD *= 1.0 - metallic;\r
\r
    let irradiance = textureSample(environmentIrradianceCubeMapTexture, textureSampler, worldNormal * vec3f(-1, 1, 1)).rgb;\r
    let diffuse = irradiance * albedo;\r
\r
    let R = reflect(-V, N);\r
\r
    const MAX_REFLECTION_LOD = 4.0;\r
    var prefilteredColor = textureSampleLevel(environmentPrefilterCubeMapTexture, textureSampler, R * vec3f(-1, 1, 1), roughness * MAX_REFLECTION_LOD).rgb;\r
    let envBRDF = textureSample(brdfLUT, textureSampler, vec2(max(dot(N, V), 0.0), roughness)).rg;\r
    let specular = prefilteredColor * (F * envBRDF.x + envBRDF.y);\r
\r
    let ambient = (kD * diffuse + specular) * ao;\r
\r
    var colorLinear = ambient + Lo + emission;\r
    colorLinear = vec3(1.0) - exp(-colorLinear * exposure);\r
\r
    let color = pow(colorLinear, vec3(1.0 / gamma));\r
    return vec4(color, 1);\r
}\r
\r
fn pow5(value: f32) -> f32 {\r
    let value2 = value * value;\r
    let value4 = value2 * value2;\r
    return value4 * value;\r
}\r
\r
fn fresnelSchlick(cosTheta: f32, F0: vec3f) -> vec3f {\r
    return F0 + (1.0 - F0) * pow5(clamp(1.0 - cosTheta, 0.0, 1.0));\r
}\r
\r
fn fresnelSchlickRoughness(cosTheta: f32, F0: vec3f, roughness: f32) -> vec3f {\r
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);\r
}\r
\r
fn distributionGGX(N: vec3f, H: vec3f, roughness: f32) -> f32 {\r
    let a = roughness * roughness;\r
    let a2 = a * a;\r
    let NdotH = max(dot(N, H), 0.0);\r
    let NdotH2 = NdotH * NdotH;\r
\r
    let num = a2;\r
    var denom = (NdotH2 * (a2 - 1.0) + 1.0);\r
    denom = PI * denom * denom;\r
\r
    return num / denom;\r
}\r
\r
fn geometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {\r
    let r = roughness + 1.0;\r
    let k = (r * r) / 8.0;\r
\r
    let num = NdotV;\r
    let denom = NdotV * (1.0 - k) + k;\r
\r
    return num / denom;\r
}\r
\r
fn geometrySmith(N: vec3f, V: vec3f, L: vec3f, roughness: f32) -> f32 {\r
    let NdotV = max(dot(N, V), 0.0);\r
    let NdotL = max(dot(N, L), 0.0);\r
    let ggx2 = geometrySchlickGGX(NdotV, roughness);\r
    let ggx1 = geometrySchlickGGX(NdotL, roughness);\r
\r
    return ggx1 * ggx2;\r
}\r
`,ss=`const PI = 3.14159265359;\r
\r
struct VertexInput {\r
    @builtin(vertex_index) vertexIndex: u32,\r
}\r
\r
struct VertexOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) uv: vec2f,\r
}\r
\r
@vertex\r
fn vert(i: VertexInput) -> VertexOutput {\r
    let positions = array<vec2f, 3>(\r
      vec2f(-1, -1),\r
      vec2f(3, -1),\r
      vec2f(-1, 3),\r
    );\r
    let uvs = array<vec2f, 3>(\r
      vec2f(0, 1),\r
      vec2f(2, 1),\r
      vec2f(0, -1),\r
    );\r
\r
    var o: VertexOutput;\r
\r
    o.position = vec4(positions[i.vertexIndex], 0, 1);\r
    o.uv = uvs[i.vertexIndex];\r
\r
    return o;\r
}\r
\r
@fragment\r
fn frag(i: VertexOutput) -> @location(0) vec4f {\r
    return vec4(integrateBRDF(i.uv.x, i.uv.y), 0, 1);\r
}\r
\r
fn integrateBRDF(NdotV: f32, roughness: f32) -> vec2f {\r
    var V: vec3f;\r
    V.x = sqrt(1.0 - NdotV * NdotV);\r
    V.y = 0.0;\r
    V.z = NdotV;\r
\r
    var A = 0.0;\r
    var B = 0.0;\r
\r
    var N = vec3(0.0, 0.0, 1.0);\r
\r
    const SAMPLE_COUNT: u32 = 1024;\r
    for(var i: u32 = 0; i < SAMPLE_COUNT; i++)\r
    {\r
        let Xi = hammersley(i, SAMPLE_COUNT);\r
        let H = importanceSampleGGX(Xi, N, roughness);\r
        let L = normalize(2.0 * dot(V, H) * H - V);\r
\r
        let NdotL = max(L.z, 0.0);\r
        let NdotH = max(H.z, 0.0);\r
        let VdotH = max(dot(V, H), 0.0);\r
\r
        if(NdotL > 0.0)\r
        {\r
            let G = geometrySmith(N, V, L, roughness);\r
            let G_Vis = (G * VdotH) / (NdotH * NdotV);\r
            let Fc = pow(1.0 - VdotH, 5.0);\r
\r
            A += (1.0 - Fc) * G_Vis;\r
            B += Fc * G_Vis;\r
        }\r
    }\r
    A /= f32(SAMPLE_COUNT);\r
    B /= f32(SAMPLE_COUNT);\r
    return vec2(A, B);\r
}\r
\r
fn radicalInverse_VdC(bits: u32) -> f32 {\r
    var bitsOut = bits;\r
    bitsOut = (bitsOut << 16u) | (bitsOut >> 16u);\r
    bitsOut = ((bitsOut & 0x55555555u) << 1u) | ((bitsOut & 0xAAAAAAAAu) >> 1u);\r
    bitsOut = ((bitsOut & 0x33333333u) << 2u) | ((bitsOut & 0xCCCCCCCCu) >> 2u);\r
    bitsOut = ((bitsOut & 0x0F0F0F0Fu) << 4u) | ((bitsOut & 0xF0F0F0F0u) >> 4u);\r
    bitsOut = ((bitsOut & 0x00FF00FFu) << 8u) | ((bitsOut & 0xFF00FF00u) >> 8u);\r
    return f32(bitsOut) * 2.3283064365386963e-10; // / 0x100000000\r
}\r
\r
fn hammersley(i: u32, N: u32) -> vec2f {\r
    return vec2(f32(i) / f32(N), radicalInverse_VdC(i));\r
}\r
\r
fn importanceSampleGGX(Xi: vec2f, N: vec3f, roughness: f32) -> vec3f{\r
    let a = roughness * roughness;\r
\r
    let phi = 2.0 * PI * Xi.x;\r
    let cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));\r
    let sinTheta = sqrt(1.0 - cosTheta * cosTheta);\r
\r
    // from spherical coordinates to cartesian coordinates\r
    var H: vec3f;\r
    H.x = cos(phi) * sinTheta;\r
    H.y = sin(phi) * sinTheta;\r
    H.z = cosTheta;\r
\r
    // from tangent-space vector to world-space sample vector\r
    let up = select(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), abs(N.z) < 0.999);\r
    let tangent = normalize(cross(up, N));\r
    let bitangent = cross(N, tangent);\r
\r
    let sampleVec = tangent * H.x + bitangent * H.y + N * H.z;\r
    return normalize(sampleVec);\r
}\r
\r
fn geometrySmith(N: vec3f, V: vec3f, L: vec3f, roughness: f32) -> f32 {\r
    let NdotV = max(dot(N, V), 0.0);\r
    let NdotL = max(dot(N, L), 0.0);\r
    let ggx2 = geometrySchlickGGXForBRDF(NdotV, roughness);\r
    let ggx1 = geometrySchlickGGXForBRDF(NdotL, roughness);\r
\r
    return ggx1 * ggx2;\r
}\r
\r
fn geometrySchlickGGXForBRDF(NdotV: f32, roughness: f32) -> f32 {\r
  let a = roughness;\r
  let k = (a * a) / 2.0;\r
\r
  let num = NdotV;\r
  let denom = NdotV * (1.0 - k) + k;\r
\r
  return num / denom;\r
}\r
`;function is(t){const e="rgba16float",r=t.createTexture({size:[512,512],format:e,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),n=t.createShaderModule({code:ss}),i={layout:t.createPipelineLayout({bindGroupLayouts:[]}),vertex:{module:n,entryPoint:"vert",buffers:[]},fragment:{module:n,entryPoint:"frag",targets:[{format:e}]},primitive:{topology:"triangle-list",cullMode:"none"}},o=t.createRenderPipeline(i),u={colorAttachments:[{view:r.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},h=new st(t,u),f=t.createCommandEncoder(),d=f.beginRenderPass(u);return d.setPipeline(o),d.draw(3),d.end(),h.storeTime(f),t.queue.submit([f.finish()]),h.recordTime(),r}class as{constructor(){I(this,"positionBufferBundles",[]);I(this,"render",()=>{});I(this,"fixedUpdate",()=>{})}async init(e,r,n,s,i){let o=new ArrayBuffer(s*16*4),u=new Float32Array(o);const h=10,f=Math.ceil(s/(h*h)),d=1.5,m=[];for(let A=h-1;A>=0;A--)for(let C=0;C<f;C++)for(let q=0;q<h&&m.length!=s;q++)m.push([q*d-h*d/2+Math.random()*.01,C*d+0+Math.random()*.01,A*d-h*d/2+Math.random()*.01]);Nr(m);for(let A=0;A<s;A++){u[A*16]=m[A][0],u[A*16+1]=m[A][1],u[A*16+2]=m[A][2],u[A*16+4+1]=-10,u[A*16+8]=Math.random()*.8+.2,u[A*16+8+1]=Math.random()*.8+.2,u[A*16+8+2]=Math.random()*.8+.2;const C=.5+Math.random();u[A*16+3]=C,u[A*16+7]=0,u[A*16+11]=4/3*Math.PI*(C*C*C),u[A*16+12]=Math.random(),u[A*16+13]=Math.random()}const _=e.createShaderModule({code:Q+ns}),g=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{}}]}),x=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{}}]}),v=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]});for(let A=0;A<2;A++){const C=e.createBuffer({size:o.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),q=e.createBindGroup({layout:v,entries:[{binding:0,resource:{buffer:C}}]});this.positionBufferBundles.push({buffer:C,bindGroups:[q]})}e.queue.writeBuffer(this.positionBufferBundles[0].buffer,0,o);const w=e.createPipelineLayout({bindGroupLayouts:[g,x,v]}),{vertices:k,indices:T,uvs:y,normals:b,tangents:S,bitangents:E}=await Gr("sphere.glb"),B=Z(e,k,GPUBufferUsage.VERTEX),F=Z(e,T,GPUBufferUsage.INDEX),U=Z(e,y,GPUBufferUsage.VERTEX),$=Z(e,b,GPUBufferUsage.VERTEX),O=Z(e,S,GPUBufferUsage.VERTEX),D=Z(e,E,GPUBufferUsage.VERTEX),j={layout:w,vertex:{module:_,entryPoint:"vert",buffers:[{arrayStride:3*4,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},{arrayStride:3*4,attributes:[{shaderLocation:1,offset:0,format:"float32x3"}]},{arrayStride:2*4,attributes:[{shaderLocation:2,offset:0,format:"float32x2"}]},{arrayStride:3*4,attributes:[{shaderLocation:3,offset:0,format:"float32x3"}]},{arrayStride:3*4,attributes:[{shaderLocation:4,offset:0,format:"float32x3"}]}]},fragment:{module:_,entryPoint:"frag",targets:[{format:r}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:we},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"}},P=e.createRenderPipeline(j),ze=e.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"}),xe=e.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:n}}]});let he=is(e),K=e.createBindGroup({layout:x,entries:[{binding:0,resource:ze},{binding:1,resource:i.irradianceCubeMapTexture.createView({dimension:"cube"})},{binding:2,resource:i.prefilterCubeMapTexture.createView({dimension:"cube"})},{binding:3,resource:he.createView()}]});this.render=A=>{A.setPipeline(P),A.setBindGroup(0,xe),A.setBindGroup(1,K),A.setBindGroup(2,this.positionBufferBundles[0].bindGroups[0]),A.setVertexBuffer(0,B),A.setVertexBuffer(1,$),A.setVertexBuffer(2,U),A.setVertexBuffer(3,O),A.setVertexBuffer(4,D),A.setIndexBuffer(F,"uint32"),A.drawIndexed(T.length,s)}}}const os=`struct SimulationInfo {\r
    boundsSize: vec3f,\r
    fixedDeltaTime: f32,\r
    boundsCenter: vec3f,\r
    workgroupCount: u32,\r
    collisionResolveStepMultiplier: f32,\r
    boundsRotation: mat4x4f,\r
    boundsRotationInverse: mat4x4f,\r
}\r
\r
@group(0) @binding(0) var<uniform> cameraData: CameraData;\r
@group(0) @binding(1) var<uniform> simulationInfo: SimulationInfo;\r
\r
struct VertexInput {\r
    @location(0) position: vec3f,\r
}\r
\r
struct VertexOutput {\r
    @builtin(position) position: vec4f,\r
}\r
\r
@vertex\r
fn vert(i: VertexInput) -> VertexOutput {\r
    var o: VertexOutput;\r
\r
    o.position = cameraData.projection * cameraData.view * (simulationInfo.boundsRotation * vec4(i.position * simulationInfo.boundsSize, 1) + vec4(simulationInfo.boundsCenter, 0));\r
\r
    return o;\r
}\r
\r
@fragment\r
fn frag(i: VertexOutput) -> @location(0) vec4f {\r
    return vec4(1, 1, 1, 1);\r
}\r
`;class us{constructor(e,r,n,s){I(this,"render");const i=e.createShaderModule({code:Q+os}),o=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{}}]}),u=e.createPipelineLayout({bindGroupLayouts:[o]}),h=new Float32Array([-.5,.5,.5,-.5,.5,-.5,.5,.5,-.5,.5,.5,.5,-.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5]),f=new Uint32Array([0,1,1,2,2,3,3,0,0,4,1,5,2,6,3,7,4,5,5,6,6,7,7,4]),d=Z(e,h,GPUBufferUsage.VERTEX),m=Z(e,f,GPUBufferUsage.INDEX),_={layout:u,vertex:{module:i,entryPoint:"vert",buffers:[{arrayStride:3*4,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},fragment:{module:i,entryPoint:"frag",targets:[{format:r}]},primitive:{topology:"line-list",cullMode:"none"},multisample:{count:we},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"}},g=e.createRenderPipeline(_);let x=e.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:n}},{binding:1,resource:{buffer:s}}]});this.render=v=>{v.setPipeline(g),v.setBindGroup(0,x),v.setVertexBuffer(0,d),v.setIndexBuffer(m,"uint32"),v.drawIndexed(f.length)}}}async function cs(){const{gpu:t,device:e,optionalFeatures:r}=await Ir(),n=document.querySelector("canvas");if(n===null){console.log("no canvas");return}const s=n.getContext("webgpu");if(s===null){console.log("webgpu context was null");return}ht();const i=t.getPreferredCanvasFormat();s.configure({device:e,format:i,alphaMode:"opaque"});const o=[],u=[],h=[],f=[];let d=z(),m=z(),_=ge(),g=G(0,0,0),x=0,v=z(),w=ge(),k=G(0,0,0),T=z(),y=ge(),b=G(0,0,75),S=z(),E=z(),B=Zt(),F=it();function U(){Jt(d,Math.PI/180*90,n.width/n.height,.01,1e3),qe(m,_,g),qe(v,w,k),qe(T,y,b),_e(T,v,T),_e(T,m,T),B[0]=0,B[1]=0,B[2]=0,B[3]=1,Er(B,B,T),F[0]=B[0],F[1]=B[1],F[2]=B[2],Pe(S,T),Yt(E,S),E[12]=0,E[13]=0,E[14]=0,_e(E,d,E),Pe(E,E)}U();const $=Ne(Q),O=Be($.structs.CameraData),D=e.createBuffer({size:O.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),j=Ne(mr),P=Be(j.uniforms.timeData),ze=e.createBuffer({size:P.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});function xe(){O.set({view:S,projection:d,position:F,viewDirectionProjectionInverse:E}),e.queue.writeBuffer(D,0,O.arrayBuffer)}xe();const he=new ts;await he.init(e,"newport_loft.hdr");const K=z();Wt(K,K,-(Math.PI/180*45)/2),vr(K,K,-(Math.PI/180*45)/2);const A={size:[50,50,50],center:[0,0,0],rotation:K},C=64*20,q=new as;await q.init(e,i,D,C,he),f.push(q.fixedUpdate),o.push(q.render);const ct=new rs(e,q.positionBufferBundles,C,A);u.push(ct.compute);const lr=new us(e,i,D,ct.simulationInfoBuffer);o.push(lr.render);const lt=new Ln;await lt.init(e,i,he.irradianceCubeMapTexture,D),o.push(lt.render);function ht(){const V=Math.max(1,Math.min(e.limits.maxTextureDimension2D,n.clientWidth)),de=Math.max(1,Math.min(e.limits.maxTextureDimension2D,n.clientHeight)),se=V!==n.width||de!==n.height;return se&&(n.width=V,n.height=de),se}function hr(){ht()&&(dt(),pt(),U())}const fe={colorAttachments:[{clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},Le=new st(e,fe),ft={},Fe=new st(e,ft);let be;function dt(){be&&be.destroy(),be=e.createTexture({size:[n.width,n.height],format:"depth24plus",sampleCount:we,usage:GPUTextureUsage.RENDER_ATTACHMENT}),fe.depthStencilAttachment.view=be.createView()}dt();let ke;function pt(){ke&&ke.destroy(),ke=e.createTexture({format:i,usage:GPUTextureUsage.RENDER_ATTACHMENT,size:[n.width,n.height],sampleCount:we}),fe.colorAttachments[0].view=ke.createView()}pt();let Ue=0,Ce=0,mt=0,_t=0;document.addEventListener("mousemove",V=>{Ue=V.clientX,Ce=V.clientY});let De=!1;document.addEventListener("mousedown",V=>{V.button===0?De=!0:V.button}),document.addEventListener("mouseup",V=>{V.button===0?De=!1:V.button}),document.addEventListener("wheel",V=>{b[2]=Pt(b[2]*(1+V.deltaY/(500/1.5)),10,150),U()});const fr=document.getElementById("info");let gt=new nt,yt=new nt;const vt=z();let wt=0,Oe=!1,xt=0,Re=0;async function bt(V){const de=performance.now();V*=.001;const se=V-xt,ee=Math.min(se,Vn);Re+=ee;let kt=mt-Ue,Tt=_t-Ce;wt+=ee;const St=ee/se;St!==1?(Oe=!0,console.log(`simulation running at ${Math.round(St*1e3)/10}% normal speed.`)):Oe&&(Oe=!1,console.log("simulation running at 100% normal speed.")),hr(),(kt!==0||Tt!==0)&&De&&(Mr(_,_,Math.PI/180*kt*.5),x=Pt(x+Tt*.5,-89.9,89.9),Br(w,x,0,0),U());let Et=0;for(;Re>=ye;)Et++,f.forEach(J=>{J(ye)}),Re-=ye;P.set({deltaTime:Math.min(ee,.01)}),e.queue.writeBuffer(ze,0,P.arrayBuffer),wr(vt,vt,Math.PI/180*ee*10),xe();const ie=e.createCommandEncoder();fe.colorAttachments[0].resolveTarget=s.getCurrentTexture().createView(),h.forEach(J=>{J(ie)});const At=ie.beginRenderPass(fe);o.forEach(J=>{J(At)}),At.end(),Le.storeTime(ie);const Mt=ie.beginComputePass(ft);u.forEach(J=>{J(Mt,Et,wt)}),Mt.end(),Fe.storeTime(ie),e.queue.submit([ie.finish()]),Le.recordTime(),Fe.recordTime(),xt=V,mt=Ue,_t=Ce,gt.addSample(1/ee),yt.addSample(performance.now()-de),fr.innerHTML=`
    fps: ${gt.average().toFixed(0)}
    <br/>js:&nbsp; ${yt.average().toFixed(2)}ms
    ${r.canTimestamp?`<br/>render: ${Le.averageMS().toFixed(2)}ms`:""}
    ${r.canTimestamp?`<br/>compute: ${Fe.averageMS().toFixed(2)}ms`:""}
    `,requestAnimationFrame(bt)}requestAnimationFrame(bt)}window.onload=()=>{cs().then()};
