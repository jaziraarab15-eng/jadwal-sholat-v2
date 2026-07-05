const { LocalNotifications } = window.Capacitor.Plugins;

async function initNotifications() {
    const perm = await LocalNotifications.requestPermissions();
    console.log("Permission:", perm);
}

async function schedulePrayerNotifications(t) {

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

        return {
            id: p.id,
            title: "🕌 Waktu Salat",
            body: `Sudah masuk waktu ${p.name}`,
            schedule: { at: date },
            sound: "default"
        };
    });

    await LocalNotifications.schedule({
        notifications
    });
}
