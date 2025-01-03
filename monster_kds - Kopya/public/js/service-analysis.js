// Teknik Servis Analizleri için JavaScript dosyası

window.onload = function() {
    loadServiceAnalysis();  // Grafiklerin yüklenmesi
    initMap();              // Harita başlatma
}

// Teknik Servis Taleplerini Yükle
function loadServiceAnalysis() {
    fetch('/api/service-analysis')
        .then(response => response.json())
        .then(data => {
            renderChart('serviceChart', 'bar', 'Teknik Servis Talepleri', 
                        data.map(item => `${item.sehir_adi} - ${item.yil}`), 
                        data.map(item => item.toplam_talep));
            markCitiesOnMap(data);  // Harita üzerinde şehirleri işaretleyelim
        });
}

// Grafik render fonksiyonu
function renderChart(canvasId, type, label, labels, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Harita Başlatma (Leaflet.js ile)
function initMap() {
    const map = L.map('map').setView([38.9637, 35.2433], 7);  // Türkiye merkezi

    // OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Şehirleri Harita Üzerinde İşaretle
function markCitiesOnMap(data) {
    const cities = {
        Izmir: [38.4237, 27.1428],
        Aydin: [37.8653, 27.8326],
        Manisa: [38.5639, 27.4284],
        Denizli: [37.7765, 29.1417],
        Mugla: [37.2169, 28.3667],
        Usak: [38.6800, 29.4090],
        Kutahya: [39.4200, 29.9781],
        Afyon: [38.7564, 30.5456]
    };

    data.forEach(item => {
        if (cities[item.sehir_adi]) {
            L.marker(cities[item.sehir_adi])
                .addTo(map)
                .bindPopup(`<b>${item.sehir_adi}</b><br>Yıl: ${item.yil}<br>Toplam Talepler: ${item.toplam_talep}`);
        }
    });
}
