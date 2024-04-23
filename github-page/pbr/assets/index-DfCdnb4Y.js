var dr=Object.defineProperty;var _r=(t,e,r)=>e in t?dr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var V=(t,e,r)=>(_r(t,typeof e!="symbol"?e+"":e,r),r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function r(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=r(s);fetch(s.href,i)}})();const ae=`struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
    position: vec3f,
    viewDirectionProjectionInverse: mat4x4f,
}
`,gr=`struct TimeData {\r
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
    velocities[i] += getGravityForce(vec3(0.05, -0.05, -1.5), id) * timeData.deltaTime;\r
    velocities[i] += getGravityForce(vec3(-0.02, -0.04, -1), id) * timeData.deltaTime;\r
    velocities[i] += getGravityForce(vec3(0.03, 0.01, -0.5), id) * timeData.deltaTime;\r
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
}`;var Ie=1e-6,D=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)});function yr(){var t=new D(9);return D!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function U(){var t=new D(16);return D!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function $t(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function vr(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function wr(t,e){if(t===e){var r=e[1],n=e[2],s=e[3],i=e[6],a=e[7],u=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=r,t[6]=e[9],t[7]=e[13],t[8]=n,t[9]=i,t[11]=e[14],t[12]=s,t[13]=a,t[14]=u}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t}function Be(t,e){var r=e[0],n=e[1],s=e[2],i=e[3],a=e[4],u=e[5],h=e[6],m=e[7],f=e[8],d=e[9],g=e[10],_=e[11],k=e[12],v=e[13],y=e[14],T=e[15],x=r*u-n*a,b=r*h-s*a,w=r*m-i*a,S=n*h-s*u,A=n*m-i*u,L=s*m-i*h,I=f*v-d*k,C=f*y-g*k,q=f*T-_*k,O=d*y-g*v,X=d*T-_*v,R=g*T-_*y,N=x*R-b*X+w*O+S*q-A*C+L*I;return N?(N=1/N,t[0]=(u*R-h*X+m*O)*N,t[1]=(s*X-n*R-i*O)*N,t[2]=(v*L-y*A+T*S)*N,t[3]=(g*A-d*L-_*S)*N,t[4]=(h*q-a*R-m*C)*N,t[5]=(r*R-s*q+i*C)*N,t[6]=(y*w-k*L-T*b)*N,t[7]=(f*L-g*w+_*b)*N,t[8]=(a*X-u*q+m*I)*N,t[9]=(n*q-r*X-i*I)*N,t[10]=(k*A-v*w+T*x)*N,t[11]=(d*w-f*A-_*x)*N,t[12]=(u*C-a*O-h*I)*N,t[13]=(r*O-n*C+s*I)*N,t[14]=(v*b-k*S-y*x)*N,t[15]=(f*S-d*b+g*x)*N,t):null}function xr(t,e,r){var n=e[0],s=e[1],i=e[2],a=e[3],u=e[4],h=e[5],m=e[6],f=e[7],d=e[8],g=e[9],_=e[10],k=e[11],v=e[12],y=e[13],T=e[14],x=e[15],b=r[0],w=r[1],S=r[2],A=r[3];return t[0]=b*n+w*u+S*d+A*v,t[1]=b*s+w*h+S*g+A*y,t[2]=b*i+w*m+S*_+A*T,t[3]=b*a+w*f+S*k+A*x,b=r[4],w=r[5],S=r[6],A=r[7],t[4]=b*n+w*u+S*d+A*v,t[5]=b*s+w*h+S*g+A*y,t[6]=b*i+w*m+S*_+A*T,t[7]=b*a+w*f+S*k+A*x,b=r[8],w=r[9],S=r[10],A=r[11],t[8]=b*n+w*u+S*d+A*v,t[9]=b*s+w*h+S*g+A*y,t[10]=b*i+w*m+S*_+A*T,t[11]=b*a+w*f+S*k+A*x,b=r[12],w=r[13],S=r[14],A=r[15],t[12]=b*n+w*u+S*d+A*v,t[13]=b*s+w*h+S*g+A*y,t[14]=b*i+w*m+S*_+A*T,t[15]=b*a+w*f+S*k+A*x,t}function br(t,e,r){var n=Math.sin(r),s=Math.cos(r),i=e[0],a=e[1],u=e[2],h=e[3],m=e[8],f=e[9],d=e[10],g=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=i*s-m*n,t[1]=a*s-f*n,t[2]=u*s-d*n,t[3]=h*s-g*n,t[8]=i*n+m*s,t[9]=a*n+f*s,t[10]=u*n+d*s,t[11]=h*n+g*s,t}function Qe(t,e,r){var n=e[0],s=e[1],i=e[2],a=e[3],u=n+n,h=s+s,m=i+i,f=n*u,d=n*h,g=n*m,_=s*h,k=s*m,v=i*m,y=a*u,T=a*h,x=a*m;return t[0]=1-(_+v),t[1]=d+x,t[2]=g-T,t[3]=0,t[4]=d-x,t[5]=1-(f+v),t[6]=k+y,t[7]=0,t[8]=g+T,t[9]=k-y,t[10]=1-(f+_),t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function kr(t,e,r,n){var s=e[0],i=e[1],a=e[2],u=e[3],h=s+s,m=i+i,f=a+a,d=s*h,g=s*m,_=s*f,k=i*m,v=i*f,y=a*f,T=u*h,x=u*m,b=u*f,w=n[0],S=n[1],A=n[2];return t[0]=(1-(k+y))*w,t[1]=(g+b)*w,t[2]=(_-x)*w,t[3]=0,t[4]=(g-b)*S,t[5]=(1-(d+y))*S,t[6]=(v+T)*S,t[7]=0,t[8]=(_+x)*A,t[9]=(v-T)*A,t[10]=(1-(d+k))*A,t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function Yt(t,e,r,n,s){var i=1/Math.tan(e/2),a;return t[0]=i/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,s!=null&&s!==1/0?(a=1/(n-s),t[10]=s*a,t[14]=s*n*a):(t[10]=-1,t[14]=-n),t}function he(t,e,r,n){var s,i,a,u,h,m,f,d,g,_,k=e[0],v=e[1],y=e[2],T=n[0],x=n[1],b=n[2],w=r[0],S=r[1],A=r[2];return Math.abs(k-w)<Ie&&Math.abs(v-S)<Ie&&Math.abs(y-A)<Ie?vr(t):(f=k-w,d=v-S,g=y-A,_=1/Math.hypot(f,d,g),f*=_,d*=_,g*=_,s=x*g-b*d,i=b*f-T*g,a=T*d-x*f,_=Math.hypot(s,i,a),_?(_=1/_,s*=_,i*=_,a*=_):(s=0,i=0,a=0),u=d*a-g*i,h=g*s-f*a,m=f*i-d*s,_=Math.hypot(u,h,m),_?(_=1/_,u*=_,h*=_,m*=_):(u=0,h=0,m=0),t[0]=s,t[1]=u,t[2]=f,t[3]=0,t[4]=i,t[5]=h,t[6]=d,t[7]=0,t[8]=a,t[9]=m,t[10]=g,t[11]=0,t[12]=-(s*k+i*v+a*y),t[13]=-(u*k+h*v+m*y),t[14]=-(f*k+d*v+g*y),t[15]=1,t)}var Ve=xr;function B(){var t=new D(3);return D!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function Tr(t){var e=t[0],r=t[1],n=t[2];return Math.hypot(e,r,n)}function M(t,e,r){var n=new D(3);return n[0]=t,n[1]=e,n[2]=r,n}function H(t,e,r,n){return t[0]=e,t[1]=r,t[2]=n,t}function Sr(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t}function Te(t,e){var r=e[0],n=e[1],s=e[2],i=r*r+n*n+s*s;return i>0&&(i=1/Math.sqrt(i)),t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t}function Ar(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function Ue(t,e,r){var n=e[0],s=e[1],i=e[2],a=r[0],u=r[1],h=r[2];return t[0]=s*h-i*u,t[1]=i*a-n*h,t[2]=n*u-s*a,t}var De=Sr,Er=Tr;(function(){var t=B();return function(e,r,n,s,i,a){var u,h;for(r||(r=3),n||(n=0),s?h=Math.min(s*r+n,e.length):h=e.length,u=n;u<h;u+=r)t[0]=e[u],t[1]=e[u+1],t[2]=e[u+2],i(t,t,a),e[u]=t[0],e[u+1]=t[1],e[u+2]=t[2];return e}})();function Wt(){var t=new D(4);return D!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function Mr(t,e){var r=e[0],n=e[1],s=e[2],i=e[3],a=r*r+n*n+s*s+i*i;return a>0&&(a=1/Math.sqrt(a)),t[0]=r*a,t[1]=n*a,t[2]=s*a,t[3]=i*a,t}function Nr(t,e,r){var n=e[0],s=e[1],i=e[2],a=e[3];return t[0]=r[0]*n+r[4]*s+r[8]*i+r[12]*a,t[1]=r[1]*n+r[5]*s+r[9]*i+r[13]*a,t[2]=r[2]*n+r[6]*s+r[10]*i+r[14]*a,t[3]=r[3]*n+r[7]*s+r[11]*i+r[15]*a,t}(function(){var t=Wt();return function(e,r,n,s,i,a){var u,h;for(r||(r=4),n||(n=0),s?h=Math.min(s*r+n,e.length):h=e.length,u=n;u<h;u+=r)t[0]=e[u],t[1]=e[u+1],t[2]=e[u+2],t[3]=e[u+3],i(t,t,a),e[u]=t[0],e[u+1]=t[1],e[u+2]=t[2],e[u+3]=t[3];return e}})();function de(){var t=new D(4);return D!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function Pr(t,e,r){r=r*.5;var n=Math.sin(r);return t[0]=n*e[0],t[1]=n*e[1],t[2]=n*e[2],t[3]=Math.cos(r),t}function Jt(t,e,r){r*=.5;var n=e[0],s=e[1],i=e[2],a=e[3],u=Math.sin(r),h=Math.cos(r);return t[0]=n*h-i*u,t[1]=s*h+a*u,t[2]=i*h+n*u,t[3]=a*h-s*u,t}function Ze(t,e,r,n){var s=e[0],i=e[1],a=e[2],u=e[3],h=r[0],m=r[1],f=r[2],d=r[3],g,_,k,v,y;return _=s*h+i*m+a*f+u*d,_<0&&(_=-_,h=-h,m=-m,f=-f,d=-d),1-_>Ie?(g=Math.acos(_),k=Math.sin(g),v=Math.sin((1-n)*g)/k,y=Math.sin(n*g)/k):(v=1-n,y=n),t[0]=v*s+y*h,t[1]=v*i+y*m,t[2]=v*a+y*f,t[3]=v*u+y*d,t}function zr(t,e){var r=e[0]+e[4]+e[8],n;if(r>0)n=Math.sqrt(r+1),t[3]=.5*n,n=.5/n,t[0]=(e[5]-e[7])*n,t[1]=(e[6]-e[2])*n,t[2]=(e[1]-e[3])*n;else{var s=0;e[4]>e[0]&&(s=1),e[8]>e[s*3+s]&&(s=2);var i=(s+1)%3,a=(s+2)%3;n=Math.sqrt(e[s*3+s]-e[i*3+i]-e[a*3+a]+1),t[s]=.5*n,n=.5/n,t[3]=(e[i*3+a]-e[a*3+i])*n,t[i]=(e[i*3+s]+e[s*3+i])*n,t[a]=(e[a*3+s]+e[s*3+a])*n}return t}function Gr(t,e,r,n){var s=.5*Math.PI/180;e*=s,r*=s,n*=s;var i=Math.sin(e),a=Math.cos(e),u=Math.sin(r),h=Math.cos(r),m=Math.sin(n),f=Math.cos(n);return t[0]=i*h*f-a*u*m,t[1]=a*u*f+i*h*m,t[2]=a*h*m-i*u*f,t[3]=a*h*f+i*u*m,t}var Qt=Mr;(function(){var t=B(),e=M(1,0,0),r=M(0,1,0);return function(n,s,i){var a=Ar(s,i);return a<-.999999?(Ue(t,e,s),Er(t)<1e-6&&Ue(t,r,s),Te(t,t),Pr(n,t,Math.PI),n):a>.999999?(n[0]=0,n[1]=0,n[2]=0,n[3]=1,n):(Ue(t,s,i),n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=1+a,Qt(n,n))}})();(function(){var t=de(),e=de();return function(r,n,s,i,a,u){return Ze(t,n,a,u),Ze(e,s,i,u),Ze(r,t,e,2*u*(1-u)),r}})();(function(){var t=yr();return function(e,r,n,s){return t[0]=n[0],t[3]=n[1],t[6]=n[2],t[1]=s[0],t[4]=s[1],t[7]=s[2],t[2]=-r[0],t[5]=-r[1],t[8]=-r[2],Qt(e,zr(e,t))}})();function pe(){var t=new D(2);return D!=Float32Array&&(t[0]=0,t[1]=0),t}function Ke(t,e,r){return t[0]=e,t[1]=r,t}function Fr(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t}var Nt=Fr;(function(){var t=pe();return function(e,r,n,s,i,a){var u,h;for(r||(r=2),n||(n=0),s?h=Math.min(s*r+n,e.length):h=e.length,u=n;u<h;u+=r)t[0]=e[u],t[1]=e[u+1],i(t,t,a),e[u]=t[0],e[u+1]=t[1];return e}})();const Ir=Math.PI/180;async function Vr(){const t=navigator.gpu;if(!t)throw console.log("browser does not support WebGPU"),alert("browser does not support WebGPU"),new Error("browser does not support WebGPU");const e=await(t==null?void 0:t.requestAdapter({powerPreference:"high-performance"}));if(!e)throw console.log("browser does not support WebGPU"),alert("browser does not support WebGPU"),new Error("browser does not support WebGPU");const r=[],n=e.features.has("timestamp-query");n&&r.push("timestamp-query");const s=await e.requestDevice({requiredFeatures:r});if(!s)throw console.log("browser does not support WebGPU"),alert("browser does not support WebGPU"),new Error("browser does not support WebGPU");return{gpu:t,device:s,optionalFeatures:{canTimestamp:n}}}function fe(t,e,r){const n=t.createBuffer({size:e.byteLength,usage:r,mappedAtCreation:!0}),s=n.getMappedRange();return e instanceof ArrayBuffer?new Uint8Array(s).set(new Uint8Array(e)):new e.constructor(s).set(e),n.unmap(),n}async function Ur(t){const e=await assimpjs();let r=[t];const n=await new Promise((_,k)=>{Promise.all(r.map(v=>fetch(v))).then(v=>Promise.all(v.map(y=>y.arrayBuffer()))).then(v=>{let y=new e.FileList;for(let S=0;S<r.length;S++)y.AddFile(r[S],new Uint8Array(v[S]));let T=e.ConvertFileList(y,"assjson");if(!T.IsSuccess()||T.FileCount()==0){console.log(T.GetErrorCode()),k(T.GetErrorCode());return}let x=T.GetFile(0),b=new TextDecoder().decode(x.GetContent()),w=JSON.parse(b);_(w)})});let s=n.meshes[0];const i=Float32Array.from(s.vertices),a=Float32Array.from(s.normals);let u;s.texturecoords.length>1&&(console.log("mesh has multiple sets of texturecoords"),console.log(s.texturecoords)),s.texturecoords.length>0&&(u=Float32Array.from(s.texturecoords[0]));const h=Uint32Array.from(s.faces.flat());let m=n.textures,f=[];if(m)for(let _=0;_<m.length;_++){const k=m[_];f.push(`data:image/${k.formathint};base64,${k.data}`)}let d;s.tangents&&(d=new Float32Array(s.tangents));let g;return s.bitangents&&(g=new Float32Array(s.bitangents)),{vertices:i,indices:h,normals:a,uvs:u,textureURIs:f,tangents:d,bitangents:g}}function ot(t,e,r){return Math.min(Math.max(t,e),r)}function Lr(t,e){if(e.length%3!==0)throw new Error(`calculateNormals indices length ${e.length} should be a multiple of 3`);const r=B(),n=B(),s=B(),i=B(),a=B(),u=B(),h=new Float32Array(t.length);for(let m=0;m<e.length/3;m++){const f=e[m*3];H(s,t[f*3],t[f*3+1],t[f*3+2]);const d=e[m*3+1];H(i,t[d*3],t[d*3+1],t[d*3+2]);const g=e[m*3+2];H(a,t[g*3],t[g*3+1],t[g*3+2]),De(r,i,s),De(n,a,s),Ue(u,r,n),Te(u,u),h[f*3]+=u[0],h[f*3+1]+=u[1],h[f*3+2]+=u[2],h[d*3]+=u[0],h[d*3+1]+=u[1],h[d*3+2]+=u[2],h[g*3]+=u[0],h[g*3+1]+=u[1],h[g*3+2]+=u[2]}for(let m=0;m<h.length/3;m++){const f=m*3;H(u,h[f],h[f+1],h[f+2]),Te(u,u),h[f]=u[0],h[f+1]=u[1],h[f+2]=u[2]}return h}function Br(t,e,r){if(e.length%3!==0)throw new Error(`calculateTangents indices length ${e.length} should be a multiple of 3`);const n=B(),s=B(),i=pe(),a=pe(),u=B(),h=B(),m=B(),f=pe(),d=pe(),g=pe(),_=B(),k=B(),v=new Float32Array(t.length),y=new Float32Array(t.length);for(let T=0;T<e.length/3;T++){const x=e[T*3];H(u,t[x*3],t[x*3+1],t[x*3+2]);const b=e[T*3+1];H(h,t[b*3],t[b*3+1],t[b*3+2]);const w=e[T*3+2];H(m,t[w*3],t[w*3+1],t[w*3+2]),De(n,h,u),De(s,m,u),Ke(f,r[x*2],r[x*2+1]),Ke(d,r[b*2],r[b*2+1]),Ke(g,r[w*2],r[w*2+1]),Nt(i,d,f),Nt(a,g,f);const S=1/(i[0]*a[1]-a[0]*i[1]);H(_,S*(a[1]*n[0]-i[1]*s[0]),S*(a[1]*n[1]-i[1]*s[1]),S*(a[1]*n[2]-i[1]*s[2])),H(k,S*(-a[0]*n[0]+i[0]*s[0]),S*(-a[0]*n[1]+i[0]*s[1]),S*(-a[0]*n[2]+i[0]*s[2])),v[x*3]+=_[0],v[x*3+1]+=_[1],v[x*3+2]+=_[2],v[b*3]+=_[0],v[b*3+1]+=_[1],v[b*3+2]+=_[2],v[w*3]+=_[0],v[w*3+1]+=_[1],v[w*3+2]+=_[2],y[x*3]+=k[0],y[x*3+1]+=k[1],y[x*3+2]+=k[2],y[b*3]+=k[0],y[b*3+1]+=k[1],y[b*3+2]+=k[2],y[w*3]+=k[0],y[w*3+1]+=k[1],y[w*3+2]+=k[2]}for(let T=0;T<t.length/3;T++){const x=T*3;H(_,v[x],v[x+1],v[x+2]),Te(_,_),v[x]=_[0],v[x+1]=_[1],v[x+2]=_[2],H(k,y[x],y[x+1],y[x+2]),Te(k,k),y[x]=k[0],y[x+1]=k[1],y[x+2]=k[2]}return{tangents:v,bitangents:y}}const mt=(t,e)=>((t+e-1)/e|0)*e;function Dr(t){return Object.keys(t)}function Cr(t,e){return new Array(t).fill(0).map((r,n)=>e(n))}const Z=t=>t&&typeof t.length=="number"&&t.buffer instanceof ArrayBuffer&&typeof t.byteLength=="number",E={i32:{numElements:1,align:4,size:4,type:"i32",View:Int32Array},u32:{numElements:1,align:4,size:4,type:"u32",View:Uint32Array},f32:{numElements:1,align:4,size:4,type:"f32",View:Float32Array},f16:{numElements:1,align:2,size:2,type:"u16",View:Uint16Array},vec2f:{numElements:2,align:8,size:8,type:"f32",View:Float32Array},vec2i:{numElements:2,align:8,size:8,type:"i32",View:Int32Array},vec2u:{numElements:2,align:8,size:8,type:"u32",View:Uint32Array},vec2h:{numElements:2,align:4,size:4,type:"u16",View:Uint16Array},vec3i:{numElements:3,align:16,size:12,type:"i32",View:Int32Array},vec3u:{numElements:3,align:16,size:12,type:"u32",View:Uint32Array},vec3f:{numElements:3,align:16,size:12,type:"f32",View:Float32Array},vec3h:{numElements:3,align:8,size:6,type:"u16",View:Uint16Array},vec4i:{numElements:4,align:16,size:16,type:"i32",View:Int32Array},vec4u:{numElements:4,align:16,size:16,type:"u32",View:Uint32Array},vec4f:{numElements:4,align:16,size:16,type:"f32",View:Float32Array},vec4h:{numElements:4,align:8,size:8,type:"u16",View:Uint16Array},mat2x2f:{numElements:4,align:8,size:16,type:"f32",View:Float32Array},mat2x2h:{numElements:4,align:4,size:8,type:"u16",View:Uint16Array},mat3x2f:{numElements:6,align:8,size:24,type:"f32",View:Float32Array},mat3x2h:{numElements:6,align:4,size:12,type:"u16",View:Uint16Array},mat4x2f:{numElements:8,align:8,size:32,type:"f32",View:Float32Array},mat4x2h:{numElements:8,align:4,size:16,type:"u16",View:Uint16Array},mat2x3f:{numElements:8,align:16,size:32,pad:[3,1],type:"f32",View:Float32Array},mat2x3h:{numElements:8,align:8,size:16,pad:[3,1],type:"u16",View:Uint16Array},mat3x3f:{numElements:12,align:16,size:48,pad:[3,1],type:"f32",View:Float32Array},mat3x3h:{numElements:12,align:8,size:24,pad:[3,1],type:"u16",View:Uint16Array},mat4x3f:{numElements:16,align:16,size:64,pad:[3,1],type:"f32",View:Float32Array},mat4x3h:{numElements:16,align:8,size:32,pad:[3,1],type:"u16",View:Uint16Array},mat2x4f:{numElements:8,align:16,size:32,type:"f32",View:Float32Array},mat2x4h:{numElements:8,align:8,size:16,type:"u16",View:Uint16Array},mat3x4f:{numElements:12,align:16,size:48,pad:[3,1],type:"f32",View:Float32Array},mat3x4h:{numElements:12,align:8,size:24,pad:[3,1],type:"u16",View:Uint16Array},mat4x4f:{numElements:16,align:16,size:64,type:"f32",View:Float32Array},mat4x4h:{numElements:16,align:8,size:32,type:"u16",View:Uint16Array},bool:{numElements:0,align:1,size:0,type:"bool",View:Uint32Array}},ye={...E,"atomic<i32>":E.i32,"atomic<u32>":E.u32,"vec2<i32>":E.vec2i,"vec2<u32>":E.vec2u,"vec2<f32>":E.vec2f,"vec2<f16>":E.vec2h,"vec3<i32>":E.vec3i,"vec3<u32>":E.vec3u,"vec3<f32>":E.vec3f,"vec3<f16>":E.vec3h,"vec4<i32>":E.vec4i,"vec4<u32>":E.vec4u,"vec4<f32>":E.vec4f,"vec4<f16>":E.vec4h,"mat2x2<f32>":E.mat2x2f,"mat2x2<f16>":E.mat2x2h,"mat3x2<f32>":E.mat3x2f,"mat3x2<f16>":E.mat3x2h,"mat4x2<f32>":E.mat4x2f,"mat4x2<f16>":E.mat4x2h,"mat2x3<f32>":E.mat2x3f,"mat2x3<f16>":E.mat2x3h,"mat3x3<f32>":E.mat3x3f,"mat3x3<f16>":E.mat3x3h,"mat4x3<f32>":E.mat4x3f,"mat4x3<f16>":E.mat4x3h,"mat2x4<f32>":E.mat2x4f,"mat2x4<f16>":E.mat2x4h,"mat3x4<f32>":E.mat3x4f,"mat3x4<f16>":E.mat3x4h,"mat4x4<f32>":E.mat4x4f,"mat4x4<f16>":E.mat4x4h},Or=Dr(ye);function Rr(t=[],e){const r=new Set;for(const n of Or){const s=ye[n];r.has(s)||(r.add(s),s.flatten=t.includes(n)?e:!e)}}Rr();function qr(t){const e=t;if(e.elementType)return e.size;{const n=t,s=e.numElements||1;if(n.fields)return t.size*s;{const i=t,{align:a}=ye[i.type];return s>1?mt(t.size,a)*s:t.size}}}function Pt(t,e,r,n){const{size:s,type:i}=t;try{const{View:a,align:u}=ye[i],h=n!==void 0,m=h?mt(s,u):s,f=m/a.BYTES_PER_ELEMENT,d=h?n===0?(e.byteLength-r)/m:n:1;return new a(e,r,f*d)}catch{throw new Error(`unknown type: ${i}`)}}function Hr(t){return!t.fields&&!t.elementType}function Xr(t,e,r){const n=r||0,s=e||new ArrayBuffer(qr(t)),i=(a,u)=>{const h=a,m=h.elementType;if(m){if(Hr(m)&&ye[m.type].flatten)return Pt(m,s,u,h.numElements);{const{size:f}=Zt(a),d=h.numElements===0?(s.byteLength-u)/f:h.numElements;return Cr(d,g=>i(m,u+f*g))}}else{if(typeof a=="string")throw Error("unreachable");{const f=a.fields;if(f){const d={};for(const[g,{type:_,offset:k}]of Object.entries(f))d[g]=i(_,u+k);return d}else return Pt(a,s,u)}}};return{views:i(t,n),arrayBuffer:s}}function ut(t,e){if(t!==void 0)if(Z(e)){const r=e;if(r.length===1&&typeof t=="number")r[0]=t;else if(Array.isArray(t[0])||Z(t[0])){const n=t[0].length,s=n===3?4:n;for(let i=0;i<t.length;++i){const a=i*s;r.set(t[i],a)}}else r.set(t)}else if(Array.isArray(e)){const r=e;t.forEach((n,s)=>{ut(n,r[s])})}else{const r=e;for(const[n,s]of Object.entries(t)){const i=r[n];i&&ut(s,i)}}}function Ce(t,e,r=0){const n=t,s=n.group===void 0?t:n.typeDefinition,i=Xr(s,e,r);return{...i,set(a){ut(a,i.views)}}}function ct(t){const r=t.elementType;if(r)return ct(r);const s=t.fields;if(s)return Object.values(s).reduce((u,{type:h})=>Math.max(u,ct(h)),0);const{type:i}=t,{align:a}=ye[i];return a}function Zt(t){const r=t.elementType;if(r){const i=r.size,a=ct(r);return{unalignedSize:i,align:a,size:mt(i,a)}}const s=t.fields;if(s){const i=Object.values(s).pop();if(i.type.size===0)return Zt(i.type)}return{size:0,unalignedSize:0,align:1}}class jr{constructor(){this.constants=new Map,this.aliases=new Map,this.structs=new Map}}class J{constructor(){}get isAstNode(){return!0}get astNodeType(){return""}evaluate(e){throw new Error("Cannot evaluate node")}evaluateString(e){return this.evaluate(e).toString()}search(e){}searchBlock(e,r){if(e){r(Oe.instance);for(const n of e)n instanceof Array?this.searchBlock(n,r):n.search(r);r(Re.instance)}}}class Oe extends J{}Oe.instance=new Oe;class Re extends J{}Re.instance=new Re;class z extends J{constructor(){super()}}class lt extends z{constructor(e,r,n,s){super(),this.name=e,this.args=r,this.returnType=n,this.body=s}get astNodeType(){return"function"}search(e){this.searchBlock(this.body,e)}}class $r extends z{constructor(e){super(),this.expression=e}get astNodeType(){return"staticAssert"}search(e){this.expression.search(e)}}class Yr extends z{constructor(e,r){super(),this.condition=e,this.body=r}get astNodeType(){return"while"}search(e){this.condition.search(e),this.searchBlock(this.body,e)}}class Wr extends z{constructor(e){super(),this.body=e}get astNodeType(){return"continuing"}search(e){this.searchBlock(this.body,e)}}class Jr extends z{constructor(e,r,n,s){super(),this.init=e,this.condition=r,this.increment=n,this.body=s}get astNodeType(){return"for"}search(e){var r,n,s;(r=this.init)===null||r===void 0||r.search(e),(n=this.condition)===null||n===void 0||n.search(e),(s=this.increment)===null||s===void 0||s.search(e),this.searchBlock(this.body,e)}}class ie extends z{constructor(e,r,n,s,i){super(),this.name=e,this.type=r,this.storage=n,this.access=s,this.value=i}get astNodeType(){return"var"}search(e){var r;e(this),(r=this.value)===null||r===void 0||r.search(e)}}class Kt extends z{constructor(e,r,n){super(),this.name=e,this.type=r,this.value=n}get astNodeType(){return"override"}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}}class ht extends z{constructor(e,r,n,s,i){super(),this.name=e,this.type=r,this.storage=n,this.access=s,this.value=i}get astNodeType(){return"let"}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}}class zt extends z{constructor(e,r,n,s,i){super(),this.name=e,this.type=r,this.storage=n,this.access=s,this.value=i}get astNodeType(){return"const"}evaluate(e){return this.value.evaluate(e)}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}}var ge;(function(t){t.increment="++",t.decrement="--"})(ge||(ge={}));(function(t){function e(r){const n=r;if(n=="parse")throw new Error("Invalid value for IncrementOperator");return t[n]}t.parse=e})(ge||(ge={}));class Qr extends z{constructor(e,r){super(),this.operator=e,this.variable=r}get astNodeType(){return"increment"}search(e){this.variable.search(e)}}var Se;(function(t){t.assign="=",t.addAssign="+=",t.subtractAssin="-=",t.multiplyAssign="*=",t.divideAssign="/=",t.moduloAssign="%=",t.andAssign="&=",t.orAssign="|=",t.xorAssign="^=",t.shiftLeftAssign="<<=",t.shiftRightAssign=">>="})(Se||(Se={}));(function(t){function e(r){const n=r;if(n=="parse")throw new Error("Invalid value for AssignOperator");return n}t.parse=e})(Se||(Se={}));class Zr extends z{constructor(e,r,n){super(),this.operator=e,this.variable=r,this.value=n}get astNodeType(){return"assign"}search(e){this.value.search(e)}}class Kr extends z{constructor(e,r){super(),this.name=e,this.args=r}get astNodeType(){return"call"}}class en extends z{constructor(e,r){super(),this.body=e,this.continuing=r}get astNodeType(){return"loop"}}class tn extends z{constructor(e,r){super(),this.condition=e,this.body=r}get astNodeType(){return"body"}}class rn extends z{constructor(e,r,n,s){super(),this.condition=e,this.body=r,this.elseif=n,this.else=s}get astNodeType(){return"if"}search(e){this.condition.search(e),this.searchBlock(this.body,e),this.searchBlock(this.elseif,e),this.searchBlock(this.else,e)}}class nn extends z{constructor(e){super(),this.value=e}get astNodeType(){return"return"}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}}class sn extends z{constructor(e){super(),this.name=e}get astNodeType(){return"enable"}}class er extends z{constructor(e,r){super(),this.name=e,this.type=r}get astNodeType(){return"alias"}}class an extends z{constructor(){super()}get astNodeType(){return"discard"}}class on extends z{constructor(){super()}get astNodeType(){return"break"}}class un extends z{constructor(){super()}get astNodeType(){return"continue"}}class oe extends z{constructor(e){super(),this.name=e}get astNodeType(){return"type"}get isStruct(){return!1}get isArray(){return!1}}class se extends oe{constructor(e,r){super(e),this.members=r}get astNodeType(){return"struct"}get isStruct(){return!0}getMemberIndex(e){for(let r=0;r<this.members.length;r++)if(this.members[r].name==e)return r;return-1}}class tr extends oe{constructor(e,r,n){super(e),this.format=r,this.access=n}get astNodeType(){return"template"}}class cn extends oe{constructor(e,r,n,s){super(e),this.storage=r,this.type=n,this.access=s}get astNodeType(){return"pointer"}}class rr extends oe{constructor(e,r,n,s){super(e),this.attributes=r,this.format=n,this.count=s}get astNodeType(){return"array"}get isArray(){return!0}}class be extends oe{constructor(e,r,n){super(e),this.format=r,this.access=n}get astNodeType(){return"sampler"}}class $ extends J{constructor(){super()}}class Gt extends ${constructor(e){super(),this.value=e}get astNodeType(){return"stringExpr"}toString(){return this.value}evaluateString(){return this.value}}class ke extends ${constructor(e,r){super(),this.type=e,this.args=r}get astNodeType(){return"createExpr"}}class nr extends ${constructor(e,r){super(),this.name=e,this.args=r}get astNodeType(){return"callExpr"}evaluate(e){switch(this.name){case"abs":return Math.abs(this.args[0].evaluate(e));case"acos":return Math.acos(this.args[0].evaluate(e));case"acosh":return Math.acosh(this.args[0].evaluate(e));case"asin":return Math.asin(this.args[0].evaluate(e));case"asinh":return Math.asinh(this.args[0].evaluate(e));case"atan":return Math.atan(this.args[0].evaluate(e));case"atan2":return Math.atan2(this.args[0].evaluate(e),this.args[1].evaluate(e));case"atanh":return Math.atanh(this.args[0].evaluate(e));case"ceil":return Math.ceil(this.args[0].evaluate(e));case"clamp":return Math.min(Math.max(this.args[0].evaluate(e),this.args[1].evaluate(e)),this.args[2].evaluate(e));case"cos":return Math.cos(this.args[0].evaluate(e));case"degrees":return this.args[0].evaluate(e)*180/Math.PI;case"distance":return Math.sqrt(Math.pow(this.args[0].evaluate(e)-this.args[1].evaluate(e),2));case"dot":case"exp":return Math.exp(this.args[0].evaluate(e));case"exp2":return Math.pow(2,this.args[0].evaluate(e));case"floor":return Math.floor(this.args[0].evaluate(e));case"fma":return this.args[0].evaluate(e)*this.args[1].evaluate(e)+this.args[2].evaluate(e);case"fract":return this.args[0].evaluate(e)-Math.floor(this.args[0].evaluate(e));case"inverseSqrt":return 1/Math.sqrt(this.args[0].evaluate(e));case"log":return Math.log(this.args[0].evaluate(e));case"log2":return Math.log2(this.args[0].evaluate(e));case"max":return Math.max(this.args[0].evaluate(e),this.args[1].evaluate(e));case"min":return Math.min(this.args[0].evaluate(e),this.args[1].evaluate(e));case"mix":return this.args[0].evaluate(e)*(1-this.args[2].evaluate(e))+this.args[1].evaluate(e)*this.args[2].evaluate(e);case"modf":return this.args[0].evaluate(e)-Math.floor(this.args[0].evaluate(e));case"pow":return Math.pow(this.args[0].evaluate(e),this.args[1].evaluate(e));case"radians":return this.args[0].evaluate(e)*Math.PI/180;case"round":return Math.round(this.args[0].evaluate(e));case"sign":return Math.sign(this.args[0].evaluate(e));case"sin":return Math.sin(this.args[0].evaluate(e));case"sinh":return Math.sinh(this.args[0].evaluate(e));case"saturate":return Math.min(Math.max(this.args[0].evaluate(e),0),1);case"smoothstep":return this.args[0].evaluate(e)*this.args[0].evaluate(e)*(3-2*this.args[0].evaluate(e));case"sqrt":return Math.sqrt(this.args[0].evaluate(e));case"step":return this.args[0].evaluate(e)<this.args[1].evaluate(e)?0:1;case"tan":return Math.tan(this.args[0].evaluate(e));case"tanh":return Math.tanh(this.args[0].evaluate(e));case"trunc":return Math.trunc(this.args[0].evaluate(e));default:throw new Error("Non const function: "+this.name)}}search(e){for(const r of this.args)r.search(e);e(this)}}class sr extends ${constructor(e){super(),this.name=e}get astNodeType(){return"varExpr"}search(e){e(this)}}class Ft extends ${constructor(e,r){super(),this.name=e,this.initializer=r}get astNodeType(){return"constExpr"}evaluate(e){var r,n;if(this.initializer instanceof ke){const s=(r=this.postfix)===null||r===void 0?void 0:r.evaluateString(e),i=(n=this.initializer.type)===null||n===void 0?void 0:n.name,a=e.structs.get(i),u=a==null?void 0:a.getMemberIndex(s);if(u!=-1)return this.initializer.args[u].evaluate(e);console.log(u)}return this.initializer.evaluate(e)}search(e){this.initializer.search(e)}}class It extends ${constructor(e){super(),this.value=e}get astNodeType(){return"literalExpr"}evaluate(){return this.value}}class ln extends ${constructor(e,r){super(),this.type=e,this.value=r}get astNodeType(){return"bitcastExpr"}search(e){this.value.search(e)}}class hn extends ${constructor(e,r){super(),this.type=e,this.args=r}get astNodeType(){return"typecastExpr"}evaluate(e){return this.args[0].evaluate(e)}search(e){this.searchBlock(this.args,e)}}class Vt extends ${constructor(e){super(),this.contents=e}get astNodeType(){return"groupExpr"}evaluate(e){return this.contents[0].evaluate(e)}search(e){this.searchBlock(this.contents,e)}}class ir extends ${constructor(){super()}}class fn extends ir{constructor(e,r){super(),this.operator=e,this.right=r}get astNodeType(){return"unaryOp"}evaluate(e){switch(this.operator){case"+":return this.right.evaluate(e);case"-":return-this.right.evaluate(e);case"!":return this.right.evaluate(e)?0:1;case"~":return~this.right.evaluate(e);default:throw new Error("Unknown unary operator: "+this.operator)}}search(e){this.right.search(e)}}class j extends ir{constructor(e,r,n){super(),this.operator=e,this.left=r,this.right=n}get astNodeType(){return"binaryOp"}evaluate(e){switch(this.operator){case"+":return this.left.evaluate(e)+this.right.evaluate(e);case"-":return this.left.evaluate(e)-this.right.evaluate(e);case"*":return this.left.evaluate(e)*this.right.evaluate(e);case"/":return this.left.evaluate(e)/this.right.evaluate(e);case"%":return this.left.evaluate(e)%this.right.evaluate(e);case"==":return this.left.evaluate(e)==this.right.evaluate(e)?1:0;case"!=":return this.left.evaluate(e)!=this.right.evaluate(e)?1:0;case"<":return this.left.evaluate(e)<this.right.evaluate(e)?1:0;case">":return this.left.evaluate(e)>this.right.evaluate(e)?1:0;case"<=":return this.left.evaluate(e)<=this.right.evaluate(e)?1:0;case">=":return this.left.evaluate(e)>=this.right.evaluate(e)?1:0;case"&&":return this.left.evaluate(e)&&this.right.evaluate(e)?1:0;case"||":return this.left.evaluate(e)||this.right.evaluate(e)?1:0;default:throw new Error(`Unknown operator ${this.operator}`)}}search(e){this.left.search(e),this.right.search(e)}}class ar extends J{constructor(){super()}}class mn extends ar{constructor(e,r){super(),this.selector=e,this.body=r}get astNodeType(){return"case"}search(e){this.searchBlock(this.body,e)}}class pn extends ar{constructor(e){super(),this.body=e}get astNodeType(){return"default"}search(e){this.searchBlock(this.body,e)}}class dn extends J{constructor(e,r,n){super(),this.name=e,this.type=r,this.attributes=n}get astNodeType(){return"argument"}}class _n extends J{constructor(e,r){super(),this.condition=e,this.body=r}get astNodeType(){return"elseif"}search(e){this.condition.search(e),this.searchBlock(this.body,e)}}class gn extends J{constructor(e,r,n){super(),this.name=e,this.type=r,this.attributes=n}get astNodeType(){return"member"}}class Ut extends J{constructor(e,r){super(),this.name=e,this.value=r}get astNodeType(){return"attribute"}}var p,c;(function(t){t[t.token=0]="token",t[t.keyword=1]="keyword",t[t.reserved=2]="reserved"})(c||(c={}));class l{constructor(e,r,n){this.name=e,this.type=r,this.rule=n}toString(){return this.name}}class o{}p=o;o.none=new l("",c.reserved,"");o.eof=new l("EOF",c.token,"");o.reserved={asm:new l("asm",c.reserved,"asm"),bf16:new l("bf16",c.reserved,"bf16"),do:new l("do",c.reserved,"do"),enum:new l("enum",c.reserved,"enum"),f16:new l("f16",c.reserved,"f16"),f64:new l("f64",c.reserved,"f64"),handle:new l("handle",c.reserved,"handle"),i8:new l("i8",c.reserved,"i8"),i16:new l("i16",c.reserved,"i16"),i64:new l("i64",c.reserved,"i64"),mat:new l("mat",c.reserved,"mat"),premerge:new l("premerge",c.reserved,"premerge"),regardless:new l("regardless",c.reserved,"regardless"),typedef:new l("typedef",c.reserved,"typedef"),u8:new l("u8",c.reserved,"u8"),u16:new l("u16",c.reserved,"u16"),u64:new l("u64",c.reserved,"u64"),unless:new l("unless",c.reserved,"unless"),using:new l("using",c.reserved,"using"),vec:new l("vec",c.reserved,"vec"),void:new l("void",c.reserved,"void")};o.keywords={array:new l("array",c.keyword,"array"),atomic:new l("atomic",c.keyword,"atomic"),bool:new l("bool",c.keyword,"bool"),f32:new l("f32",c.keyword,"f32"),i32:new l("i32",c.keyword,"i32"),mat2x2:new l("mat2x2",c.keyword,"mat2x2"),mat2x3:new l("mat2x3",c.keyword,"mat2x3"),mat2x4:new l("mat2x4",c.keyword,"mat2x4"),mat3x2:new l("mat3x2",c.keyword,"mat3x2"),mat3x3:new l("mat3x3",c.keyword,"mat3x3"),mat3x4:new l("mat3x4",c.keyword,"mat3x4"),mat4x2:new l("mat4x2",c.keyword,"mat4x2"),mat4x3:new l("mat4x3",c.keyword,"mat4x3"),mat4x4:new l("mat4x4",c.keyword,"mat4x4"),ptr:new l("ptr",c.keyword,"ptr"),sampler:new l("sampler",c.keyword,"sampler"),sampler_comparison:new l("sampler_comparison",c.keyword,"sampler_comparison"),struct:new l("struct",c.keyword,"struct"),texture_1d:new l("texture_1d",c.keyword,"texture_1d"),texture_2d:new l("texture_2d",c.keyword,"texture_2d"),texture_2d_array:new l("texture_2d_array",c.keyword,"texture_2d_array"),texture_3d:new l("texture_3d",c.keyword,"texture_3d"),texture_cube:new l("texture_cube",c.keyword,"texture_cube"),texture_cube_array:new l("texture_cube_array",c.keyword,"texture_cube_array"),texture_multisampled_2d:new l("texture_multisampled_2d",c.keyword,"texture_multisampled_2d"),texture_storage_1d:new l("texture_storage_1d",c.keyword,"texture_storage_1d"),texture_storage_2d:new l("texture_storage_2d",c.keyword,"texture_storage_2d"),texture_storage_2d_array:new l("texture_storage_2d_array",c.keyword,"texture_storage_2d_array"),texture_storage_3d:new l("texture_storage_3d",c.keyword,"texture_storage_3d"),texture_depth_2d:new l("texture_depth_2d",c.keyword,"texture_depth_2d"),texture_depth_2d_array:new l("texture_depth_2d_array",c.keyword,"texture_depth_2d_array"),texture_depth_cube:new l("texture_depth_cube",c.keyword,"texture_depth_cube"),texture_depth_cube_array:new l("texture_depth_cube_array",c.keyword,"texture_depth_cube_array"),texture_depth_multisampled_2d:new l("texture_depth_multisampled_2d",c.keyword,"texture_depth_multisampled_2d"),texture_external:new l("texture_external",c.keyword,"texture_external"),u32:new l("u32",c.keyword,"u32"),vec2:new l("vec2",c.keyword,"vec2"),vec3:new l("vec3",c.keyword,"vec3"),vec4:new l("vec4",c.keyword,"vec4"),bitcast:new l("bitcast",c.keyword,"bitcast"),block:new l("block",c.keyword,"block"),break:new l("break",c.keyword,"break"),case:new l("case",c.keyword,"case"),continue:new l("continue",c.keyword,"continue"),continuing:new l("continuing",c.keyword,"continuing"),default:new l("default",c.keyword,"default"),discard:new l("discard",c.keyword,"discard"),else:new l("else",c.keyword,"else"),enable:new l("enable",c.keyword,"enable"),fallthrough:new l("fallthrough",c.keyword,"fallthrough"),false:new l("false",c.keyword,"false"),fn:new l("fn",c.keyword,"fn"),for:new l("for",c.keyword,"for"),function:new l("function",c.keyword,"function"),if:new l("if",c.keyword,"if"),let:new l("let",c.keyword,"let"),const:new l("const",c.keyword,"const"),loop:new l("loop",c.keyword,"loop"),while:new l("while",c.keyword,"while"),private:new l("private",c.keyword,"private"),read:new l("read",c.keyword,"read"),read_write:new l("read_write",c.keyword,"read_write"),return:new l("return",c.keyword,"return"),storage:new l("storage",c.keyword,"storage"),switch:new l("switch",c.keyword,"switch"),true:new l("true",c.keyword,"true"),alias:new l("alias",c.keyword,"alias"),type:new l("type",c.keyword,"type"),uniform:new l("uniform",c.keyword,"uniform"),var:new l("var",c.keyword,"var"),override:new l("override",c.keyword,"override"),workgroup:new l("workgroup",c.keyword,"workgroup"),write:new l("write",c.keyword,"write"),r8unorm:new l("r8unorm",c.keyword,"r8unorm"),r8snorm:new l("r8snorm",c.keyword,"r8snorm"),r8uint:new l("r8uint",c.keyword,"r8uint"),r8sint:new l("r8sint",c.keyword,"r8sint"),r16uint:new l("r16uint",c.keyword,"r16uint"),r16sint:new l("r16sint",c.keyword,"r16sint"),r16float:new l("r16float",c.keyword,"r16float"),rg8unorm:new l("rg8unorm",c.keyword,"rg8unorm"),rg8snorm:new l("rg8snorm",c.keyword,"rg8snorm"),rg8uint:new l("rg8uint",c.keyword,"rg8uint"),rg8sint:new l("rg8sint",c.keyword,"rg8sint"),r32uint:new l("r32uint",c.keyword,"r32uint"),r32sint:new l("r32sint",c.keyword,"r32sint"),r32float:new l("r32float",c.keyword,"r32float"),rg16uint:new l("rg16uint",c.keyword,"rg16uint"),rg16sint:new l("rg16sint",c.keyword,"rg16sint"),rg16float:new l("rg16float",c.keyword,"rg16float"),rgba8unorm:new l("rgba8unorm",c.keyword,"rgba8unorm"),rgba8unorm_srgb:new l("rgba8unorm_srgb",c.keyword,"rgba8unorm_srgb"),rgba8snorm:new l("rgba8snorm",c.keyword,"rgba8snorm"),rgba8uint:new l("rgba8uint",c.keyword,"rgba8uint"),rgba8sint:new l("rgba8sint",c.keyword,"rgba8sint"),bgra8unorm:new l("bgra8unorm",c.keyword,"bgra8unorm"),bgra8unorm_srgb:new l("bgra8unorm_srgb",c.keyword,"bgra8unorm_srgb"),rgb10a2unorm:new l("rgb10a2unorm",c.keyword,"rgb10a2unorm"),rg11b10float:new l("rg11b10float",c.keyword,"rg11b10float"),rg32uint:new l("rg32uint",c.keyword,"rg32uint"),rg32sint:new l("rg32sint",c.keyword,"rg32sint"),rg32float:new l("rg32float",c.keyword,"rg32float"),rgba16uint:new l("rgba16uint",c.keyword,"rgba16uint"),rgba16sint:new l("rgba16sint",c.keyword,"rgba16sint"),rgba16float:new l("rgba16float",c.keyword,"rgba16float"),rgba32uint:new l("rgba32uint",c.keyword,"rgba32uint"),rgba32sint:new l("rgba32sint",c.keyword,"rgba32sint"),rgba32float:new l("rgba32float",c.keyword,"rgba32float"),static_assert:new l("static_assert",c.keyword,"static_assert")};o.tokens={decimal_float_literal:new l("decimal_float_literal",c.token,/((-?[0-9]*\.[0-9]+|-?[0-9]+\.[0-9]*)((e|E)(\+|-)?[0-9]+)?f?)|(-?[0-9]+(e|E)(\+|-)?[0-9]+f?)|([0-9]+f)/),hex_float_literal:new l("hex_float_literal",c.token,/-?0x((([0-9a-fA-F]*\.[0-9a-fA-F]+|[0-9a-fA-F]+\.[0-9a-fA-F]*)((p|P)(\+|-)?[0-9]+f?)?)|([0-9a-fA-F]+(p|P)(\+|-)?[0-9]+f?))/),int_literal:new l("int_literal",c.token,/-?0x[0-9a-fA-F]+|0i?|-?[1-9][0-9]*i?/),uint_literal:new l("uint_literal",c.token,/0x[0-9a-fA-F]+u|0u|[1-9][0-9]*u/),ident:new l("ident",c.token,/[a-zA-Z][0-9a-zA-Z_]*/),and:new l("and",c.token,"&"),and_and:new l("and_and",c.token,"&&"),arrow:new l("arrow ",c.token,"->"),attr:new l("attr",c.token,"@"),attr_left:new l("attr_left",c.token,"[["),attr_right:new l("attr_right",c.token,"]]"),forward_slash:new l("forward_slash",c.token,"/"),bang:new l("bang",c.token,"!"),bracket_left:new l("bracket_left",c.token,"["),bracket_right:new l("bracket_right",c.token,"]"),brace_left:new l("brace_left",c.token,"{"),brace_right:new l("brace_right",c.token,"}"),colon:new l("colon",c.token,":"),comma:new l("comma",c.token,","),equal:new l("equal",c.token,"="),equal_equal:new l("equal_equal",c.token,"=="),not_equal:new l("not_equal",c.token,"!="),greater_than:new l("greater_than",c.token,">"),greater_than_equal:new l("greater_than_equal",c.token,">="),shift_right:new l("shift_right",c.token,">>"),less_than:new l("less_than",c.token,"<"),less_than_equal:new l("less_than_equal",c.token,"<="),shift_left:new l("shift_left",c.token,"<<"),modulo:new l("modulo",c.token,"%"),minus:new l("minus",c.token,"-"),minus_minus:new l("minus_minus",c.token,"--"),period:new l("period",c.token,"."),plus:new l("plus",c.token,"+"),plus_plus:new l("plus_plus",c.token,"++"),or:new l("or",c.token,"|"),or_or:new l("or_or",c.token,"||"),paren_left:new l("paren_left",c.token,"("),paren_right:new l("paren_right",c.token,")"),semicolon:new l("semicolon",c.token,";"),star:new l("star",c.token,"*"),tilde:new l("tilde",c.token,"~"),underscore:new l("underscore",c.token,"_"),xor:new l("xor",c.token,"^"),plus_equal:new l("plus_equal",c.token,"+="),minus_equal:new l("minus_equal",c.token,"-="),times_equal:new l("times_equal",c.token,"*="),division_equal:new l("division_equal",c.token,"/="),modulo_equal:new l("modulo_equal",c.token,"%="),and_equal:new l("and_equal",c.token,"&="),or_equal:new l("or_equal",c.token,"|="),xor_equal:new l("xor_equal",c.token,"^="),shift_right_equal:new l("shift_right_equal",c.token,">>="),shift_left_equal:new l("shift_left_equal",c.token,"<<=")};o.storage_class=[p.keywords.function,p.keywords.private,p.keywords.workgroup,p.keywords.uniform,p.keywords.storage];o.access_mode=[p.keywords.read,p.keywords.write,p.keywords.read_write];o.sampler_type=[p.keywords.sampler,p.keywords.sampler_comparison];o.sampled_texture_type=[p.keywords.texture_1d,p.keywords.texture_2d,p.keywords.texture_2d_array,p.keywords.texture_3d,p.keywords.texture_cube,p.keywords.texture_cube_array];o.multisampled_texture_type=[p.keywords.texture_multisampled_2d];o.storage_texture_type=[p.keywords.texture_storage_1d,p.keywords.texture_storage_2d,p.keywords.texture_storage_2d_array,p.keywords.texture_storage_3d];o.depth_texture_type=[p.keywords.texture_depth_2d,p.keywords.texture_depth_2d_array,p.keywords.texture_depth_cube,p.keywords.texture_depth_cube_array,p.keywords.texture_depth_multisampled_2d];o.texture_external_type=[p.keywords.texture_external];o.any_texture_type=[...p.sampled_texture_type,...p.multisampled_texture_type,...p.storage_texture_type,...p.depth_texture_type,...p.texture_external_type];o.texel_format=[p.keywords.r8unorm,p.keywords.r8snorm,p.keywords.r8uint,p.keywords.r8sint,p.keywords.r16uint,p.keywords.r16sint,p.keywords.r16float,p.keywords.rg8unorm,p.keywords.rg8snorm,p.keywords.rg8uint,p.keywords.rg8sint,p.keywords.r32uint,p.keywords.r32sint,p.keywords.r32float,p.keywords.rg16uint,p.keywords.rg16sint,p.keywords.rg16float,p.keywords.rgba8unorm,p.keywords.rgba8unorm_srgb,p.keywords.rgba8snorm,p.keywords.rgba8uint,p.keywords.rgba8sint,p.keywords.bgra8unorm,p.keywords.bgra8unorm_srgb,p.keywords.rgb10a2unorm,p.keywords.rg11b10float,p.keywords.rg32uint,p.keywords.rg32sint,p.keywords.rg32float,p.keywords.rgba16uint,p.keywords.rgba16sint,p.keywords.rgba16float,p.keywords.rgba32uint,p.keywords.rgba32sint,p.keywords.rgba32float];o.const_literal=[p.tokens.int_literal,p.tokens.uint_literal,p.tokens.decimal_float_literal,p.tokens.hex_float_literal,p.keywords.true,p.keywords.false];o.literal_or_ident=[p.tokens.ident,p.tokens.int_literal,p.tokens.uint_literal,p.tokens.decimal_float_literal,p.tokens.hex_float_literal];o.element_count_expression=[p.tokens.int_literal,p.tokens.uint_literal,p.tokens.ident];o.template_types=[p.keywords.vec2,p.keywords.vec3,p.keywords.vec4,p.keywords.mat2x2,p.keywords.mat2x3,p.keywords.mat2x4,p.keywords.mat3x2,p.keywords.mat3x3,p.keywords.mat3x4,p.keywords.mat4x2,p.keywords.mat4x3,p.keywords.mat4x4,p.keywords.atomic,p.keywords.bitcast,...p.any_texture_type];o.attribute_name=[p.tokens.ident,p.keywords.block];o.assignment_operators=[p.tokens.equal,p.tokens.plus_equal,p.tokens.minus_equal,p.tokens.times_equal,p.tokens.division_equal,p.tokens.modulo_equal,p.tokens.and_equal,p.tokens.or_equal,p.tokens.xor_equal,p.tokens.shift_right_equal,p.tokens.shift_left_equal];o.increment_operators=[p.tokens.plus_plus,p.tokens.minus_minus];class Lt{constructor(e,r,n){this.type=e,this.lexeme=r,this.line=n}toString(){return this.lexeme}isTemplateType(){return o.template_types.indexOf(this.type)!=-1}isArrayType(){return this.type==o.keywords.array}isArrayOrTemplateType(){return this.isArrayType()||this.isTemplateType()}}class yn{constructor(e){this._tokens=[],this._start=0,this._current=0,this._line=1,this._source=e??""}scanTokens(){for(;!this._isAtEnd();)if(this._start=this._current,!this.scanToken())throw`Invalid syntax at line ${this._line}`;return this._tokens.push(new Lt(o.eof,"",this._line)),this._tokens}scanToken(){let e=this._advance();if(e==`
`)return this._line++,!0;if(this._isWhitespace(e))return!0;if(e=="/"){if(this._peekAhead()=="/"){for(;e!=`
`;){if(this._isAtEnd())return!0;e=this._advance()}return this._line++,!0}else if(this._peekAhead()=="*"){this._advance();let n=1;for(;n>0;){if(this._isAtEnd())return!0;if(e=this._advance(),e==`
`)this._line++;else if(e=="*"){if(this._peekAhead()=="/"&&(this._advance(),n--,n==0))return!0}else e=="/"&&this._peekAhead()=="*"&&(this._advance(),n++)}return!0}}let r=o.none;for(;;){let n=this._findType(e);const s=this._peekAhead();if(e==">"&&(s==">"||s=="=")){let i=!1,a=this._tokens.length-1;for(let u=0;u<5&&a>=0;++u,--a)if(this._tokens[a].type===o.tokens.less_than){a>0&&this._tokens[a-1].isArrayOrTemplateType()&&(i=!0);break}if(i)return this._addToken(n),!0}if(n===o.none){let i=e,a=0;const u=2;for(let h=0;h<u;++h)if(i+=this._peekAhead(h),n=this._findType(i),n!==o.none){a=h;break}if(n===o.none)return r===o.none?!1:(this._current--,this._addToken(r),!0);e=i,this._current+=a+1}if(r=n,this._isAtEnd())break;e+=this._advance()}return r===o.none?!1:(this._addToken(r),!0)}_findType(e){for(const r in o.keywords){const n=o.keywords[r];if(this._match(e,n.rule))return n}for(const r in o.tokens){const n=o.tokens[r];if(this._match(e,n.rule))return n}return o.none}_match(e,r){if(typeof r=="string"){if(r==e)return!0}else{const n=r.exec(e);if(n&&n.index==0&&n[0]==e)return!0}return!1}_isAtEnd(){return this._current>=this._source.length}_isWhitespace(e){return e==" "||e=="	"||e=="\r"}_advance(e=0){let r=this._source[this._current];return e=e||0,e++,this._current+=e,r}_peekAhead(e=0){return e=e||0,this._current+e>=this._source.length?"\0":this._source[this._current+e]}_addToken(e){const r=this._source.substring(this._start,this._current);this._tokens.push(new Lt(e,r,this._line))}}class vn{constructor(){this._tokens=[],this._current=0,this._context=new jr}parse(e){this._initialize(e);let r=[];for(;!this._isAtEnd();){const n=this._global_decl_or_directive();if(!n)break;r.push(n)}return r}_initialize(e){if(e)if(typeof e=="string"){const r=new yn(e);this._tokens=r.scanTokens()}else this._tokens=e;else this._tokens=[];this._current=0}_error(e,r){return console.error(e,r),{token:e,message:r,toString:function(){return`${r}`}}}_isAtEnd(){return this._current>=this._tokens.length||this._peek().type==o.eof}_match(e){if(e instanceof l)return this._check(e)?(this._advance(),!0):!1;for(let r=0,n=e.length;r<n;++r){const s=e[r];if(this._check(s))return this._advance(),!0}return!1}_consume(e,r){if(this._check(e))return this._advance();throw this._error(this._peek(),r)}_check(e){if(this._isAtEnd())return!1;const r=this._peek();if(e instanceof Array){let n=r.type;return e.indexOf(n)!=-1}return r.type==e}_advance(){return this._isAtEnd()||this._current++,this._previous()}_peek(){return this._tokens[this._current]}_previous(){return this._tokens[this._current-1]}_global_decl_or_directive(){for(;this._match(o.tokens.semicolon)&&!this._isAtEnd(););if(this._match(o.keywords.alias)){const r=this._type_alias();return this._consume(o.tokens.semicolon,"Expected ';'"),r}if(this._match(o.keywords.enable)){const r=this._enable_directive();return this._consume(o.tokens.semicolon,"Expected ';'"),r}const e=this._attribute();if(this._check(o.keywords.var)){const r=this._global_variable_decl();return r!=null&&(r.attributes=e),this._consume(o.tokens.semicolon,"Expected ';'."),r}if(this._check(o.keywords.override)){const r=this._override_variable_decl();return r!=null&&(r.attributes=e),this._consume(o.tokens.semicolon,"Expected ';'."),r}if(this._check(o.keywords.let)){const r=this._global_let_decl();return r!=null&&(r.attributes=e),this._consume(o.tokens.semicolon,"Expected ';'."),r}if(this._check(o.keywords.const)){const r=this._global_const_decl();return r!=null&&(r.attributes=e),this._consume(o.tokens.semicolon,"Expected ';'."),r}if(this._check(o.keywords.struct)){const r=this._struct_decl();return r!=null&&(r.attributes=e),r}if(this._check(o.keywords.fn)){const r=this._function_decl();return r!=null&&(r.attributes=e),r}return null}_function_decl(){if(!this._match(o.keywords.fn))return null;const e=this._consume(o.tokens.ident,"Expected function name.").toString();this._consume(o.tokens.paren_left,"Expected '(' for function arguments.");const r=[];if(!this._check(o.tokens.paren_right))do{if(this._check(o.tokens.paren_right))break;const i=this._attribute(),a=this._consume(o.tokens.ident,"Expected argument name.").toString();this._consume(o.tokens.colon,"Expected ':' for argument type.");const u=this._attribute(),h=this._type_decl();h!=null&&(h.attributes=u,r.push(new dn(a,h,i)))}while(this._match(o.tokens.comma));this._consume(o.tokens.paren_right,"Expected ')' after function arguments.");let n=null;if(this._match(o.tokens.arrow)){const i=this._attribute();n=this._type_decl(),n!=null&&(n.attributes=i)}const s=this._compound_statement();return new lt(e,r,n,s)}_compound_statement(){const e=[];for(this._consume(o.tokens.brace_left,"Expected '{' for block.");!this._check(o.tokens.brace_right);){const r=this._statement();r!==null&&e.push(r)}return this._consume(o.tokens.brace_right,"Expected '}' for block."),e}_statement(){for(;this._match(o.tokens.semicolon)&&!this._isAtEnd(););if(this._check(o.keywords.if))return this._if_statement();if(this._check(o.keywords.switch))return this._switch_statement();if(this._check(o.keywords.loop))return this._loop_statement();if(this._check(o.keywords.for))return this._for_statement();if(this._check(o.keywords.while))return this._while_statement();if(this._check(o.keywords.continuing))return this._continuing_statement();if(this._check(o.keywords.static_assert))return this._static_assert_statement();if(this._check(o.tokens.brace_left))return this._compound_statement();let e=null;return this._check(o.keywords.return)?e=this._return_statement():this._check([o.keywords.var,o.keywords.let,o.keywords.const])?e=this._variable_statement():this._match(o.keywords.discard)?e=new an:this._match(o.keywords.break)?e=new on:this._match(o.keywords.continue)?e=new un:e=this._increment_decrement_statement()||this._func_call_statement()||this._assignment_statement(),e!=null&&this._consume(o.tokens.semicolon,"Expected ';' after statement."),e}_static_assert_statement(){if(!this._match(o.keywords.static_assert))return null;let e=this._optional_paren_expression();return new $r(e)}_while_statement(){if(!this._match(o.keywords.while))return null;let e=this._optional_paren_expression();const r=this._compound_statement();return new Yr(e,r)}_continuing_statement(){if(!this._match(o.keywords.continuing))return null;const e=this._compound_statement();return new Wr(e)}_for_statement(){if(!this._match(o.keywords.for))return null;this._consume(o.tokens.paren_left,"Expected '('.");const e=this._check(o.tokens.semicolon)?null:this._for_init();this._consume(o.tokens.semicolon,"Expected ';'.");const r=this._check(o.tokens.semicolon)?null:this._short_circuit_or_expression();this._consume(o.tokens.semicolon,"Expected ';'.");const n=this._check(o.tokens.paren_right)?null:this._for_increment();this._consume(o.tokens.paren_right,"Expected ')'.");const s=this._compound_statement();return new Jr(e,r,n,s)}_for_init(){return this._variable_statement()||this._func_call_statement()||this._assignment_statement()}_for_increment(){return this._func_call_statement()||this._increment_decrement_statement()||this._assignment_statement()}_variable_statement(){if(this._check(o.keywords.var)){const e=this._variable_decl();if(e===null)throw this._error(this._peek(),"Variable declaration expected.");let r=null;return this._match(o.tokens.equal)&&(r=this._short_circuit_or_expression()),new ie(e.name,e.type,e.storage,e.access,r)}if(this._match(o.keywords.let)){const e=this._consume(o.tokens.ident,"Expected name for let.").toString();let r=null;if(this._match(o.tokens.colon)){const s=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=s)}this._consume(o.tokens.equal,"Expected '=' for let.");const n=this._short_circuit_or_expression();return new ht(e,r,null,null,n)}if(this._match(o.keywords.const)){const e=this._consume(o.tokens.ident,"Expected name for const.").toString();let r=null;if(this._match(o.tokens.colon)){const s=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=s)}this._consume(o.tokens.equal,"Expected '=' for const.");const n=this._short_circuit_or_expression();return new zt(e,r,null,null,n)}return null}_increment_decrement_statement(){const e=this._current,r=this._unary_expression();if(r==null)return null;if(!this._check(o.increment_operators))return this._current=e,null;const n=this._consume(o.increment_operators,"Expected increment operator");return new Qr(n.type===o.tokens.plus_plus?ge.increment:ge.decrement,r)}_assignment_statement(){let e=null;if(this._check(o.tokens.brace_right))return null;let r=this._match(o.tokens.underscore);if(r||(e=this._unary_expression()),!r&&e==null)return null;const n=this._consume(o.assignment_operators,"Expected assignment operator."),s=this._short_circuit_or_expression();return new Zr(Se.parse(n.lexeme),e,s)}_func_call_statement(){if(!this._check(o.tokens.ident))return null;const e=this._current,r=this._consume(o.tokens.ident,"Expected function name."),n=this._argument_expression_list();return n===null?(this._current=e,null):new Kr(r.lexeme,n)}_loop_statement(){if(!this._match(o.keywords.loop))return null;this._consume(o.tokens.brace_left,"Expected '{' for loop.");const e=[];let r=this._statement();for(;r!==null;){if(Array.isArray(r))for(let s of r)e.push(s);else e.push(r);r=this._statement()}let n=null;return this._match(o.keywords.continuing)&&(n=this._compound_statement()),this._consume(o.tokens.brace_right,"Expected '}' for loop."),new en(e,n)}_switch_statement(){if(!this._match(o.keywords.switch))return null;const e=this._optional_paren_expression();this._consume(o.tokens.brace_left,"Expected '{' for switch.");const r=this._switch_body();if(r==null||r.length==0)throw this._error(this._previous(),"Expected 'case' or 'default'.");return this._consume(o.tokens.brace_right,"Expected '}' for switch."),new tn(e,r)}_switch_body(){const e=[];if(this._match(o.keywords.case)){const r=this._case_selectors();this._match(o.tokens.colon),this._consume(o.tokens.brace_left,"Exected '{' for switch case.");const n=this._case_body();this._consume(o.tokens.brace_right,"Exected '}' for switch case."),e.push(new mn(r,n))}if(this._match(o.keywords.default)){this._match(o.tokens.colon),this._consume(o.tokens.brace_left,"Exected '{' for switch default.");const r=this._case_body();this._consume(o.tokens.brace_right,"Exected '}' for switch default."),e.push(new pn(r))}if(this._check([o.keywords.default,o.keywords.case])){const r=this._switch_body();e.push(r[0])}return e}_case_selectors(){var e,r,n,s;const i=[(r=(e=this._shift_expression())===null||e===void 0?void 0:e.evaluate(this._context).toString())!==null&&r!==void 0?r:""];for(;this._match(o.tokens.comma);)i.push((s=(n=this._shift_expression())===null||n===void 0?void 0:n.evaluate(this._context).toString())!==null&&s!==void 0?s:"");return i}_case_body(){if(this._match(o.keywords.fallthrough))return this._consume(o.tokens.semicolon,"Expected ';'"),[];let e=this._statement();if(e==null)return[];e instanceof Array||(e=[e]);const r=this._case_body();return r.length==0?e:[...e,r[0]]}_if_statement(){if(!this._match(o.keywords.if))return null;const e=this._optional_paren_expression(),r=this._compound_statement();let n=[];this._match_elseif()&&(n=this._elseif_statement(n));let s=null;return this._match(o.keywords.else)&&(s=this._compound_statement()),new rn(e,r,n,s)}_match_elseif(){return this._tokens[this._current].type===o.keywords.else&&this._tokens[this._current+1].type===o.keywords.if?(this._advance(),this._advance(),!0):!1}_elseif_statement(e=[]){const r=this._optional_paren_expression(),n=this._compound_statement();return e.push(new _n(r,n)),this._match_elseif()&&this._elseif_statement(e),e}_return_statement(){if(!this._match(o.keywords.return))return null;const e=this._short_circuit_or_expression();return new nn(e)}_short_circuit_or_expression(){let e=this._short_circuit_and_expr();for(;this._match(o.tokens.or_or);)e=new j(this._previous().toString(),e,this._short_circuit_and_expr());return e}_short_circuit_and_expr(){let e=this._inclusive_or_expression();for(;this._match(o.tokens.and_and);)e=new j(this._previous().toString(),e,this._inclusive_or_expression());return e}_inclusive_or_expression(){let e=this._exclusive_or_expression();for(;this._match(o.tokens.or);)e=new j(this._previous().toString(),e,this._exclusive_or_expression());return e}_exclusive_or_expression(){let e=this._and_expression();for(;this._match(o.tokens.xor);)e=new j(this._previous().toString(),e,this._and_expression());return e}_and_expression(){let e=this._equality_expression();for(;this._match(o.tokens.and);)e=new j(this._previous().toString(),e,this._equality_expression());return e}_equality_expression(){const e=this._relational_expression();return this._match([o.tokens.equal_equal,o.tokens.not_equal])?new j(this._previous().toString(),e,this._relational_expression()):e}_relational_expression(){let e=this._shift_expression();for(;this._match([o.tokens.less_than,o.tokens.greater_than,o.tokens.less_than_equal,o.tokens.greater_than_equal]);)e=new j(this._previous().toString(),e,this._shift_expression());return e}_shift_expression(){let e=this._additive_expression();for(;this._match([o.tokens.shift_left,o.tokens.shift_right]);)e=new j(this._previous().toString(),e,this._additive_expression());return e}_additive_expression(){let e=this._multiplicative_expression();for(;this._match([o.tokens.plus,o.tokens.minus]);)e=new j(this._previous().toString(),e,this._multiplicative_expression());return e}_multiplicative_expression(){let e=this._unary_expression();for(;this._match([o.tokens.star,o.tokens.forward_slash,o.tokens.modulo]);)e=new j(this._previous().toString(),e,this._unary_expression());return e}_unary_expression(){return this._match([o.tokens.minus,o.tokens.bang,o.tokens.tilde,o.tokens.star,o.tokens.and])?new fn(this._previous().toString(),this._unary_expression()):this._singular_expression()}_singular_expression(){const e=this._primary_expression(),r=this._postfix_expression();return r&&(e.postfix=r),e}_postfix_expression(){if(this._match(o.tokens.bracket_left)){const e=this._short_circuit_or_expression();this._consume(o.tokens.bracket_right,"Expected ']'.");const r=this._postfix_expression();return r&&(e.postfix=r),e}if(this._match(o.tokens.period)){const e=this._consume(o.tokens.ident,"Expected member name."),r=this._postfix_expression(),n=new Gt(e.lexeme);return r&&(n.postfix=r),n}return null}_getStruct(e){return this._context.aliases.has(e)?this._context.aliases.get(e).type:this._context.structs.has(e)?this._context.structs.get(e):null}_primary_expression(){if(this._match(o.tokens.ident)){const n=this._previous().toString();if(this._check(o.tokens.paren_left)){const s=this._argument_expression_list(),i=this._getStruct(n);return i!=null?new ke(i,s):new nr(n,s)}if(this._context.constants.has(n)){const s=this._context.constants.get(n);return new Ft(n,s.value)}return new sr(n)}if(this._match(o.const_literal))return new It(parseFloat(this._previous().toString()));if(this._check(o.tokens.paren_left))return this._paren_expression();if(this._match(o.keywords.bitcast)){this._consume(o.tokens.less_than,"Expected '<'.");const n=this._type_decl();this._consume(o.tokens.greater_than,"Expected '>'.");const s=this._paren_expression();return new ln(n,s)}const e=this._type_decl(),r=this._argument_expression_list();return new hn(e,r)}_argument_expression_list(){if(!this._match(o.tokens.paren_left))return null;const e=[];do{if(this._check(o.tokens.paren_right))break;const r=this._short_circuit_or_expression();e.push(r)}while(this._match(o.tokens.comma));return this._consume(o.tokens.paren_right,"Expected ')' for agument list"),e}_optional_paren_expression(){this._match(o.tokens.paren_left);const e=this._short_circuit_or_expression();return this._match(o.tokens.paren_right),new Vt([e])}_paren_expression(){this._consume(o.tokens.paren_left,"Expected '('.");const e=this._short_circuit_or_expression();return this._consume(o.tokens.paren_right,"Expected ')'."),new Vt([e])}_struct_decl(){if(!this._match(o.keywords.struct))return null;const e=this._consume(o.tokens.ident,"Expected name for struct.").toString();this._consume(o.tokens.brace_left,"Expected '{' for struct body.");const r=[];for(;!this._check(o.tokens.brace_right);){const s=this._attribute(),i=this._consume(o.tokens.ident,"Expected variable name.").toString();this._consume(o.tokens.colon,"Expected ':' for struct member type.");const a=this._attribute(),u=this._type_decl();u!=null&&(u.attributes=a),this._check(o.tokens.brace_right)?this._match(o.tokens.comma):this._consume(o.tokens.comma,"Expected ',' for struct member."),r.push(new gn(i,u,s))}this._consume(o.tokens.brace_right,"Expected '}' after struct body.");const n=new se(e,r);return this._context.structs.set(e,n),n}_global_variable_decl(){const e=this._variable_decl();return e&&this._match(o.tokens.equal)&&(e.value=this._const_expression()),e}_override_variable_decl(){const e=this._override_decl();return e&&this._match(o.tokens.equal)&&(e.value=this._const_expression()),e}_global_const_decl(){if(!this._match(o.keywords.const))return null;const e=this._consume(o.tokens.ident,"Expected variable name");let r=null;if(this._match(o.tokens.colon)){const i=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=i)}let n=null;if(this._match(o.tokens.equal)){const i=this._short_circuit_or_expression();if(i instanceof ke)n=i;else if(i instanceof Ft&&i.initializer instanceof ke)n=i.initializer;else try{const a=i.evaluate(this._context);n=new It(a)}catch{n=i}}const s=new zt(e.toString(),r,"","",n);return this._context.constants.set(s.name,s),s}_global_let_decl(){if(!this._match(o.keywords.let))return null;const e=this._consume(o.tokens.ident,"Expected variable name");let r=null;if(this._match(o.tokens.colon)){const s=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=s)}let n=null;return this._match(o.tokens.equal)&&(n=this._const_expression()),new ht(e.toString(),r,"","",n)}_const_expression(){if(this._match(o.const_literal))return new Gt(this._previous().toString());const e=this._type_decl();this._consume(o.tokens.paren_left,"Expected '('.");let r=[];for(;!this._check(o.tokens.paren_right)&&(r.push(this._const_expression()),!!this._check(o.tokens.comma));)this._advance();return this._consume(o.tokens.paren_right,"Expected ')'."),new ke(e,r)}_variable_decl(){if(!this._match(o.keywords.var))return null;let e="",r="";this._match(o.tokens.less_than)&&(e=this._consume(o.storage_class,"Expected storage_class.").toString(),this._match(o.tokens.comma)&&(r=this._consume(o.access_mode,"Expected access_mode.").toString()),this._consume(o.tokens.greater_than,"Expected '>'."));const n=this._consume(o.tokens.ident,"Expected variable name");let s=null;if(this._match(o.tokens.colon)){const i=this._attribute();s=this._type_decl(),s!=null&&(s.attributes=i)}return new ie(n.toString(),s,e,r,null)}_override_decl(){if(!this._match(o.keywords.override))return null;const e=this._consume(o.tokens.ident,"Expected variable name");let r=null;if(this._match(o.tokens.colon)){const n=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=n)}return new Kt(e.toString(),r,null)}_enable_directive(){const e=this._consume(o.tokens.ident,"identity expected.");return new sn(e.toString())}_type_alias(){const e=this._consume(o.tokens.ident,"identity expected.");this._consume(o.tokens.equal,"Expected '=' for type alias.");let r=this._type_decl();if(r===null)throw this._error(this._peek(),"Expected Type for Alias.");this._context.aliases.has(r.name)&&(r=this._context.aliases.get(r.name).type);const n=new er(e.toString(),r);return this._context.aliases.set(n.name,n),n}_type_decl(){if(this._check([o.tokens.ident,...o.texel_format,o.keywords.bool,o.keywords.f32,o.keywords.i32,o.keywords.u32])){const n=this._advance(),s=n.toString();return this._context.structs.has(s)?this._context.structs.get(s):this._context.aliases.has(s)?this._context.aliases.get(s).type:new oe(n.toString())}let e=this._texture_sampler_types();if(e)return e;if(this._check(o.template_types)){let n=this._advance().toString(),s=null,i=null;return this._match(o.tokens.less_than)&&(s=this._type_decl(),i=null,this._match(o.tokens.comma)&&(i=this._consume(o.access_mode,"Expected access_mode for pointer").toString()),this._consume(o.tokens.greater_than,"Expected '>' for type.")),new tr(n,s,i)}if(this._match(o.keywords.ptr)){let n=this._previous().toString();this._consume(o.tokens.less_than,"Expected '<' for pointer.");const s=this._consume(o.storage_class,"Expected storage_class for pointer");this._consume(o.tokens.comma,"Expected ',' for pointer.");const i=this._type_decl();let a=null;return this._match(o.tokens.comma)&&(a=this._consume(o.access_mode,"Expected access_mode for pointer").toString()),this._consume(o.tokens.greater_than,"Expected '>' for pointer."),new cn(n,s.toString(),i,a)}const r=this._attribute();if(this._match(o.keywords.array)){let n=null,s=-1;const i=this._previous();if(this._match(o.tokens.less_than)){n=this._type_decl(),this._context.aliases.has(n.name)&&(n=this._context.aliases.get(n.name).type);let a="";this._match(o.tokens.comma)&&(a=this._shift_expression().evaluate(this._context).toString()),this._consume(o.tokens.greater_than,"Expected '>' for array."),s=a?parseInt(a):0}return new rr(i.toString(),r,n,s)}return null}_texture_sampler_types(){if(this._match(o.sampler_type))return new be(this._previous().toString(),null,null);if(this._match(o.depth_texture_type))return new be(this._previous().toString(),null,null);if(this._match(o.sampled_texture_type)||this._match(o.multisampled_texture_type)){const e=this._previous();this._consume(o.tokens.less_than,"Expected '<' for sampler type.");const r=this._type_decl();return this._consume(o.tokens.greater_than,"Expected '>' for sampler type."),new be(e.toString(),r,null)}if(this._match(o.storage_texture_type)){const e=this._previous();this._consume(o.tokens.less_than,"Expected '<' for sampler type.");const r=this._consume(o.texel_format,"Invalid texel format.").toString();this._consume(o.tokens.comma,"Expected ',' after texel format.");const n=this._consume(o.access_mode,"Expected access mode for storage texture type.").toString();return this._consume(o.tokens.greater_than,"Expected '>' for sampler type."),new be(e.toString(),r,n)}return null}_attribute(){let e=[];for(;this._match(o.tokens.attr);){const r=this._consume(o.attribute_name,"Expected attribute name"),n=new Ut(r.toString(),null);if(this._match(o.tokens.paren_left)){if(n.value=this._consume(o.literal_or_ident,"Expected attribute value").toString(),this._check(o.tokens.comma)){this._advance();do{const s=this._consume(o.literal_or_ident,"Expected attribute value").toString();n.value instanceof Array||(n.value=[n.value]),n.value.push(s)}while(this._match(o.tokens.comma))}this._consume(o.tokens.paren_right,"Expected ')'")}e.push(n)}for(;this._match(o.tokens.attr_left);){if(!this._check(o.tokens.attr_right))do{const r=this._consume(o.attribute_name,"Expected attribute name"),n=new Ut(r.toString(),null);if(this._match(o.tokens.paren_left)){if(n.value=[this._consume(o.literal_or_ident,"Expected attribute value").toString()],this._check(o.tokens.comma)){this._advance();do{const s=this._consume(o.literal_or_ident,"Expected attribute value").toString();n.value.push(s)}while(this._match(o.tokens.comma))}this._consume(o.tokens.paren_right,"Expected ')'")}e.push(n)}while(this._match(o.tokens.comma));this._consume(o.tokens.attr_right,"Expected ']]' after attribute declarations")}return e.length==0?null:e}}class _e{constructor(e,r){this.name=e,this.attributes=r,this.size=0}get isArray(){return!1}get isStruct(){return!1}get isTemplate(){return!1}}class Bt{constructor(e,r,n){this.name=e,this.type=r,this.attributes=n,this.offset=0,this.size=0}get isArray(){return this.type.isArray}get isStruct(){return this.type.isStruct}get isTemplate(){return this.type.isTemplate}get align(){return this.type.isStruct?this.type.align:0}get members(){return this.type.isStruct?this.type.members:null}get format(){return this.type.isArray?this.type.format:this.type.isTemplate?this.type.format:null}get count(){return this.type.isArray?this.type.count:0}get stride(){return this.type.isArray?this.type.stride:this.size}}class ze extends _e{constructor(e,r){super(e,r),this.members=[],this.align=0}get isStruct(){return!0}}class et extends _e{constructor(e,r){super(e,r),this.count=0,this.stride=0}get isArray(){return!0}}class Dt extends _e{constructor(e,r,n,s){super(e,n),this.format=r,this.access=s}get isTemplate(){return!0}}var F;(function(t){t[t.Uniform=0]="Uniform",t[t.Storage=1]="Storage",t[t.Texture=2]="Texture",t[t.Sampler=3]="Sampler",t[t.StorageTexture=4]="StorageTexture"})(F||(F={}));class Ge{constructor(e,r,n,s,i,a,u){this.name=e,this.type=r,this.group=n,this.binding=s,this.attributes=i,this.resourceType=a,this.access=u}get isArray(){return this.type.isArray}get isStruct(){return this.type.isStruct}get isTemplate(){return this.type.isTemplate}get size(){return this.type.size}get align(){return this.type.isStruct?this.type.align:0}get members(){return this.type.isStruct?this.type.members:null}get format(){return this.type.isArray?this.type.format:this.type.isTemplate?this.type.format:null}get count(){return this.type.isArray?this.type.count:0}get stride(){return this.type.isArray?this.type.stride:this.size}}class wn{constructor(e,r){this.name=e,this.type=r}}class Fe{constructor(e,r){this.align=e,this.size=r}}class xn{constructor(e,r,n,s){this.name=e,this.type=r,this.locationType=n,this.location=s,this.interpolation=null}}class Ct{constructor(e,r,n,s){this.name=e,this.type=r,this.locationType=n,this.location=s}}class bn{constructor(e,r=null){this.stage=null,this.inputs=[],this.outputs=[],this.resources=[],this.name=e,this.stage=r}}class kn{constructor(){this.vertex=[],this.fragment=[],this.compute=[]}}class Tn{constructor(e,r,n,s){this.name=e,this.type=r,this.attributes=n,this.id=s}}class Sn{constructor(e){this.resources=null,this.node=e}}class W{constructor(e){this.uniforms=[],this.storage=[],this.textures=[],this.samplers=[],this.aliases=[],this.overrides=[],this.structs=[],this.entry=new kn,this._types=new Map,this._functions=new Map,e&&this.update(e)}_isStorageTexture(e){return e.name=="texture_storage_1d"||e.name=="texture_storage_2d"||e.name=="texture_storage_2d_array"||e.name=="texture_storage_3d"}update(e){const n=new vn().parse(e);for(const s of n)s instanceof lt&&this._functions.set(s.name,new Sn(s));for(const s of n){if(s instanceof se){const i=this._getTypeInfo(s,null);i instanceof ze&&this.structs.push(i);continue}if(s instanceof er){this.aliases.push(this._getAliasInfo(s));continue}if(s instanceof Kt){const i=s,a=this._getAttributeNum(i.attributes,"id",0),u=i.type!=null?this._getTypeInfo(i.type,i.attributes):null;this.overrides.push(new Tn(i.name,u,i.attributes,a));continue}if(this._isUniformVar(s)){const i=s,a=this._getAttributeNum(i.attributes,"group",0),u=this._getAttributeNum(i.attributes,"binding",0),h=this._getTypeInfo(i.type,i.attributes),m=new Ge(i.name,h,a,u,i.attributes,F.Uniform,i.access);this.uniforms.push(m);continue}if(this._isStorageVar(s)){const i=s,a=this._getAttributeNum(i.attributes,"group",0),u=this._getAttributeNum(i.attributes,"binding",0),h=this._getTypeInfo(i.type,i.attributes),m=this._isStorageTexture(h),f=new Ge(i.name,h,a,u,i.attributes,m?F.StorageTexture:F.Storage,i.access);this.storage.push(f);continue}if(this._isTextureVar(s)){const i=s,a=this._getAttributeNum(i.attributes,"group",0),u=this._getAttributeNum(i.attributes,"binding",0),h=this._getTypeInfo(i.type,i.attributes),m=this._isStorageTexture(h),f=new Ge(i.name,h,a,u,i.attributes,m?F.StorageTexture:F.Texture,i.access);m?this.storage.push(f):this.textures.push(f);continue}if(this._isSamplerVar(s)){const i=s,a=this._getAttributeNum(i.attributes,"group",0),u=this._getAttributeNum(i.attributes,"binding",0),h=this._getTypeInfo(i.type,i.attributes),m=new Ge(i.name,h,a,u,i.attributes,F.Sampler,i.access);this.samplers.push(m);continue}if(s instanceof lt){const i=this._getAttribute(s,"vertex"),a=this._getAttribute(s,"fragment"),u=this._getAttribute(s,"compute"),h=i||a||u;if(h){const m=new bn(s.name,h==null?void 0:h.name);m.inputs=this._getInputs(s.args),m.outputs=this._getOutputs(s.returnType),m.resources=this._findResources(s),this.entry[h.name].push(m)}continue}}}_findResource(e){for(const r of this.uniforms)if(r.name==e)return r;for(const r of this.storage)if(r.name==e)return r;for(const r of this.textures)if(r.name==e)return r;for(const r of this.samplers)if(r.name==e)return r;return null}_findResources(e){const r=[],n=this,s=[];return e.search(i=>{if(i instanceof Oe)s.push({});else if(i instanceof Re)s.pop();else if(i instanceof ie){if(s.length>0){const a=i;s[s.length-1][a.name]=a}}else if(i instanceof ht){if(s.length>0){const a=i;s[s.length-1][a.name]=a}}else if(i instanceof sr){const a=i;if(s.length>0&&s[s.length-1][a.name])return;const u=n._findResource(a.name);u&&r.push(u)}else if(i instanceof nr){const a=i,u=n._functions.get(a.name);u&&(u.resources===null&&(u.resources=n._findResources(u.node)),r.push(...u.resources))}}),[...new Map(r.map(i=>[i.name,i])).values()]}getBindGroups(){const e=[];function r(n,s){n>=e.length&&(e.length=n+1),e[n]===void 0&&(e[n]=[]),s>=e[n].length&&(e[n].length=s+1)}for(const n of this.uniforms){r(n.group,n.binding);const s=e[n.group];s[n.binding]=n}for(const n of this.storage){r(n.group,n.binding);const s=e[n.group];s[n.binding]=n}for(const n of this.textures){r(n.group,n.binding);const s=e[n.group];s[n.binding]=n}for(const n of this.samplers){r(n.group,n.binding);const s=e[n.group];s[n.binding]=n}return e}_getOutputs(e,r=void 0){if(r===void 0&&(r=[]),e instanceof se)this._getStructOutputs(e,r);else{const n=this._getOutputInfo(e);n!==null&&r.push(n)}return r}_getStructOutputs(e,r){for(const n of e.members)if(n.type instanceof se)this._getStructOutputs(n.type,r);else{const s=this._getAttribute(n,"location")||this._getAttribute(n,"builtin");if(s!==null){const i=this._getTypeInfo(n.type,n.type.attributes),a=this._parseInt(s.value),u=new Ct(n.name,i,s.name,a);r.push(u)}}}_getOutputInfo(e){const r=this._getAttribute(e,"location")||this._getAttribute(e,"builtin");if(r!==null){const n=this._getTypeInfo(e,e.attributes),s=this._parseInt(r.value);return new Ct("",n,r.name,s)}return null}_getInputs(e,r=void 0){r===void 0&&(r=[]);for(const n of e)if(n.type instanceof se)this._getStructInputs(n.type,r);else{const s=this._getInputInfo(n);s!==null&&r.push(s)}return r}_getStructInputs(e,r){for(const n of e.members)if(n.type instanceof se)this._getStructInputs(n.type,r);else{const s=this._getInputInfo(n);s!==null&&r.push(s)}}_getInputInfo(e){const r=this._getAttribute(e,"location")||this._getAttribute(e,"builtin");if(r!==null){const n=this._getAttribute(e,"interpolation"),s=this._getTypeInfo(e.type,e.attributes),i=this._parseInt(r.value),a=new xn(e.name,s,r.name,i);return n!==null&&(a.interpolation=this._parseString(n.value)),a}return null}_parseString(e){return e instanceof Array&&(e=e[0]),e}_parseInt(e){e instanceof Array&&(e=e[0]);const r=parseInt(e);return isNaN(r)?e:r}_getAlias(e){for(const r of this.aliases)if(r.name==e)return r.type;return null}_getAliasInfo(e){return new wn(e.name,this._getTypeInfo(e.type,null))}_getTypeInfo(e,r){if(this._types.has(e))return this._types.get(e);if(e instanceof rr){const s=e,i=this._getTypeInfo(s.format,s.attributes),a=new et(s.name,r);return a.format=i,a.count=s.count,this._types.set(e,a),this._updateTypeInfo(a),a}if(e instanceof se){const s=e,i=new ze(s.name,r);for(const a of s.members){const u=this._getTypeInfo(a.type,a.attributes);i.members.push(new Bt(a.name,u,a.attributes))}return this._types.set(e,i),this._updateTypeInfo(i),i}if(e instanceof be){const s=e,i=s.format instanceof oe,a=s.format?i?this._getTypeInfo(s.format,null):new _e(s.format,null):null,u=new Dt(s.name,a,r,s.access);return this._types.set(e,u),this._updateTypeInfo(u),u}if(e instanceof tr){const s=e,i=s.format?this._getTypeInfo(s.format,null):null,a=new Dt(s.name,i,r,s.access);return this._types.set(e,a),this._updateTypeInfo(a),a}const n=new _e(e.name,r);return this._types.set(e,n),this._updateTypeInfo(n),n}_updateTypeInfo(e){var r,n;const s=this._getTypeSize(e);if(e.size=(r=s==null?void 0:s.size)!==null&&r!==void 0?r:0,e instanceof et){const i=this._getTypeSize(e.format);e.stride=(n=i==null?void 0:i.size)!==null&&n!==void 0?n:0,this._updateTypeInfo(e.format)}e instanceof ze&&this._updateStructInfo(e)}_updateStructInfo(e){var r;let n=0,s=0,i=0,a=0;for(let u=0,h=e.members.length;u<h;++u){const m=e.members[u],f=this._getTypeSize(m);if(!f)continue;(r=this._getAlias(m.type.name))!==null&&r!==void 0||m.type;const d=f.align,g=f.size;n=this._roundUp(d,n+s),s=g,i=n,a=Math.max(a,d),m.offset=n,m.size=g,this._updateTypeInfo(m.type)}e.size=this._roundUp(a,i+s),e.align=a}_getTypeSize(e){var r;if(e==null)return null;const n=this._getAttributeNum(e.attributes,"size",0),s=this._getAttributeNum(e.attributes,"align",0);if(e instanceof Bt&&(e=e.type),e instanceof _e){const i=this._getAlias(e.name);i!==null&&(e=i)}{const i=W._typeInfo[e.name];if(i!==void 0){const a=e.format==="f16"?2:1;return new Fe(Math.max(s,i.align/a),Math.max(n,i.size/a))}}{const i=W._typeInfo[e.name.substring(0,e.name.length-1)];if(i){const a=e.name[e.name.length-1]==="h"?2:1;return new Fe(Math.max(s,i.align/a),Math.max(n,i.size/a))}}if(e instanceof et){let i=e,a=8,u=8;const h=this._getTypeSize(i.format);h!==null&&(u=h.size,a=h.align);const m=i.count,f=this._getAttributeNum((r=e==null?void 0:e.attributes)!==null&&r!==void 0?r:null,"stride",this._roundUp(a,u));return u=m*f,n&&(u=n),new Fe(Math.max(s,a),Math.max(n,u))}if(e instanceof ze){let i=0,a=0,u=0,h=0,m=0;for(const f of e.members){const d=this._getTypeSize(f.type);d!==null&&(i=Math.max(d.align,i),u=this._roundUp(d.align,u+h),h=d.size,m=u)}return a=this._roundUp(i,m+h),new Fe(Math.max(s,i),Math.max(n,a))}return null}_isUniformVar(e){return e instanceof ie&&e.storage=="uniform"}_isStorageVar(e){return e instanceof ie&&e.storage=="storage"}_isTextureVar(e){return e instanceof ie&&e.type!==null&&W._textureTypes.indexOf(e.type.name)!=-1}_isSamplerVar(e){return e instanceof ie&&e.type!==null&&W._samplerTypes.indexOf(e.type.name)!=-1}_getAttribute(e,r){const n=e;if(!n||!n.attributes)return null;const s=n.attributes;for(let i of s)if(i.name==r)return i;return null}_getAttributeNum(e,r,n){if(e===null)return n;for(let s of e)if(s.name==r){let i=s!==null&&s.value!==null?s.value:n;return i instanceof Array&&(i=i[0]),typeof i=="number"?i:typeof i=="string"?parseInt(i):n}return n}_roundUp(e,r){return Math.ceil(r/e)*e}}W._typeInfo={f16:{align:2,size:2},i32:{align:4,size:4},u32:{align:4,size:4},f32:{align:4,size:4},atomic:{align:4,size:4},vec2:{align:8,size:8},vec3:{align:16,size:12},vec4:{align:16,size:16},mat2x2:{align:8,size:16},mat3x2:{align:8,size:24},mat4x2:{align:8,size:32},mat2x3:{align:16,size:32},mat3x3:{align:16,size:48},mat4x3:{align:16,size:64},mat2x4:{align:16,size:32},mat3x4:{align:16,size:48},mat4x4:{align:16,size:64}};W._textureTypes=o.any_texture_type.map(t=>t.name);W._samplerTypes=o.sampler_type.map(t=>t.name);function me(t,e){return Object.fromEntries(e.map(r=>{const n=Pn(t,r,0);return[r.name,{typeDefinition:n,group:r.group,binding:r.binding,size:n.size}]}))}function or(t,e,r){return{fields:Object.fromEntries(e.members.map(s=>[s.name,{offset:s.offset,type:pt(t,s.type,0)}])),size:e.size,offset:r}}function An(t){var e;if(t.name.includes("depth"))return"depth";switch((e=t.format)==null?void 0:e.name){case"f32":return"float";case"i32":return"sint";case"u32":return"uint";default:throw new Error("unknown texture sample type")}}function Ot(t){return t.name.includes("2d_array")?"2d-array":t.name.includes("cube_array")?"cube-array":t.name.includes("3d")?"3d":t.name.includes("1d")?"1d":t.name.includes("cube")?"cube":"2d"}function En(t){switch(t.access){case"read":return"read-only";case"write":return"write-only";case"read_write":return"read-write";default:throw new Error("unknonw storage texture access")}}function Mn(t){return t.name.endsWith("_comparison")?"comparison":"filtering"}function Nn(t,e){const{binding:r,access:n,type:s}=t;switch(t.resourceType){case F.Uniform:return{binding:r,visibility:e,buffer:{}};case F.Storage:return{binding:r,visibility:e,buffer:{type:n===""||n==="read"?"read-only-storage":"storage"}};case F.Texture:{if(s.name==="texture_external")return{binding:r,visibility:e,externalTexture:{}};const i=s.name.includes("multisampled");return{binding:r,visibility:e,texture:{sampleType:An(s),viewDimension:Ot(s),multisampled:i}}}case F.Sampler:return{binding:r,visibility:e,sampler:{type:Mn(s)}};case F.StorageTexture:return{binding:r,visibility:e,storageTexture:{access:En(s),format:s.format.name,viewDimension:Ot(s)}};default:throw new Error("unknown resource type")}}function tt(t,e){const r={};for(const n of t)r[n.name]={stage:e,resources:n.resources.map(s=>{const{name:i,group:a}=s;return{name:i,group:a,entry:Nn(s,e)}})};return r}function qe(t){const e=new W(t),r=Object.fromEntries(e.structs.map(f=>[f.name,or(e,f,0)])),n=me(e,e.uniforms),s=me(e,e.storage.filter(f=>f.resourceType===F.Storage)),i=me(e,e.storage.filter(f=>f.resourceType===F.StorageTexture)),a=me(e,e.textures.filter(f=>f.type.name!=="texture_external")),u=me(e,e.textures.filter(f=>f.type.name==="texture_external")),h=me(e,e.samplers),m={...tt(e.entry.vertex,GPUShaderStage.VERTEX),...tt(e.entry.fragment,GPUShaderStage.FRAGMENT),...tt(e.entry.compute,GPUShaderStage.COMPUTE)};return{externalTextures:u,samplers:h,structs:r,storages:s,storageTextures:i,textures:a,uniforms:n,entryPoints:m}}function rt(t,e=""){if(!t)throw new Error(e)}function Pn(t,e,r){switch(e.resourceType){case F.Uniform:case F.Storage:case F.StorageTexture:return pt(t,e.type,r);default:return{size:0,type:e.type.name}}}function pt(t,e,r){if(e.isArray){rt(!e.isStruct,"struct array is invalid"),rt(!e.isStruct,"template array is invalid");const n=e;return{size:n.size,elementType:pt(t,n.format,r),numElements:n.count}}else{if(e.isStruct)return rt(!e.isTemplate,"template struct is invalid"),or(t,e,r);{const n=e,s=e.isTemplate?`${n.name}<${n.format.name}>`:e.name;return{size:e.size,type:s}}}}function zn(t){switch(t.dimension){case"1d":return"1d";case"3d":return"3d";default:case"2d":return t.depthOrArrayLayers>1?"2d-array":"2d"}}function Gn(t){return[t.width,t.height||1,t.depthOrArrayLayers||1]}function Fn(t){return Array.isArray(t)||Z(t)?[...t,1,1].slice(0,3):Gn(t)}function ur(t,e){const r=Fn(t),n=Math.max(...r.slice(0,e==="3d"?3:2));return 1+Math.log2(n)|0}function In(t){let e,r;switch(t){case"2d":e="texture_2d<f32>",r="textureSample(ourTexture, ourSampler, fsInput.texcoord)";break;case"2d-array":e="texture_2d_array<f32>",r=`
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
      `}const Rt=new WeakMap;function cr(t,e,r){let n=Rt.get(t);n||(n={pipelineByFormatAndView:{},moduleByViewType:{}},Rt.set(t,n));let{sampler:s,uniformBuffer:i,uniformValues:a}=n;const{pipelineByFormatAndView:u,moduleByViewType:h}=n;r=r||zn(e);let m=h[r];if(!m){const g=In(r);m=t.createShaderModule({label:`mip level generation for ${r}`,code:g}),h[r]=m}s||(s=t.createSampler({minFilter:"linear",magFilter:"linear"}),i=t.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=new Uint32Array(1),Object.assign(n,{sampler:s,uniformBuffer:i,uniformValues:a}));const f=`${e.format}.${r}`;u[f]||(u[f]=t.createRenderPipeline({label:`mip level generator pipeline for ${r}`,layout:"auto",vertex:{module:m,entryPoint:"vs"},fragment:{module:m,entryPoint:"fs",targets:[{format:e.format}]}}));const d=u[f];for(let g=1;g<e.mipLevelCount;++g)for(let _=0;_<e.depthOrArrayLayers;++_){a[0]=_,t.queue.writeBuffer(i,0,a);const k=t.createBindGroup({layout:d.getBindGroupLayout(0),entries:[{binding:0,resource:s},{binding:1,resource:e.createView({dimension:r,baseMipLevel:g-1,mipLevelCount:1})},{binding:2,resource:{buffer:i}}]}),v={label:"mip gen renderPass",colorAttachments:[{view:e.createView({dimension:"2d",baseMipLevel:g,mipLevelCount:1,baseArrayLayer:_,arrayLayerCount:1}),loadOp:"clear",storeOp:"store"}]},y=t.createCommandEncoder({label:"mip gen encoder"}),T=y.beginRenderPass(v);T.setPipeline(d),T.setBindGroup(0,k),T.draw(3),T.end();const x=y.finish();t.queue.submit([x])}}const Vn=new Map([[Int8Array,{formats:["sint8","snorm8"],defaultForType:1}],[Uint8Array,{formats:["uint8","unorm8"],defaultForType:1}],[Int16Array,{formats:["sint16","snorm16"],defaultForType:1}],[Uint16Array,{formats:["uint16","unorm16"],defaultForType:1}],[Int32Array,{formats:["sint32","snorm32"],defaultForType:0}],[Uint32Array,{formats:["uint32","unorm32"],defaultForType:0}],[Float32Array,{formats:["float32","float32"],defaultForType:0}]]);new Map([...Vn.entries()].map(([t,{formats:[e,r]}])=>[[e,t],[r,t]]).flat());function Un(t){const e=t;return Z(e.data)||Array.isArray(e.data)}function lr(t){return Z(t)||Array.isArray(t)||Un(t)}function Ln(t,e){if(Z(t))return t;const{Type:r}=dt(e);return new r(t)}function Bn(t,e,r,n="2d"){if(r%1!==0)throw new Error("can't guess dimensions");if(!t&&!e){const i=Math.sqrt(r/(n==="cube"?6:1));i%1===0?(t=i,e=i):(t=r,e=1)}else if(e){if(!t&&(t=r/e,t%1))throw new Error("can't guess dimensions")}else if(e=r/t,e%1)throw new Error("can't guess dimensions");const s=r/t/e;if(s%1)throw new Error("can't guess dimensions");return[t,e,s]}function Dn(t){switch(t){case"1d":return"1d";case"3d":return"3d";default:return"2d"}}const Cn={"8snorm":Int8Array,"8unorm":Uint8Array,"8sint":Int8Array,"8uint":Uint8Array,"16snorm":Int16Array,"16unorm":Uint16Array,"16sint":Int16Array,"16uint":Uint16Array,"32snorm":Int32Array,"32unorm":Uint32Array,"32sint":Int32Array,"32uint":Uint32Array,"16float":Uint16Array,"32float":Float32Array},On=/([a-z]+)(\d+)([a-z]+)/;function dt(t){const[,e,r,n]=On.exec(t),s=e.length,i=parseInt(r)/8,a=s*i,u=Cn[`${r}${n}`];return{channels:e,numChannels:s,bytesPerChannel:i,bytesPerElement:a,Type:u}}function Rn(t,e){return[t.width,t.height,t.depthOrArrayLayers].map(r=>Math.max(1,Math.floor(r/2**e)))}function qn(t,e,r,n){const s=Ln(r.data||r,e.format),a=Rn(e,0),{bytesPerElement:u}=dt(e.format),h=n.origin||[0,0,0];t.queue.writeTexture({texture:e,origin:h},s,{bytesPerRow:u*a[0],rowsPerImage:a[1]},a)}function Hn(t,e,r,n={}){r.forEach((s,i)=>{const a=[0,0,i+(n.baseArrayLayer||0)];if(lr(s))qn(t,e,s,{origin:a});else{const u=s,{flipY:h,premultipliedAlpha:m,colorSpace:f}=n;t.queue.copyExternalImageToTexture({source:u,flipY:h},{texture:e,premultipliedAlpha:m,colorSpace:f,origin:a},hr(u,n))}}),e.mipLevelCount>1&&cr(t,e)}function hr(t,e){if(t instanceof HTMLVideoElement)return[t.videoWidth,t.videoHeight,1];{const r=t,{width:n,height:s}=r;if(n>0&&s>0&&!lr(t))return[n,s,1];const i=e.format||"rgba8unorm",{bytesPerElement:a,bytesPerChannel:u}=dt(i),h=Z(t)||Array.isArray(t)?t:t.data,f=(Z(h)?h.byteLength:h.length*u)/a;return Bn(n,s,f)}}function Xn(t,e,r={}){const n=hr(e[0],r);n[2]=n[2]>1?n[2]:e.length;const s=t.createTexture({dimension:Dn(r.dimension),format:r.format||"rgba8unorm",mipLevelCount:r.mipLevelCount?r.mipLevelCount:r.mips?ur(n):1,size:n,usage:(r.usage??0)|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});return Hn(t,s,e,r),s}async function jn(t,e={}){const n=await(await fetch(t)).blob(),s={...e,...e.colorSpaceConversion!==void 0&&{colorSpaceConversion:"none"}};return await createImageBitmap(n,s)}async function $n(t,e,r={}){const n=await Promise.all(e.map(s=>jn(s)));return Xn(t,n,r)}async function Yn(t,e,r={}){return $n(t,[e],r)}const Wn=100,nt=1/Wn,Jn=1/30,He=4,Qn=`@group(0) @binding(0) var texture: texture_cube<f32>;\r
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
`;class Zn{constructor(){V(this,"render")}async init(e,r,n,s){const i=e.createShaderModule({code:ae+Qn}),a=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}},{binding:2,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{}}]}),h={layout:e.createPipelineLayout({bindGroupLayouts:[a]}),vertex:{module:i,entryPoint:"vert",buffers:[]},fragment:{module:i,entryPoint:"frag",targets:[{format:r}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:He},depthStencil:{depthWriteEnabled:!0,depthCompare:"less-equal",format:"depth24plus"}},m=e.createRenderPipeline(h),f=e.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"});let d=e.createBindGroup({layout:a,entries:[{binding:0,resource:n.createView({dimension:"cube"})},{binding:1,resource:f},{binding:2,resource:{buffer:s}}]});this.render=g=>{g.setPipeline(m),g.setBindGroup(0,d),g.draw(3)}}}const Kn=`const PI = 3.14159265359;\r
\r
struct ObjectData {\r
    model: mat4x4f,\r
    normalMatrix: mat4x4f,\r
    metallic: f32,\r
    roughness: f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> cameraData: CameraData;\r
\r
@group(1) @binding(0) var textureSampler: sampler;\r
@group(1) @binding(1) var albedoTexture: texture_2d<f32>;\r
@group(1) @binding(2) var emissionTexture: texture_2d<f32>;\r
@group(1) @binding(3) var normalTexture: texture_2d<f32>;\r
@group(1) @binding(4) var occlusionRoughnessMetalicTexture: texture_2d<f32>;\r
@group(1) @binding(5) var environmentIrradianceCubeMapTexture: texture_cube<f32>;\r
@group(1) @binding(6) var environmentPrefilterCubeMapTexture: texture_cube<f32>;\r
@group(1) @binding(7) var brdfLUT: texture_2d<f32>;\r
\r
@group(2) @binding(0) var<storage, read> objectData: array<ObjectData>;\r
\r
struct VertexInput {\r
    @builtin(instance_index) instanceIndex: u32,\r
    @location(0) position: vec4f,\r
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
}\r
\r
@vertex\r
fn vert(i: VertexInput) -> VertexOutput {\r
    let objectData = objectData[i.instanceIndex];\r
\r
    var o: VertexOutput;\r
\r
    o.fragPosition = cameraData.projection * cameraData.view * objectData.model * i.position;\r
    o.worldPosition = (objectData.model * i.position).xyz;\r
    o.uv = i.uv;\r
    o.tangnet = normalize((objectData.normalMatrix * vec4(i.tangent, 0)).xyz);\r
    o.bitangent = normalize((objectData.normalMatrix * vec4(i.bitangent, 0)).xyz);\r
    o.normal = normalize((objectData.normalMatrix * vec4(i.normal, 0)).xyz);\r
    o.metallic = objectData.metallic;\r
    o.roughness = objectData.roughness;\r
\r
    return o;\r
}\r
\r
@fragment\r
fn frag(i: VertexOutput) -> @location(0) vec4f {\r
    const gamma: f32 = 2.2;\r
    const exposure: f32 = 1;\r
\r
    let albedo = pow(textureSample(albedoTexture, textureSampler, i.uv).rgb, vec3(gamma));\r
//    let albedo: vec3f = vec3(0.5, 0, 0);\r
//    let albedo: vec3f = vec3(1, 1, 1);\r
\r
    let emission = pow(textureSample(emissionTexture, textureSampler, i.uv).rgb, vec3(gamma));\r
//    let emission: vec3f = vec3(0, 0, 0);\r
\r
    let occlusionRoughnessMetalic = textureSample(occlusionRoughnessMetalicTexture, textureSampler, i.uv).rgb;\r
//    let occlusionRoughnessMetalic: vec3f = vec3(1, i.roughness, i.metallic);\r
\r
    let TBN = mat3x3(i.tangnet, i.bitangent, i.normal);\r
    let tangentSpaceNormal = textureSample(normalTexture, textureSampler, i.uv).rgb * 2 - 1;\r
//    let tangentSpaceNormal: vec3f = vec3(0, 0, 1);\r
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
`,es=`const PI = 3.14159265359;\r
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
`;class ft{constructor(e=100){V(this,"samples",[]);V(this,"numSamples");V(this,"total",0);V(this,"_average",0);if(e<1)throw new Error("numSamples should be larger than 0");this.numSamples=e}addSample(e){if(this.samples.push(e),this.total+=e,this.samples.length>this.numSamples){const r=this.samples.shift();this.total-=r}this._average=this.total/this.samples.length}average(){return this._average}}class fr{constructor(e,r){V(this,"_canTimestamp");V(this,"querySet");V(this,"resolveBuffer");V(this,"resultBuffer");V(this,"gpuTimeMS",new ft);V(this,"newResultCallback");this._canTimestamp=e.features.has("timestamp-query"),this._canTimestamp&&(this.querySet=e.createQuerySet({type:"timestamp",count:2}),this.resolveBuffer=e.createBuffer({size:this.querySet.count*8,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),this.resultBuffer=e.createBuffer({size:this.resolveBuffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1})}storeTime(e){this._canTimestamp&&(e.resolveQuerySet(this.querySet,0,this.querySet.count,this.resolveBuffer,0),this.resultBuffer.mapState==="unmapped"&&e.copyBufferToBuffer(this.resolveBuffer,0,this.resultBuffer,0,this.resultBuffer.size))}recordTime(){this._canTimestamp&&this._canTimestamp&&this.resultBuffer.mapState==="unmapped"&&this.resultBuffer.mapAsync(GPUMapMode.READ).then(()=>{const e=new BigInt64Array(this.resultBuffer.getMappedRange()),r=Number(e[1]-e[0])/(1e3*1e3);this.gpuTimeMS.addSample(r),this.resultBuffer.unmap(),this.newResultCallback&&this.newResultCallback(r)})}canTimestamp(){return this._canTimestamp}averageMS(){return this.gpuTimeMS.average()}}function ts(t){const e="rgba16float",r=t.createTexture({size:[512,512],format:e,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),n=t.createShaderModule({code:es}),i={layout:t.createPipelineLayout({bindGroupLayouts:[]}),vertex:{module:n,entryPoint:"vert",buffers:[]},fragment:{module:n,entryPoint:"frag",targets:[{format:e}]},primitive:{topology:"triangle-list",cullMode:"none"}},a=t.createRenderPipeline(i),u={colorAttachments:[{view:r.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},h=new fr(t,u),m=t.createCommandEncoder(),f=m.beginRenderPass(u);return f.setPipeline(a),f.draw(3),f.end(),h.storeTime(m),t.queue.submit([m.finish()]),h.recordTime(),r}const qt=ae+Kn;class rs{constructor(){V(this,"render")}async init(e,r,n,s,i){const m=[];for(let P=0;P<1;P++){const Ne=P/1;for(let Y=0;Y<1;Y++){const Pe=ot(Y/1,.05,1),ee=500,te=U(),ce=de();Jt(ce,ce,Ir*180),kr(te,ce,M((Y-1/2)*2.5+2.5/2,(P-1/2)*2.5+2.5/2,0),M(ee,ee,ee));const re=U();Be(re,te),wr(re,re),m.push({model:te,normalMatrix:re,metallic:Ne,roughness:Pe})}}const f=qe(qt),d=Ce(f.storages.objectData,new ArrayBuffer(f.structs.ObjectData.size*1*1)),g=r.createBuffer({size:d.arrayBuffer.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});d.set(m),r.queue.writeBuffer(g,0,d.arrayBuffer);let{vertices:_,indices:k,uvs:v,normals:y,tangents:T,bitangents:x,textureURIs:b}=await Ur(e);v||console.log("model missing texurecoords"),y||(console.log("model missing normals. calculating new normals."),y=Lr(_,k)),(!T||!x)&&(v?(console.log("model missing tangents or bitangents. calculating new tangents"),{tangents:T,bitangents:x}=Br(_,k,v)):console.log("model missing tangents or bitangents, but new tangents cannot be calculated because the model is also missing uvs")),b.length!==4&&(b=["normal.png","normal.png","normal.png","normal.png"]);let w=await Promise.all(b.map(P=>Yn(r,P,{mips:!0,flipY:!0})));const S=fe(r,_,GPUBufferUsage.VERTEX),A=fe(r,k,GPUBufferUsage.INDEX),L=fe(r,v,GPUBufferUsage.VERTEX),I=fe(r,y,GPUBufferUsage.VERTEX),C=fe(r,T,GPUBufferUsage.VERTEX),q=fe(r,x,GPUBufferUsage.VERTEX),O=r.createShaderModule({code:qt}),X=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{}}]}),R=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:5,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:7,visibility:GPUShaderStage.FRAGMENT,texture:{}}]}),N=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),ve={layout:r.createPipelineLayout({bindGroupLayouts:[X,R,N]}),vertex:{module:O,entryPoint:"vert",buffers:[{arrayStride:3*4,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},{arrayStride:3*4,attributes:[{shaderLocation:1,offset:0,format:"float32x3"}]},{arrayStride:2*4,attributes:[{shaderLocation:2,offset:0,format:"float32x2"}]},{arrayStride:3*4,attributes:[{shaderLocation:3,offset:0,format:"float32x3"}]},{arrayStride:3*4,attributes:[{shaderLocation:4,offset:0,format:"float32x3"}]}]},fragment:{module:O,entryPoint:"frag",targets:[{format:n}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:He},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"}},Ae=r.createRenderPipeline(ve),Ee=r.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"});let Me=r.createBindGroup({layout:X,entries:[{binding:0,resource:{buffer:s}}]}),$e=ts(r),K=r.createBindGroup({layout:R,entries:[{binding:0,resource:Ee},{binding:1,resource:w[0].createView()},{binding:2,resource:w[3].createView()},{binding:3,resource:w[2].createView()},{binding:4,resource:w[1].createView()},{binding:5,resource:i.irradianceCubeMapTexture.createView({dimension:"cube"})},{binding:6,resource:i.prefilterCubeMapTexture.createView({dimension:"cube"})},{binding:7,resource:$e.createView()}]}),ue=r.createBindGroup({layout:N,entries:[{binding:0,resource:{buffer:g}}]});this.render=P=>{P.setPipeline(Ae),P.setBindGroup(0,Me),P.setBindGroup(1,K),P.setBindGroup(2,ue),P.setVertexBuffer(0,S),P.setVertexBuffer(1,I),P.setVertexBuffer(2,L),P.setVertexBuffer(3,C),P.setVertexBuffer(4,q),P.setIndexBuffer(A,"uint32"),P.drawIndexed(k.length,1*1)}}}const mr=new Float32Array(1),ns=new Int32Array(mr.buffer);function Le(t){mr[0]=t;var e=ns[0],r=e>>16&32768,n=e>>12&2047,s=e>>23&255;return s<103?r:s>142?(r|=31744,r|=(s==255?0:1)&&e&8388607,r):s<113?(n|=2048,r|=(n>>114-s)+(n>>113-s&1),r):(r|=s-112<<10|n>>1,r+=n&1,r)}const ss=Le(1);let is="#\\?RADIANCE",as="#.*",os="EXPOSURE=\\s*([0-9]*[.][0-9]*)",us="FORMAT=32-bit_rle_rgbe",cs="-Y ([0-9]+) \\+X ([0-9]+)";async function ls(t){const r=await(await fetch(t)).arrayBuffer(),n=new Uint8Array(r);let s=0;const i=n.length,a=10;function u(){let x="";for(;++s<i;){let b=n[s];if(b==a){s+=1;break}x+=String.fromCharCode(b)}return x}let h=0,m=0,f=1,d=1;for(let x=0;x<20;x+=1){let b=u(),w;if(!(w=b.match(is))){if(!(w=b.match(us))){if(w=b.match(os))f=Number(w[1]);else if(!(w=b.match(as))){if(w=b.match(cs)){m=Number(w[1]),h=Number(w[2]);break}}}}}let g=new Uint8Array(h*m*4);hs(n,g,0,s,h,m);let v=0;const y=4;let T=new Uint16Array(h*m*y);for(let x=0;x<g.length;x+=4){let b=g[x]/255,w=g[x+1]/255,S=g[x+2]/255;const A=g[x+3],L=Math.pow(2,A-128);b*=L,w*=L,S*=L;const I=x;T[I]=Le(b),T[I+1]=Le(w),T[I+2]=Le(S),T[I+3]=ss;const C=(b+w+S)/3;C>v&&(v=C)}return v>25&&(console.log("hdr image has very high intensities. the intensity will be clamped to 25 for the irradiance map."),console.log("max intensity: "+v)),{width:h,height:m,exposure:f,gamma:d,data:T}}function hs(t,e,r,n,s,i){const a=new Array(4);let u=null,h,m,f;const d=new Array(2),g=t.length;function _(y){let T=0;do y[T++]=t[n],n+=1;while(n<g&&T<y.length);return T}function k(y,T,x){let b=0;do y[T+b]=t[n],b+=1,n+=1;while(n<g&&b<x);return b}function v(y,T,x){const b=4*x;let w=k(y,T,b);if(w<b)throw new Error("Error reading raw pixels: got "+w+" bytes, expected "+b)}for(;i>0;){if(_(a)<a.length)throw new Error("Error reading bytes: expected "+a.length);if(a[0]!=2||a[1]!=2||a[2]&128){e[r+0]=a[0],e[r+1]=a[1],e[r+2]=a[2],e[r+3]=a[3],r+=4,v(e,r,s*i-1);return}if(((a[2]&255)<<8|a[3]&255)!=s)throw new Error("Wrong scanline width "+((a[2]&255)<<8|a[3]&255)+", expected "+s);u==null&&(u=new Array(4*s)),h=0;for(let y=0;y<4;y+=1)for(m=(y+1)*s;h<m;){if(_(d)<d.length)throw new Error("Error reading 2-byte buffer");if((d[0]&255)>128){if(f=(d[0]&255)-128,f==0||f>m-h)throw new Error("Bad scanline data");for(;f-- >0;)u[h++]=d[1]}else{if(f=d[0]&255,f==0||f>m-h)throw new Error("Bad scanline data");if(u[h++]=d[1],--f>0){if(k(u,h,f)<f)throw new Error("Error reading non-run data");h+=f}}}for(let y=0;y<s;y+=1)e[r+0]=u[y],e[r+1]=u[y+s],e[r+2]=u[y+2*s],e[r+3]=u[y+3*s],r+=4;i-=1}}const fs=`@group(0) @binding(0) var texture: texture_2d<f32>;\r
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
`,ms=`const PI = 3.14159265359;\r
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
`,ps=`const PI = 3.14159265359;\r
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
`,ds=[he(U(),M(0,0,0),M(-1,0,0),M(0,1,0)),he(U(),M(0,0,0),M(1,0,0),M(0,1,0)),he(U(),M(0,0,0),M(0,1,0),M(0,0,-1)),he(U(),M(0,0,0),M(0,-1,0),M(0,0,1)),he(U(),M(0,0,0),M(0,0,1),M(0,1,0)),he(U(),M(0,0,0),M(0,0,-1),M(0,1,0))];let st;function Xe(t){return st||(st=_s(t)),st}function _s(t){return t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{}}]})}let it;function _t(t){return it||(it=gs(t)),it}function gs(t){const e=qe(ae);return ds.map(r=>{const n=Ce(e.structs.CameraData),s=t.createBuffer({size:n.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let i=U();Yt(i,Math.PI/180*90,1,.01,1e3);let a=U();return $t(a,r),Ve(a,i,a),Be(a,a),n.set({viewDirectionProjectionInverse:a}),t.queue.writeBuffer(s,0,n.arrayBuffer),t.createBindGroup({layout:Xe(t),entries:[{binding:0,resource:{buffer:s}}]})})}const Ht=2048,Xt=32,jt=512,at=5;async function ys(t,e){const r=t.createShaderModule({code:ae+fs}),n=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),s=t.createPipelineLayout({bindGroupLayouts:[n,Xe(t)]}),i="rgba16float",a={layout:s,vertex:{module:r,entryPoint:"vert",buffers:[]},fragment:{module:r,entryPoint:"frag",targets:[{format:i}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:1}},u=t.createRenderPipeline(a),h=t.createSampler({magFilter:"linear",minFilter:"linear"}),m=[Ht,Ht,6],f=ur(m),d=t.createTexture({size:m,mipLevelCount:f,format:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),g=t.createCommandEncoder();let _=t.createBindGroup({layout:n,entries:[{binding:0,resource:e.createView()},{binding:1,resource:h}]});const k=_t(t);for(let v=0;v<k.length;v++){const y={colorAttachments:[{view:d.createView({dimension:"2d",baseArrayLayer:v,arrayLayerCount:1,baseMipLevel:0,mipLevelCount:1}),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},T=g.beginRenderPass(y);T.setPipeline(u),T.setBindGroup(0,_),T.setBindGroup(1,k[v]),T.draw(3),T.end()}return t.queue.submit([g.finish()]),cr(t,d),d}async function vs(t,e){const r=t.createShaderModule({code:ae+ms}),n=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),s=t.createPipelineLayout({bindGroupLayouts:[n,Xe(t)]}),i="rgba16float",a={layout:s,vertex:{module:r,entryPoint:"vert",buffers:[]},fragment:{module:r,entryPoint:"frag",targets:[{format:i}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:1}},u=t.createRenderPipeline(a),h=t.createSampler({magFilter:"linear",minFilter:"linear"}),m=t.createTexture({size:[Xt,Xt,6],format:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=t.createCommandEncoder();let d=t.createBindGroup({layout:n,entries:[{binding:0,resource:e.createView({dimension:"cube"})},{binding:1,resource:h}]});const g=_t(t);for(let _=0;_<g.length;_++){const k={colorAttachments:[{view:m.createView({dimension:"2d",baseArrayLayer:_,arrayLayerCount:1}),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},v=f.beginRenderPass(k);v.setPipeline(u),v.setBindGroup(0,d),v.setBindGroup(1,g[_]),v.draw(3),v.end()}return t.queue.submit([f.finish()]),m}async function ws(t,e){const r=t.createShaderModule({code:ae+ps}),n=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),s=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{}}]}),i=t.createPipelineLayout({bindGroupLayouts:[n,Xe(t),s]}),a="rgba16float",u={layout:i,vertex:{module:r,entryPoint:"vert",buffers:[]},fragment:{module:r,entryPoint:"frag",targets:[{format:a}]},primitive:{topology:"triangle-list",cullMode:"back"},multisample:{count:1}},h=t.createRenderPipeline(u),m=t.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"}),f=t.createTexture({size:[jt,jt,6],mipLevelCount:at,format:a,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=t.createCommandEncoder();let g=t.createBindGroup({layout:n,entries:[{binding:0,resource:e.createView({dimension:"cube"})},{binding:1,resource:m}]});const _=_t(t);for(let k=0;k<at;k++){const v=k/(at-1),y=t.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(y,0,new Float32Array([v]));let T=t.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:y}}]});for(let x=0;x<_.length;x++){const b={colorAttachments:[{view:f.createView({dimension:"2d",baseArrayLayer:x,arrayLayerCount:1,baseMipLevel:k,mipLevelCount:1}),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},w=d.beginRenderPass(b);w.setPipeline(h),w.setBindGroup(0,g),w.setBindGroup(1,_[x]),w.setBindGroup(2,T),w.draw(3),w.end()}}return t.queue.submit([d.finish()]),f}class xs{constructor(){V(this,"equirectangularTexture");V(this,"cubeMapTexture");V(this,"irradianceCubeMapTexture");V(this,"prefilterCubeMapTexture")}async init(e,r){const n=await ls(r),s=e.createTexture({size:{width:n.width,height:n.height},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});this.equirectangularTexture=s,e.queue.writeTexture({texture:s},n.data.buffer,{bytesPerRow:8*n.width},{width:n.width,height:n.height}),this.cubeMapTexture=await ys(e,s),this.irradianceCubeMapTexture=await vs(e,this.cubeMapTexture),this.prefilterCubeMapTexture=await ws(e,this.cubeMapTexture)}}async function bs(){const{gpu:t,device:e}=await Vr(),r=document.querySelector("canvas");if(r===null){console.log("no canvas");return}const n=r.getContext("webgpu");if(n===null){console.log("webgpu context was null");return}Me();const s=t.getPreferredCanvasFormat();n.configure({device:e,format:s,alphaMode:"opaque"});const i=[],a=[],u=[],h=[];let m=U(),f=U(),d=de(),g=M(0,0,0),_=0,k=U(),v=de(),y=M(0,0,0),T=U(),x=de(),b=M(0,0,15),w=U(),S=U(),A=Wt(),L=B();function I(){Yt(m,Math.PI/180*90,r.width/r.height,.01,1e3),Qe(f,d,g),Qe(k,v,y),Qe(T,x,b),Ve(T,k,T),Ve(T,f,T),A[0]=0,A[1]=0,A[2]=0,A[3]=1,Nr(A,A,T),L[0]=A[0],L[1]=A[1],L[2]=A[2],Be(w,T),$t(S,w),S[12]=0,S[13]=0,S[14]=0,Ve(S,m,S),Be(S,S)}I();const C=qe(ae),q=Ce(C.structs.CameraData),O=e.createBuffer({size:q.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),X=qe(gr),R=Ce(X.uniforms.timeData),N=e.createBuffer({size:R.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});function je(){q.set({view:w,projection:m,position:L,viewDirectionProjectionInverse:S}),e.queue.writeBuffer(O,0,q.arrayBuffer)}je();const ve=new xs;await ve.init(e,"buikslotermeerplein_1k.hdr");const Ae=new rs;await Ae.init("BoomBox.glb",e,s,O,ve),i.push(Ae.render);const Ee=new Zn;await Ee.init(e,s,ve.cubeMapTexture,O),i.push(Ee.render);function Me(){const G=Math.max(1,Math.min(e.limits.maxTextureDimension2D,r.clientWidth)),we=Math.max(1,Math.min(e.limits.maxTextureDimension2D,r.clientHeight)),le=G!==r.width||we!==r.height;return le&&(r.width=G,r.height=we),le}function $e(){Me()&&(Ne(),Pe(),I())}const K={colorAttachments:[{clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},ue=new fr(e,K);let P;function Ne(){P&&P.destroy(),P=e.createTexture({size:[r.width,r.height],format:"depth24plus",sampleCount:He,usage:GPUTextureUsage.RENDER_ATTACHMENT}),K.depthStencilAttachment.view=P.createView()}Ne();let Y;function Pe(){Y&&Y.destroy(),Y=e.createTexture({format:s,usage:GPUTextureUsage.RENDER_ATTACHMENT,size:[r.width,r.height],sampleCount:He}),K.colorAttachments[0].view=Y.createView()}Pe();let ee=0,te=0,ce=0,re=0;document.addEventListener("mousemove",G=>{ee=G.clientX,te=G.clientY});let Ye=!1;document.addEventListener("mousedown",G=>{G.button===0?Ye=!0:G.button}),document.addEventListener("mouseup",G=>{G.button===0?Ye=!1:G.button}),document.addEventListener("wheel",G=>{b[2]=ot(b[2]*(1+G.deltaY/(500/1.5)),.5,250),I()});const pr=document.getElementById("info");let gt=new ft,yt=new ft;const vt=U();let wt=0,We=!1,xt=0,Je=0;async function bt(G){const we=performance.now();G*=.001;const le=G-xt,ne=Math.min(le,Jn);Je+=ne;let kt=ce-ee,Tt=re-te;wt+=ne;const St=ne/le;St!==1?(We=!0,console.log(`simulation running at ${Math.round(St*1e3)/10}% normal speed.`)):We&&(We=!1,console.log("simulation running at 100% normal speed.")),$e(),(kt!==0||Tt!==0)&&Ye&&(Jt(d,d,Math.PI/180*kt*.5),_=ot(_+Tt*.5,-89.9,89.9),Gr(v,_,0,0),I());let At=0;for(;Je>=nt;)At++,h.forEach(Q=>{Q(nt)}),Je-=nt;R.set({deltaTime:Math.min(ne,.01)}),e.queue.writeBuffer(N,0,R.arrayBuffer),br(vt,vt,Math.PI/180*ne*10),je();const xe=e.createCommandEncoder();K.colorAttachments[0].resolveTarget=n.getCurrentTexture().createView(),u.forEach(Q=>{Q(xe)});const Et=xe.beginRenderPass(K);i.forEach(Q=>{Q(Et)}),Et.end(),ue.storeTime(xe);const Mt=xe.beginComputePass();a.forEach(Q=>{Q(Mt,At,wt)}),Mt.end(),e.queue.submit([xe.finish()]),ue.recordTime(),xt=G,ce=ee,re=te,gt.addSample(1/ne),yt.addSample(performance.now()-we),pr.innerHTML=`
    fps: ${gt.average().toFixed(0)}
    <br/>js:&nbsp; ${yt.average().toFixed(2)}ms
    ${ue.canTimestamp()?`<br/>gpu: ${ue.averageMS().toFixed(2)}ms`:""}
    `,requestAnimationFrame(bt)}requestAnimationFrame(bt)}window.onload=()=>{bs().then()};
