document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("kota").textContent = "📍 Aplikasi berhasil dimulai";
    document.getElementById("tanggal").textContent =
        new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    document.getElementById("nextPrayer").textContent = "Siap memuat jadwal";
});
