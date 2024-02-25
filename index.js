"use strict";var M=Object.defineProperty;var Z=Object.getOwnPropertyDescriptor;var q=Object.getOwnPropertyNames;var G=Object.prototype.hasOwnProperty;var J=(f,s)=>{for(var i in s)M(f,i,{get:s[i],enumerable:!0})},K=(f,s,i,r)=>{if(s&&
typeof s=="object"||typeof s=="function")for(let n of q(s))!G.call(f,n)&&n!==i&&
M(f,n,{get:()=>s[n],enumerable:!(r=Z(s,n))||r.enumerable});return f};var P=f=>K(M({},"__esModule",{value:!0}),f);var _={};J(_,{createZip:()=>X});module.exports=P(_);var h;function Q(){if(h)return;let f=new Int32Array(256),s=new Int32Array(4096),
i=-306674912,r,n,m;for(n=0;n<256;n++)r=n,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,
r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,
r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,f[n]=r;for(n=0;n<256;n++)s[n]=f[n];for(n=
0;n<256;n++)for(m=f[n],r=256+n;r<4096;r+=256)m=s[r]=m>>>8^f[m&255];for(h=[f],n=1;n<
16;n++)h[n]=s.subarray(n*256,n*256+256)}function N(f,s=0){Q();let[i,r,n,m,S,l,z,
t,A,e,b,g,a,c,d,y]=h,x=s^-1,u=f.length-15,o=0;for(;o<u;)x=y[f[o++]^x&255]^d[f[o++]^
x>>8&255]^c[f[o++]^x>>16&255]^a[f[o++]^x>>>24]^g[f[o++]]^b[f[o++]]^e[f[o++]]^A[f[o++]]^
t[f[o++]]^z[f[o++]]^l[f[o++]]^S[f[o++]]^m[f[o++]]^n[f[o++]]^r[f[o++]]^i[f[o++]];
for(u+=15;o<u;)x=x>>>8^i[(x^f[o++])&255];return~x}var V=typeof CompressionStream<"u",O=new TextEncoder,U=f=>f.reduce((s,i)=>s+i,0);
async function X(f,s=!0){let i=V&&s,r=[],n=f.map(a=>O.encode(a.name)),m=f.map(({
data:a})=>typeof a=="string"?O.encode(a):a instanceof ArrayBuffer?new Uint8Array(
a):a),S=m.map(a=>a.byteLength+5*Math.ceil(a.byteLength/32768)),l=n.length,z=22+l*
30+l*46+U(n.map(a=>a.byteLength))*2+U(S),t=new Uint8Array(z),A=new Date,e=0;for(let a=0;a<
l;a++){r[a]=e;let c=n[a],d=c.byteLength,y=m[a],x=y.byteLength,u=N(y),o=f[a].lastModified??
A,H=o.getSeconds(),v=o.getMinutes(),E=o.getHours(),F=o.getDate(),j=o.getMonth()+
1,k=o.getFullYear(),D=Math.floor(H/2)+(v<<5)+(E<<11),C=F+(j<<5)+(k-1980<<9);t[e++]=
80,t[e++]=75,t[e++]=3,t[e++]=4,t[e++]=20,t[e++]=0,t[e++]=0,t[e++]=8,t[e++]=i?8:0,
t[e++]=0,t[e++]=D&255,t[e++]=D>>8,t[e++]=C&255,t[e++]=C>>8,t[e++]=u&255,t[e++]=u>>
8&255,t[e++]=u>>16&255,t[e++]=u>>24;let T=e;e+=4,t[e++]=x&255,t[e++]=x>>8&255,t[e++]=
x>>16&255,t[e++]=x>>24,t[e++]=d&255,t[e++]=d>>8&255,t[e++]=0,t[e++]=0,t.set(c,e),
e+=d;let p;if(i){let R=e,I=new CompressionStream("gzip"),w=I.writable.getWriter(),
W=I.readable.getReader();for(await w.ready,await w.write(y),await w.ready,await w.
close();;){let{done:Y,value:L}=await W.read();if(console.log(L),Y)break;t.set(L,
e),e+=L.length}p=e-R}else t.set(y,e),e+=x,p=x;t[T++]=p&255,t[T++]=p>>8&255,t[T++]=
p>>16&255,t[T++]=p>>24}let b=e;for(let a=0;a<l;a++){let c=r[a],d=n[a],y=d.byteLength;
t[e++]=80,t[e++]=75,t[e++]=1,t[e++]=2,t[e++]=20,t[e++]=0,t[e++]=20,t[e++]=0,t.set(
t.subarray(c+6,c+30),e),e+=24;for(let x=0;x<10;x++)t[e++]=0;t[e++]=c&255,t[e++]=
c>>8&255,t[e++]=c>>16&255,t[e++]=c>>24,t.set(d,e),e+=y}let g=e-b;return t[e++]=80,
t[e++]=75,t[e++]=5,t[e++]=6,t[e++]=0,t[e++]=0,t[e++]=0,t[e++]=0,t[e++]=l&255,t[e++]=
l>>8&255,t[e++]=l&255,t[e++]=l>>8&255,t[e++]=g&255,t[e++]=g>>8&255,t[e++]=g>>16&
255,t[e++]=g>>24,t[e++]=b&255,t[e++]=b>>8&255,t[e++]=b>>16&255,t[e++]=b>>24,t[e++]=
0,t[e++]=0,t.subarray(0,e)}
