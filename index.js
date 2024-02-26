"use strict";var H=Object.defineProperty;var Q=Object.getOwnPropertyDescriptor;var V=Object.getOwnPropertyNames;var X=Object.prototype.hasOwnProperty;var _=(f,i)=>{for(var s in i)H(f,s,{get:i[s],enumerable:!0})},B=(f,i,s,r)=>{if(i&&typeof i=="object"||
typeof i=="function")for(let n of V(i))!X.call(f,n)&&n!==s&&H(f,n,{get:()=>i[n],enumerable:!(r=Q(i,n))||
r.enumerable});return f};var ee=f=>B(H({},"__esModule",{value:!0}),f);var ne={};_(ne,{createZip:()=>fe});module.exports=ee(ne);var L,te=()=>{let f=new Int32Array(256),i=new Int32Array(4096),s=-306674912,r,n,g,x;for(n=0;n<256;n++)
r=n,r=r&1?s^r>>>1:r>>>1,r=r&1?s^r>>>1:r>>>1,r=r&1?s^r>>>1:r>>>1,r=r&1?s^r>>>1:r>>>1,r=r&1?s^r>>>1:r>>>
1,r=r&1?s^r>>>1:r>>>1,r=r&1?s^r>>>1:r>>>1,i[n]=f[n]=r&1?s^r>>>1:r>>>1;for(n=0;n<256;n++)for(x=f[n],r=
256+n;r<4096;r+=256)x=i[r]=x>>>8^f[x&255];for(L=[f],n=1;n<16;n++)L[n]=i.subarray(n*256,n*256+256)},F=(f,i=0)=>{
L||te();let[s,r,n,g,x,M,A,O,y,U,v,t,N,e,u,o]=L,c=i^-1,l=f.length-15,a=0;for(;a<l;)c=o[f[a++]^c&255]^
u[f[a++]^c>>8&255]^e[f[a++]^c>>16&255]^N[f[a++]^c>>>24]^t[f[a++]]^v[f[a++]]^U[f[a++]]^y[f[a++]]^O[f[a++]]^
A[f[a++]]^M[f[a++]]^x[f[a++]]^g[f[a++]]^n[f[a++]]^r[f[a++]]^s[f[a++]];for(l+=15;a<l;)c=c>>>8^s[(c^f[a++])&
255];return~c};var re=typeof CompressionStream<"u",R=new TextEncoder,W=f=>f.reduce((i,s)=>i+s,0),I=10;async function fe(f,i=!0){
let s=[],r=re&&i,n=f.length,g=f.map(o=>R.encode(o.name)),x=f.map(({data:o})=>typeof o=="string"?R.encode(
o):o instanceof ArrayBuffer?new Uint8Array(o):o),M=W(x.map(o=>o.byteLength)),A=W(g.map(o=>o.byteLength)),
O=n*30+A,y=n*46+A,U=22,v=O+y+U+Math.ceil(M*1.01)+n*128,t=new Uint8Array(v),N=new Date,e=0;for(let o=0;o<
n;o++){s[o]=e;let c=g[o],l=c.byteLength,a=x[o],m=a.byteLength,h=f[o].lastModified??N,Y=h.getSeconds(),
q=h.getMinutes(),G=h.getHours(),J=h.getDate(),K=h.getMonth()+1,P=h.getFullYear(),k=Math.floor(Y/2)+(q<<
5)+(G<<11),C=J+(K<<5)+(P-1980<<9);t[e++]=80,t[e++]=75,t[e++]=3,t[e++]=4,t[e++]=20,t[e++]=0,t[e++]=0,
t[e++]=8,t[e++]=r?8:0,t[e++]=0,t[e++]=k&255,t[e++]=k>>8,t[e++]=C&255,t[e++]=C>>8;let D=e;e+=4;let E=e;
e+=4,t[e++]=m&255,t[e++]=m>>8&255,t[e++]=m>>16&255,t[e++]=m>>24,t[e++]=l&255,t[e++]=l>>8&255,t[e++]=
0,t[e++]=0,t.set(c,e),e+=l;let w;if(r){let T=e,Z=new CompressionStream("gzip"),$=Z.writable.getWriter(),
j=Z.readable.getReader();$.write(a),$.close();let b=0,z=0;for(;;){let S=await j.read();if(S.done)throw new Error(
"Unexpected end of gzip data");let p=S.value;if(b=z,z=b+p.length,b<=2&&z>2){let d=p[2-b];if(d!==8)throw new Error(
`Assumptions violated: gzip not deflated (compression value: ${d})`)}if(b<=3&&z>3){let d=p[3-b];if(d&
30)throw new Error(`Assumptions violated: one or more optional gzip flags present (flags: ${d})`)}if(z===
I)break;if(z>I){let d=p.subarray(I-b);t.set(d,e),e+=d.byteLength;break}}for(;;){let S=await j.read();
if(S.done)break;let p=S.value;t.set(p,e),e+=p.byteLength}e-=8,t[D++]=t[e++],t[D++]=t[e++],t[D++]=t[e++],
t[D++]=t[e++],e-=4,w=e-T}else{t.set(a,e),e+=m,w=m;let T=F(a);t[e++]=T&255,t[e++]=T>>8&255,t[e++]=T>>
16&255,t[e++]=T>>24}t[E++]=w&255,t[E++]=w>>8&255,t[E++]=w>>16&255,t[E++]=w>>24}let u=e;for(let o=0;o<
n;o++){let c=s[o],l=g[o],a=l.byteLength;t[e++]=80,t[e++]=75,t[e++]=1,t[e++]=2,t[e++]=20,t[e++]=0,t[e++]=
20,t[e++]=0,t.set(t.subarray(c+6,c+30),e),e+=24;for(let m=0;m<10;m++)t[e++]=0;t[e++]=c&255,t[e++]=c>>
8&255,t[e++]=c>>16&255,t[e++]=c>>24,t.set(l,e),e+=a}return t[e++]=80,t[e++]=75,t[e++]=5,t[e++]=6,t[e++]=
0,t[e++]=0,t[e++]=0,t[e++]=0,t[e++]=n&255,t[e++]=n>>8&255,t[e++]=n&255,t[e++]=n>>8&255,t[e++]=y&255,
t[e++]=y>>8&255,t[e++]=y>>16&255,t[e++]=y>>24,t[e++]=u&255,t[e++]=u>>8&255,t[e++]=u>>16&255,t[e++]=u>>
24,t[e++]=0,t[e++]=0,t.subarray(0,e)}
