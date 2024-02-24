"use strict";var M=Object.defineProperty;var Y=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames;var q=Object.prototype.hasOwnProperty;var G=(f,s)=>{for(var o in s)M(f,o,{get:s[o],enumerable:!0})},J=(f,s,o,r)=>{if(s&&
typeof s=="object"||typeof s=="function")for(let n of Z(s))!q.call(f,n)&&n!==o&&
M(f,n,{get:()=>s[n],enumerable:!(r=Y(s,n))||r.enumerable});return f};var K=f=>J(M({},"__esModule",{value:!0}),f);var X={};G(X,{createZip:()=>V});module.exports=K(X);var h;function P(){if(h)return;let f=new Int32Array(256),s=new Int32Array(4096),
o=-306674912,r,n,m;for(n=0;n<256;n++)r=n,r=r&1?o^r>>>1:r>>>1,r=r&1?o^r>>>1:r>>>1,
r=r&1?o^r>>>1:r>>>1,r=r&1?o^r>>>1:r>>>1,r=r&1?o^r>>>1:r>>>1,r=r&1?o^r>>>1:r>>>1,
r=r&1?o^r>>>1:r>>>1,r=r&1?o^r>>>1:r>>>1,f[n]=r;for(n=0;n<256;n++)s[n]=f[n];for(n=
0;n<256;n++)for(m=f[n],r=256+n;r<4096;r+=256)m=s[r]=m>>>8^f[m&255];for(h=[f],n=1;n<
16;n++)h[n]=s.subarray(n*256,n*256+256)}function N(f,s=0){P();let[o,r,n,m,S,l,z,
t,A,e,b,T,a,c,d,y]=h,x=s^-1,u=f.length-15,i=0;for(;i<u;)x=y[f[i++]^x&255]^d[f[i++]^
x>>8&255]^c[f[i++]^x>>16&255]^a[f[i++]^x>>>24]^T[f[i++]]^b[f[i++]]^e[f[i++]]^A[f[i++]]^
t[f[i++]]^z[f[i++]]^l[f[i++]]^S[f[i++]]^m[f[i++]]^n[f[i++]]^r[f[i++]]^o[f[i++]];
for(u+=15;i<u;)x=x>>>8^o[(x^f[i++])&255];return~x}var Q=typeof CompressionStream<"u",O=new TextEncoder,U=f=>f.reduce((s,o)=>s+o,0);
async function V(f,s=!0){let o=Q&&s,r=[],n=f.map(a=>O.encode(a.name)),m=f.map(({
data:a})=>typeof a=="string"?O.encode(a):a instanceof ArrayBuffer?new Uint8Array(
a):a),S=m.map(a=>a.byteLength+5*Math.ceil(a.byteLength/32768)),l=n.length,z=22+l*
30+l*46+U(n.map(a=>a.byteLength))*2+U(S),t=new Uint8Array(z),A=new Date,e=0;for(let a=0;a<
l;a++){r[a]=e;let c=n[a],d=c.byteLength,y=m[a],x=y.byteLength,u=N(y),i=f[a].lastModified??
A,H=i.getSeconds(),v=i.getMinutes(),E=i.getHours(),F=i.getDate(),j=i.getMonth()+
1,k=i.getFullYear(),D=Math.floor(H/2)+(v<<5)+(E<<11),C=F+(j<<5)+(k-1980<<9);t[e++]=
80,t[e++]=75,t[e++]=3,t[e++]=4,t[e++]=20,t[e++]=0,t[e++]=0,t[e++]=8,t[e++]=o?8:0,
t[e++]=0,t[e++]=D&255,t[e++]=D>>8,t[e++]=C&255,t[e++]=C>>8,t[e++]=u&255,t[e++]=u>>
8&255,t[e++]=u>>16&255,t[e++]=u>>24;let p=e;e+=4,t[e++]=x&255,t[e++]=x>>8&255,t[e++]=
x>>16&255,t[e++]=x>>24,t[e++]=d&255,t[e++]=d>>8&255,t[e++]=0,t[e++]=0,t.set(c,e),
e+=d;let g;if(o){let I=new CompressionStream("deflate-raw"),w=I.writable.getWriter(),
R=I.readable.getReader();for(await w.ready,await w.write(y),await w.ready,await w.
close(),g=0;;){let{done:W,value:L}=await R.read();if(W)break;t.set(L,e),g+=L.length,
e+=L.length}}else t.set(y,e),g=x,e+=x;t[p++]=g&255,t[p++]=g>>8&255,t[p++]=g>>16&
255,t[p++]=g>>24}let b=e;for(let a=0;a<l;a++){let c=r[a],d=n[a],y=d.byteLength;t[e++]=
80,t[e++]=75,t[e++]=1,t[e++]=2,t[e++]=20,t[e++]=0,t[e++]=20,t[e++]=0,t.set(t.subarray(
c+6,c+30),e),e+=24;for(let x=0;x<10;x++)t[e++]=0;t[e++]=c&255,t[e++]=c>>8&255,t[e++]=
c>>16&255,t[e++]=c>>24,t.set(d,e),e+=y}let T=e-b;return t[e++]=80,t[e++]=75,t[e++]=
5,t[e++]=6,t[e++]=0,t[e++]=0,t[e++]=0,t[e++]=0,t[e++]=l&255,t[e++]=l>>8&255,t[e++]=
l&255,t[e++]=l>>8&255,t[e++]=T&255,t[e++]=T>>8&255,t[e++]=T>>16&255,t[e++]=T>>24,
t[e++]=b&255,t[e++]=b>>8&255,t[e++]=b>>16&255,t[e++]=b>>24,t[e++]=0,t[e++]=0,t.subarray(
0,e)}
