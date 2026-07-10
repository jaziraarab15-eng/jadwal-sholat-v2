/* ==========================================================
   JADWAL SHOLAT v3.0
   app.js
========================================================== */

"use strict";

/* ==========================================================
   STATE
========================================================== */

const App = {

    latitude: null,
    longitude: null,

    city: "",

    prayerTimes: null,

    hijri: null,

    qibla: 0,

    darkMode: false,

    adhanVoice: "makkah",

    notifications: true

};

/* ==========================================================
   ELEMENT
========================================================== */

const $ = (id) => document.getElementById(id);

/* ==========================================================
   PAGE
========================================================== */

const pages = [

"page-home",
"page-qibla",
"page-calendar",
"page-hijri",
"page-more"

];

const menus = {

"nav-home":"page-home",
"nav-qibla":"page-qibla",
"nav-calendar":"page-calendar",
"nav-hijri":"page-hijri",
"nav-more":"page-more"

};

/* ==========================================================
   SHOW PAGE
========================================================== */

function showPage(page){

pages.forEach(id=>{

const el=$(id);

if(el){

el.classList.remove("active");

}

});

const target=$(page);

if(target){

target.classList.add("active");

}

document.querySelectorAll(".nav-item").forEach(n=>{

n.classList.remove("active");

});

Object.keys(menus).forEach(btn=>{

if(menus[btn]===page){

const item=$(btn);

if(item){

item.classList.add("active");

}

}

});

}

/* ==========================================================
   NAVIGATION
========================================================== */

function initNavigation(){

Object.keys(menus).forEach(btn=>{

const el=$(btn);

if(!el) return;

el.onclick=()=>{

showPage(menus[btn]);

};

});

}

/* ==========================================================
   LOADING
========================================================== */

function showLoading(){

const box=$("loadingScreen");

if(box){

box.style.display="flex";

}

}

function hideLoading(){

const box=$("loadingScreen");

if(box){

box.style.display="none";

}

}

/* ==========================================================
   TOAST
========================================================== */

function toast(text){

const t=$("toast");

const s=$("toastText");

if(!t||!s) return;

s.textContent=text;

t.classList.add("show");

setTimeout(()=>{

t.classList.remove("show");

},2500);

}

/* ==========================================================
   FORMAT
========================================================== */

function pad(v){

return String(v).padStart(2,"0");

}

function formatDate(date){

return date.toLocaleDateString(

"id-ID",

{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

}

);

}

/* ==========================================================
   START
========================================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

showLoading();

initNavigation();

showPage("page-home");

$("tanggal").textContent=formatDate(new Date());

toast("Aplikasi dimulai");

}

);

/* ==========================================================
   GPS & LOKASI
========================================================== */

async function getLocation(){

    return new Promise((resolve,reject)=>{

        if(!navigator.geolocation){

            reject("GPS tidak didukung");

            return;

        }

        navigator.geolocation.getCurrentPosition(

            pos=>{

                resolve({

                    lat:pos.coords.latitude,

                    lon:pos.coords.longitude

                });

            },

            err=>reject(err.message),

            {

                enableHighAccuracy:true,

                timeout:15000,

                maximumAge:0

            }

        );

    });

}

/* ==========================================================
   NAMA KOTA
========================================================== */

async function loadCity(lat,lon){

    try{

        const res=await fetch(

            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`

        );

        const json=await res.json();

        const city=

        json.address.city ||

        json.address.town ||

        json.address.village ||

        json.address.county ||

        "Lokasi Anda";

        App.city=city;

        $("kota").textContent="📍 "+city;

        if($("qibla-location")){

            $("qibla-location").textContent=city;

        }

    }catch(e){

        $("kota").textContent="📍 Lokasi Tidak Diketahui";

    }

}

/* ==========================================================
   JADWAL SHOLAT
========================================================== */

async function loadPrayerTimes(){

    try{

        const url=

`https://api.aladhan.com/v1/timings?latitude=${App.latitude}&longitude=${App.longitude}&method=11`;

        const res=await fetch(url);

        const json=await res.json();

        App.prayerTimes=json.data.timings;

        App.hijri=json.data.date.hijri;

        updatePrayerUI();

startCountdown();

    }catch(e){

        toast("Gagal memuat jadwal");

        console.log(e);

    }

}

/* ==========================================================
   UPDATE UI SHOLAT
========================================================== */

function updatePrayerUI(){

    const t=App.prayerTimes;

    if(!t) return;

    $("fajr").textContent=t.Fajr.substring(0,5);

    $("sunrise").textContent=t.Sunrise.substring(0,5);

    $("dhuhr").textContent=t.Dhuhr.substring(0,5);

    $("asr").textContent=t.Asr.substring(0,5);

    $("maghrib").textContent=t.Maghrib.substring(0,5);

    $("isha").textContent=t.Isha.substring(0,5);

    if(App.hijri){

        $("hijri").textContent=

        "🌙 "+

        App.hijri.day+

        " "+

        App.hijri.month.en+

        " "+

        App.hijri.year+

        " H";

    }

}

/* ==========================================================
   RINGKASAN HARI INI
========================================================== */

function updateTodaySummary(){

    if(!App.prayerTimes) return;

    const schedule=[
        ["Subuh",App.prayerTimes.Fajr],
        ["Syuruq",App.prayerTimes.Sunrise],
        ["Zuhur",App.prayerTimes.Dhuhr],
        ["Asar",App.prayerTimes.Asr],
        ["Magrib",App.prayerTimes.Maghrib],
        ["Isya",App.prayerTimes.Isha]
    ];

    const now=new Date();

    const current=now.getHours()*60+now.getMinutes();

    let active=schedule[0];
    let next=schedule[0];

    for(let i=0;i<schedule.length;i++){

        const [h,m]=schedule[i][1].split(":").map(Number);

        const minute=h*60+m;

        if(current>=minute){

            active=schedule[i];

        }

        if(current<minute){

            next=schedule[i];

            break;

        }

    }

    const [nh,nm]=next[1].split(":").map(Number);

    const target=new Date();

    target.setHours(nh,nm,0,0);

    if(target<now){

        target.setDate(target.getDate()+1);

    }

    const diff=target-now;

    const jam=Math.floor(diff/3600000);

    const menit=Math.floor((diff%3600000)/60000);

    if($("activePrayer")){

        $("activePrayer").textContent=active[0];

    }

    if($("remainingTime")){

        $("remainingTime").textContent=
        pad(jam)+":"+pad(menit);

    }

    if($("qiblaSummary")){

        $("qiblaSummary").textContent=
        Math.round(App.qibla)+"°";

    }

}

updateTodaySummary();
setInterval(updateTodaySummary,60000);

/* ==========================================================
   PENANDA SHOLAT AKTIF
========================================================== */

function updateActivePrayer(){

    if(!App.prayerTimes) return;

    document.querySelectorAll(".prayer-row").forEach(row=>{
        row.classList.remove("active-prayer");
    });

    const list=[
        {id:"fajr",time:App.prayerTimes.Fajr},
        {id:"sunrise",time:App.prayerTimes.Sunrise},
        {id:"dhuhr",time:App.prayerTimes.Dhuhr},
        {id:"asr",time:App.prayerTimes.Asr},
        {id:"maghrib",time:App.prayerTimes.Maghrib},
        {id:"isha",time:App.prayerTimes.Isha}
    ];

    const now=new Date();

    const currentMinute=
        now.getHours()*60+
        now.getMinutes();

    let active=0;

    for(let i=0;i<list.length;i++){

        const parts=list[i].time.substring(0,5).split(":");

        const minute=
            parseInt(parts[0])*60+
            parseInt(parts[1]);

        if(currentMinute>=minute){
            active=i;
        }

    }

    const el=document.getElementById(list[active].id);

    if(el && el.parentElement){

        el.parentElement.classList.add("active-prayer");

    }

    const activeName=
        el.parentElement.querySelector("span").textContent;

    if(document.getElementById("activePrayer")){

        document.getElementById("activePrayer").textContent=
            activeName;

    }

}
    setInterval(() => {

        updateActivePrayer();

    }, 60000);

});

/* ==========================================================
   INISIALISASI GPS
========================================================== */

async function initGPS(){

    try{

        const gps=await getLocation();

        App.latitude=gps.lat;

        App.longitude=gps.lon;

        await loadCity(

            App.latitude,

            App.longitude

        );

        await loadPrayerTimes();

await loadMonthlySchedule();

        hideLoading();

        toast("Lokasi ditemukan");

    }catch(err){

        hideLoading();

        $("kota").textContent="❌ "+err;

        toast("GPS gagal");

    }

}

/* ==========================================================
   START GPS
========================================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

    initGPS();

}

);

/* ==========================================================
   JADWAL BULANAN BERDASARKAN GPS
========================================================== */

async function loadMonthlySchedule(){

    const table = $("monthlyBody");

    if(!table) return;

    if(App.latitude==null || App.longitude==null){

        table.innerHTML=
        "<tr><td colspan='6'>Menunggu GPS...</td></tr>";

        return;

    }

    const now=new Date();

    const month=now.getMonth()+1;
    const year=now.getFullYear();

    const url=
`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${App.latitude}&longitude=${App.longitude}&method=11`;

    try{

        const res=await fetch(url);

        const json=await res.json();

        table.innerHTML="";

        json.data.forEach(day=>{

            const t=day.timings;

            const tr=document.createElement("tr");

            tr.innerHTML=`

<td>${day.date.gregorian.day}</td>

<td>${t.Fajr.substring(0,5)}</td>

<td>${t.Dhuhr.substring(0,5)}</td>

<td>${t.Asr.substring(0,5)}</td>

<td>${t.Maghrib.substring(0,5)}</td>

<td>${t.Isha.substring(0,5)}</td>

`;

            table.appendChild(tr);

        });

    }catch(e){

        console.log(e);

        table.innerHTML=
        "<tr><td colspan='6'>Gagal memuat jadwal</td></tr>";

    }

}

/* ==========================================================
   SHOLAT BERIKUTNYA & COUNTDOWN
========================================================== */

function getPrayerList(){

    const t = App.prayerTimes;

    return [

        {name:"Subuh",id:"fajr",time:t.Fajr},
        {name:"Zuhur",id:"dhuhr",time:t.Dhuhr},
        {name:"Asar",id:"asr",time:t.Asr},
        {name:"Maghrib",id:"maghrib",time:t.Maghrib},
        {name:"Isya",id:"isha",time:t.Isha}

    ];

}

function startCountdown(){

    if(!App.prayerTimes) return;

    setInterval(updateCountdown,1000);

    updateCountdown();

}

function updateCountdown(){

    const now = new Date();

    const prayers = getPrayerList();

    let next = null;

    for(const p of prayers){

        const [h,m] = p.time.substring(0,5).split(":").map(Number);

        const d = new Date();

        d.setHours(h,m,0,0);

        if(d > now){

            next = {
                ...p,
                target:d
            };

            break;

        }

    }

    if(!next){

        const [h,m] = prayers[0].time.substring(0,5).split(":").map(Number);

        const d = new Date();

        d.setDate(d.getDate()+1);

        d.setHours(h,m,0,0);

        next = {

            ...prayers[0],

            target:d

        };

    }

    $("nextPrayer").textContent = next.name;

    const diff = next.target-now;

    const jam = Math.floor(diff/3600000);

    const menit = Math.floor((diff%3600000)/60000);

    const detik = Math.floor((diff%60000)/1000);

    $("countdown").textContent =
        `${pad(jam)}:${pad(menit)}:${pad(detik)}`;

    highlightPrayer();

}

/* ==========================================================
   HIGHLIGHT SHOLAT AKTIF
========================================================== */

function highlightPrayer(){

    document.querySelectorAll(".prayer-row")
    .forEach(r=>r.classList.remove("active-prayer"));

    const prayers = getPrayerList();

    const now = new Date();

    const current = now.getHours()*60+now.getMinutes();

    let active = 0;

    prayers.forEach((p,i)=>{

        const [h,m]=p.time.substring(0,5).split(":").map(Number);

        const minute=h*60+m;

        if(current>=minute){

            active=i;

        }

    });

    const row = $(prayers[active].id)?.parentElement;

    if(row){

        row.classList.add("active-prayer");

    }

}

/* ==========================================================
   COUNTDOWN SHOLAT BERIKUTNYA
========================================================== */

let countdownTimer=null;

function startCountdown(){

    if(!App.prayerTimes) return;

    if(countdownTimer){

        clearInterval(countdownTimer);

    }

    function update(){

        const now=new Date();

        const schedule=[

            ["Subuh",App.prayerTimes.Fajr],
            ["Zuhur",App.prayerTimes.Dhuhr],
            ["Asar",App.prayerTimes.Asr],
            ["Magrib",App.prayerTimes.Maghrib],
            ["Isya",App.prayerTimes.Isha]

        ];

        let next=null;

        for(const item of schedule){

            const hm=item[1].substring(0,5).split(":");

            const d=new Date();

            d.setHours(
                parseInt(hm[0]),
                parseInt(hm[1]),
                0,
                0
            );

            if(d>now){

                next={
                    name:item[0],
                    target:d
                };

                break;

            }

        }

        if(!next){

            const hm=schedule[0][1].substring(0,5).split(":");

            const d=new Date();

            d.setDate(d.getDate()+1);

            d.setHours(
                parseInt(hm[0]),
                parseInt(hm[1]),
                0,
                0
            );

            next={
                name:schedule[0][0],
                target:d
            };

        }

        $("nextPrayer").textContent=next.name;

        const diff=next.target-now;

        const h=Math.floor(diff/3600000);

        const m=Math.floor((diff%3600000)/60000);

        const s=Math.floor((diff%60000)/1000);

        $("countdown").textContent=

        pad(h)+":"+

        pad(m)+":"+

        pad(s);

    }

    update();

    countdownTimer=setInterval(update,1000);

}

/* ==========================================================
   SHOLAT AKTIF
========================================================== */

function updateActivePrayer(){

    if(!App.prayerTimes) return;

    document.querySelectorAll(".prayer-row").forEach(row=>{

        row.classList.remove("active-prayer");

    });

    const list=[

        {id:"fajr",time:App.prayerTimes.Fajr},

        {id:"sunrise",time:App.prayerTimes.Sunrise},

        {id:"dhuhr",time:App.prayerTimes.Dhuhr},

        {id:"asr",time:App.prayerTimes.Asr},

        {id:"maghrib",time:App.prayerTimes.Maghrib},

        {id:"isha",time:App.prayerTimes.Isha}

    ];

    const now=new Date();

    const minuteNow=

    now.getHours()*60+

    now.getMinutes();

    let active=0;

    list.forEach((item,index)=>{

        const t=item.time.substring(0,5).split(":");

        const minute=

        parseInt(t[0])*60+

        parseInt(t[1]);

        if(minuteNow>=minute){

            active=index;

        }

    });

    const el=$(list[active].id);

    if(el){

        el.parentElement.classList.add("active-prayer");

    }

    const label=

    el.parentElement.querySelector("span").textContent;

    if($("activePrayer")){

        $("activePrayer").textContent=label;

    }

}

/* ==========================================================
   JADWAL BULANAN GPS
========================================================== */

async function loadMonthlySchedule(){

    if(!App.latitude) return;

    const tbody=$("monthlyBody");

    if(!tbody) return;

    const now=new Date();

    const month=now.getMonth()+1;

    const year=now.getFullYear();

    const url=

`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${App.latitude}&longitude=${App.longitude}&method=11`;

    try{

        const res=await fetch(url);

        const json=await res.json();

        tbody.innerHTML="";

        json.data.forEach(day=>{

            const t=day.timings;

            const tr=document.createElement("tr");

            tr.innerHTML=`

<td>${day.date.gregorian.day}</td>

<td>${t.Fajr.substring(0,5)}</td>

<td>${t.Dhuhr.substring(0,5)}</td>

<td>${t.Asr.substring(0,5)}</td>

<td>${t.Maghrib.substring(0,5)}</td>

<td>${t.Isha.substring(0,5)}</td>

`;

            tbody.appendChild(tr);

        });

    }catch(e){

        tbody.innerHTML=

"<tr><td colspan='6'>Gagal memuat jadwal</td></tr>";

    }

}

/* ==========================================================
   UPDATE SETELAH DATA MASUK
========================================================== */

document.addEventListener("DOMContentLoaded",()=>{

    const wait=setInterval(()=>{

        if(App.prayerTimes){

            clearInterval(wait);

            startCountdown();

            updateActivePrayer();

            loadMonthlySchedule();

            setInterval(updateActivePrayer,60000);

        }

    },500);

});

/* ==========================================================
   KOMPAS KIBLAT
========================================================== */

function calculateQibla(lat, lon){

    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;

    const toRad = d => d * Math.PI / 180;
    const toDeg = r => r * 180 / Math.PI;

    const dLon = toRad(kaabaLon - lon);

    const lat1 = toRad(lat);
    const lat2 = toRad(kaabaLat);

    const y = Math.sin(dLon);

    const x =
        Math.cos(lat1) * Math.tan(lat2) -
        Math.sin(lat1) * Math.cos(dLon);

    let brng = toDeg(Math.atan2(y, x));

    return (brng + 360) % 360;

}

function initQibla(){

    if(!App.latitude) return;

    App.qibla = calculateQibla(
        App.latitude,
        App.longitude
    );

    if($("qibla")){

        $("qibla").textContent =
        Math.round(App.qibla)+"°";

    }

    if($("qibla-degree")){

        $("qibla-degree").textContent =
        Math.round(App.qibla)+"°";

    }

}

window.addEventListener(

"deviceorientation",

(event)=>{

    if(event.alpha==null) return;

    const heading = event.alpha;

const rotate = App.qibla - heading;

    if($("compass")){

        $("compass").style.transform=

        `rotate(${rotate}deg)`;

    }

    if($("compass-page")){

        $("compass-page").style.transform=

        `rotate(${rotate}deg)`;

    }

});

/* ==========================================================
   KALENDER HIJRIAH
========================================================== */

);

function renderHijriCalendar(){

    const box = $("hijriCalendar");

    if(!box) return;

    box.innerHTML="";

    for(let i=1;i<=30;i++){

        const div=document.createElement("div");

        div.className="hijri-day-box";

        if(App.hijri){

            if(i==parseInt(App.hijri.day)){

                div.classList.add("today");

            }

        }

        div.textContent=i;

        box.appendChild(div);

    }

}

/* ==========================================================
   DARK MODE
========================================================== */

function initDarkMode(){

    const btn=$("darkModeBtn");

    if(!btn) return;

    const saved=

    localStorage.getItem("dark");

    if(saved==="on"){

        document.body.classList.add("dark");

    }

    btn.onclick=()=>{

        document.body.classList.toggle("dark");

        localStorage.setItem(

            "dark",

            document.body.classList.contains("dark")

            ?"on":"off"

        );

        toast("Mode berhasil diubah");

    };

}

/* ==========================================================
   AUDIO ADZAN
========================================================== */

function initAdhanSelector(){

    const select=

    $("adhanSelect");

    const audio=

    $("adhanAudio");

    if(!select||!audio) return;

    const saved=

    localStorage.getItem("adhan");

    if(saved){

        select.value=saved;

    }

    audio.src=

    "audio/"+select.value+".mp3";

    select.onchange=()=>{

        audio.src=

        "audio/"+

        select.value+

        ".mp3";

        localStorage.setItem(

            "adhan",

            select.value

        );

        toast(

        "Suara adzan diganti"

        );

    };

}

/* ==========================================================
   START FITUR
========================================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

const wait=setInterval(()=>{

if(App.prayerTimes){

clearInterval(wait);

initQibla();

renderHijriCalendar();

initDarkMode();

initAdhanSelector();

}

},500);

});

/* ==========================================================
   BAGIAN 5
   FINAL STARTUP & AUTO REFRESH
========================================================== */

function updateTodaySummary(){

    if(!$("activePrayer") || !$("remainingTime")) return;

    $("activePrayer").textContent =
        $("nextPrayer") ? $("nextPrayer").textContent : "-";

    $("remainingTime").textContent =
        $("countdown") ? $("countdown").textContent : "-";

    if($("qiblaSummary")){

        $("qiblaSummary").textContent =
            Math.round(App.qibla || 0) + "°";

    }

}

function playAdhan(){

    const audio = $("adhanAudio");

    if(!audio) return;

    audio.currentTime = 0;

    audio.play().catch(()=>{

        console.log("Audio belum diizinkan browser");

    });

}

function checkPrayerAlarm(){

    if(!App.prayerTimes) return;

    const now = new Date();

    const current =
        pad(now.getHours()) + ":" +
        pad(now.getMinutes());

    const list = [

        App.prayerTimes.Fajr.substring(0,5),

        App.prayerTimes.Dhuhr.substring(0,5),

        App.prayerTimes.Asr.substring(0,5),

        App.prayerTimes.Maghrib.substring(0,5),

        App.prayerTimes.Isha.substring(0,5)

    ];

    if(list.includes(current)){

        playAdhan();

    }

}

function autoRefresh(){

    updateTodaySummary();

    checkPrayerAlarm();

}

setInterval(autoRefresh,1000);

/* ==========================================================
   START APP
========================================================== */

document.addEventListener("DOMContentLoaded",()=>{

    showPage("page-home");

    setTimeout(()=>{

        hideLoading();

    },1000);

    toast("Jadwal Sholat v3.0 siap");

});
