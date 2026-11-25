const T=THREE,$=id=>document.getElementById(id),stage=$('stage');
const fmt=(n,d=1)=>n.toFixed(d).replace('.',',');
/* ---------- escena ---------- */
const R=new T.WebGLRenderer({antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;R.outputEncoding=T.sRGBEncoding;
stage.prepend(R.domElement);
const S=new T.Scene(),cam=new T.PerspectiveCamera(32,1,.1,120);
cam.position.set(-3,9.5,20);
const C=new T.OrbitControls(cam,R.domElement);C.target.set(-1.5,1.6,0);C.enableDamping=true;C.minDistance=6;C.maxDistance=36;C.maxPolarAngle=Math.PI*.49;
const hemi=new T.HemisphereLight(0xffffff,0x6b7a5c,.7),sunL=new T.DirectionalLight(0xfff0d2,1.4);
sunL.position.set(-7,14,9);sunL.castShadow=true;sunL.shadow.mapSize.set(1024,1024);Object.assign(sunL.shadow.camera,{left:-14,right:14,top:12,bottom:-12});
S.add(hemi,sunL);
const gnd=new T.Mesh(new T.CircleGeometry(22,48),new T.ShadowMaterial({opacity:.22}));gnd.rotation.x=-Math.PI/2;gnd.receiveShadow=true;S.add(gnd);
const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.7,metalness:0},o));
const B=(w,h,d)=>new T.BoxGeometry(w,h,d);
const add=(g,m,x,y,z,sh=true)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=sh;o.receiveShadow=true;S.add(o);return o};
const V3=p=>new T.Vector3(...p);
const tube=(pts,r,c)=>add(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(V3)),48,r,8,false),M(c,{roughness:.5}),0,0,0,false);
const grey=M(0x8f928c,{roughness:.85});

/* ---------- caja (cuerpo + frente con ventana y orificio con marcas de sol) ---------- */
add(B(5.2,4,3.25),grey,0,2,-.075);
const sh=new T.Shape();sh.moveTo(-2.6,-2);sh.lineTo(2.6,-2);sh.lineTo(2.6,2);sh.lineTo(-2.6,2);sh.closePath();
const hole=pts=>{const p=new T.Path();pts.forEach((q,i)=>i?p.lineTo(q[0],q[1]):p.moveTo(q[0],q[1]));p.closePath();sh.holes.push(p)};
hole([[.48,-1.38],[1.82,-1.38],[1.82,-.62],[.48,-.62]]);
const hx=-.8,hy=-1.2;
{const p=new T.Path();p.absarc(hx,hy,.2,0,Math.PI*2,true);sh.holes.push(p)}
for(let i=0;i<8;i++){const a=i*Math.PI/4,c=Math.cos(a),s=Math.sin(a),t=.035,r0=.33,r1=.56;
  hole([[hx+c*r0-s*t,hy+s*r0+c*t],[hx+c*r1-s*t,hy+s*r1+c*t],[hx+c*r1+s*t,hy+s*r1-c*t],[hx+c*r0+s*t,hy+s*r0-c*t]])}
add(new T.ExtrudeGeometry(sh,{depth:.15,bevelEnabled:false}),grey,0,2,1.55);
add(new T.CircleGeometry(.62,32),new T.MeshBasicMaterial({color:0x232a26}),-.8,.8,1.56,false);
const sc=document.createElement('canvas');sc.width=640;sc.height=364;const g=sc.getContext('2d');
const sTex=new T.CanvasTexture(sc);sTex.encoding=T.sRGBEncoding;sTex.anisotropy=8;
add(new T.PlaneGeometry(1.34,.76),new T.MeshBasicMaterial({map:sTex}),1.15,1,1.565,false);

/* ---------- base con 3 soportes y panel solar ---------- */
add(B(3.8,.15,2.4),grey,4.5,.075,0);
const rs=new T.Shape();rs.moveTo(-.9,0);rs.lineTo(.9,0);rs.lineTo(-.9,1.5);rs.closePath();
const rg=new T.ExtrudeGeometry(rs,{depth:.14,bevelEnabled:false});
[3.1,4.5,5.9].forEach(x=>{const m=add(rg,grey,x+.07,.15,0);m.rotation.y=-Math.PI/2;add(B(.14,.24,.1),grey,x,.27,.96)});
const pc=document.createElement('canvas');pc.width=512;pc.height=256;const pg=pc.getContext('2d');
pg.fillStyle='#0d2a52';pg.fillRect(0,0,512,256);
for(let i=0;i<6;i++)for(let j=0;j<3;j++){const q=pg.createLinearGradient(0,j*85,0,j*85+80);q.addColorStop(0,'#3a78c4');q.addColorStop(1,'#1d4e8f');pg.fillStyle=q;pg.fillRect(i*85+4,j*85+4,77,77)}
const pTex=new T.CanvasTexture(pc);pTex.encoding=T.sRGBEncoding;
const pMat=M(0xffffff,{map:pTex,emissive:0x2d7fe0,emissiveMap:pTex,roughness:.3,metalness:.2}),frame=M(0xd6d6d0,{metalness:.5,roughness:.4});
const th=Math.atan2(1.5,1.8);
const panel=add(B(3.4,.1,2.2),[frame,frame,pMat,frame,frame,frame],4.5,.9+.06*Math.cos(th),.06*Math.sin(th));panel.rotation.x=th;

/* ---------- transformador y cables ---------- */
add(B(1.1,1.3,.9),M(0x2b3330),-3.6,.65,-2.9);
const led=add(new T.SphereGeometry(.07,12,12),new T.MeshBasicMaterial({color:0x2ecc71}),-3.3,1.0,-2.44,false);
tube([[-3.1,.7,-2.9],[-2.9,.35,-2.2],[-2.75,.6,-1.3],[-2.6,1.0,-.9]],.04,0x151a18);
tube([[-4.1,.5,-2.9],[-4.8,.05,-4],[-4.6,.05,-5.2]],.04,0x151a18);
add(B(.35,.18,.5),M(0x2b3330),-4.6,.1,-5.5);
tube([[2.85,.9,-.7],[2.9,.4,-1.1],[2.75,.7,-.9],[2.6,1.0,-.8]],.04,0x151a18);

/* ---------- depósito y bomba sumergible ---------- */
const tank=add(B(4.2,1.8,3.2),M(0xdfeef5,{transparent:true,opacity:.16,depthWrite:false}),-6.6,.9,0,false);
const edg=new T.LineSegments(new T.EdgesGeometry(B(4.2,1.8,3.2)),new T.LineBasicMaterial({color:0x7fa0b0}));edg.position.copy(tank.position);S.add(edg);
add(B(4,1.35,3),M(0x2f8fcb,{transparent:true,opacity:.5,roughness:.15}),-6.6,.7,0,false);
add(new T.CylinderGeometry(.38,.38,.7,24),M(0x22303a),-7.4,.45,-.2);
const cap=add(new T.CylinderGeometry(.3,.3,.14,24),M(0x22303a,{emissive:0x000000}),-7.4,.87,-.2);
const hp=[[-7.4,.9,-.2],[-7.4,2.4,-.2],[-6.5,2.95,-.2],[-5.7,2.55,-.2],[-5.65,2.15,-.2]];
tube(hp,.07,0x1f2a24);
const path=new T.CatmullRomCurve3([...hp,[-5.65,1.8,-.2],[-5.65,1.4,-.2]].map(V3));
const drops=[],dg=new T.SphereGeometry(.07,8,8),dm=new T.MeshBasicMaterial({color:0x8fd2ff});
for(let i=0;i<30;i++){const o=new T.Mesh(dg,dm);S.add(o);drops.push(o)}
tube([[-.8,.8,1.7],[-.8,.45,2.4],[-1.4,.05,3.1],[-4,.05,3.2],[-5.8,.1,2.6],[-6.2,1.95,1.6],[-6.9,.9,.8],[-7.3,.5,.3]],.04,0x151a18);

/* ---------- sol ---------- */
const sunB=add(new T.SphereGeometry(.9,24,24),new T.MeshBasicMaterial({color:0xffd34d}),-7,12.5,5,false);

/* ---------- etiquetas ---------- */
const PARTS=[['Pantalla con voltajes',[1.15,1.5,1.7]],['Caja con Arduino',[0,4.1,0]],['Panel solar 6 V',[4.5,1.9,0]],['Transformador 12 V',[-3.6,1.5,-2.9]],['Bomba sumergible',[-7.4,1.1,-.2]]];
const tags=PARTS.map(p=>{const d=document.createElement('div');d.className='tag';d.textContent=p[0];stage.appendChild(d);return d});
function place(w,h){PARTS.forEach((p,k)=>{const v=V3(p[1]).project(cam);tags[k].style.left=(v.x+1)/2*w+'px';tags[k].style.top=(1-v.y)/2*h-8+'px'})}
$('tg').onclick=e=>{const off=stage.classList.toggle('off');e.currentTarget.setAttribute('aria-pressed',!off);e.currentTarget.textContent=off?'Mostrar partes':'Ocultar partes'};

/* ---------- simulación ---------- */
let sun=.8,mains=true,pumping=true,cyc=0,ph=0,eS=0,eG=0,v={};
function sim(dt){
  cyc=(cyc+dt)%10;const on=pumping&&cyc<6,Pd=3;
  const Vp=sun<.02?0:6*(.55+.45*sun),Pmax=Vp*.6*sun;
  const Ps=on?Math.min(Pmax,Pd):0,Pg=on&&mains?Pd-Ps:0;
  v={on,Pd,Ps,Pg,Vp,Ip:Vp>0?Ps/Vp:0,Vt:mains?12:0,It:mains?Pg/12+.02:0,eff:on?(Ps+Pg)/Pd:0};
  eS+=Ps*dt;eG+=Pg*dt;
}
function row(l,V,I,c,y){g.font='600 26px Figtree,sans-serif';g.fillStyle='#9db3a4';g.fillText(l,24,y);
  g.font='700 66px Figtree,sans-serif';g.fillStyle=c;g.fillText(fmt(V)+' V',24,y+68);g.fillText(fmt(I,2)+' A',340,y+68)}
function screen(){
  g.fillStyle='#0b1d12';g.fillRect(0,0,640,364);
  g.font='700 30px Figtree,sans-serif';g.fillStyle='#F2B705';g.textAlign='left';g.fillText('AGROVOLTZ',24,42);
  g.textAlign='right';g.fillStyle=v.on?'#7BE08A':'#7f8f84';g.fillText(v.on?'BOMBA ON':'BOMBA OFF',616,42);g.textAlign='left';
  g.fillStyle='#24402d';g.fillRect(24,56,592,3);
  row('PANEL SOLAR',v.Vp,v.Ip,'#F2B705',96);row('TRANSFORMADOR',v.Vt,v.It,'#6CC1F5',212);
  g.fillStyle='#1c3324';g.fillRect(24,330,592,18);
  g.fillStyle='#F2B705';g.fillRect(24,330,592*v.Ps/v.Pd,18);g.fillStyle='#6CC1F5';g.fillRect(24+592*v.Ps/v.Pd,330,592*v.Pg/v.Pd,18);
  sTex.needsUpdate=true;
}
function ui(){
  const pS=v.on?v.Ps/v.Pd*100:0,tot=eS+eG;
  $('bs').style.width=pS+'%';$('bg').style.width=(v.on?v.Pg/v.Pd*100:0)+'%';
  $('kS').textContent=fmt(v.Ps)+' W';$('kG').textContent=fmt(v.Pg)+' W';
  $('kA').textContent=v.on?Math.round(v.Ps/Math.max(v.Ps+v.Pg,.001)*100)+' %':'–';
  $('kC').textContent=tot>0?Math.round(eS/tot*100)+' %':'–';
  let m,st;
  if(!pumping){m='La bomba está detenida. El Arduino sigue midiendo el panel y el transformador.';st='Bomba detenida'}
  else if(!v.on){m='Pausa del ciclo: la bomba descansa unos segundos y no consume.';st='Bomba en pausa del ciclo'}
  else if(v.Ps+v.Pg<.01){m='Sin sol ni red, la bomba no puede encender.';st='Sin energía disponible'}
  else if(v.Ps>=v.Pd-.01){m='El panel cubre toda la bomba: la red no aporta nada.';st='Bomba encendida · 100 % solar'}
  else if(v.Ps<.01){m='Sin sol, el transformador alimenta toda la bomba.';st='Bomba encendida · solo red'}
  else if(mains){m='El panel aporta una parte y el transformador completa lo que falta.';st='Bomba encendida · solar + red'}
  else{m='Sin red y con poco sol, la bomba trabaja con menos caudal ('+Math.round(v.eff*100)+' %).';st='Bomba encendida · caudal reducido'}
  $('msg').textContent=m;$('stxt').textContent=st;$('status').classList.toggle('on',v.on);
}
$('sun').oninput=e=>{sun=e.target.value/100;$('sunout').textContent=e.target.value+' %'};
$('mains').onchange=e=>{mains=e.target.checked};
$('pump').onclick=e=>{pumping=!pumping;e.currentTarget.textContent=pumping?'Detener bomba':'Iniciar bomba'};

/* ---------- bucle ---------- */
function resize(){const w=stage.clientWidth,h=stage.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<600?46:32;cam.updateProjectionMatrix()}
new ResizeObserver(resize).observe(stage);resize();
let last=performance.now(),acc=1;
R.setAnimationLoop(now=>{
  const dt=Math.min(.1,(now-last)/1000);last=now;sim(dt);
  ph+=dt*.45*v.eff;
  drops.forEach((o,i)=>{o.visible=v.eff>.05;if(o.visible)o.position.copy(path.getPointAt((ph+i/30)%1))});
  cap.material.emissive.setHex(v.on?0x1f9e55:0);led.visible=mains;
  pMat.emissiveIntensity=.05+sun*.5;sunL.intensity=.25+1.45*sun;hemi.intensity=.35+.4*sun;
  sunB.scale.setScalar(.6+.5*sun);sunB.material.color.setHex(sun<.1?0x8a8f99:0xffd34d);
  $('night').style.opacity=(1-sun)*.4;
  acc+=dt;if(acc>.16){acc=0;screen();ui()}
  C.update();R.render(S,cam);place(stage.clientWidth,stage.clientHeight);
});
