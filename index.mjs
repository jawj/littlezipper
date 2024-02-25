var E;function P(){if(E)return;let n=new Int32Array(256),x=new Int32Array(4096),
i=-306674912,r,f,c;for(f=0;f<256;f++)r=f,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,
r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,
r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,n[f]=r;for(f=0;f<256;f++)x[f]=n[f];for(f=
0;f<256;f++)for(c=n[f],r=256+f;r<4096;r+=256)c=x[r]=c>>>8^n[c&255];for(E=[n],f=1;f<
16;f++)E[f]=x.subarray(f*256,f*256+256)}function j(n,x=0){P();let[i,r,f,c,S,M,A,
O,y,U,v,t,N,e,g,o]=E,s=x^-1,l=n.length-15,a=0;for(;a<l;)s=o[n[a++]^s&255]^g[n[a++]^
s>>8&255]^e[n[a++]^s>>16&255]^N[n[a++]^s>>>24]^t[n[a++]]^v[n[a++]]^U[n[a++]]^y[n[a++]]^
O[n[a++]]^A[n[a++]]^M[n[a++]]^S[n[a++]]^c[n[a++]]^f[n[a++]]^r[n[a++]]^i[n[a++]];
for(l+=15;a<l;)s=s>>>8^i[(s^n[a++])&255];return~s}var Q=typeof CompressionStream<"u",F=new TextEncoder,R=n=>n.reduce((x,i)=>x+i,0),
H=10;async function _(n,x=!0){let i=[],r=Q&&x,f=n.length,c=n.map(o=>F.encode(o.name)),
S=n.map(({data:o})=>typeof o=="string"?F.encode(o):o instanceof ArrayBuffer?new Uint8Array(
o):o),M=R(S.map(o=>o.byteLength)),A=R(c.map(o=>o.byteLength)),O=f*30+A,y=f*46+A,
U=22,v=O+y+U+Math.ceil(M*1.01)+f*128,t=new Uint8Array(v),N=new Date,e=0;for(let o=0;o<
f;o++){i[o]=e;let s=c[o],l=s.byteLength,a=S[o],d=a.byteLength,u=n[o].lastModified??
N,W=u.getSeconds(),Y=u.getMinutes(),q=u.getHours(),G=u.getDate(),J=u.getMonth()+
1,K=u.getFullYear(),I=Math.floor(W/2)+(Y<<5)+(q<<11),C=G+(J<<5)+(K-1980<<9);t[e++]=
80,t[e++]=75,t[e++]=3,t[e++]=4,t[e++]=20,t[e++]=0,t[e++]=0,t[e++]=8,t[e++]=r?8:0,
t[e++]=0,t[e++]=I&255,t[e++]=I>>8,t[e++]=C&255,t[e++]=C>>8;let D=e;e+=4;let L=e;
e+=4,t[e++]=d&255,t[e++]=d>>8&255,t[e++]=d>>16&255,t[e++]=d>>24,t[e++]=l&255,t[e++]=
l>>8&255,t[e++]=0,t[e++]=0,t.set(s,e),e+=l;let h;if(r){let w=e,k=new CompressionStream(
"gzip"),Z=k.writable.getWriter(),$=k.readable.getReader();Z.write(a),Z.close();let b=0,
T=0;for(;;){let z=await $.read();if(z.done)throw new Error("Unexpected end of gz\
ip data");let p=z.value;if(b=T,T=b+p.length,b<=2&&T>2){let m=p[2-b];if(m!==8)throw new Error(
`Assumptions violated: gzip not deflated (compression value: ${m})`)}if(b<=3&&T>
3){let m=p[3-b];if(m&30)throw new Error(`Assumptions violated: one or more optio\
nal gzip flags present (flags: ${m})`)}if(T===H)break;if(T>H){let m=p.subarray(H-
b);t.set(m,e),e+=m.byteLength;break}}for(;;){let z=await $.read();if(z.done)break;
let p=z.value;t.set(p,e),e+=p.byteLength}e-=8,t[D++]=t[e++],t[D++]=t[e++],t[D++]=
t[e++],t[D++]=t[e++],e-=4,h=e-w}else{t.set(a,e),e+=d,h=d;let w=j(a);t[e++]=w&255,
t[e++]=w>>8&255,t[e++]=w>>16&255,t[e++]=w>>24}t[L++]=h&255,t[L++]=h>>8&255,t[L++]=
h>>16&255,t[L++]=h>>24}let g=e;for(let o=0;o<f;o++){let s=i[o],l=c[o],a=l.byteLength;
t[e++]=80,t[e++]=75,t[e++]=1,t[e++]=2,t[e++]=20,t[e++]=0,t[e++]=20,t[e++]=0,t.set(
t.subarray(s+6,s+30),e),e+=24;for(let d=0;d<10;d++)t[e++]=0;t[e++]=s&255,t[e++]=
s>>8&255,t[e++]=s>>16&255,t[e++]=s>>24,t.set(l,e),e+=a}return t[e++]=80,t[e++]=75,
t[e++]=5,t[e++]=6,t[e++]=0,t[e++]=0,t[e++]=0,t[e++]=0,t[e++]=f&255,t[e++]=f>>8&255,
t[e++]=f&255,t[e++]=f>>8&255,t[e++]=y&255,t[e++]=y>>8&255,t[e++]=y>>16&255,t[e++]=
y>>24,t[e++]=g&255,t[e++]=g>>8&255,t[e++]=g>>16&255,t[e++]=g>>24,t[e++]=0,t[e++]=
0,t.subarray(0,e)}export{_ as createZip};
