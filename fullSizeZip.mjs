var p,L=()=>{let r=Int32Array,c=new r(256),x=new r(4096),t,a,l;for(a=0;a<256;a++)t=a,t=t&1?-306674912^t>>>1:t>>>1,t=t&1?-306674912^t>>>1:t>>>1,t=t&1?-306674912^t>>>1:t>>>1,t=t&1?-306674912^t>>>1:t>>>1,t=t&1?-306674912^t>>>1:t>>>1,t=t&1?-306674912^t>>>1:t>>>1,t=t&1?-306674912^t>>>1:t>>>1,x[a]=c[a]=t&1?-306674912^t>>>1:t>>>1;for(a=0;a<256;a++)for(l=c[a],t=256+a;t<4096;t+=256)l=x[t]=l>>>8^c[l&255];for(p=[c],a=1;a<16;a++)p[a]=x.subarray(a*256,(a+1)*256)},S=(r,c=0)=>{p||L();let[x,t,a,l,u,y,z,f,w,e,g,n,s,m,T,b]=p,i=c^-1,d=r.length-15,o=0;for(;o<d;)i=b[r[o++]^i&255]^T[r[o++]^i>>8&255]^m[r[o++]^i>>16&255]^s[r[o++]^i>>>24]^n[r[o++]]^g[r[o++]]^e[r[o++]]^w[r[o++]]^f[r[o++]]^z[r[o++]]^y[r[o++]]^u[r[o++]]^l[r[o++]]^a[r[o++]]^t[r[o++]]^x[r[o++]];for(d+=15;o<d;)i=i>>>8^x[(i^r[o++])&255];return~i};var A=new TextEncoder,D=r=>r.reduce((c,x)=>c+x,0),N=Uint8Array,H=async r=>{let c=[],x=r.length,t=r.map(n=>A.encode(n.name)),a=r.map(({data:n})=>typeof n=="string"?A.encode(n):n instanceof ArrayBuffer?new N(n):n),l=D(a.map(n=>n.byteLength)),u=D(t.map(n=>n.byteLength)),y=x*46+u,z=x*30+u+l+y+22,f=new N(z),w=new Date,e=0;for(let n=0;n<x;n++){c[n]=e;let s=t[n],m=s.byteLength,T=a[n],b=T.byteLength,i=r[n].lastModified??w,d=Math.floor(i.getSeconds()/2)+(i.getMinutes()<<5)+(i.getHours()<<11),o=i.getDate()+(i.getMonth()+1<<5)+(i.getFullYear()-1980<<9);f[e++]=80,f[e++]=75,f[e++]=3,f[e++]=4,f[e]=20,e+=3,f[e]=8,e+=3,f[e++]=d&255,f[e++]=d>>8,f[e++]=o&255,f[e++]=o>>8;let h=S(T);f[e++]=h&255,f[e++]=h>>8&255,f[e++]=h>>16&255,f[e++]=h>>24,f[e+4]=f[e++]=b&255,f[e+4]=f[e++]=b>>8&255,f[e+4]=f[e++]=b>>16&255,f[e+4]=f[e]=b>>24,e+=5,f[e++]=m&255,f[e]=m>>8&255,e+=3,f.set(s,e),e+=m,f.set(T,e),e+=b}let g=e;for(let n=0;n<x;n++){let s=c[n],m=t[n],T=m.byteLength;f[e++]=80,f[e++]=75,f[e++]=1,f[e++]=2,f[e]=20,e+=2,f[e]=20,e+=2,f.set(f.subarray(s+6,s+30),e),e+=34,f[e++]=s&255,f[e++]=s>>8&255,f[e++]=s>>16&255,f[e++]=s>>24,f.set(m,e),e+=T}return f[e++]=80,f[e++]=75,f[e++]=5,f[e]=6,e+=5,f[e++]=x&255,f[e++]=x>>8&255,f[e++]=x&255,f[e++]=x>>8&255,f[e++]=y&255,f[e++]=y>>8&255,f[e++]=y>>16&255,f[e++]=y>>24,f[e++]=g&255,f[e++]=g>>8&255,f[e++]=g>>16&255,f[e]=g>>24,e+=3,f.subarray(0,e)};export{H as createZip};