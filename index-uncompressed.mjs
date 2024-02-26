var h,E=()=>{let r=new Int32Array(256),s=new Int32Array(4096),a=-306674912,f,o,m;for(o=0;o<256;o++)f=o,f=f&1?a^f>>>1:f>>>
1,f=f&1?a^f>>>1:f>>>1,f=f&1?a^f>>>1:f>>>1,f=f&1?a^f>>>1:f>>>1,f=f&1?a^f>>>1:f>>>1,f=f&1?a^f>>>1:f>>>1,f=f&1?a^f>>>1:f>>>
1,s[o]=r[o]=f&1?a^f>>>1:f>>>1;for(o=0;o<256;o++)for(m=r[o],f=256+o;f<4096;f+=256)m=s[f]=m>>>8^r[m&255];for(h=[r],o=1;o<16;o++)
h[o]=s.subarray(o*256,o*256+256)},D=(r,s=0)=>{h||E();let[a,f,o,m,g,z,d,p,t,A,e,b,n,c,y,T]=h,x=s^-1,l=r.length-15,i=0;for(;i<
l;)x=T[r[i++]^x&255]^y[r[i++]^x>>8&255]^c[r[i++]^x>>16&255]^n[r[i++]^x>>>24]^b[r[i++]]^e[r[i++]]^A[r[i++]]^t[r[i++]]^p[r[i++]]^
d[r[i++]]^z[r[i++]]^g[r[i++]]^m[r[i++]]^o[r[i++]]^f[r[i++]]^a[r[i++]];for(l+=15;i<l;)x=x>>>8^a[(x^r[i++])&255];return~x};var M=new TextEncoder,N=r=>r.reduce((s,a)=>s+a,0),Y=async r=>{let s=[],a=r.length,f=r.map(n=>M.encode(n.name)),o=r.map(({
data:n})=>typeof n=="string"?M.encode(n):n instanceof ArrayBuffer?new Uint8Array(n):n),m=N(o.map(n=>n.byteLength)),g=N(f.
map(n=>n.byteLength)),z=a*30+g,d=a*46+g,p=z+m+d+22,t=new Uint8Array(p),A=new Date,e=0;for(let n=0;n<a;n++){s[n]=e;let c=f[n],
y=c.byteLength,T=o[n],x=T.byteLength,l=r[n].lastModified??A,i=l.getSeconds(),I=l.getMinutes(),L=l.getHours(),H=l.getDate(),
U=l.getMonth()+1,O=l.getFullYear(),S=Math.floor(i/2)+(I<<5)+(L<<11),w=H+(U<<5)+(O-1980<<9);t[e++]=80,t[e++]=75,t[e++]=3,
t[e++]=4,t[e]=20,e+=3,t[e]=8,e+=3,t[e++]=S&255,t[e++]=S>>8,t[e++]=w&255,t[e++]=w>>8;let u=D(T);t[e++]=u&255,t[e++]=u>>8&
255,t[e++]=u>>16&255,t[e++]=u>>24,t[e+4]=t[e++]=x&255,t[e+4]=t[e++]=x>>8&255,t[e+4]=t[e++]=x>>16&255,t[e+4]=t[e]=x>>24,e+=
5,t[e++]=y&255,t[e]=y>>8&255,e+=3,t.set(c,e),e+=y,t.set(T,e),e+=x}let b=e;for(let n=0;n<a;n++){let c=s[n],y=f[n],T=y.byteLength;
t[e++]=80,t[e++]=75,t[e++]=1,t[e++]=2,t[e]=20,e+=2,t[e]=20,e+=2,t.set(t.subarray(c+6,c+30),e),e+=34,t[e++]=c&255,t[e++]=
c>>8&255,t[e++]=c>>16&255,t[e++]=c>>24,t.set(y,e),e+=T}return t[e++]=80,t[e++]=75,t[e++]=5,t[e]=6,e+=5,t[e++]=a&255,t[e++]=
a>>8&255,t[e++]=a&255,t[e++]=a>>8&255,t[e++]=d&255,t[e++]=d>>8&255,t[e++]=d>>16&255,t[e++]=d>>24,t[e++]=b&255,t[e++]=b>>
8&255,t[e++]=b>>16&255,t[e]=b>>24,e+=3,t.subarray(0,e)};export{Y as createZip};
