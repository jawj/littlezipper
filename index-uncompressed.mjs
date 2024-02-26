var h,E=()=>{let r=new Int32Array(256),s=new Int32Array(4096),a=-306674912,t,x,g,
m;for(x=0;x<256;x++)t=x,t=t&1?a^t>>>1:t>>>1,t=t&1?a^t>>>1:t>>>1,t=t&1?a^t>>>1:t>>>
1,t=t&1?a^t>>>1:t>>>1,t=t&1?a^t>>>1:t>>>1,t=t&1?a^t>>>1:t>>>1,t=t&1?a^t>>>1:t>>>
1,s[x]=r[x]=t&1?a^t>>>1:t>>>1;for(x=0;x<256;x++)for(m=r[x],t=256+x;t<4096;t+=256)
m=s[t]=m>>>8^r[m&255];for(h=[r],x=1;x<16;x++)h[x]=s.subarray(x*256,x*256+256)},D=(r,s=0)=>{
h||E();let[a,t,x,g,m,z,b,p,f,A,e,T,n,c,y,d]=h,o=s^-1,l=r.length-15,i=0;for(;i<l;)
o=d[r[i++]^o&255]^y[r[i++]^o>>8&255]^c[r[i++]^o>>16&255]^n[r[i++]^o>>>24]^T[r[i++]]^
e[r[i++]]^A[r[i++]]^f[r[i++]]^p[r[i++]]^b[r[i++]]^z[r[i++]]^m[r[i++]]^g[r[i++]]^
x[r[i++]]^t[r[i++]]^a[r[i++]];for(l+=15;i<l;)o=o>>>8^a[(o^r[i++])&255];return~o};var M=new TextEncoder,N=r=>r.reduce((s,a)=>s+a,0),F=async r=>{let s=[],a=r.length,
t=r.map(n=>M.encode(n.name)),x=r.map(({data:n})=>typeof n=="string"?M.encode(n):
n instanceof ArrayBuffer?new Uint8Array(n):n),g=N(x.map(n=>n.byteLength)),m=N(t.
map(n=>n.byteLength)),z=a*30+m,b=a*46+m,p=z+g+b+22,f=new Uint8Array(p),A=new Date,
e=0;for(let n=0;n<a;n++){s[n]=e;let c=t[n],y=c.byteLength,d=x[n],o=d.byteLength,
l=r[n].lastModified??A,i=l.getSeconds(),I=l.getMinutes(),L=l.getHours(),H=l.getDate(),
U=l.getMonth()+1,O=l.getFullYear(),S=Math.floor(i/2)+(I<<5)+(L<<11),w=H+(U<<5)+(O-
1980<<9);f[e++]=80,f[e++]=75,f[e++]=3,f[e++]=4,f[e++]=20,f[e++]=0,f[e++]=0,f[e++]=
8,f[e++]=0,f[e++]=0,f[e++]=S&255,f[e++]=S>>8,f[e++]=w&255,f[e++]=w>>8;let u=D(d);
f[e++]=u&255,f[e++]=u>>8&255,f[e++]=u>>16&255,f[e++]=u>>24,f[e++]=o&255,f[e++]=o>>
8&255,f[e++]=o>>16&255,f[e++]=o>>24,f[e++]=o&255,f[e++]=o>>8&255,f[e++]=o>>16&255,
f[e++]=o>>24,f[e++]=y&255,f[e++]=y>>8&255,f[e++]=0,f[e++]=0,f.set(c,e),e+=y,f.set(
d,e),e+=o}let T=e;for(let n=0;n<a;n++){let c=s[n],y=t[n],d=y.byteLength;f[e++]=80,
f[e++]=75,f[e++]=1,f[e++]=2,f[e++]=20,f[e++]=0,f[e++]=20,f[e++]=0,f.set(f.subarray(
c+6,c+30),e),e+=24;for(let o=0;o<10;o++)f[e++]=0;f[e++]=c&255,f[e++]=c>>8&255,f[e++]=
c>>16&255,f[e++]=c>>24,f.set(y,e),e+=d}return f[e++]=80,f[e++]=75,f[e++]=5,f[e++]=
6,f[e++]=0,f[e++]=0,f[e++]=0,f[e++]=0,f[e++]=a&255,f[e++]=a>>8&255,f[e++]=a&255,
f[e++]=a>>8&255,f[e++]=b&255,f[e++]=b>>8&255,f[e++]=b>>16&255,f[e++]=b>>24,f[e++]=
T&255,f[e++]=T>>8&255,f[e++]=T>>16&255,f[e++]=T>>24,f[e++]=0,f[e++]=0,f.subarray(
0,e)};export{F as createZip};
