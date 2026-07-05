import { LocalNotifications } from '@capacitor/local-notifications';

export async function checkPrayer(t) {

    const now = new Date();
    const current = now.getHours() + ":" + now.getMinutes();

    const prayers = [
        { name: "Subuh", time: t.Fajr, id: 1 },
        { name: "Zuhur", time: t.Dhuhr, id: 2 },
        { name: "Asar", time: t.Asr, id: 3 },
        { name: "Magrib", time: t.Maghrib, id: 4 },
        { name: "Isya", time: t.Isha, id: 5 }
    ];

    prayers.forEach(p => {

        const [h, m] = p.time.split(":");

        const target = h + ":" + m;

        if (current === target) {
            LocalNotifications.schedule({
                notifications: [{
                    id: p.id,
                    title: "🕌 Waktu Sholat",
                    body: "Sudah masuk waktu " + p.name,
                    schedule: { at: new Date() },
                    sound: "default"
                }]
            });
        }
    });
}
