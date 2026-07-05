document.addEventListener("DOMContentLoaded", () => {

    const kota = document.getElementById("kota");
    const tanggal = document.getElementById("tanggal");

    async function loadPrayerTimes() {

        if (!navigator.geolocation) {
            kota.textContent = "❌ GPS tidak didukung";
            return;
        }

        kota.textContent = "📍 Mencari lokasi...";

        navigator.geolocation.getCurrentPosition(async (pos) => {

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

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

initNotifications();
schedulePrayerNotifications(t)

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

            document.getElementById("countdown").textContent =
                new Date(86400000 - (now % 86400000))
                    .toISOString()
                    .substr(11, 8);
        }

        setInterval(tick, 1000);
    }

    loadPrayerTimes();
});
