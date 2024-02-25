var h,E=()=>{let r=new Int32Array(256),s=new Int32Array(4096),o=-306674912,t,n,m;
for(n=0;n<256;n++)t=n,t=t&1?o^t>>>1:t>>>1,t=t&1?o^t>>>1:t>>>1,t=t&1?o^t>>>1:t>>>
1,t=t&1?o^t>>>1:t>>>1,t=t&1?o^t>>>1:t>>>1,t=t&1?o^t>>>1:t>>>1,t=t&1?o^t>>>1:t>>>
1,t=t&1?o^t>>>1:t>>>1,r[n]=t;for(n=0;n<256;n++)s[n]=r[n];for(n=0;n<256;n++)for(m=
r[n],t=256+n;t<4096;t+=256)m=s[t]=m>>>8^r[m&255];for(h=[r],n=1;n<16;n++)h[n]=s.subarray(
n*256,n*256+256)},D=(r,s=0)=>{h||E();let[o,t,n,m,g,z,d,p,f,A,e,b,a,c,y,T]=h,x=s^
-1,l=r.length-15,i=0;for(;i<l;)x=T[r[i++]^x&255]^y[r[i++]^x>>8&255]^c[r[i++]^x>>
16&255]^a[r[i++]^x>>>24]^b[r[i++]]^e[r[i++]]^A[r[i++]]^f[r[i++]]^p[r[i++]]^d[r[i++]]^
z[r[i++]]^g[r[i++]]^m[r[i++]]^n[r[i++]]^t[r[i++]]^o[r[i++]];for(l+=15;i<l;)x=x>>>
8^o[(x^r[i++])&255];return~x};var L=new TextEncoder,M=r=>r.reduce((s,o)=>s+o,0),C=async r=>{let s=[],o=r.length,
t=r.map(a=>L.encode(a.name)),n=r.map(({data:a})=>typeof a=="string"?L.encode(a):
a instanceof ArrayBuffer?new Uint8Array(a):a),m=M(n.map(a=>a.byteLength)),g=M(t.
map(a=>a.byteLength)),z=o*30+g,d=o*46+g,p=z+m+d+22,f=new Uint8Array(p),A=new Date,
e=0;for(let a=0;a<o;a++){s[a]=e;let c=t[a],y=c.byteLength,T=n[a],x=T.byteLength,
l=r[a].lastModified??A,i=l.getSeconds(),N=l.getMinutes(),I=l.getHours(),H=l.getDate(),
U=l.getMonth()+1,O=l.getFullYear(),S=Math.floor(i/2)+(N<<5)+(I<<11),w=H+(U<<5)+(O-
1980<<9);f[e++]=80,f[e++]=75,f[e++]=3,f[e++]=4,f[e++]=20,f[e++]=0,f[e++]=0,f[e++]=
8,f[e++]=0,f[e++]=0,f[e++]=S&255,f[e++]=S>>8,f[e++]=w&255,f[e++]=w>>8;let u=D(T);
f[e++]=u&255,f[e++]=u>>8&255,f[e++]=u>>16&255,f[e++]=u>>24,f[e++]=x&255,f[e++]=x>>
8&255,f[e++]=x>>16&255,f[e++]=x>>24,f[e++]=x&255,f[e++]=x>>8&255,f[e++]=x>>16&255,
f[e++]=x>>24,f[e++]=y&255,f[e++]=y>>8&255,f[e++]=0,f[e++]=0,f.set(c,e),e+=y,f.set(
T,e),e+=x}let b=e;for(let a=0;a<o;a++){let c=s[a],y=t[a],T=y.byteLength;f[e++]=80,
f[e++]=75,f[e++]=1,f[e++]=2,f[e++]=20,f[e++]=0,f[e++]=20,f[e++]=0,f.set(f.subarray(
c+6,c+30),e),e+=24;for(let x=0;x<10;x++)f[e++]=0;f[e++]=c&255,f[e++]=c>>8&255,f[e++]=
c>>16&255,f[e++]=c>>24,f.set(y,e),e+=T}return f[e++]=80,f[e++]=75,f[e++]=5,f[e++]=
6,f[e++]=0,f[e++]=0,f[e++]=0,f[e++]=0,f[e++]=o&255,f[e++]=o>>8&255,f[e++]=o&255,
f[e++]=o>>8&255,f[e++]=d&255,f[e++]=d>>8&255,f[e++]=d>>16&255,f[e++]=d>>24,f[e++]=
b&255,f[e++]=b>>8&255,f[e++]=b>>16&255,f[e++]=b>>24,f[e++]=0,f[e++]=0,f.subarray(
0,e)};export{C as createZip};
