var L,P=()=>{let f=new Int32Array(256),l=new Int32Array(4096),i=-306674912,r,n,g,x;for(n=0;n<256;n++)
r=n,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>
1,r=r&1?i^r>>>1:r>>>1,r=r&1?i^r>>>1:r>>>1,l[n]=f[n]=r&1?i^r>>>1:r>>>1;for(n=0;n<256;n++)for(x=f[n],r=
256+n;r<4096;r+=256)x=l[r]=x>>>8^f[x&255];for(L=[f],n=1;n<16;n++)L[n]=l.subarray(n*256,n*256+256)},j=(f,l=0)=>{
L||P();let[i,r,n,g,x,M,A,O,y,U,v,t,N,e,u,o]=L,s=l^-1,c=f.length-15,a=0;for(;a<c;)s=o[f[a++]^s&255]^u[f[a++]^
s>>8&255]^e[f[a++]^s>>16&255]^N[f[a++]^s>>>24]^t[f[a++]]^v[f[a++]]^U[f[a++]]^y[f[a++]]^O[f[a++]]^A[f[a++]]^
M[f[a++]]^x[f[a++]]^g[f[a++]]^n[f[a++]]^r[f[a++]]^i[f[a++]];for(c+=15;a<c;)s=s>>>8^i[(s^f[a++])&255];
return~s};var Q=typeof CompressionStream<"u",F=new TextEncoder,R=f=>f.reduce((l,i)=>l+i,0),H=10;async function _(f,l=!0){
let i=[],r=Q&&l,n=f.length,g=f.map(o=>F.encode(o.name)),x=f.map(({data:o})=>typeof o=="string"?F.encode(
o):o instanceof ArrayBuffer?new Uint8Array(o):o),M=R(x.map(o=>o.byteLength)),A=R(g.map(o=>o.byteLength)),
O=n*30+A,y=n*46+A,U=22,v=O+y+U+Math.ceil(M*1.01)+n*128,t=new Uint8Array(v),N=new Date,e=0;for(let o=0;o<
n;o++){i[o]=e;let s=g[o],c=s.byteLength,a=x[o],m=a.byteLength,h=f[o].lastModified??N,W=h.getSeconds(),
Y=h.getMinutes(),q=h.getHours(),G=h.getDate(),J=h.getMonth()+1,K=h.getFullYear(),I=Math.floor(W/2)+(Y<<
5)+(q<<11),k=G+(J<<5)+(K-1980<<9);t[e++]=80,t[e++]=75,t[e++]=3,t[e++]=4,t[e++]=20,t[e++]=0,t[e++]=0,
t[e++]=8,t[e++]=r?8:0,t[e++]=0,t[e++]=I&255,t[e++]=I>>8,t[e++]=k&255,t[e++]=k>>8;let D=e;e+=4;let E=e;
e+=4,t[e++]=m&255,t[e++]=m>>8&255,t[e++]=m>>16&255,t[e++]=m>>24,t[e++]=c&255,t[e++]=c>>8&255,t[e++]=
0,t[e++]=0,t.set(s,e),e+=c;let w;if(r){let T=e,C=new CompressionStream("gzip"),Z=C.writable.getWriter(),
$=C.readable.getReader();Z.write(a),Z.close();let b=0,z=0;for(;;){let S=await $.read();if(S.done)throw new Error(
"Unexpected end of gzip data");let p=S.value;if(b=z,z=b+p.length,b<=2&&z>2){let d=p[2-b];if(d!==8)throw new Error(
`Assumptions violated: gzip not deflated (compression value: ${d})`)}if(b<=3&&z>3){let d=p[3-b];if(d&
30)throw new Error(`Assumptions violated: one or more optional gzip flags present (flags: ${d})`)}if(z===
H)break;if(z>H){let d=p.subarray(H-b);t.set(d,e),e+=d.byteLength;break}}for(;;){let S=await $.read();
if(S.done)break;let p=S.value;t.set(p,e),e+=p.byteLength}e-=8,t[D++]=t[e++],t[D++]=t[e++],t[D++]=t[e++],
t[D++]=t[e++],e-=4,w=e-T}else{t.set(a,e),e+=m,w=m;let T=j(a);t[e++]=T&255,t[e++]=T>>8&255,t[e++]=T>>
16&255,t[e++]=T>>24}t[E++]=w&255,t[E++]=w>>8&255,t[E++]=w>>16&255,t[E++]=w>>24}let u=e;for(let o=0;o<
n;o++){let s=i[o],c=g[o],a=c.byteLength;t[e++]=80,t[e++]=75,t[e++]=1,t[e++]=2,t[e++]=20,t[e++]=0,t[e++]=
20,t[e++]=0,t.set(t.subarray(s+6,s+30),e),e+=24;for(let m=0;m<10;m++)t[e++]=0;t[e++]=s&255,t[e++]=s>>
8&255,t[e++]=s>>16&255,t[e++]=s>>24,t.set(c,e),e+=a}return t[e++]=80,t[e++]=75,t[e++]=5,t[e++]=6,t[e++]=
0,t[e++]=0,t[e++]=0,t[e++]=0,t[e++]=n&255,t[e++]=n>>8&255,t[e++]=n&255,t[e++]=n>>8&255,t[e++]=y&255,
t[e++]=y>>8&255,t[e++]=y>>16&255,t[e++]=y>>24,t[e++]=u&255,t[e++]=u>>8&255,t[e++]=u>>16&255,t[e++]=u>>
24,t[e++]=0,t[e++]=0,t.subarray(0,e)}export{_ as createZip};
