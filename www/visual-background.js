(() => {

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

let currentTop = "#071d49";
let currentBottom = "#243b55";

function hexToRgb(hex){
    const n = parseInt(hex.slice(1),16);
    return {
        r:(n>>16)&255,
        g:(n>>8)&255,
        b:n&255
    };
}

function lerp(a,b,t){
    return a+(b-a)*t;
}

function blendColor(from,to,speed=0.02){
    const a=hexToRgb(from);
    const b=hexToRgb(to);

    return `rgb(${
        Math.round(lerp(a.r,b.r,speed))
    },${
        Math.round(lerp(a.g,b.g,speed))
    },${
        Math.round(lerp(a.b,b.b,speed))
    })`;
}

canvas.style.position = "fixed";
canvas.style.inset = "0";
canvas.style.zIndex = "-1";
canvas.style.pointerEvents = "none";

document.body.prepend(canvas);

function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
resize();
window.onresize = resize;


// waktu untuk warna langit
function sky(){

    const h = new Date().getHours();

    if(h >= 4 && h < 7)
        return ["#102542","#ff9966"]; // subuh

    if(h >=7 && h <15)
        return ["#2196f3","#90caf9"]; // pagi siang

    if(h >=15 && h <18)
        return ["#ff7043","#ffcc80"]; // sore

    return ["#020024","#243b55"]; // malam

}


// bintang
let stars=[];

for(let i=0;i<120;i++){
stars.push({
x:Math.random()*innerWidth,
y:Math.random()*innerHeight,
r:Math.random()*2,
a:Math.random()
});
}


// awan
let clouds=[
{x:100,y:120,s:1},
{x:400,y:200,s:.7},
{x:700,y:100,s:1.2}
];


// bulan
let moon={
x:100,
y:120,
move:0
};



function draw(){

let target = sky();

currentTop = blendColor(currentTop, target[0], 0.02);
currentBottom = blendColor(currentBottom, target[1], 0.02);

let g = ctx.createLinearGradient(0,0,0,canvas.height);

g.addColorStop(0, currentTop);
g.addColorStop(1, currentBottom);


// bulan malam

let hour=new Date().getHours();

if(hour>=18 || hour<6){

moon.move+=0.2;

ctx.beginPath();
ctx.arc(
moon.x+Math.sin(moon.move/100)*30,
moon.y,
45,
0,
Math.PI*2
);

ctx.fillStyle="#fff3b0";
ctx.shadowBlur=40;
ctx.shadowColor="#fff";
ctx.fill();
ctx.shadowBlur=0;


// bintang

stars.forEach(s=>{

s.a+=0.01;

ctx.beginPath();
ctx.arc(s.x,s.y,s.r,0,Math.PI*2);

ctx.fillStyle=
`rgba(255,255,255,${Math.abs(Math.sin(s.a))})`;

ctx.fill();

});

}


// awan

clouds.forEach(c=>{

c.x+=0.2;

if(c.x>canvas.width+100)
c.x=-150;


ctx.fillStyle="rgba(255,255,255,.12)";

ctx.beginPath();
ctx.arc(c.x,c.y,40,0,Math.PI*2);
ctx.arc(c.x+40,c.y,50,0,Math.PI*2);
ctx.arc(c.x+90,c.y,35,0,Math.PI*2);
ctx.fill();

});


// cahaya masjid

let glow=
ctx.createRadialGradient(
canvas.width/2,
canvas.height,
20,
canvas.width/2,
canvas.height,
250
);

glow.addColorStop(0,"rgba(255,220,120,.35)");
glow.addColorStop(1,"transparent");

ctx.fillStyle=glow;

ctx.fillRect(
0,
canvas.height-300,
canvas.width,
300
);

// ===== Siluet Masjid =====
ctx.fillStyle = "#0b1020";

const baseY = canvas.height + 100;

ctx.beginPath();

// Tanah
ctx.rect(0, baseY - 70, canvas.width, 70);

// Kubah utama
ctx.moveTo(canvas.width * 0.50, baseY - 170);
ctx.arc(canvas.width * 0.50, baseY - 120, 50, Math.PI, 0);

// Bangunan utama
ctx.rect(canvas.width * 0.42, baseY - 120, canvas.width * 0.16, 70);

// Menara kiri
ctx.rect(canvas.width * 0.28, baseY - 180, 24, 110);
ctx.moveTo(canvas.width * 0.292, baseY - 180);
ctx.lineTo(canvas.width * 0.304, baseY - 205);
ctx.lineTo(canvas.width * 0.316, baseY - 180);

// Menara kanan
ctx.rect(canvas.width * 0.70, baseY - 180, 24, 110);
ctx.moveTo(canvas.width * 0.712, baseY - 180);
ctx.lineTo(canvas.width * 0.724, baseY - 205);
ctx.lineTo(canvas.width * 0.736, baseY - 180);

ctx.fill();

requestAnimationFrame(draw);

}

draw();


})();
