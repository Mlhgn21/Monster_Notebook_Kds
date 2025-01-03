// Grafik verilerini çekip oluşturan genel fonksiyon
async function fetchData(url, canvasId, label, backgroundColor, borderColor = "") {
    const response = await fetch(url);
    const data = await response.json();
    const labels = data.map(item => item.yil || item.sehir_adi || item.urun_adi);
    const values = data.map(item => item.toplam_satis || item.toplam_talep);

    new Chart(document.getElementById(canvasId), {
        type: borderColor ? "line" : "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: values,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: borderColor ? 2 : 0,
                    fill: borderColor ? true : false,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: "top" },
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: "#ffffff" } },
                x: { ticks: { color: "#ffffff" } },
            },
        },
    });
}

// Anasayfa Grafik Verilerini Getiren Fonksiyonlar
function fetchServiceRequests() {
    fetchData("/api/service-requests", "serviceChart", "Teknik Servis Talepleri", "rgba(0, 255, 0, 0.6)");
}

function fetchAnnualSales() {
    fetchData("/api/annual-sales", "annualSalesChart", "Yıllık Satış Verileri", "rgba(0, 255, 0, 0.3)", "rgba(0, 255, 0, 1)");
}

function fetchTopProducts() {
    fetchData("/api/top-products", "topProductsChart", "En Çok Satılan Ürünler", "rgba(255, 99, 132, 0.6)");
}

function fetchLeastProducts() {
    fetchData("/api/least-sold-products", "leastProductsChart", "En Az Satılan Ürünler", "rgba(99, 132, 255, 0.6)");
}

// Satış Analizleri Grafik Verilerini Getiren Fonksiyonlar
function fetchCitySales() {
    fetchData("/api/city-sales", "citySalesChart", "Şehirler", "rgba(0, 255, 0, 0.6)");
}

function fetchYearlySales() {
    fetchData("/api/yearly-sales", "yearlySalesChart", "Yıllık Satışlar", "rgba(0, 255, 0, 0.3)", "rgba(0, 255, 0, 1)");
}

// Teknik Servis Analizleri Grafik Verilerini Getiren Fonksiyonlar
function fetchCityServiceRequests() {
    fetchData("/api/city-service-requests", "cityServiceChart", "Şehirler", "rgba(99, 132, 255, 0.6)");
}

function fetchYearlyServiceRequests() {
    fetchData("/api/yearly-service-requests", "yearlyServiceChart", "Yıllık Teknik Servis Talepleri", "rgba(0, 255, 255, 0.3)", "rgba(0, 255, 255, 1)");
}

// Sayfa Yüklendiğinde İlgili Sekmenin Grafiklerini Getir
document.addEventListener("DOMContentLoaded", () => {
    // Anasayfa için grafikler
    fetchServiceRequests();
    fetchAnnualSales();
    fetchTopProducts();
    fetchLeastProducts();

    // Satış ve Teknik Servis Grafiklerini de Yükle
    fetchCitySales();
    fetchYearlySales();
    fetchCityServiceRequests();
    fetchYearlyServiceRequests();
});

// Çıkış Yap Fonksiyonu
function logout() {
    alert("Çıkış yapılıyor...");
    window.location.href = "/";
}
