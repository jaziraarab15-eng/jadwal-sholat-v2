// =====================================
// Jadwal Sholat Premium v2.0
// Bagian 1 - Inisialisasi
// =====================================

const API_METHOD = 11;

const state = {
    latitude: null,
    longitude: null,
    city: "",
    prayerTimes: null,
    hijri: null,
    qibla: 0,
    settings: {
        notification: true,
        darkMode: false,
        adhan: "makkah"
    }
};

const el = {};

document.addEventListener("DOMContentLoaded", initApp);

async function initApp(){

    cacheElements();

    loadSettings();

    bindEvents();

    await loadLocation();

}

function cacheElements(){

    el.city=document.getElementById("kota");
    el.date=document.getElementById("tanggal");
    el.hijri=document.getElementById("hijri");

    el.fajr=document.getElementById("fajr");
    el.sunrise=document.getElementById("sunrise");
    el.dhuhr=document.getElementById("dhuhr");
    el.asr=document.getElementById("asr");
    el.maghrib=document.getElementById("maghrib");
    el.isha=document.getElementById("isha");

    el.nextPrayer=document.getElementById("nextPrayer");
    el.countdown=document.getElementById("countdown");

    el.qibla=document.getElementById("qibla");

    el.notif=document.getElementById("notifToggle");

}

function loadSettings(){

    state.settings.notification=
        localStorage.getItem("notif")!=="off";

    state.settings.darkMode=
        localStorage.getItem("dark")=="on";

    state.settings.adhan=
        localStorage.getItem("adhan") || "makkah";

    if(el.notif)
        el.notif.checked=
            state.settings.notification;

    if(state.settings.darkMode)
        document.body.classList.add("dark");

}

function bindEvents(){

    if(el.notif){

        el.notif.addEventListener("change",()=>{

            state.settings.notification=
                el.notif.checked;

            localStorage.setItem(
                "notif",
                el.notif.checked?"on":"off"
            );

        });

    }

}

async function loadLocation(){

    if(!navigator.geolocation){

        el.city.textContent=
            "GPS tidak didukung";

        return;

    }

    el.city.textContent=
        "📍 Mengambil lokasi...";

    navigator.geolocation.getCurrentPosition(

        onLocationSuccess,

        onLocationError,

        {
            enableHighAccuracy:true,
            timeout:15000,
            maximumAge:0
        }

    );

}

async function onLocationSuccess(position){

    state.latitude=
        position.coords.latitude;

    state.longitude=
        position.coords.longitude;

    await reverseGeocode();

    await loadPrayerTimes();

}

function onLocationError(err){

    el.city.textContent=
        "❌ "+err.message;

}

async function reverseGeocode(){

    try{

        const url=
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${state.latitude}&lon=${state.longitude}`;

        const res=await fetch(url);

        const json=await res.json();

        state.city=
            json.address.city ||
            json.address.town ||
            json.address.village ||
            "Lokasi Anda";

        el.city.textContent=
            "📍 "+state.city;

    }catch(e){

        el.city.textContent=
            "📍 Lokasi Anda";

    }

}

// =====================================
// Bagian 2
// Jadwal Sholat + Countdown
// =====================================

async function loadPrayerTimes(){

    try{

        const url =
        `https://api.aladhan.com/v1/timings?latitude=${state.latitude}&longitude=${state.longitude}&method=${API_METHOD}`;

        const res = await fetch(url);

        const json = await res.json();

        state.prayerTimes = json.data.timings;

        state.hijri = json.data.date.hijri;

        fillPrayerTimes();

        fillHijri();

        fillHijriPage();

        calculateQibla();

        updateToday();

        startCountdown();

        updatePrayerHighlight();

        loadMonthlySchedule();

    }catch(e){

        alert("Gagal mengambil jadwal sholat");

        console.log(e);

    }

}

function fillPrayerTimes(){

    const t = state.prayerTimes;

    el.fajr.textContent = t.Fajr.substring(0,5);

    el.sunrise.textContent = t.Sunrise.substring(0,5);

    el.dhuhr.textContent = t.Dhuhr.substring(0,5);

    el.asr.textContent = t.Asr.substring(0,5);

    el.maghrib.textContent = t.Maghrib.substring(0,5);

    el.isha.textContent = t.Isha.substring(0,5);

}

function fillHijri(){

    if(!state.hijri) return;

    el.hijri.textContent =
    "🌙 " +
    state.hijri.day +
    " " +
    state.hijri.month.en +
    " " +
    state.hijri.year +
    " H";

}

function updateToday(){

    el.date.textContent =
    new Date().toLocaleDateString("id-ID",{

        weekday:"long",

        day:"numeric",

        month:"long",

        year:"numeric"

    });

}

function startCountdown(){

    updateCountdown();

    setInterval(updateCountdown,1000);

}

function updateCountdown(){

    if(!state.prayerTimes) return;

    const list=[

        ["Subuh",state.prayerTimes.Fajr],

        ["Zuhur",state.prayerTimes.Dhuhr],

        ["Asar",state.prayerTimes.Asr],

        ["Magrib",state.prayerTimes.Maghrib],

        ["Isya",state.prayerTimes.Isha]

    ];

    const now=new Date();

    let next=null;

    for(const p of list){

        const time=p[1].substring(0,5);

        const h=parseInt(time.split(":")[0]);

        const m=parseInt(time.split(":")[1]);

        const d=new Date();

        d.setHours(h,m,0,0);

        if(d>now){

            next={
                name:p[0],
                target:d
            };

            break;

        }

    }

    if(next==null){

       const h=parseInt(list[0][1].split(":")[0]); 
       
        const .parseInt(list[0][1].split(":")[1]);

        const d=new Date();

        d.setDate(d.getDate()+1);

        d.setHours(h,m,0,0);

        next={

            name:"Subuh",

            target:d

        };

    }

    el.nextPrayer.textContent="🕌 "+next.name;

    const diff=next.target-now;

    const hh=Math.floor(diff/3600000);

    const mm=Math.floor((diff%3600000)/60000);

    const ss=Math.floor((diff%60000)/1000);

    el.countdown.textContent=

    String(hh).padStart(2,"0")+":"+

    String(mm).padStart(2,"0")+":"+

    String(ss).padStart(2,"0");

}

function updatePrayerHighlight(){

    document

    .querySelectorAll(".prayer-row")

    .forEach(x=>x.classList.remove("active-prayer"));

    const schedule=[

        ["fajr",state.prayerTimes.Fajr],

        ["sunrise",state.prayerTimes.Sunrise],

        ["dhuhr",state.prayerTimes.Dhuhr],

        ["asr",state.prayerTimes.Asr],

        ["maghrib",state.prayerTimes.Maghrib],

        ["isha",state.prayerTimes.Isha]

    ];

    const now=new Date();

    const current=

    now.getHours()*60+

    now.getMinutes();

    let active=0;

    schedule.forEach((p,i)=>{

        const t=p[1].substring(0,5);

        const minute=

        parseInt(t.split(":")[0])*60+

        parseInt(t.split(":")[1]);

        if(current>=minute)

            active=i;

    });

    document

    .getElementById(schedule[active][0])

    .parentElement

    .classList

    .add("active-prayer");

}

// =====================================
// Bagian 3
// Kiblat + Jadwal Bulanan + Hijriah
// =====================================

async function loadMonthlySchedule(){

    if(state.latitude==null || state.longitude==null)
        return;

    const table=document.getElementById("monthlyBody");

    if(!table) return;

    const now=new Date();

    const month=now.getMonth()+1;

    const year=now.getFullYear();

    const url=
    `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${state.latitude}&longitude=${state.longitude}&method=${API_METHOD}`;

    try{

        const res=await fetch(url);

        const json=await res.json();

        table.innerHTML="";

        json.data.forEach(day=>{

            const t=day.timings;

            table.innerHTML+=`

            <tr>

            <td>${day.date.gregorian.day}</td>

            <td>${t.Fajr.substring(0,5)}</td>

            <td>${t.Dhuhr.substring(0,5)}</td>

            <td>${t.Asr.substring(0,5)}</td>

            <td>${t.Maghrib.substring(0,5)}</td>

            <td>${t.Isha.substring(0,5)}</td>

            </tr>

            `;

        });

    }catch(e){

        table.innerHTML=

        "<tr><td colspan='6'>❌ Gagal memuat jadwal</td></tr>";

        console.log(e);

    }

}

function calculateQibla(){

    const kaabaLat=21.4225;

    const kaabaLon=39.8262;

    const toRad=d=>d*Math.PI/180;

    const toDeg=r=>r*180/Math.PI;

    const dLon=toRad(kaabaLon-state.longitude);

    const lat1=toRad(state.latitude);

    const lat2=toRad(kaabaLat);

    const y=Math.sin(dLon);

    const x=

    Math.cos(lat1)*Math.tan(lat2)

    -

    Math.sin(lat1)*Math.cos(dLon);

    state.qibla=

    (toDeg(Math.atan2(y,x))+360)%360;

    const text=document.getElementById("qibla");

    if(text)

        text.textContent=

        "🧭 Kiblat "+Math.round(state.qibla)+"°";

    const degree=document.getElementById("qibla-degree");

    if(degree)

        degree.textContent=

        Math.round(state.qibla)+"°";

    const loc=document.getElementById("qibla-location");

    if(loc)

        loc.textContent=state.city;

}

window.addEventListener(

"deviceorientation",

e=>{

    if(e.alpha==null) return;

    const c=document.getElementById("compass");

    const c2=document.getElementById("compass-page");

    const rotate=

    state.qibla-e.alpha;

    if(c)

        c.style.transform=

        `rotate(${rotate}deg)`;

    if(c2)

        c2.style.transform=

        `rotate(${rotate}deg)`;

});

function fillHijriPage(){

    if(!state.hijri) return;

    const day=document.getElementById("hijri-day");

    const month=document.getElementById("hijri-month");

    const greg=document.getElementById("hijri-gregorian");

    if(day)

        day.textContent=

        state.hijri.day;

    if(month)

        month.textContent=

        state.hijri.month.en+

        " "+

        state.hijri.year+" H";

    if(greg)

        greg.textContent=

        new Date().toLocaleDateString(

        "id-ID",

        {

            weekday:"long",

            day:"numeric",

            month:"long",

            year:"numeric"

        });

    renderHijriCalendar();

}

function renderHijriCalendar(){

    const grid=document.getElementById("hijriCalendar");

    if(!grid) return;

    grid.innerHTML="";

    for(let i=1;i<=30;i++){

        const box=document.createElement("div");

        box.className="hijri-day-box";

        box.textContent=i;

        if(state.hijri &&

           Number(state.hijri.day)===i)

            box.classList.add("today");

        grid.appendChild(box);

    }

}

// =====================================
// Bagian 4
// Settings + Navigation + Auto Refresh
// =====================================

// ---------- Dark Mode ----------

const darkBtn=document.getElementById("darkModeBtn");

if(darkBtn){

    darkBtn.onclick=()=>{

        state.settings.darkMode=
        !state.settings.darkMode;

        document.body.classList.toggle(
            "dark",
            state.settings.darkMode
        );

        localStorage.setItem(
            "dark",
            state.settings.darkMode?"on":"off"
        );

    };

}

// ---------- Pilih Adzan ----------

const adhanSelect=document.getElementById("adhanSelect");

if(adhanSelect){

    adhanSelect.value=state.settings.adhan;

    adhanSelect.onchange=()=>{

        state.settings.adhan=
        adhanSelect.value;

        localStorage.setItem(
            "adhan",
            adhanSelect.value
        );

    };

}

// ---------- Navigasi ----------

function showPage(id){

    document
    .querySelectorAll(".page")
    .forEach(p=>p.classList.remove("active"));

    const page=document.getElementById(id);

    if(page)
        page.classList.add("active");

}

[
["nav-home","page-home"],
["nav-qibla","page-qibla"],
["nav-calendar","page-calendar"],
["nav-hijri","page-hijri"],
["nav-more","page-more"]

].forEach(item=>{

    const btn=document.getElementById(item[0]);

    if(btn){

        btn.onclick=()=>{

            showPage(item[1]);

        };

    }

});

showPage("page-home");

// ---------- Auto Refresh ----------

setInterval(()=>{

    const now=new Date();

    if(
        now.getHours()===0 &&
        now.getMinutes()===0 &&
        now.getSeconds()<2
    ){

        loadPrayerTimes();

    }

},1000);

// ---------- Online ----------

window.addEventListener("online",()=>{

    loadPrayerTimes();

});

// ---------- Offline ----------

window.addEventListener("offline",()=>{

    alert(
        "Mode Offline\nMenggunakan data terakhir."
    );

});

// ---------- Error ----------

window.onerror=function(msg){

    console.log(msg);

};

// ---------- Selesai ----------

console.log(

"Jadwal Sholat Premium v2.0 Loaded"

);
