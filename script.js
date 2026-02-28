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

// 2. MEMBUAT GRAFIK DUMMY DENGAN CHART.JS
const ctx = document.getElementById('kualitasAirChart').getContext('2d');

new Chart(ctx, {
    type: 'line', // Jenis grafik: garis
    data: {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'], // Label bawah
        datasets: [
            {
                label: 'pH Air',
                data: [7.1, 7.2, 7.0, 7.4, 7.3, 7.2, 7.5], // Data bohong-bohongan
                borderColor: '#0984e3',
                backgroundColor: 'rgba(9, 132, 227, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4 // Membuat garis melengkung (smooth)
            },
            {
                label: 'Suhu (°C)',
                data: [28, 28.5, 27.8, 29, 28.2, 27.5, 28.1],
                borderColor: '#e17055',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            y: { beginAtZero: false }
        }
    }
});