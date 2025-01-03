// Raporlar sayfası için JavaScript dosyası

// Teknik Servis Analizleri, Satış Analizleri ve Kampanya Planlama seçenekleri
function showAnalysis(type) {
    const content = document.getElementById("report-content");
    content.innerHTML = ""; // Önce içeriği temizle

    if (type === "servis") {
        content.innerHTML = `
            <h3>Teknik Servis Analizleri</h3>
            <p>Her şehirdeki yıllık teknik servis taleplerini analiz edin.</p>
            <canvas id="serviceChart"></canvas>
        `;
        loadServiceAnalysis();
    } else if (type === "satis") {
        content.innerHTML = `
            <h3>Satış Analizleri</h3>
            <p>Yıllık satış performansını ve en çok/az satılan ürünleri analiz edin.</p>
            <canvas id="salesChart"></canvas>
        `;
        loadSalesAnalysis();
    } else if (type === "kampanya") {
        content.innerHTML = `
            <h3>Kampanya Planlama</h3>
            <p>Karne günleri için kampanya önerileri ve satış analizlerini görüntüleyin.</p>
            <canvas id="campaignChart"></canvas>
        `;
        loadCampaignAnalysis();
    }
}

// Teknik Servis Analizlerini Yükleme
function loadServiceAnalysis() {
    fetch('/api/service-analysis')
        .then(response => response.json())
        .then(data => {
            renderChart('serviceChart', 'bar', 'Teknik Servis Talepleri', 
                        data.map(item => `${item.sehir_adi} - ${item.yil}`), 
                        data.map(item => item.toplam_talep));
        });
}

// Satış Analizlerini Yükleme
function loadSalesAnalysis() {
    fetch('/api/annual-sales')
        .then(response => response.json())
        .then(data => {
            renderChart('salesChart', 'line', 'Yıllık Satış Verileri', 
                        data.map(item => item.yil), 
                        data.map(item => item.toplam_satis));
        });
}

// Kampanya Analizlerini Yükleme
function loadCampaignAnalysis() {
    fetch('/api/campaign-analysis')
        .then(response => response.json())
        .then(data => {
            renderChart('campaignChart', 'pie', 'Kampanya Planlama', 
                        data.map(item => item.donem_adi), 
                        data.map(item => item.toplam_satis));
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
