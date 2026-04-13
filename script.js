// =========================================
// FUNGSI UNTUK PINDAH MENU / TAB
// =========================================
function gantiTab(namaTab) {
    document.getElementById('tab-air').classList.remove('aktif');
    document.getElementById('tab-pakan').classList.remove('aktif');
    document.getElementById('menu-air').classList.remove('active');
    document.getElementById('menu-pakan').classList.remove('active');

    if (namaTab === 'air') {
        document.getElementById('tab-air').classList.add('aktif');
        document.getElementById('menu-air').classList.add('active');
    } else if (namaTab === 'pakan') {
        document.getElementById('tab-pakan').classList.add('aktif');
        document.getElementById('menu-pakan').classList.add('active');
    }
}

// =========================================
// FUNGSI TANGGAL
// =========================================
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const tglHariIni = new Date().toLocaleDateString('id-ID', dateOptions);
document.querySelectorAll('.tanggal-hari-ini').forEach(el => {
    el.innerText = tglHariIni;
});

// =========================================
// INISIALISASI GRAFIK (Kosong di awal)
// =========================================
const ctx1 = document.getElementById('kualitasAirChart').getContext('2d');
let chartAir = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: [], 
        datasets: [
            { label: 'pH Air', data: [], borderColor: '#0984e3', backgroundColor: 'transparent', borderWidth: 2, tension: 0.4 },
            { label: 'Turbidity (NTU)', data: [], borderColor: '#00b894', backgroundColor: 'transparent', borderWidth: 2, tension: 0.4 },
            { label: 'DO (mg/L)', data: [], borderColor: '#6c5ce7', backgroundColor: 'transparent', borderWidth: 2, tension: 0.4 },
            { label: 'Suhu (°C)', data: [], borderColor: '#e17055', backgroundColor: 'transparent', borderWidth: 2, tension: 0.4 }
        ]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { title: { display: true, text: 'Nilai Sensor' } }, x: { title: { display: true, text: 'Waktu' } } } }
});

const ctx2 = document.getElementById('tdsChart').getContext('2d');
let chartTds = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'TDS (ppm)', data: [], borderColor: '#fdcb6e', backgroundColor: 'rgba(253, 203, 110, 0.2)', borderWidth: 2, fill: true, tension: 0.4 }
        ]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { title: { display: true, text: 'Nilai TDS (ppm)' } }, x: { title: { display: true, text: 'Waktu' } } } }
});

// =========================================
// FUNGSI TARIK DATA REAL-TIME DARI VPS
// =========================================
function updateData() {
    let filter = "menit";
    let elemenFilter = document.getElementById('filterWaktu');
    if (elemenFilter) {
        filter = elemenFilter.value;
    }

    fetch('http://203.194.114.41/get_data.php?filter=' + filter)
        .then(response => response.json())
        .then(data => {
            // Update Kartu Angka Air
            if(data.kualitas_air) {
                document.getElementById('val-ph').innerText = data.kualitas_air.ph;
                document.getElementById('val-tur').innerText = data.kualitas_air.turbidity + ' NTU';
                document.getElementById('val-tds').innerText = data.kualitas_air.tds + ' ppm';
                document.getElementById('val-do').innerText = data.kualitas_air.nilai_do + ' mg/L';
                document.getElementById('val-suhu').innerText = data.kualitas_air.suhu + ' °C';
            }
            // Update Kartu Angka Pakan
            if(data.pakan_ikan) {
                document.getElementById('val-berat').innerText = data.pakan_ikan.berat_pakan + ' kg';
                document.getElementById('val-sisa').innerText = data.pakan_ikan.sisa_pakan + ' %';
            }

            // Update Grafik Air
            if(data.grafik_air && data.grafik_air.length > 0) {
                let labelJam = []; let dataPh = []; let dataTur = []; let dataDo = []; let dataSuhu = []; let dataTds = [];

                data.grafik_air.forEach(row => {
                    labelJam.push(row.jam);
                    dataPh.push(row.ph);
                    dataTur.push(row.turbidity);
                    dataDo.push(row.nilai_do);
                    dataSuhu.push(row.suhu);
                    dataTds.push(row.tds);
                });

                chartAir.data.labels = labelJam;
                chartAir.data.datasets[0].data = dataPh;
                chartAir.data.datasets[1].data = dataTur;
                chartAir.data.datasets[2].data = dataDo;
                chartAir.data.datasets[3].data = dataSuhu;
                chartAir.update();

                chartTds.data.labels = labelJam;
                chartTds.data.datasets[0].data = dataTds;
                chartTds.update();
            }
        })
        .catch(error => console.error('Gagal mengambil data dari VPS:', error));
}

// Jalankan auto-update
updateData();
setInterval(updateData, 5000);

// =========================================
// FUNGSI PANEL KONTROL PAKAN
// =========================================
let frekuensiTerpilih = 1; // Default 1x sehari

function pilihFrekuensi(elemen, nilai) {
    frekuensiTerpilih = nilai;
    
    // Reset warna semua tombol opsi ke abu-abu
    let tombolSemua = document.querySelectorAll('.opsi-frekuensi');
    tombolSemua.forEach(tombol => {
        tombol.style.background = '#f1f2f6';
        tombol.style.color = '#636e72';
        tombol.style.border = '2px solid transparent';
    });

    // Nyalakan tombol yang diklik
    elemen.style.background = '#e3f2fd';
    elemen.style.color = '#0984e3';
    elemen.style.border = '2px solid #0984e3';
}

// =========================================
// MODIFIKASI: FUNGSI KIRIM PERINTAH KE NODE-RED
// =========================================
function simpanKonfigurasi() {
    let takaran = document.getElementById('input-takaran').value;
    
    if(takaran <= 0 || takaran === "") {
        alert("Takaran pakan tidak boleh kosong atau nol!");
        return;
    }

    // 1. Bungkus data sesuai format JSON yang dimengerti Node-RED
    let dataKirim = {
        "frekuensi": parseInt(frekuensiTerpilih),
        "berat": parseFloat(takaran)
    };

    // 2. Tembak data ke IP VPS tempat Node-RED berjalan (Port 1880)
    let urlNodeRed = "http://203.194.114.41:1880/api/set_pakan"; 

    // 3. Eksekusi pengiriman pakai Fetch (HTTP POST)
    fetch(urlNodeRed, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataKirim)
    })
    .then(response => {
        // Cek apakah Node-RED memberikan balasan OK (status 200)
        if(response.ok) {
            alert("✅ PERINTAH BERHASIL DIKIRIM!\n\nJadwal : " + frekuensiTerpilih + "x Sehari\nTakaran : " + takaran + " Kg");
        } else {
            alert("❌ Server Node-RED merespons tapi gagal memproses data.");
        }
    })
    .catch(error => {
        console.error('Error jaringan ke Node-RED:', error);
        alert("❌ Gagal terhubung ke Node-RED! Pastikan Node-RED sedang berjalan di VPS port 1880.");
    });
}