addEventListener('checkPrayer', async (resolve, reject, args) => {
  try {
    console.log('Background Runner aktif');

    // Nanti di sini kita tambahkan cek waktu salat
    // dan kirim notifikasi.

    resolve();
  } catch (err) {
    console.error(err);
    reject(err);
  }
});
