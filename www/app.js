const BackgroundRunner = window.Capacitor?.Plugins?.BackgroundRunner;

document.addEventListener("DOMContentLoaded", () => {

    const kota = document.getElementById("kota");
    const tanggal = document.getElementById("tanggal");
    const notifToggle = document.getElementById("notifToggle");

notifToggle.checked = localStorage.getItem("notif") !== "off";

notifToggle.addEventListener("change", () => {
    localStorage.setItem(
        "notif",
        notifToggle.checked ? "on" : "off"
    );
});

    async function loadPrayerTimes() {

        if (!navigator.geolocation) {
            kota.textContent = "❌ GPS tidak didukung";
            return;
        }

        kota.textContent = "📍 Mencari lokasi...";

        navigator.geolocation.getCurrentPosition(async (pos) => {

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

const qibla = calculateQibla(lat, lon);
qiblaDirection = qibla;

document.getElementById("qibla").textContent =
    "Arah Kiblat: " + Math.round(qibla) + "°";

const kaabaLat = 21.4225;
const kaabaLon = 39.8262;

function toRad(v) {
    return v * Math.PI / 180;
}

function toDeg(v) {
    return v * 180 / Math.PI;
}

const dLon = toRad(kaabaLon - lon);
const lat1 = toRad(lat);
const lat2 = toRad(kaabaLat);

const y = Math.sin(dLon) * Math.cos(lat2);
const x = Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

let brng = toDeg(Math.atan2(y, x));
brng = (brng + 360) % 360;

document.getElementById("qibla").textContent =
    "🧭 Kiblat: " + Math.round(brng) + "° dari utara";

            try {
                const geo = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
                );

                const data = await geo.json();

                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    "Lokasi Anda";

                kota.textContent = "📍 " + city;

                const res = await fetch(
                    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=11`
                );

                const json = await res.json();
                const t = json.data.timings;

                const hijri = json.data.date.hijri;

document.getElementById("hijri").textContent =
    "🌙 " +
    hijri.day + " " +
    hijri.month.en + " " +
    hijri.year + " H";

           if (notifToggle.checked) {
    initNotifications();
    schedulePrayerNotifications(t);
}

                document.getElementById("fajr").textContent = t.Fajr;
                document.getElementById("sunrise").textContent = t.Sunrise;
                document.getElementById("dhuhr").textContent = t.Dhuhr;
                document.getElementById("asr").textContent = t.Asr;
                document.getElementById("maghrib").textContent = t.Maghrib;
                document.getElementById("isha").textContent = t.Isha;

                updatePrayerHighlight(t);

                tanggal.textContent = new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                });

                startCountdown(t);

            } catch (e) {
    console.log(e);
    alert(e.message);
    kota.textContent = "❌ Error load data";
}

        }, (err) => {
            kota.textContent = "❌ GPS error: " + err.message;
        });
    }

    function startCountdown(t) {

        function tick() {
            const now = new Date();

            const list = [
                ["Subuh", t.Fajr],
                ["Zuhur", t.Dhuhr],
                ["Asar", t.Asr],
                ["Magrib", t.Maghrib],
                ["Isya", t.Isha]
            ];

            let next = null;

            for (const item of list) {
                const [h, m] = item[1].split(":");
                const d = new Date();
                d.setHours(Number(h), Number(m), 0, 0);

                if (d > now) {
                    next = item;
                    break;
                }
            }

            if (!next) next = list[0];

            document.getElementById("nextPrayer").textContent =
                "🕌 " + next[0];

            const [h, m] = next[1].split(":").map(Number);

const target = new Date();
target.setHours(h, m, 0, 0);

if (target < now) {
    target.setDate(target.getDate() + 1);
}

const diff = target - now;

const jam = Math.floor(diff / 3600000);
const menit = Math.floor((diff % 3600000) / 60000);
const detik = Math.floor((diff % 60000) / 1000);

document.getElementById("countdown").textContent =
    `${String(jam).padStart(2, "0")}:${String(menit).padStart(2, "0")}:${String(detik).padStart(2, "0")}`;
        }

        setInterval(tick, 1000);
    }

let qiblaDirection = 0;

window.addEventListener("deviceorientation", (event) => {
    if (event.alpha == null) return;

    const compass = document.getElementById("compass");
    if (!compass) return;

    // arah HP
    const heading = event.alpha;

    // panah kiblat = arah Ka'bah - arah HP
    const rotation = qiblaDirection - heading;

    compass.style.transform = `rotate(${rotation}deg)`;
});

// qiblaDirection = qibla;

function calculateQibla(lat, lon) {
    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;

    const toRad = (deg) => deg * (Math.PI / 180);
    const toDeg = (rad) => rad * (180 / Math.PI);

    const dLon = toRad(kaabaLon - lon);
    const lat1 = toRad(lat);
    const lat2 = toRad(kaabaLat);

    const y = Math.sin(dLon);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLon);

    let brng = toDeg(Math.atan2(y, x));
    return (brng + 360) % 360;
}

    loadPrayerTimes();
});

// ===== Multi Page Navigation =====

document.addEventListener("DOMContentLoaded", () => {

    function showPage(pageId) {

        document.querySelectorAll(".page").forEach(p => {
            p.classList.remove("active");
        });

        const page = document.getElementById(pageId);

        if (page) {
            page.classList.add("active");
        }
    }

    document.getElementById("nav-home").onclick = () => showPage("page-home");
    document.getElementById("nav-qibla").onclick = () => showPage("page-qibla");
    document.getElementById("nav-calendar").onclick = () => showPage("page-calendar");
    document.getElementById("nav-hijri").onclick = () => showPage("page-hijri");
    document.getElementById("nav-more").onclick = () => showPage("page-more");

    showPage("page-home");

});

// ===== Jadwal Bulanan =====

async function loadMonthlySchedule(){

    const table = document.getElementById("monthlyBody");

    if(!table) return;

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();


    // Contoh koordinat Rancaekek
    const latitude = -6.98;
    const longitude = 107.75;


    const url =
    `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=20`;


    try{

        const response = await fetch(url);

        const data = await response.json();


        table.innerHTML="";


        data.data.forEach(day=>{


            const t = day.timings;


            const row = document.createElement("tr");


            row.innerHTML = `

            <td>${day.date.gregorian.day}</td>

            <td>${t.Fajr.substring(0,5)}</td>

            <td>${t.Dhuhr.substring(0,5)}</td>

            <td>${t.Asr.substring(0,5)}</td>

            <td>${t.Maghrib.substring(0,5)}</td>

            <td>${t.Isha.substring(0,5)}</td>

            `;


            table.appendChild(row);


        });


    }catch(e){

        table.innerHTML =
        "<tr><td colspan='6'>Gagal memuat jadwal</td></tr>";

        console.log(e);

    }

}


loadMonthlySchedule();

// ===== Dark Mode =====

const darkBtn = document.getElementById("darkModeBtn");


if(darkBtn){

darkBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");


});

}

// ===== Highlight Waktu Sholat Aktif =====

function updatePrayerHighlight(times) {

    document.querySelectorAll(".prayer-row").forEach(row => {
        row.classList.remove("active-prayer");
    });

    const schedule = [
        { id: "fajr", time: times.Fajr },
        { id: "sunrise", time: times.Sunrise },
        { id: "dhuhr", time: times.Dhuhr },
        { id: "asr", time: times.Asr },
        { id: "maghrib", time: times.Maghrib },
        { id: "isha", time: times.Isha }
    ];

    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    let activeIndex = 0;

    schedule.forEach((p, i) => {

        const t = p.time.split(":");

        const minute = parseInt(t[0]) * 60 + parseInt(t[1]);

        if (current >= minute) {
            activeIndex = i;
        }

    });

    document.getElementById(schedule[activeIndex].id)
        .parentElement
        .classList.add("active-prayer");

}

function updatePrayerBackground(){

let hour = new Date().getHours();

let img="malam.jpg";

if(hour>=4 && hour<10){
img="subuh.jpg";
}
else if(hour>=10 && hour<15){
img="siang.jpg";
}
else if(hour>=15 && hour<18){
img="sore.jpg";
}

let header=document.getElementById("prayerHeader");

if(header){
header.style.backgroundImage=
`url(images/${img})`;
}

}

updatePrayerBackground();
setInterval(updatePrayerBackground,60000);
