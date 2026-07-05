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

                checkPrayer(t);

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

window.addEventListener("deviceorientation", (event) => {
    console.log("alpha (arah):", event.alpha);
});

    loadPrayerTimes();
});
