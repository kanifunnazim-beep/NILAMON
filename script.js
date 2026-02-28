// =========================================
// FUNGSI UNTUK PINDAH MENU / TAB
// =========================================
function gantiTab(namaTab) {
    // 1. Sembunyikan kedua konten tab
    document.getElementById('tab-air').classList.remove('aktif');
    document.getElementById('tab-pakan').classList.remove('aktif');

    // 2. Hilangkan warna biru (active) dari kedua menu sidebar
    document.getElementById('menu-air').classList.remove('active');
    document.getElementById('menu-pakan').classList.remove('active');

    // 3. Tampilkan tab yang dipilih saja
    if (namaTab === 'air') {
        document.getElementById('tab-air').classList.add('aktif');
        document.getElementById('menu-air').classList.add('active');
    } else if (namaTab === 'pakan') {
        document.getElementById('tab-pakan').classList.add('aktif');
        document.getElementById('menu-pakan').classList.add('active');
    }
}

// =========================================
// FUNGSI TANGGAL (Diperbarui agar bisa tampil di kedua halaman)
// =========================================
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const tglHariIni = new Date().toLocaleDateString('id-ID', dateOptions);

// Masukkan tanggal ke semua elemen yang punya class 'tanggal-hari-ini'
const elemenTanggal = document.querySelectorAll('.tanggal-hari-ini');
elemenTanggal.forEach(el => {
    el.innerText = tglHariIni;
});

// =========================================
// GRAFIK 1: pH, Turbidity, DO, Suhu
// =========================================
const ctx1 = document.getElementById('kualitasAirChart').getContext('2d');

new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'], 
        datasets: [
            {
                label: 'pH Air',
                data: [7.1, 7.2, 7.0, 7.1, 7.3, 7.2, 7.1], 
                borderColor: '#0984e3',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Turbidity (NTU)',
                data: [12, 15, 14, 16, 15, 13, 14], 
                borderColor: '#00b894',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'DO (mg/L)',
                data: [6.5, 6.6, 6.4, 6.5, 6.7, 6.5, 6.6], 
                borderColor: '#6c5ce7',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Suhu (°C)',
                data: [27.5, 28.0, 28.5, 29.0, 28.8, 28.2, 28.0], 
                borderColor: '#e17055',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
            y: { title: { display: true, text: 'Nilai Sensor' } },
            x: { title: { display: true, text: 'Waktu (Jam)' } }
        }
    }
});

// =========================================
// GRAFIK 2: KHUSUS TDS
// =========================================
const ctx2 = document.getElementById('tdsChart').getContext('2d');

new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'], 
        datasets: [
            {
                label: 'TDS (ppm)',
                data: [340, 345, 350, 348, 352, 350, 345], 
                borderColor: '#fdcb6e', // Warna Kuning/Emas
                backgroundColor: 'rgba(253, 203, 110, 0.2)', // Sedikit efek warna di bawah garis
                borderWidth: 2,
                fill: true, // Membuat grafik TDS sedikit berbeda visualnya
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
            y: { title: { display: true, text: 'Nilai TDS (ppm)' } },
            x: { title: { display: true, text: 'Waktu (Jam)' } }
        }
    }
});