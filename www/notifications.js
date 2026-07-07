async function initNotifications() {

    const { LocalNotifications } = window.Capacitor.Plugins;

    const perm = await LocalNotifications.requestPermissions();
    
    await LocalNotifications.createChannel({
    id: "subuh",
    name: "Subuh",
    sound: "fajr_128_44",
    importance: 5
});

   await LocalNotifications.createChannel({
    id: "adzan",
    name: "Adzan",
    sound: "azan1",
    importance:5
});

    console.log("Permission:", perm);
}

async function schedulePrayerNotifications(t) {

    const { LocalNotifications } = window.Capacitor.Plugins;

    const prayers = [
        { id: 1, name: "Subuh", time: t.Fajr },
        { id: 2, name: "Zuhur", time: t.Dhuhr },
        { id: 3, name: "Asar", time: t.Asr },
        { id: 4, name: "Magrib", time: t.Maghrib },
        { id: 5, name: "Isya", time: t.Isha }
    ];

    const notifications = prayers.map(p => {
        const [hour, minute] = p.time.split(":").map(Number);

        const date = new Date();
        date.setHours(hour, minute, 0, 0);

if (date < new Date()) {
    date.setDate(date.getDate() + 1);
}

        return {
            id: p.id,
            title: "🕌 Waktu Salat",
            body: `Sudah masuk waktu ${p.name}`,
            schedule: { at: date },
            channelId: p.name === "Subuh" ? "subuh" : "adzan"
        };
    });

    await LocalNotifications.schedule({
        notifications
    });
}

window.initNotifications = initNotifications;
window.schedulePrayerNotifications = schedulePrayerNotifications;
