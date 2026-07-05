import { LocalNotifications } from "@capacitor/local-notifications";

// minta izin notifikasi
export async function initNotifications() {
    await LocalNotifications.requestPermissions();
}

// jadwalkan adzan
export async function schedulePrayerNotifications(t) {

    const prayers = [
        { id: 1, name: "Subuh", time: t.Fajr },
        { id: 2, name: "Zuhur", time: t.Dhuhr },
        { id: 3, name: "Asar", time: t.Asr },
        { id: 4, name: "Magrib", time: t.Maghrib },
        { id: 5, name: "Isya", time: t.Isha },
    ];

    const now = new Date();

    for (const p of prayers) {

        const [h, m] = p.time.split(":");

        const fireDate = new Date();
        fireDate.setHours(Number(h), Number(m), 0, 0);

        if (fireDate > now) {
            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: p.id + Date.now(),
                        title: "🕌 Adzan",
                        body: `Waktu sholat ${p.name}`,
                        schedule: { at: fireDate },
                        sound: "default",
                    }
                ]
            });
        }
    }
}
