document.addEventListener("deviceready", async () => {

    const { LocalNotifications } = window.Capacitor.Plugins;

    if (!LocalNotifications) {
        console.log("Plugin not found");
        return;
    }

    const perm = await LocalNotifications.requestPermissions();
    console.log("Permission:", perm);

    // test notif langsung (biar kamu yakin jalan)
    await LocalNotifications.schedule({
        notifications: [
            {
                title: "🕌 Jadwal Sholat",
                body: "Aplikasi berhasil aktif",
                id: 1,
                schedule: { at: new Date(Date.now() + 5000) }, // 5 detik
                sound: "default"
            }
        ]
    });

});
