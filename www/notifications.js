async function initNotifications() {

    alert("initNotifications dipanggil");

    const { LocalNotifications } = window.Capacitor.Plugins;

    const perm = await LocalNotifications.requestPermissions();

    alert("Permission: " + JSON.stringify(perm));
}
