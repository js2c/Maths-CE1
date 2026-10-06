// FICHIER GÉNÉRÉ par art/tools/export-voiliers.mjs depuis art/voiliers/index.html (empreinte 3069dcec2be1) : ne pas
// modifier à la main. Le script de la maquette du jeu des voiliers, tel quel, enveloppé dans startVoiliers ; ses raccords
// à l'application sont décrits dans l'outil (RETOUCHES, SECTIONS, RACCORDS). Les images sont dans assets/voiliers/.
//
// OPTS : { racine : la scène (#stage) ; gl, gs, fx : les trois canvas (la mer, les bateaux et les bouées, les effets) ;
// donnees : assets/voiliers/donnees.json ; echelle() : px d'écran par px de la scène ; temps(now) : le temps du jeu en s
// (il s'arrête pendant la pause) ; fige() : la scène est-elle en pause ; toucher(e) : ce toucher peut-il prendre le
// bateau ; on(cible, type, f, o) : un écouteur à retirer en sortant ; attente : le point d'attente du bateau ;
// attenteXMin : avec le vent et les pirates, le bateau s'arrête de préférence au-dessus d'un passage plus à droite ;
// ventMs, piratesK : le vent et les pirates (module4.json) ; qualite : la qualité de la mer au départ ; mesure(t) : appelé à
// chaque image ; sansWebGL() : pas de WebGL } ; renvoie l'interface de la scène (API), ou null sans WebGL.
/* eslint-disable */
export function startVoiliers(OPTS) {
let VIVANT = true, RAF = 0;
const ASSETS=OPTS.donnees.ASSETS;
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const stage=OPTS.racine,cs=OPTS.gl,cb=OPTS.gs,fx=OPTS.fx,c2=fx.getContext('2d');
const gl=cs.getContext('webgl',{antialias:false,alpha:false});
const gb=cb.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true});
if(!gl||!gb||!gl.getExtension('OES_standard_derivatives')){OPTS.sansWebGL?.();return null;}

/* =====================================================================================
   CAMERA AND SWELL. The same formulas run on the GPU (to paint the sea) and here (so the
   boats and buoys ride the very waves that are drawn under them).
   ===================================================================================== */
const F=900,HC=12,HY=200;
const WAVES=[[-1.75,40,.85,0],[-1.42,27,.52,1.3],[-2.08,18,.32,2.1],[-1.22,11.5,.18,4.0],[-1.93,7.3,.10,.7],[-2.42,4.7,.06,3.3]].map(([a,L,A,ph])=>{const k=2*Math.PI/L;return{dx:Math.cos(a),dz:Math.sin(a),k,A,om:Math.sqrt(9.81*k)*.8,ph};});
const SUMA=WAVES.reduce((s,w)=>s+w.A,0);
let SEA=.6,SEA_T=.6,QUAL=OPTS.qualite??1,T=0;const VIT={k:1};let OLD=null,ATTENTE=null,REDESSINE=true;
function wave(x,z,t){let h=0;for(const w of WAVES){const th=w.k*(w.dx*x+w.dz*z)-w.om*t+w.ph;h+=w.A*SEA*(Math.exp(1.6*(Math.sin(th)-1))-.35);}return h;}
const toWorld=(sx,sy)=>{const v=Math.max(.02,(sy-HY)/F),z=HC/v;return{x:(sx-640)/F*z,z};};
const toScreen=(x,y,z)=>[640+F*x/z,HY+F*(HC-y)/z];

/* =====================================================================================
   THE SEA: grey-blue water, drawn coast, drifting clouds; contact shadows; a highlight on
   the channel the boat is over.
   ===================================================================================== */
const SEA_FS=`#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;uniform float uTc,uAmp,uSumA;uniform vec4 uW[6];uniform vec2 uW2[6];
uniform vec4 uSh[2];uniform float uShA[2];uniform vec3 uZone;uniform float uLineY;uniform float uZoff;
const float F=${F}.0,HC=${HC}.0,HY=${HY}.0;
const vec3 INK=vec3(.10,.14,.19);
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
mat2 ROT=mat2(.766,-.643,.643,.766);
float chop(vec2 p){vec2 q=p*vec2(.85,1.35)+vec2(0.,uTc*.55);vec2 r=ROT*p*1.6-vec2(uTc*.25,uTc*.8);return fbm(q)*.6+fbm(r)*.4;}
float line(float x,float px){return 1.-smoothstep(px*.5,px*.5+1.,abs(x)/(fwidth(x)+1e-5));}
vec3 sky(vec3 d){float e=max(d.y,0.);return mix(vec3(.82,.86,.89),vec3(.46,.60,.73),pow(e,.5));}
vec3 poster(vec3 c,float k){float l=dot(c,vec3(.3,.5,.2))+1e-4;float n=7.;float q=floor(l*n)/n,f=fract(l*n);q+=smoothstep(.3,.7,f)/n;return c*mix(1.,q/l,k);}
// The coast is a painted strip (a relief rendered offline: cliffs, scree, valleys, an island, stacks),
// its bottom edge on the horizon; the clouds are drawings cut from a reference sheet, drifting slowly.
uniform sampler2D uCoast,uClouds;uniform float uCoastH;uniform vec4 uCA[6],uCB[6];uniform float uCHz[6];
vec4 coastAt(float x,float hgt){if(hgt<0.||hgt>uCoastH)return vec4(0.);return texture2D(uCoast,vec2(x/1280.,1.-hgt/uCoastH));}
vec3 clouds(vec2 L,vec3 c){
 for(int k=0;k<6;k++){
  vec2 q=(L-uCA[k].xy)/uCA[k].zw;
  // sampled everywhere (no branch) so the mip level stays right at the edges of each cloud's frame
  float inside=step(0.,q.x)*step(q.x,1.)*step(0.,q.y)*step(q.y,1.);
  vec4 t=texture2D(uClouds,uCB[k].xy+clamp(q,0.,1.)*uCB[k].zw)*inside;   // premultiplied
  c=c*(1.-t.a)+mix(t.rgb,c*t.a,uCHz[k]);
 }
 return c;}
void main(){
 vec2 L=vec2(gl_FragCoord.x/uRes.x*1280.,(1.-gl_FragCoord.y/uRes.y)*800.);
 float u=(L.x-640.)/F,v=(L.y-HY)/F;
 if(v<=.0006){
  vec3 d=normalize(vec3(u,-v,1.));vec3 c=sky(d);
  c=clouds(L,c);
  float hgt=HY-L.y;vec4 t=coastAt(L.x,hgt);
  c=c*(1.-t.a)+t.rgb;
  c=mix(c,vec3(.62,.68,.72),smoothstep(4.,0.,hgt)*.45*t.a);   // mist lying on the water at the foot of the land
  gl_FragColor=vec4(c,1.);return;}
 float z=HC/v,x=u*z;vec2 p=vec2(x,z-uZoff);   // uZoff: how far the camera has drawn back
 float h=0.,crest=0.;vec2 g=vec2(0.);
 for(int i=0;i<6;i++){vec4 w=uW[i];float th=w.z*dot(w.xy,p)-uW2[i].x*uTc+uW2[i].y;float e=exp(1.6*(sin(th)-1.));float A=w.w*uAmp;h+=A*(e-.35);g+=A*1.6*cos(th)*e*w.z*w.xy;crest+=e*w.w;}
 vec2 g0=g;
 float fd=exp(-z/45.);
 if(fd>.02){float e=.06;float c0=chop(p),cx=chop(p+vec2(e,0.)),cz=chop(p+vec2(0.,e));g+=vec2(cx-c0,cz-c0)/e*.13*(.55+.45*uAmp)*fd;}
 vec3 N=normalize(vec3(-g.x,1.,-g.y));
 vec3 P=vec3(x,h,z),V=normalize(vec3(0.,HC,0.)-P);
 float ndv=max(dot(N,V),0.),Fr=.02+.98*pow(1.-ndv,5.);
 vec3 R=reflect(-V,N);R.y=abs(R.y);
 float hn=clamp(h/(uAmp*.9+.001)+.45,0.,1.);
 vec3 deep=vec3(.075,.115,.155),scat=vec3(.20,.29,.33);
 vec3 refr=mix(deep,scat,.10+.50*hn*hn);
 float face=clamp(-N.z*3.,-1.,1.);refr*=1.+.25*face;
 vec3 col=mix(refr,sky(R),Fr*.9);
 col+=vec3(.55,.60,.65)*.05*max(dot(N,normalize(vec3(-.3,1.,.5))),0.);
 float cr=crest/uSumA,pat=fbm(p*.45+g0*1.5+vec2(0.,uTc*.15)),fine=fbm(p*1.3+vec2(uTc*.2,0.));
 float near=1.-smoothstep(150.,400.,z);
 float foam=smoothstep(.70,1.0,cr*(.7+.3*uAmp))*smoothstep(.55,.8,pat*.6+fine*.5)*.8;
 col=mix(col,vec3(.88,.91,.92),clamp(foam,0.,1.)*.9*near);
 for(int i=0;i<2;i++){vec4 s=uSh[i];vec2 q=L-s.xy;float a=uShA[i];vec2 r=vec2(cos(a)*q.x+sin(a)*q.y,-sin(a)*q.x+cos(a)*q.y)/max(s.zw,vec2(1.));col*=1.-.30*(1.-smoothstep(.5,1.,length(r)))*step(1.,s.z);}
 // the channel under the boat lights up a little (a band of brighter water between two buoys)
 if(uZone.z>0.){float w=uZone.y-uZone.x;float cx=(uZone.x+uZone.y)*.5;float inx=1.-smoothstep(w*.22,w*.5,abs(L.x-cx));float iny=exp(-pow((L.y-uLineY+10.)/(L.y<uLineY?95.:40.),2.));col=mix(col,col*1.30+vec3(.05,.07,.08),inx*iny*uZone.z);}
 col=mix(col,poster(col,.25),1.);
 col=mix(col,vec3(.70,.76,.80),smoothstep(40.,650.,z)*.82);
 float dy=L.y-HY;
 if(dy<60.){vec4 rt=coastAt(L.x+(noise(vec2(L.x/9.,dy*.8-uTc*.5))-.5)*3.,dy*1.5);
  float br=smoothstep(.25,.65,noise(vec2(L.x/3.,dy*1.3-uTc*.6)));
  col=mix(col,rt.rgb/max(rt.a,.001)*.82,rt.a*.5*br*(1.-smoothstep(0.,60.,dy)));}
 col=mix(col,INK,(1.-smoothstep(.15,.9,abs(L.y-HY-.5)))*.45);
 gl_FragColor=vec4(col,1.);}`;

/* =====================================================================================
   BOATS AND BUOYS. Every boat is a drawing (three states for sailing boats: sails full,
   sails slack, wrecked) plus a map baked from it: where its cloth is, how deep each pixel
   sits under its waterline, and how far each pixel of water is from that line. From these
   the shader makes the sails breathe, the flags fly, the hull meet the water softly, and
   lays the foam, bow wave and wake in the boat's own frame, so they never flicker.
   ===================================================================================== */
const SPR_VS=`attribute vec2 a;uniform vec3 uM0,uM1;uniform vec4 uQuad;varying vec2 vPx;
void main(){vec2 px=mix(uQuad.xy,uQuad.zw,a);vec2 s=vec2(dot(uM0,vec3(px,1.)),dot(uM1,vec3(px,1.)));vPx=px;gl_Position=vec4(s.x/640.-1.,1.-s.y/400.,0.,1.);}`;
const SPR_FS=`precision highp float;
varying vec2 vPx;uniform sampler2D uT0,uT1,uT2,uMap,uNum;uniform vec2 uTex;
uniform float uT,uMix,uBroken,uSail,uFoam,uSpeed,uUp,uMode,uAlpha,uLit,uPh,uGust,uHasNum,uNumOnSail;
uniform vec2 uBow[2];uniform float uNBow;uniform vec2 uStern,uAxis;uniform vec4 uFlag[3];uniform float uNFlag;
uniform mat3 uH;uniform vec4 uNumRect;uniform vec4 uBuoy;
const vec3 FOAM=vec3(.90,.92,.93),WATER=vec3(.13,.18,.22);
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
float froth(vec2 q,float t){
 float a=fbm(q*.055+vec2(t*.05,0.)),b=fbm(q*.055+vec2(3.7,1.3)-vec2(0.,t*.04));
 float m=mix(a,b,.5+.5*sin(t*.35));
 float holes=noise(q*.20+vec2(t*.12,-t*.08));
 return clamp(m*1.25-.18+.22*(holes-.5),0.,1.);}
bool inTex(vec2 p){return p.x>=0.&&p.y>=0.&&p.x<=uTex.x&&p.y<=uTex.y;}
// textures are always sampled (never inside a branch), so the mip level is right up to the edge of each picture
vec4 tx(sampler2D s,vec2 p){vec4 c=texture2D(s,clamp(p/uTex,0.,1.));return c*(inTex(p)?1.:0.);}
vec4 numberAt(vec2 at){vec3 q=uH*vec3(at,1.);vec2 nu=q.xy/q.z;vec4 c=texture2D(uNum,mix(uNumRect.xy,uNumRect.zw,clamp(nu,0.,1.)));if(uHasNum<.5||nu.x<0.||nu.x>1.||nu.y<0.||nu.y>1.) return vec4(0.);return c;}
void main(){
 vec2 P=vPx;float t=uT;
 if(uMode<.5){
  // ===================== A BOAT =====================
  vec4 mp=inTex(P)?texture2D(uMap,P/uTex):vec4(0.,0.,1.,1.);
  float baked=(mp.g*255.-128.)*4.;
  float depth=baked+uUp+2.2*sin(P.x*.045+t*1.6)+1.2*sin(P.x*.13-t*2.1);
  float fdist=mp.b*255.;
  vec2 ax=uAxis,pp=vec2(-ax.y,ax.x);
  vec2 q=P-uStern;float sw=dot(q,ax),lw=dot(q,pp);
  float wakeLen=180.+520.*uSpeed;
  float Wt=(18.+.22*max(sw,0.))*(.6+.4*uSpeed);
  bool wakeZone=uFoam>.01&&sw>-40.&&sw<wakeLen*1.6&&abs(lw)<max(Wt*1.4,.4*sw+40.);
  bool foamZone=uFoam>.01&&fdist<140.;
  vec4 c=vec4(0.);
  {
   vec2 at=P;float shade=1.;float m=mp.r*uSail,soft=clamp(mp.r*8.,0.,1.);
   if(m>0.){
    float br=.5+.5*sin(t*1.25);
    float ph1=dot(P,vec2(.034,.052))-t*(2.4+11.*uGust),ph2=dot(P,vec2(-.020,.072))-t*(1.8+8.*uGust)+1.3;
    float amp=m*((1.6+1.4*br)+uGust*6.);
    at=P-normalize(vec2(1.,.38))*(amp*(.6*sin(ph1)+.4*sin(ph2))+m*br*2.6);
    shade=1.+soft*m*(.06+.09*uGust)*(.6*cos(ph1)+.4*cos(ph2))-soft*m*.04*br;
   }
   for(int i=0;i<3;i++){
    if(float(i)>=uNFlag) break;
    vec4 f=uFlag[i];float fh=f.w-f.y,fw=f.z-f.x;
    if(P.x>f.x-2.&&P.x<f.z+fw*.35&&P.y>f.y-fh*.35&&P.y<f.w+fh*.35){
     float u=clamp((P.x-f.x)/fw,0.,1.);float w=t*(7.+5.*uGust)+float(i)*1.7;
     float dy=u*fh*(.09+.06*uGust)*sin(u*5.5-w)+u*u*fh*.04*sin(u*9.-w*1.3);
     float dx=-u*u*fw*(.03+.03*uGust)*(.5+.5*cos(u*5.5-w));
     at=vec2(P.x-dx,P.y-dy);shade=1.+.22*u*cos(u*5.5-w);
    }
   }
   vec2 au=clamp(at/uTex,0.,1.);
   c=texture2D(uT0,au);
   if(uMix>0.) c=mix(c,texture2D(uT1,au),uMix);
   if(uBroken>0.) c=mix(c,texture2D(uT2,clamp(P/uTex,0.,1.)),uBroken);
   vec4 n=numberAt(at);
   float nk=(uNumOnSail>.5?soft*.92:step(.5,c.a))*(1.-uBroken);
   c=n*nk+c*(1.-n.a*nk);
   c.rgb*=shade;
   c.rgb=mix(c.rgb,WATER*c.a,clamp(smoothstep(0.,3.,depth)*.35+smoothstep(0.,22.,max(depth,0.))*.6,0.,.95));
   c*=1.-smoothstep(8.,24.,depth);
   c*=inTex(P)?1.:0.;
  }
  if(foamZone||wakeZone){
   float bowD=1e5;for(int i=0;i<2;i++){if(float(i)<uNBow) bowD=min(bowD,length(P-uBow[i]));}
   float sp=.35+.65*uSpeed;
   float fo=0.,band=0.,trail=0.;
   if(foamZone){
    float dmin=fdist;
    float W=(12.+48.*exp(-bowD/110.)*sp+14.*uSpeed);
    vec2 flow=vec2(dot(P,ax)-t*(14.+36.*uSpeed),dmin*1.4);
    band=smoothstep(W,W*.25,dmin);
    float fr=froth(flow,t);
    fo=band*smoothstep(.22,.52,fr+.45*(band-.5));
    fo=max(fo,smoothstep(6.,1.2,dmin)*.9*smoothstep(.2,.5,fr+.3));
   }
   for(int i=0;i<2;i++){
    if(float(i)>=uNBow) break;
    vec2 bq=P-uBow[i]-vec2(-8.,10.);float bw=length(bq*vec2(.62,1.15));float R=(30.+55.*uSpeed);
    float b=smoothstep(R,R*.25,bw)*smoothstep(.22,.55,froth(P*1.2+vec2(-t*(10.+30.*uSpeed),t*8.),t)+.35*smoothstep(R,R*.25,bw)-.1)*smoothstep(-.45*R,.1*R,P.y-uBow[i].y);
    fo=max(fo,b*(.4+.6*uSpeed));
   }
   if(wakeZone){
    float fade=smoothstep(-25.,10.,sw)*exp(-max(sw,0.)/(wakeLen*.8));
    trail=fade*smoothstep(Wt,Wt*.2,abs(lw));
    float frw=froth(vec2(sw-t*(14.+36.*uSpeed),lw*1.6),t+3.);
    float thr=.22+.30*smoothstep(0.,wakeLen,sw);
    fo=max(fo,trail*smoothstep(thr,thr+.28,frw+.35*(trail-.5))*(.25+.75*uSpeed));
    float armD=abs(abs(lw)-.36*sw)/(3.+.05*max(sw,0.));
    float arm=smoothstep(20.,80.,sw)*exp(-max(sw,0.)/(wakeLen*.9))*exp(-armD*armD)*smoothstep(.45,.7,froth(vec2(sw-t*30.,sign(lw)*40.+lw),t+7.));
    fo=max(fo,arm*.7*uSpeed);
   }
   fo=clamp(fo,0.,1.)*uFoam;
   float fS=.82+.22*fbm(P*.08+vec2(t*.1,0.));
   float halo=max(band*.8,trail*.85*uSpeed)*uFoam;
   vec4 u4=vec4(vec3(.45,.52,.56)*halo*.36,halo*.36);
   vec4 f4=vec4(FOAM*fS*fo,fo);f4=f4+u4*(1.-f4.a);
   c=c+f4*(1.-c.a);
   float lip=exp(-pow(depth/4.,2.))*step(-500.,baked)*smoothstep(.35,.6,froth(vec2(P.x-t*30.,P.y*2.),t+11.))*uFoam*step(fdist,60.)*step(uUp,.5);
   c.rgb=mix(c.rgb,FOAM*fS*max(c.a,lip),lip*.85);c.a=max(c.a,lip*.85);
  }
  c*=uAlpha;
  if(c.a<.003) discard;
  gl_FragColor=c;
 } else {
  // ===================== A BUOY =====================
  float rx=uBuoy.y*1.04,ry=rx*.30;vec2 cen=vec2(uBuoy.z,uBuoy.x-ry*.45);
  float u=(P.x-cen.x)/rx;
  float wl=cen.y+ry*sqrt(max(0.,1.-u*u))+1.8*sin(P.x*.07+t*1.9+uPh)+1.*sin(P.x*.17-t*2.6+uPh*2.);
  float depth=P.y-wl;
  vec4 c=tx(uT0,P);
  vec4 n=numberAt(P);c=n*step(.5,c.a)+c*(1.-n.a*step(.5,c.a));
  c.rgb=mix(c.rgb,WATER*c.a,clamp(smoothstep(0.,3.,depth)*.40+smoothstep(0.,12.,max(depth,0.))*.55,0.,.95));
  c*=1.-smoothstep(4.,18.,depth);
  if(uLit>0.){
   float mx=0.;for(int i=0;i<8;i++){float a=float(i)*.785;vec2 o=vec2(cos(a),sin(a))*14.;mx=max(mx,tx(uT0,P+o).a*step(P.y+o.y,wl+4.));}
   float glow=clamp(mx-c.a,0.,1.)*uLit*(.65+.35*sin(t*7.));
   c=c+vec4(vec3(1.,.55,.05)*glow,glow)*(1.-c.a);
   c.rgb=mix(c.rgb,vec3(1.,.62,.15)*c.a,.18*uLit*(.5+.5*sin(t*7.)));
  }
  vec2 r=(P-cen-vec2(-6.*sin(t*.7+uPh),0.))/vec2(rx,ry);float e=length(r);
  float fr=froth(P*1.5+vec2(t*14.,t*3.),t+uPh);
  float ringW=.42+.18*sin(atan(r.y,r.x)*3.+t*.8+uPh);
  float ring=smoothstep(1.+ringW,1.02,e)*smoothstep(.22,.55,fr+.5*(1.+ringW-e)/ringW-.25);
  ring*=smoothstep(-.35,.05,r.y);
  ring*=max(smoothstep(-3.,1.5,depth),1.-c.a);
  float lip=exp(-pow(depth/2.8,2.))*step(abs(u),1.)*smoothstep(.25,.55,fr+.15)*.9;
  ring=max(ring,lip);
  vec4 f4=vec4(FOAM*(.82+.2*fr)*ring,ring);
  c=f4+c*(1.-f4.a);
  c*=uAlpha;
  if(c.a<.003) discard;
  gl_FragColor=c;
 }}`;
function mk(G,vs,fs){const Sh=(t,s)=>{const o=G.createShader(t);G.shaderSource(o,s);G.compileShader(o);if(!G.getShaderParameter(o,G.COMPILE_STATUS))throw new Error(G.getShaderInfoLog(o));return o;};const p=G.createProgram();G.attachShader(p,Sh(G.VERTEX_SHADER,vs));G.attachShader(p,Sh(G.FRAGMENT_SHADER,fs));G.linkProgram(p);if(!G.getProgramParameter(p,G.LINK_STATUS))throw new Error(G.getProgramInfoLog(p));return p;}
// ---- sea program
const PS=mk(gl,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}',SEA_FS);gl.useProgram(PS);
{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const ap=gl.getAttribLocation(PS,'p');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);}
const US={};const us=n=>US[n]??(US[n]=gl.getUniformLocation(PS,n));
// ---- sky textures on the sea context: the coast strip and the cloud sheet
const SKY=OPTS.donnees.SKY;
function seaTex(src,unit,mip){const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));pending++;const im=new Image();im.onload=()=>{gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);
 gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
 if(mip){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);}else gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);pending--;};im.src=src;return t;}
let pending=0;
seaTex(SKY.coast,0,false);seaTex(SKY.clouds,1,true);
gl.uniform1i(us('uCoast'),0);gl.uniform1i(us('uClouds'),1);gl.uniform1f(us('uCoastH'),SKY.coastH);
// six clouds from three drawings (two mirrored); higher ones larger and a little faster, lower ones smaller and hazier
const CLOUDS=[{k:1,x:40,y:16,s:.50,v:5.0,f:0,hz:0},{k:0,x:640,y:34,s:.56,v:4.2,f:1,hz:.04},{k:2,x:470,y:118,s:.40,v:2.6,f:0,hz:.22},
 {k:2,x:1050,y:84,s:.50,v:3.4,f:1,hz:.12},{k:0,x:1350,y:104,s:.36,v:2.4,f:0,hz:.26},{k:1,x:1600,y:58,s:.36,v:3.0,f:1,hz:.16}];
function cloudUniforms(){const A=[],Bv=[],Hz=[];
 for(const c of CLOUDS){const r=SKY.rects[c.k],w=r[4]*c.s,h=r[5]*c.s,span=1280+w+240;
  const x=((c.x+T*c.v)%span+span)%span-w-120;A.push(x,c.y,w,h);
  Bv.push(c.f?r[0]+r[2]:r[0],r[1],c.f?-r[2]:r[2],r[3]);Hz.push(c.hz);}
 gl.uniform4fv(us('uCA'),new Float32Array(A));gl.uniform4fv(us('uCB'),new Float32Array(Bv));gl.uniform1fv(us('uCHz'),new Float32Array(Hz));}
gl.uniform4fv(us('uW'),new Float32Array(WAVES.flatMap(w=>[w.dx,w.dz,w.k,w.A])));
gl.uniform2fv(us('uW2'),new Float32Array(WAVES.flatMap(w=>[w.om,w.ph])));
gl.uniform1f(us('uSumA'),SUMA);
// ---- sprite program
const PB=mk(gb,SPR_VS,SPR_FS);gb.useProgram(PB);
{const b=gb.createBuffer();gb.bindBuffer(gb.ARRAY_BUFFER,b);gb.bufferData(gb.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),gb.STATIC_DRAW);const ap=gb.getAttribLocation(PB,'a');gb.enableVertexAttribArray(ap);gb.vertexAttribPointer(ap,2,gb.FLOAT,false,0,0);}
const UB={};const ub=n=>UB[n]??(UB[n]=gb.getUniformLocation(PB,n));
gb.enable(gb.BLEND);gb.blendFunc(gb.ONE,gb.ONE_MINUS_SRC_ALPHA);
function texFrom(src,mip=true){const t=gb.createTexture();t.ok=false;
 const up=im=>{gb.bindTexture(gb.TEXTURE_2D,t);gb.pixelStorei(gb.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gb.texImage2D(gb.TEXTURE_2D,0,gb.RGBA,gb.RGBA,gb.UNSIGNED_BYTE,im);
  if(mip){gb.generateMipmap(gb.TEXTURE_2D);gb.texParameteri(gb.TEXTURE_2D,gb.TEXTURE_MIN_FILTER,gb.LINEAR_MIPMAP_LINEAR);}else gb.texParameteri(gb.TEXTURE_2D,gb.TEXTURE_MIN_FILTER,gb.LINEAR);
  gb.texParameteri(gb.TEXTURE_2D,gb.TEXTURE_MAG_FILTER,gb.LINEAR);gb.texParameteri(gb.TEXTURE_2D,gb.TEXTURE_WRAP_S,gb.CLAMP_TO_EDGE);gb.texParameteri(gb.TEXTURE_2D,gb.TEXTURE_WRAP_T,gb.CLAMP_TO_EDGE);t.ok=true;};
 if(typeof src==='string'){pending++;const im=new Image();im.onload=()=>{up(im);pending--;};im.src=src;}else up(src);
 t.up=up;return t;}
// map textures must stay linear data: no premultiplication
function mapFrom(src){const t=gb.createTexture();t.ok=false;pending++;const im=new Image();im.onload=()=>{gb.bindTexture(gb.TEXTURE_2D,t);gb.pixelStorei(gb.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gb.pixelStorei(gb.UNPACK_COLORSPACE_CONVERSION_WEBGL,gb.NONE);gb.texImage2D(gb.TEXTURE_2D,0,gb.RGBA,gb.RGBA,gb.UNSIGNED_BYTE,im);gb.pixelStorei(gb.UNPACK_COLORSPACE_CONVERSION_WEBGL,gb.BROWSER_DEFAULT_WEBGL);
 gb.texParameteri(gb.TEXTURE_2D,gb.TEXTURE_MIN_FILTER,gb.LINEAR);gb.texParameteri(gb.TEXTURE_2D,gb.TEXTURE_MAG_FILTER,gb.LINEAR);gb.texParameteri(gb.TEXTURE_2D,gb.TEXTURE_WRAP_S,gb.CLAMP_TO_EDGE);gb.texParameteri(gb.TEXTURE_2D,gb.TEXTURE_WRAP_T,gb.CLAMP_TO_EDGE);t.ok=true;pending--;};im.src=src;return t;}
const BOATDEF={};
for(const [name,b] of Object.entries(ASSETS.boats)){
 const m=b.meta;const d={name,meta:m,tex:{},map:mapFrom(b.map)};
 for(const v of m.variants) d.tex[v]=texFrom(b.tex[v]);
 const bw=m.bow[0],st=m.stern[0];let ax=[st[0]-bw[0],st[1]-bw[1]];const al=Math.hypot(...ax);d.axis=[ax[0]/al,ax[1]/al];
 BOATDEF[name]=d;}
const BUOYDEF=ASSETS.buoys.map(b=>({meta:b.meta,tex:texFrom(b.tex)}));
const PLAYER_BOATS=['sloop','cata','yacht','trawler'];
const NAMES={sloop:'le voilier',cata:'le catamaran',yacht:'le bateau',trawler:'le chalutier'};
// ---- numbers, painted on small canvases: one slot for the player's boat, eight for the buoys
const numC=document.createElement('canvas');numC.width=512;numC.height=3072;const nx=numC.getContext('2d');
const SLOT=256,NSLOT=12;let TNUM=null;
function quadAspect(q){const d=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);return (d(q[0],q[1])+d(q[3],q[2]))/(d(q[0],q[3])+d(q[1],q[2]));}
function paintNumber(slot,num,style,aspect){
 nx.clearRect(0,slot*SLOT,512,SLOT);nx.save();nx.translate(256,slot*SLOT+SLOT/2);
 const s=String(num),n=s.length;
 const sx=2/aspect;     // the slot is 2:1; this undoes the stretch of mapping it onto the surface
 if(style==='plate'){nx.fillStyle='#f7f4ea';nx.strokeStyle='#1d2a33';nx.lineWidth=12;const w=488,h=232;nx.beginPath();nx.roundRect(-w/2,-h/2,w,h,30);nx.fill();nx.stroke();}
 nx.font=`900 100px "Arial Black","Helvetica Neue",Arial,sans-serif`;const wn=nx.measureText(s).width/100;
 const room=style==='plate'?.80:.94,fs=Math.min(218*(style==='plate'?.82:1),512*room/(wn*sx));
 nx.font=`900 ${fs}px "Arial Black","Helvetica Neue",Arial,sans-serif`;nx.textAlign='center';nx.textBaseline='middle';
 nx.scale(sx,1);nx.lineJoin='round';
 if(style==='light'){nx.lineWidth=18;nx.strokeStyle='rgba(20,24,30,.85)';nx.strokeText(s,0,8);nx.fillStyle='#f8f6ee';nx.fillText(s,0,8);}
 else if(style==='dark'){nx.lineWidth=16;nx.strokeStyle='rgba(250,248,240,.9)';nx.strokeText(s,0,8);nx.fillStyle='#16191f';nx.fillText(s,0,8);}
 else if(style==='sail'){nx.fillStyle='#1a2233';nx.fillText(s,0,8);}
 else {nx.fillStyle='#14202e';nx.fillText(s,0,10);}
 nx.restore();
 if(TNUM) TNUM.up(numC);}
TNUM=texFrom(numC,false);
const slotRect=k=>[0,(k+.02)/NSLOT,1,(k+.98)/NSLOT];
function homog(P){const A=[],B=[],U=[[0,0],[1,0],[1,1],[0,1]];
 for(let i=0;i<4;i++){const[x,y]=U[i],[X,Y]=P[i];A.push([x,y,1,0,0,0,-x*X,-y*X]);B.push(X);A.push([0,0,0,x,y,1,-x*Y,-y*Y]);B.push(Y);}
 for(let c=0;c<8;c++){let p=c;for(let r=c+1;r<8;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];[B[c],B[p]]=[B[p],B[c]];for(let r=0;r<8;r++){if(r===c)continue;const f=A[r][c]/A[c][c];for(let k=c;k<8;k++)A[r][k]-=f*A[c][k];B[r]-=f*B[c];}}
 const h=B.map((v,i)=>v/A[i][i]);const[a,b,c]=[h[0],h[1],h[2]],[d,e,f]=[h[3],h[4],h[5]],[g,hh,i]=[h[6],h[7],1];
 const det=a*(e*i-f*hh)-b*(d*i-f*g)+c*(d*hh-e*g);
 const I=[[(e*i-f*hh)/det,(c*hh-b*i)/det,(b*f-c*e)/det],[(f*g-d*i)/det,(a*i-c*g)/det,(c*d-a*f)/det],[(d*hh-e*g)/det,(b*g-a*hh)/det,(a*e-b*d)/det]];
 return new Float32Array([I[0][0],I[1][0],I[2][0],I[0][1],I[1][1],I[2][1],I[0][2],I[1][2],I[2][2]]);}
for(const d of Object.values(BOATDEF)) if(d.meta.num) d.H=homog(d.meta.num);
for(const d of BUOYDEF) d.H=homog(d.meta.num);

/* ---- 2D affine matrices, canvas-style */
class M2{constructor(){this.m=[1,0,0,1,0,0];}mul(a,b,c,d,e,f){const[A,B,C,D,E,G]=this.m;this.m=[A*a+C*b,B*a+D*b,A*c+C*d,B*c+D*d,A*e+C*f+E,B*e+D*f+G];return this;}
 translate(x,y){return this.mul(1,0,0,1,x,y);}rotate(r){const c=Math.cos(r),s=Math.sin(r);return this.mul(c,s,-s,c,0,0);}scale(x,y){return this.mul(x,0,0,y??x,0,0);}skewX(k){return this.mul(1,0,k,1,0,0);}
 ap(x,y){const[a,b,c,d,e,f]=this.m;return[a*x+c*y+e,b*x+d*y+f];}}
function setMat(mat,quad){const[a,b,c,d,e,f]=mat.m;gb.uniform3f(ub('uM0'),a,c,e);gb.uniform3f(ub('uM1'),b,d,f);gb.uniform4f(ub('uQuad'),...quad);}
function bindTex(unit,t){gb.activeTexture(gb.TEXTURE0+unit);gb.bindTexture(gb.TEXTURE_2D,t);}
function drawBoatSprite(o){
 const d=BOATDEF[o.type],m=d.meta;
 if(!d.tex.full.ok||!d.map.ok) return;
 setMat(o.mat,[-260,-40,1024+620,1024+140]);
 gb.uniform2f(ub('uTex'),1024,1024);gb.uniform1f(ub('uMode'),0);
 bindTex(0,d.tex.full);bindTex(1,d.tex.slack||d.tex.full);bindTex(2,d.tex.broken||d.tex.full);bindTex(3,d.map);bindTex(4,TNUM);
 gb.uniform1i(ub('uT0'),0);gb.uniform1i(ub('uT1'),1);gb.uniform1i(ub('uT2'),2);gb.uniform1i(ub('uMap'),3);gb.uniform1i(ub('uNum'),4);
 gb.uniform1f(ub('uT'),T%1000);gb.uniform1f(ub('uMix'),d.tex.slack?o.slack:0);gb.uniform1f(ub('uBroken'),d.tex.broken?o.broken:0);
 gb.uniform1f(ub('uSail'),m.sail?(1-o.broken):0);gb.uniform1f(ub('uFoam'),o.foam);gb.uniform1f(ub('uSpeed'),o.speed);gb.uniform1f(ub('uUp'),o.up);gb.uniform1f(ub('uAlpha'),o.alpha);gb.uniform1f(ub('uGust'),o.gust);
 const bows=m.bow.concat([[0,0]]).slice(0,2);gb.uniform2fv(ub('uBow'),new Float32Array(bows.flat()));gb.uniform1f(ub('uNBow'),m.bow.length);
 gb.uniform2f(ub('uStern'),...m.stern[0]);gb.uniform2f(ub('uAxis'),...d.axis);
 const fl=m.flags.concat([[0,0,0,0],[0,0,0,0]]).slice(0,3);gb.uniform4fv(ub('uFlag'),new Float32Array(fl.flat()));gb.uniform1f(ub('uNFlag'),m.flags.length);
 const hasNum=!!(d.H&&o.num!=null);gb.uniform1f(ub('uHasNum'),hasNum?1:0);if(hasNum){gb.uniformMatrix3fv(ub('uH'),false,d.H);gb.uniform4f(ub('uNumRect'),...slotRect(o.slot??0));}
 gb.uniform1f(ub('uNumOnSail'),m.plate?0:1);
 gb.drawArrays(gb.TRIANGLES,0,6);}
function drawBuoySprite(b,i){
 const d=BUOYDEF[b.type];if(!d.tex.ok) return;
 setMat(b.mat,[-120,0,512+120,1024+60]);
 gb.uniform2f(ub('uTex'),512,1024);gb.uniform1f(ub('uMode'),1);
 bindTex(0,d.tex);bindTex(4,TNUM);gb.uniform1i(ub('uT0'),0);gb.uniform1i(ub('uNum'),4);
 gb.uniform1f(ub('uT'),T%1000);gb.uniform1f(ub('uAlpha'),b.alpha);gb.uniform1f(ub('uLit'),b.lit);gb.uniform1f(ub('uPh'),b.slot*1.7);
 gb.uniform4f(ub('uBuoy'),d.meta.wl,d.meta.half,d.meta.cx,0);
 gb.uniform1f(ub('uHasNum'),1);gb.uniformMatrix3fv(ub('uH'),false,d.H);gb.uniform4f(ub('uNumRect'),...slotRect(b.slot));
 gb.drawArrays(gb.TRIANGLES,0,6);}

/* =====================================================================================
   STAGE SIZING. The sea can run at a lower resolution; boats and the overlay never do.
   ===================================================================================== */
let scale=1,R2=1;
function fit(){scale=OPTS.echelle();REDESSINE=true;
 const dpr=devicePixelRatio||1,full=Math.min(2,scale*dpr),k=[Math.min(1,full)*.6,Math.min(1,full),full][QUAL];
 cs.width=Math.round(1280*k);cs.height=Math.round(800*k);
 R2=full;cb.width=fx.width=Math.round(1280*R2);cb.height=fx.height=Math.round(800*R2);}
OPTS.on(window,'resize',fit);fit();
function pt(e){const r=stage.getBoundingClientRect();return{x:(e.clientX-r.left)/scale,y:(e.clientY-r.top)/scale};}

/* =====================================================================================
   GAME RULES (from the mock-up that was validated)
   ===================================================================================== */
const LV=[null,
 {max:100, n:3,kind:'ten',    mode:'far', farD:3,  d:'Nombres ≤ 100 · 3 bouées, écart 10 · bateau loin des bouées'},
 {max:100, n:3,kind:'odd',    mode:'any',           d:'Nombres ≤ 100 · 3 bouées non rondes, écart 3 à 9'},
 {max:1000,n:3,kind:'hundred',mode:'far', farD:20, d:'Nombres ≤ 1 000 · 3 bouées, écart 100 · bateau loin'},
 {max:1000,n:4,kind:'ten',    mode:'far', farD:3,  d:'Nombres ≤ 1 000 · 4 bouées, écart 10 · bateau loin'},
 {max:1000,n:4,kind:'alt',    mode:'near',          d:'Nombres ≤ 1 000 · 4 bouées, écart 100 ou 10 en alternance · bateau proche d’une bouée'},
 {max:1000,n:4,kind:'odd',    mode:'near',          d:'Nombres ≤ 1 000 · 4 bouées non rondes · bateau proche'},
 {max:1000,n:5,kind:'ten',    mode:'near',          d:'Nombres ≤ 1 000 · 5 bouées, écart 10 · bateau proche'},
 {max:1000,n:5,kind:'mix',    mode:'near',          d:'Nombres ≤ 1 000 · 5 bouées, écarts mélangés · bateau proche'},
 {max:1000,n:4,kind:'double', mode:'any',           d:'Double encadrement : entre deux centaines (4 bouées de 100 en 100), puis entre deux dizaines (5 bouées de 10 en 10)'}];
const NG=LV.length-1,MV=[null,'statique','vent','pirates'];
const G={grade:1,mv:1,mvWins:0,fails:0,forcedN:null,buoys:[],kindUsed:'ten',alt:false,v:0,lastV:null,attempts:0,dots:[],sessionLen:15,windDur:7000,
 first:true,announce:null,log:[],lastType:null,running:false,ended:false,zoneOn:0,stage:1,row1:null,s1ok:false};
function genBuoys(kind,n,max){
 if(kind==='double'){const h0=100*rnd(1,6);return [h0,h0+100,h0+200,h0+300];}
 const top=max===100?90:990;
 for(let t=0;t<800;t++){let b=[];
  if(kind==='ten'||kind==='hundred'){const step=kind==='ten'?10:100,lo=kind==='hundred'?100:(max===100?10:20),hi=(kind==='hundred'?900:top)-step*(n-1);if(hi<lo)continue;const s=lo+step*rnd(0,Math.floor((hi-lo)/step));for(let i=0;i<n;i++)b.push(s+i*step);}
  else if(kind==='odd'){b.push(rnd(12,max===100?Math.max(12,top-9*(n-1)):900));for(let i=1;i<n;i++)b.push(b[i-1]+rnd(3,9));if(b.some(x=>x%10===0))continue;}
  else{b.push(rnd(15,max===100?40:450));for(let i=1;i<n;i++)b.push(b[i-1]+pick([100,10,rnd(3,9)]));}
  if(b[0]<10||b[b.length-1]>top)continue;return b;}
 return [40,50,60].slice(0,n);}
function gapOfChenal(c){const b=G.buoys,n=b.length;if(n===1)return G.kindUsed==='hundred'?100:10;if(c===0)return b[1]-b[0];if(c===n)return b[n-1]-b[n-2];return b[c]-b[c-1];}
function distIn(v,c){const b=G.buoys;let d=Infinity;if(c>0)d=Math.min(d,v-b[c-1]);if(c<b.length)d=Math.min(d,b[c]-v);return d;}
function candidates(c,cfg){const b=G.buoys,n=b.length,maxB=cfg.max===100?99:999,lo=c===0?1:b[c-1]+1,hi=c===n?maxB:b[c]-1,out=[];
 for(let v=lo;v<=hi;v++){if(v===G.lastV)continue;const d=distIn(v,c);if(cfg.mode==='far'&&d<cfg.farD)continue;if(cfg.mode==='near'&&d>(gapOfChenal(c)>=100?9:2))continue;out.push(v);}return out;}
function pickNumber(){const cfg=LV[G.grade],n=G.buoys.length;
 if(cfg.kind==='double'){const b=G.row1;let v;do{v=rnd(b[0]+1,b[3]-1);}while(v%10===0||v===G.lastV);return v;}const w=n===2?[.25,.5,.25]:Array(n+1).fill(1/(n+1));
 let r=Math.random(),c=0;for(;c<n;c++){if(r<w[c])break;r-=w[c];}
 let cand=candidates(c,cfg);for(let k=0;k<=n&&!cand.length;k++)cand=candidates(k,cfg);for(let k=0;k<=n&&!cand.length;k++)cand=candidates(k,{max:cfg.max,mode:'any'});return pick(cand);}
const U=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize'];
function w99(n){if(n<17)return U[n];if(n<20)return'dix-'+U[n-10];const t=Math.floor(n/10),u=n%10,TT={2:'vingt',3:'trente',4:'quarante',5:'cinquante',6:'soixante'};
 if(t<7){if(u===0)return TT[t];if(u===1)return TT[t]+' et un';return TT[t]+'-'+U[u];}if(t===7)return n===71?'soixante et onze':'soixante-'+w99(n-60);if(n===80)return'quatre-vingts';return'quatre-vingt-'+w99(n-80);}
function words(n){if(n===1000)return'mille';if(n<100)return w99(n);const h=Math.floor(n/100),r=n%100,s=h===1?'cent':U[h]+' cent';if(r===0)return h===1?s:s+'s';return s+' '+w99(r);}
const numLine=v=>{const w=words(v);return `<b>${v}</b><br>« ${w[0].toUpperCase()+w.slice(1)} »`;};
const CONSIGNE='Les bouées sont rangées du plus petit au plus grand. Fais passer chaque bateau par le bon passage.';

/* =====================================================================================
   SCENE LAYOUT
   ===================================================================================== */
const LINE_Y=690,WAIT={x:OPTS.attente?.x??430,y:OPTS.attente?.y??410},AUTO_Y0=405;
const xsOf=()=>{const n=G.buoys.length;return G.buoys.map((_,i)=>Math.round(1280*(i+1)/(n+1)));};
const edges=()=>[0,...xsOf(),1280];
const chenalAt=x=>xsOf().filter(v=>v<x).length;
const zoneCenter=k=>{const e=edges();return clamp((e[k]+e[k+1])/2,170,1060);};
const boatK=y=>.44*(.92+.16*clamp((y-330)/(LINE_Y-330),0,1.6));   // a little bigger as it comes closer
const BK=.23;
const Z_LINE=F*HC/(LINE_Y-HY),PULL=29;   // depth of the buoy line; how far the camera draws back between the two rows
let ZC=0;                                 // the camera's pull-back so far (grows, never resets: the sea keeps flowing)
const activeBU=()=>BU.filter(b=>b.row===G.stage&&b.fade!==-1);

/* ---- the moving things */
function newShip(type){return{type,x:1500,y:330,num:null,k:.33,mode:'off',vis:false,slack:0,broken:0,up:0,sinkY:0,alpha:1,foam:1,speed:.3,gust:0,tilt:0,
 h:0,p:0,r:0,hinit:false,tw:null,prevX:1500,prevY:330,mat:new M2(),gustT:-99};}
let B=newShip('sloop'),P=newShip('pirate');
const BU=[];  // buoys on stage: {type,val,x,y,mat,lit,alpha}
const HEAD=[-.55,-.835],HULL_L=10,BEAM=3.2;
function rideWaves(o,t,dt){
 const{x,z:zs}=toWorld(o.x,o.y),z=zs-ZC;
 const hs=[];for(let i=-2;i<=2;i++){const s=i/4*HULL_L;hs.push(wave(x+HEAD[0]*s,z+HEAD[1]*s,t));}
 const px=-HEAD[1],pz=HEAD[0],b=BEAM/2;
 const th=(hs[0]+2*hs[1]+3*hs[2]+2*hs[3]+hs[4])/9,tp=Math.atan((hs[4]-hs[0])/HULL_L),tr=Math.atan((wave(x+px*b,z+pz*b,t)-wave(x-px*b,z-pz*b,t))/BEAM);
 if(!o.hinit){o.h=th;o.p=tp;o.r=tr;o.hinit=true;}
 const a=1-Math.exp(-dt*3.2);o.h+=(th-o.h)*a;o.p+=(tp-o.p)*a;o.r+=(tr-o.r)*a;
 const[sx,sy]=toScreen(x,o.h,zs);
 const d=BOATDEF[o.type],an=d.meta.anchor;o.k=boatK(o.y);
 o.mat=new M2().translate(sx,sy+o.sinkY).rotate(o.p*.9-.06*o.gust+o.tilt).scale(o.k).skewX(-(o.r*.8+.10*o.gust)).translate(-an[0],-an[1]);}
// A row of buoys, laid on the water at world depth wz (seen at depth wz+ZC). Row 1 sits on the buoy line;
// row 2 of a double framing is laid PULL metres nearer, out of sight, and comes into view as the camera draws back.
function addRow(vals,row,wz,fadeIn){
 const n=vals.length,base=row===2?1+4:1;
 vals.forEach((v,i)=>{const x=Math.round(1280*(i+1)/(n+1)),wx=(x-640)/F*Z_LINE,type=(i+(row===2?1:0))%4,slot=base+i;
  BU.push({type,val:v,wx,wz,row,slot,mat:new M2(),lit:0,alpha:fadeIn?0:1,fade:fadeIn?1:0,x,y:LINE_Y});
  paintNumber(slot,v,BUOYDEF[type].meta.ink,quadAspect(BUOYDEF[type].meta.num));});}
function placeBuoys(fadeIn){BU.length=0;addRow(G.buoys,1,Z_LINE-ZC,fadeIn);}
function rideBuoy(b,i,t){
 const z=b.wz+ZC;b.hidden=z<7;if(b.hidden)return;
 const h=(wave(b.wx,b.wz,t)*2+wave(b.wx-.8,b.wz,t)+wave(b.wx+.8,b.wz,t))/4,s=(wave(b.wx+.8,b.wz,t)-wave(b.wx-.8,b.wz,t))/1.6;
 const[sx,sy]=toScreen(b.wx,h,z);b.x=640+F*b.wx/z;b.y=HY+F*HC/z;
 const d=BUOYDEF[b.type].meta;b.mat=new M2().translate(sx,sy).rotate(-Math.atan(s)*.8).scale(BK*Z_LINE/z).translate(-d.cx,-d.wl);b.sx=sx;b.sy=sy;}

/* ---- tweens */
function tween(o,to,dur,ease,done){o.tw={from:{x:o.x,y:o.y},to,t0:T,dur:dur/1000/VIT.k,ease:ease||(p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2),done};}
function stepTween(o){if(!o.tw)return;const w=o.tw,q=clamp((T-w.t0)/w.dur,0,1),e=w.ease(q);o.x=w.from.x+(w.to.x-w.from.x)*e;o.y=w.from.y+(w.to.y-w.from.y)*e;if(q>=1){o.tw=null;w.done&&w.done();}}
const later=[];function after(ms,f){later.push({t:T+ms/1000,f,ep:G.epoch});}
G.epoch=0;

/* ---- HUD : la bulle et la mascotte de la maquette sont celles de l'application (engine/bulle.js, engine/mascotte.js) */
/* =====================================================================================
   RACCORDS AVEC L'APPLICATION (art/tools/export-voiliers.mjs) : l'application conduit la partie
   ===================================================================================== */
const MERS={calme:1,vent:2,pirates:3};
let JETON=0,FENTE=0;
// un délai en temps du jeu (il s'arrête pendant la pause), annulé si la scène s'arrête
function apres(ms,f){const j=JETON;later.push({t:T+ms/1000/VIT.k,f:()=>{if(j===JETON)f();},any:true});}
// le geste de l'enfant (ou le vent, ou les pirates) : l'application l'attend
function lacher(c){B.mode='juge';G.zoneOn=0;const r=ATTENTE;ATTENTE=null;r&&r({c});}
function rattrape(){B.mode='juge';const r=ATTENTE;ATTENTE=null;r&&r({rattrape:true});}
function seaFor(mv){return[0,.6,1,1.25][mv];}
const sameRow=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const API={
  // la rangée de bouées du bateau ; nouvelle : l'ancienne s'efface et la nouvelle apparaît (comme la maquette)
  bouees(vals){
    const row2=BU.some(b=>b.row===2);
    if(BU.length&&!row2&&G.stage===1&&sameRow(G.buoys,vals))return Promise.resolve();
    G.row1=vals.slice();
    // le double encadrement : la première rangée revient à la ligne des bouées, sans attendre (maquette, newBoat)
    if(row2&&sameRow(G.row1,BU.filter(b=>b.row===1).map(b=>b.val))){G.stage=1;G.buoys=vals.slice();BU.forEach(b=>b.fade=-1);addRow(G.buoys,1,Z_LINE-ZC,true);return Promise.resolve();}
    const had=BU.length;BU.forEach(b=>b.fade=-1);
    return new Promise(res=>apres(had?500:0,()=>{G.stage=1;G.buoys=vals.slice();addRow(G.buoys,1,Z_LINE-ZC,true);res();}));
  },
  // la mer (calme, vent, pirates)
  mer(m){G.mv=MERS[m]??1;SEA_T=seaFor(G.mv);},
  // un bateau arrive avec son nombre (maquette, newBoat) ; au calme, il attend au point d'attente, touchable ; avec le vent
  // et les pirates, il s'arrête au-dessus d'un mauvais passage (à droite si possible : la bulle est à gauche) et ne part
  // qu'à partir() (la consigne dite)
  arrivee({num}){
    G.epoch++;
    let type;do{type=pick(PLAYER_BOATS);}while(type===G.lastType);G.lastType=type;
    if(B.vis&&B.mode==='pass')OLD=B;
    B=newShip(type);B.vis=true;B.num=num;B.slot=FENTE=FENTE?0:10;G.v=num;G.s1ok=false;
    paintNumber(B.slot,num,BOATDEF[type].meta.plate?'plate':'sail',quadAspect(BOATDEF[type].meta.num));
    BU.forEach(b=>b.lit=0);SEA_T=seaFor(G.mv);
    B.x=1460;B.y=300;B.mode='enter';
    let target;
    if(G.mv===1) target={x:WAIT.x,y:WAIT.y};
    else{const n=G.buoys.length,k=G.buoys.filter(x=>x<num).length,wrong=[...Array(n+1).keys()].filter(c=>c!==k),droite=wrong.filter(c=>zoneCenter(c)>=(OPTS.attenteXMin??0));target={x:zoneCenter(pick(droite.length?droite:wrong)),y:AUTO_Y0};}
    if(G.mv!==3&&P.vis&&P.mode!=='leave'){P.mode='leave';}
    return new Promise(res=>tween(B,target,2200,p=>1-Math.pow(1-p,2.2),()=>{B.mode=G.mv===1?'wait':'tenu';res();}));
  },
  // la consigne est dite : le vent pousse, les pirates partent en chasse
  partir(){if(B.mode==='tenu')B.mode='wait';if(G.mv===3&&B.mode==='wait'&&!(P.vis&&P.mode==='chase'))startPirates();},
  // le geste attendu : { c } (le passage où le bateau a été lâché, ou poussé par le vent) ou { rattrape: true }
  attendreLacher(){return new Promise(res=>{ATTENTE=res;});},
  // les bouées de la rangée en cours, allumées (leurs rangs)
  allumer(rangs){BU.forEach(x=>x.lit=0);activeBU().forEach((x,i)=>x.lit=rangs.includes(i)?1:0);},
  // le bon passage : le bateau passe et s'en va (maquette, evaluate) ; la promesse se tient quand il a franchi la ligne
  passe(k){
    B.mode='pass';BU.forEach(x=>x.lit=0);if(G.mv===3&&P.vis)P.mode='leave';
    const b=B,x=zoneCenter(k);
    return new Promise(res=>tween(b,{x,y:LINE_Y+30},700,p=>p,()=>{res();tween(b,{x:x-260,y:1060},1700,p=>p*p,()=>{b.vis=false;});}));
  },
  // une erreur au calme : le bateau revient attendre ; au vent : une rafale le repousse (il repart à partir())
  revenir(){B.mode='return';const w=G.stage===2?G.wait2:WAIT;return new Promise(res=>tween(B,{x:w.x,y:w.y},1300,undefined,()=>{B.mode='wait';res();}));},
  rafale(){B.mode='gust';B.gustT=T;return new Promise(res=>tween(B,{x:B.x,y:G.stage===2?G.wait2.y:AUTO_Y0},1500,p=>1-Math.pow(1-p,3),()=>apres(400,()=>{B.mode='tenu';res();})));},
  // les pirates l'abordent, il coule (maquette, sinkBoat)
  couler(){
    B.mode='sink';
    if(!P.vis){P=newShip('pirate');P.vis=true;P.x=1420;P.y=AUTO_Y0-95;}
    P.mode='board';const tgt=pirTarget();
    return new Promise(res=>tween(P,tgt,600,p=>p*p,()=>{B.sinkT=T;apres(3600,()=>{B.vis=false;P.mode='leave';BU.forEach(x=>x.lit=0);res();});}));
  },
  // le bateau va seul jusqu'au bon passage, au bord de la ligne des bouées (puis passe(k))
  guider(k){
    B.mode='auto';drag=null;BU.forEach(x=>x.lit=0);if(P.vis&&P.mode!=='leave')P.mode='leave';
    return new Promise(res=>tween(B,{x:zoneCenter(k),y:LINE_Y-70},1600,undefined,res));
  },
  // le double encadrement : la bonne centaine franchie, la caméra recule, la rangée des dizaines apparaît (maquette, startTravel)
  traversee(row2){
    const v=B.num,b=G.buoys,k=b.filter(x=>x<v).length;
    B.mode='travel';BU.forEach(x=>x.lit=0);if(G.mv===3&&P.vis)P.mode='leave';
    const x=zoneCenter(k);
    return new Promise(res=>tween(B,{x,y:LINE_Y+30},700,p=>p,()=>{
      const w=toWorld(B.x,B.y);B.wx=w.x;B.wz=w.z-ZC;
      addRow(row2,2,Z_LINE-ZC-PULL,false);
      const e2=[0,...row2.map((_,i)=>1280*(i+1)/6),1280],kk=row2.filter(x=>x<v).length,wrong=[0,1,2,3,4,5].filter(c=>c!==kk),droite=wrong.filter(c=>(e2[c]+e2[c+1])/2>=(OPTS.attenteXMin??0)),cw=pick(droite.length?droite:wrong);
      const xc=clamp((e2[cw]+e2[cw+1])/2,170,1060);B.wx0=B.wx;B.wxT=(xc-640)/F*(B.wz+ZC+PULL);
      G.travel={t0:T,dur:2.6,z0:ZC,z1:ZC+PULL,done:()=>{
        G.stage=2;G.buoys=row2.slice();G.travel=null;G.wait2={x:B.x,y:B.y};
        BU.filter(x=>x.row===1).forEach(x=>x.lit=0);
        B.mode=G.mv===1?'wait':'tenu';res();}};}));
  },
  // la vitesse des gestes (1 : celle de la maquette)
  vitesse(k){VIT.k=k;},
  // la qualité de la mer (0 économe, 1 normale, 2 fine : la maquette)
  qualite(q){if(q!==QUAL){QUAL=q;fit();}},
  get qual(){return QUAL;},
  // où est le bateau de l'enfant (pour la bulle, qui ne le couvre jamais) : là où il va s'il arrive
  zoneBateau(){if(!B.vis)return null;const t=B.tw&&B.mode==='enter'?B.tw.to:B,s=boatK(t.y)/.44;return[t.x-190*s,t.y-330*s,t.x+200*s,t.y+55*s];},
  // pour les parcours : poser le bateau dans le passage c, comme le doigt
  deposer(c){if(B.mode!=='wait')return false;B.x=zoneCenter(c);B.y=LINE_Y-20;drag=null;lacher(chenalAt(B.x));return true;},
  etat(){return{mode:B.mode,vis:B.vis,x:B.x,y:B.y,k:B.k,num:B.num,bouees:G.buoys.slice(),rangee:G.stage,xs:xsOf(),LINE_Y,mer:G.mv,pirates:P.vis?P.mode:null,allumees:activeBU().map(b=>b.lit),images:pending,qualite:QUAL,ZC,depart:OLD?OLD.vis:false};},
  centre:k=>zoneCenter(k),
  chenal:x=>chenalAt(x),
  pret(){return new Promise(res=>{const t=()=>pending>0?setTimeout(t,50):res();t();});},
  redessiner(){REDESSINE=true;},
  resize(){fit();},
  stop(){VIVANT=false;JETON++;cancelAnimationFrame(RAF);ATTENTE=null;for(const c of [gl,gb]){try{c.getExtension('WEBGL_lose_context')?.loseContext();}catch(e){void e;}}},
};
/* =====================================================================================
   TOUCH
   ===================================================================================== */
let drag=null;
function hitBoat(p){if(!B.vis)return false;const s=B.k/.44;return p.x>B.x-190*s&&p.x<B.x+200*s&&p.y>B.y-330*s&&p.y<B.y+55*s;}
OPTS.on(stage,'pointerdown',e=>{
 if(!OPTS.toucher(e)||!['wait'].includes(B.mode))return;const p=pt(e);if(!hitBoat(p))return;
 e.preventDefault();drag={id:e.pointerId,dx:p.x-B.x,dy:p.y-B.y};B.mode='drag';B.tw=null;BU.forEach(x=>x.lit=0);});
// With wind or pirates the finger steers left and right and may hurry the boat on, but never holds it back:
// it cannot climb back up, and time keeps running.
OPTS.on(window,'pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const p=pt(e);B.x=clamp(p.x-drag.dx,110,1170);const ny=clamp(p.y-drag.dy,300,LINE_Y+24);B.y=G.mv>=2?Math.max(B.y,ny):ny;});
function release(e){if(!drag||e.pointerId!==drag.id)return;drag=null;
 if(B.y>LINE_Y-48) lacher(chenalAt(B.x)); else B.mode='wait';}
OPTS.on(window,'pointerup',release);OPTS.on(window,'pointercancel',release);

/* =====================================================================================
   UPDATE + RENDER
   ===================================================================================== */
const bubbles=[];
function update(dt){
 SEA+=(SEA_T-SEA)*Math.min(1,dt*.6);
 for(let i=later.length-1;i>=0;i--){if(T>=later[i].t){const l=later.splice(i,1)[0];if(l.ep===G.epoch||l.any)l.f();}}
 // the camera drawing back between the two rows of a double framing
 if(G.travel){const q=clamp((T-G.travel.t0)/G.travel.dur,0,1),e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2;ZC=G.travel.z0+(G.travel.z1-G.travel.z0)*e;
  B.wx=B.wx0+(B.wxT-B.wx0)*e;const z=B.wz+ZC;B.x=640+F*B.wx/z;B.y=HY+F*HC/z;if(q>=1){const d=G.travel.done;d();}}
 // the player's boat
 stepTween(B);if(OLD){stepTween(OLD);if(OLD.vis)rideWaves(OLD,T,dt);else OLD=null;}
 if((B.mode==='wait'||B.mode==='drag')&&G.mv===2) B.y+=(LINE_Y-AUTO_Y0)/(G.windDur/1000)*dt;
 if((B.mode==='wait'||B.mode==='drag')&&G.mv>=2&&B.y>=LINE_Y-6){B.y=Math.min(B.y,LINE_Y+10);drag=null;lacher(chenalAt(B.x));}
 const gq=T-B.gustT;B.gust=gq>0&&gq<2.6?Math.sin(Math.PI*gq/2.6):0;
 const sailing=B.mode==='enter'||B.mode==='pass'||B.mode==='travel'||B.mode==='auto'||(B.mode==='wait'&&G.mv===2);
 const vel=Math.hypot(B.x-B.prevX,B.y-B.prevY)/Math.max(dt,1e-3);B.prevX=B.x;B.prevY=B.y;
 B.speed+=(clamp((sailing?.45:.12)+vel/260,0,1)-B.speed)*Math.min(1,dt*2);
 const br=.10+.10*Math.sin(T*1.25),flog=B.gust>0?B.gust*(.5+.5*Math.sin(T*30)):0;B.slack=Math.max(br,flog*.85);
 if(B.mode==='sink'&&B.sinkT){const q=T-B.sinkT;B.broken=clamp(q/.35,0,1);const s=clamp((q-.3)/2.8,0,1);B.up=s*s*720;B.sinkY=s*s*60;B.tilt=.30*s;B.foam=1-clamp((q-.2)/.9,0,1);
  if(s>0&&s<1)for(let j=0;j<2;j++){const pp=B.mat.ap(260+Math.random()*480,820-Math.random()*120-B.up*.5);bubbles.push({x:pp[0],y:pp[1],r:2+Math.random()*4,t:T});}}
 if(B.vis) rideWaves(B,T,dt);
 // the zone under the boat once it is near the buoys
 if(B.vis&&(B.mode==='drag'||B.mode==='wait')&&B.y>LINE_Y-170){const k=chenalAt(B.x),e=edges();G.zone=[e[k],e[k+1]];G.zoneOn+=(1-G.zoneOn)*Math.min(1,dt*6);}else G.zoneOn+=(0-G.zoneOn)*Math.min(1,dt*6);
 // pirates
 if(P.vis){
  stepTween(P);
  if(P.mode==='chase'&&(B.mode==='wait'||B.mode==='drag')){const tg=pirTarget(),dx=tg.x-P.x,dy=tg.y-P.y,d=Math.hypot(dx,dy),rem=P.deadline-T,st=rem>dt?d*dt/rem:d+3;
   // the pirates reach the boat at a fixed moment, wherever it goes
   if(d<=st+2||rem<=0){P.x=tg.x;P.y=tg.y;P.mode='board';drag=null;rattrape();}
   else{P.x+=dx/d*st;P.y+=dy/d*st;}}
  if(P.mode==='leave'&&!P.tw){tween(P,{x:1520,y:250},2600,p=>p*p,()=>{P.vis=false;P.mode='off';});}
  P.speed+=((P.mode==='chase'?.7:P.mode==='leave'?.6:.3)-P.speed)*Math.min(1,dt*2);P.slack=.12+.1*Math.sin(T*1.1+1);
  rideWaves(P,T,dt);}
 // buoys
 BU.forEach((b,i)=>{if(b.fade===-1)b.alpha=Math.max(0,b.alpha-dt*2.5);else if(b.fade===1){b.alpha=Math.min(1,b.alpha+dt*2);if(b.alpha>=1)b.fade=0;}rideBuoy(b,i,T);});
 for(let i=BU.length-1;i>=0;i--) if(BU[i].fade===-1&&BU[i].alpha<=0) BU.splice(i,1);
}
function render(){
 // ---- sea
 gl.viewport(0,0,cs.width,cs.height);gl.useProgram(PS);
 const sh=[],sa=[];
 for(const o of [B,P]){if(o.vis&&o.broken<.5){const d=BOATDEF[o.type],an=d.meta.anchor,c=o.mat.ap(an[0],an[1]);sh.push(c[0],c[1]+4,280*o.k,52*o.k);sa.push(Math.atan2(d.axis[1],d.axis[0])+o.p*.9);}else{sh.push(0,0,0,0);sa.push(0);}}
 gl.uniform4fv(us('uSh'),new Float32Array(sh));gl.uniform1fv(us('uShA'),new Float32Array(sa));
 gl.uniform3f(us('uZone'),...(G.zone||[0,0]),G.zoneOn*.85);gl.uniform1f(us('uLineY'),LINE_Y);
 gl.uniform1f(us('uZoff'),ZC);cloudUniforms();gl.uniform1f(us('uTc'),T%1000);gl.uniform1f(us('uAmp'),SEA);gl.uniform2f(us('uRes'),cs.width,cs.height);
 gl.drawArrays(gl.TRIANGLES,0,3);
 // ---- sprites, far to near
 gb.viewport(0,0,cb.width,cb.height);gb.clearColor(0,0,0,0);gb.clear(gb.COLOR_BUFFER_BIT);gb.useProgram(PB);
 const list=[];
 if(P.vis)list.push({y:P.y,f:()=>drawBoatSprite(P)});
 if(OLD&&OLD.vis)list.push({y:1e4-1,f:()=>drawBoatSprite(OLD)});
 if(B.vis)list.push({y:1e4,f:()=>drawBoatSprite(B)});   // the child's boat is always in front, so its number is never hidden
 BU.forEach((b,i)=>{if(!b.hidden&&b.y<900)list.push({y:b.y+.5,f:()=>drawBuoySprite(b,i)});});
 list.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
 // ---- overlay
 c2.setTransform(1,0,0,1,0,0);c2.clearRect(0,0,fx.width,fx.height);c2.setTransform(R2,0,0,R2,0,0);
 c2.strokeStyle='rgba(30,40,52,.75)';c2.lineWidth=1.4;c2.lineCap='round';
 [[180,70,.9],[215,58,.7],[700,92,1],[1010,48,.8],[1040,66,.6]].forEach(([bx,by,s],i)=>{const x=((bx+T*(8+i*2))%1400)-60,y=by+3*Math.sin(T*.7+i),f=4*Math.sin(T*6+i*2)*s;
  c2.beginPath();c2.moveTo(x-9*s,y-2*s-f);c2.quadraticCurveTo(x-4*s,y-6*s-f*.4,x,y);c2.quadraticCurveTo(x+4*s,y-6*s-f*.4,x+9*s,y-2*s-f);c2.stroke();});
 for(let i=bubbles.length-1;i>=0;i--){const b=bubbles[i],q=(T-b.t)/1.2;if(q>=1){bubbles.splice(i,1);continue;}c2.globalAlpha=(1-q)*.9;c2.fillStyle='#e6ecee';c2.beginPath();c2.arc(b.x,b.y-q*25,b.r*(1+q),0,7);c2.fill();}
 c2.globalAlpha=1;}
let NFR=0,last=performance.now(),fpsN=0,fpsT=performance.now(),FPS=0;
function frame(now){
 if(!VIVANT)return;RAF=requestAnimationFrame(frame);OPTS.mesure?.(now);
 const tNow=OPTS.temps(now);const dt=clamp(tNow-T,0,.1);T=tNow;
 if(OPTS.fige?.()){if(REDESSINE){REDESSINE=false;render();}return;}REDESSINE=false;
 update(dt||.016);render();NFR++;
 fpsN++;if(now-fpsT>1000){FPS=Math.round(fpsN*1000/(now-fpsT));fpsN=0;fpsT=now;}
}

G.windDur=OPTS.ventMs??7000;
RAF=requestAnimationFrame(frame);
return API;

}
