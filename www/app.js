document.addEventListener("DOMContentLoaded", async () => {
    const kota = document.getElementById("kota");

    if (!navigator.geolocation) {
        kota.textContent = "❌ GPS tidak didukung";
        return;
    }

    kota.textContent = "📍 Mencari lokasi...";

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
                );

                const data = await res.json();

                const nama =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    data.address.county ||
                    "Lokasi Anda";

                kota.textContent = "📍 " + nama;
            } catch (e) {
                kota.textContent =
                    `📍 ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            }
        },
        (err) => {
            kota.textContent = "❌ GPS: " + err.message;
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );

    document.getElementById("tanggal").textContent =
        new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
});
