"use strict";

/* ==========================================================
   JADWAL SHOLAT v4.0
========================================================== */

const App = {
    version: "4.0",
    latitude: null,
    longitude: null,
    city: "",
    prayerTimes: null,
    monthlyData: [],
    hijriData: null,
    countdownTimer: null,
    loading: false
};

const $ = (id) => document.getElementById(id);

function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
}

function showLoading(text = "Memuat Jadwal Sholat...") {

    const box = $("loadingOverlay");
    const label = $("loadingText");

    if (label) {
        label.textContent = text;
    }

    if (box) {
        box.classList.remove("hidden");
        box.style.display = "flex";
    }

    App.loading = true;
}

function hideLoading() {

    const box = $("loadingOverlay");

    if (box) {
        box.classList.add("hidden");

        setTimeout(() => {
            box.style.display = "none";
        }, 300);
    }

    App.loading = false;
}

async function getGPS() {

    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {
            reject("GPS tidak tersedia");
            return;
        }
console.log("📍 Meminta izin GPS...");

        navigator.geolocation.getCurrentPosition(

            pos => {

                App.latitude = pos.coords.latitude;
                App.longitude = pos.coords.longitude;

                resolve();

            },

            err => {

console.error("❌ GPS gagal", err);


                reject(err.message);

            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }

        );

    });

}

console.log("🕌 Jadwal Sholat v4.0 Loaded");
/* ==========================================================
   APP v4.0 - BAGIAN 2
   GPS + JADWAL SHOLAT HARI INI
========================================================== */

async function loadPrayerTimes() {

    try {

showLoading("Mengambil lokasi GPS...");

alert("STEP 1");
await getGPS();

alert("STEP 2");

setText(
    "locationName",
    `${App.latitude.toFixed(5)}, ${App.longitude.toFixed(5)}`
);

alert("STEP 3");

const res = await fetch(url);

alert("STEP 4");

const json = await res.json();

alert("STEP 5");

App.prayerTimes = json.data.timings;

alert("STEP 6");

renderTodayPrayer();
renderHijriInfo();

hideLoading();

alert("STEP 7");


        alert("Gagal memuat jadwal sholat.\n" + err.message);

    }

}

/* ==========================================================
   TAMPILKAN JADWAL HARI INI
========================================================== */

function renderTodayPrayer() {

    if (!App.prayerTimes) return;

    const t = App.prayerTimes;

    setText("fajrTime", t.Fajr.substring(0,5));
    setText("sunriseTime", t.Sunrise.substring(0,5));
    setText("dhuhrTime", t.Dhuhr.substring(0,5));
    setText("asrTime", t.Asr.substring(0,5));
    setText("maghribTime", t.Maghrib.substring(0,5));
    setText("ishaTime", t.Isha.substring(0,5));

}

/* ==========================================================
   TANGGAL HIJRIAH
========================================================== */

function renderHijriInfo() {

    if (!App.hijriData) return;

    setText(
        "hijriDate",
        `${App.hijriData.day} ${App.hijriData.month.en} ${App.hijriData.year} H`
    );

}
/* ==========================================================
   APP v4.0 - BAGIAN 3
   COUNTDOWN + SHOLAT AKTIF + KIBLAT
========================================================== */

function startCountdown() {

    if (App.countdownTimer) {
        clearInterval(App.countdownTimer);
    }

    App.countdownTimer = setInterval(updateCountdown, 1000);

    updateCountdown();

}

function updateCountdown() {

    if (!App.prayerTimes) return;

    const now = new Date();

    const schedule = [

        ["Subuh", App.prayerTimes.Fajr],
        ["Syuruq", App.prayerTimes.Sunrise],
        ["Zuhur", App.prayerTimes.Dhuhr],
        ["Asar", App.prayerTimes.Asr],
        ["Maghrib", App.prayerTimes.Maghrib],
        ["Isya", App.prayerTimes.Isha]

    ];

    let nextName = "";
    let target = null;

    for (const item of schedule) {

        const hm = item[1].substring(0,5).split(":");

        const d = new Date();

        d.setHours(
            parseInt(hm[0]),
            parseInt(hm[1]),
            0,
            0
        );

        if (d > now) {

            nextName = item[0];
            target = d;

            break;

        }

    }

    if (!target) {

        nextName = "Subuh";

        const hm = App.prayerTimes.Fajr.substring(0,5).split(":");

        target = new Date();

        target.setDate(target.getDate() + 1);

        target.setHours(
            parseInt(hm[0]),
            parseInt(hm[1]),
            0,
            0
        );

    }

    const diff = target - now;

    const h = Math.floor(diff / 3600000);

    const m = Math.floor((diff % 3600000) / 60000);

    const s = Math.floor((diff % 60000) / 1000);

    setText("nextPrayer", nextName);

    setText(
        "countdown",
        `${String(h).padStart(2,"0")}:` +
        `${String(m).padStart(2,"0")}:` +
        `${String(s).padStart(2,"0")}`
    );

}

/* ==========================================================
   SHOLAT AKTIF
========================================================== */

function updateActivePrayer() {

    if (!App.prayerTimes) return;

    document
        .querySelectorAll(".prayer-row")
        .forEach(row => row.classList.remove("active"));

    const list = [

        {id:"fajrRow",time:App.prayerTimes.Fajr},
        {id:"sunriseRow",time:App.prayerTimes.Sunrise},
        {id:"dhuhrRow",time:App.prayerTimes.Dhuhr},
        {id:"asrRow",time:App.prayerTimes.Asr},
        {id:"maghribRow",time:App.prayerTimes.Maghrib},
        {id:"ishaRow",time:App.prayerTimes.Isha}

    ];

    const now = new Date();

    const minuteNow =
        now.getHours() * 60 +
        now.getMinutes();

    let active = 0;

    list.forEach((item,index)=>{

        const hm = item.time.substring(0,5).split(":");

        const minute =
            parseInt(hm[0])*60 +
            parseInt(hm[1]);

        if(minuteNow >= minute){

            active = index;

        }

    });

    const el = document.getElementById(list[active].id);

    if(el){

        el.classList.add("active");

    }

}

/* ==========================================================
   HITUNG ARAH KIBLAT
========================================================== */

function calculateQibla(lat, lon){

    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;

    const toRad = d => d*Math.PI/180;
    const toDeg = r => r*180/Math.PI;

    const dLon = toRad(kaabaLon-lon);

    const lat1 = toRad(lat);
    const lat2 = toRad(kaabaLat);

    const y = Math.sin(dLon);

    const x =
        Math.cos(lat1)*Math.tan(lat2)
        -
        Math.sin(lat1)*Math.cos(dLon);

    let brng = toDeg(Math.atan2(y,x));

    brng = (brng+360)%360;

    return brng;

}

/* ==========================================================
   KOMPAS KIBLAT
========================================================== */

function initCompass(){

    if(
        App.latitude===null ||
        App.longitude===null
    ) return;

    const qibla =
        calculateQibla(
            App.latitude,
            App.longitude
        );

    setText(
        "qiblaDegree",
        Math.round(qibla)+"°"
    );

    window.addEventListener(
        "deviceorientation",
        e=>{

            if(e.alpha==null) return;

            const compass =
                document.getElementById("compass");

            if(!compass) return;

            compass.style.transform =
                `rotate(${qibla-e.alpha}deg)`;

        }
    );

}
/* ==========================================================
   APP v4.0 - BAGIAN 4 (FINAL)
   NAVIGASI + JADWAL BULANAN + INIT APP
========================================================== */

function showPage(pageId){

    document.querySelectorAll(".page").forEach(page=>{

        page.classList.remove("active");

    });

    const target=document.getElementById(pageId);

    if(target){

        target.classList.add("active");

    }

}

function initNavigation(){

    const nav={

        "nav-home":"page-home",
        "nav-qibla":"page-qibla",
        "nav-calendar":"page-calendar",
        "nav-hijri":"page-hijri",
        "nav-more":"page-more"

    };

    Object.keys(nav).forEach(id=>{

        const btn=document.getElementById(id);

        if(btn){

            btn.addEventListener("click",()=>{

                showPage(nav[id]);

            });

        }

    });

}

async function loadMonthlySchedule(){

    if(
        App.latitude===null ||
        App.longitude===null
    ) return;

    const tbody=document.getElementById("monthlyBody");

    if(!tbody) return;

    try{

        const now=new Date();

        const month=now.getMonth()+1;

        const year=now.getFullYear();

        const url=
`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${App.latitude}&longitude=${App.longitude}&method=11`;

        console.log("URL:", url);

try {

console.log("STEP 3");
    const res = await fetch(url);
console.log("STEP 4");
    if(!res.ok){
        throw new Error("Gagal mengambil jadwal bulanan");
    }

    const json = await res.json();

    tbody.innerHTML = "";

    json.data.forEach(day => {

        const t = day.timings;

        tbody.insertAdjacentHTML("beforeend",`

<tr>

<td>${day.date.gregorian.day}</td>

<td>${t.Fajr.substring(0,5)}</td>

<td>${t.Dhuhr.substring(0,5)}</td>

<td>${t.Asr.substring(0,5)}</td>

<td>${t.Maghrib.substring(0,5)}</td>

<td>${t.Isha.substring(0,5)}</td>

</tr>

`);

    });

} catch(err){

    console.error("Jadwal bulanan gagal:", err);

    tbody.innerHTML =
    "<tr><td colspan='6'>Jadwal bulanan belum tersedia</td></tr>";

}

}

function initDarkMode(){

    const btn=document.getElementById("darkModeBtn");

    if(!btn) return;

    if(localStorage.getItem("darkMode")==="on"){

        document.body.classList.add("dark");

    }

    btn.onclick=()=>{

        document.body.classList.toggle("dark");

        localStorage.setItem(

            "darkMode",

            document.body.classList.contains("dark")
            ? "on"
            : "off"

        );

    };

}

/* ==========================================================
   START APP
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    try {

        initNavigation();

        initDarkMode();

        showPage("page-home");

        await loadPrayerTimes();

        hideLoading();

        startCountdown();

        updateActivePrayer();

        initCompass();

        loadMonthlySchedule(); // jangan di-await

        setInterval(updateActivePrayer, 60000);

        console.log("✅ Jadwal Sholat v4.0 siap digunakan");

    } catch (err) {

        console.error("FULL ERROR:", err);

        hideLoading();

        alert(
            "Gagal memulai aplikasi\n\n" +
            err.name + "\n" +
            err.message
        );

    }

});
