// Grafik verilerini çekip oluşturan genel fonksiyon
async function fetchData(url, canvasId, label, backgroundColor, borderColor = "") {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const labels = data.map(item => item.label);
        const values = data.map(item => item.value);

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
                        fill: !!borderColor,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: true, position: "top" } },
                scales: {
                    y: { beginAtZero: true },
                    x: {},
                },
            },
        });
    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }
}

// Şehir Bazlı Satışlar
fetchData("/api/sales/city-sales", "citySalesChart", "Şehir Bazlı Satışlar", "rgba(0, 255, 0, 0.6)");

// Yıllık Satışlar
fetchData("/api/sales/yearly-sales", "yearlySalesChart", "Yıllık Satışlar", "rgba(0, 255, 0, 0.3)", "rgba(0, 255, 0, 1)");

let campaignSalesChart = null; // Kampanya satışları grafik değişkeni

// Kampanya Satışları (Chart.js)
const campaignSelect = document.getElementById("campaignSelect");
const campaignYearSelect = document.getElementById("campaignYearSelect");

// Kampanya verilerini çekme ve grafik güncelleme fonksiyonu
async function loadCampaignSalesData(campaign, year) {
    try {
        const response = await fetch(`/api/sales/campaign-sales?campaignName=${campaign}&year=${year}`);
        const data = await response.json();

        const labels = data.map(item => item.urun_adi); // Ürün adları
        const values = data.map(item => item.toplam_satis); // Satış adetleri

        // Eğer grafik varsa, önceki grafiği sil
        if (campaignSalesChart) {
            campaignSalesChart.destroy();
        }

        // Yeni grafik oluşturuluyor
        campaignSalesChart = new Chart(document.getElementById("campaignSalesChart"), {
            type: "bar", // Grafik tipi
            data: {
                labels: labels, // X eksenine ürün adları
                datasets: [{
                    label: `${campaign} - ${year}`,
                    data: values, // Y eksenine satış adetleri
                    backgroundColor: "rgba(255, 159, 64, 0.6)", // Bar rengi
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                    x: { ticks: { autoSkip: true } },
                }
            }
        });
    } catch (error) {
        console.error("Kampanya satışları verisi yüklenirken hata oluştu:", error);
    }
}

// Başlangıçta ilk kampanyayı yükleyelim
loadCampaignSalesData(campaignSelect.value, campaignYearSelect.value);

// Kampanya veya yıl değiştirildiğinde grafiği güncelle
campaignSelect.addEventListener("change", () => {
    const selectedCampaign = campaignSelect.value;
    const selectedYear = campaignYearSelect.value;
    loadCampaignSalesData(selectedCampaign, selectedYear);
});

campaignYearSelect.addEventListener("change", () => {
    const selectedCampaign = campaignSelect.value;
    const selectedYear = campaignYearSelect.value;
    loadCampaignSalesData(selectedCampaign, selectedYear);
});

// Yeni Grafik 1: Yıl Bazında Ürün Satışları
let productSalesChart = null; // Ürün satışları grafik değişkeni

async function loadProductSalesData(year) {
    try {
        const response = await fetch(`/api/sales/product-sales?year=${year}`);
        const data = await response.json();

        const labels = data.map(item => item.urun_adi); // Ürün adları
        const values = data.map(item => item.toplam_satis); // Satış adetleri

        // Eğer grafik varsa, önceki grafiği sil
        if (productSalesChart) {
            productSalesChart.destroy(); // Eski grafik silinir
        }

        // Yeni grafik oluşturuluyor
        productSalesChart = new Chart(document.getElementById("productSalesChart"), {
            type: "bar", // Grafik tipi
            data: {
                labels: labels, // X eksenine ürün adları
                datasets: [{
                    label: `Ürün Satışları - ${year}`,
                    data: values, // Y eksenine satış adetleri
                    backgroundColor: "rgba(153, 102, 255, 0.6)", // Bar rengi
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { 
                        beginAtZero: true, // Y ekseni sıfırdan başlar
                    },
                    x: { 
                        ticks: { 
                            autoSkip: false, // Etiketlerin kaydırılmasını engeller
                            maxRotation: 90,  // Etiketler fazla uzun olursa 90 derece döndürülsün
                            minRotation: 45,  // Etiketler çok kısa ise döndürülmesin
                        },
                    },
                },
            }
        });
    } catch (error) {
        console.error("Ürün satışları verisi yüklenirken hata oluştu:", error);
    }
}


// İlk yıl bazında ürün satışlarını yükleyelim
loadProductSalesData(2020);  // Varsayılan olarak 2020 yılı seçili

// Yıl seçildiğinde veri ve grafik güncelleniyor
const productYearSelect = document.getElementById("productYearSelect");
productYearSelect.addEventListener("change", () => {
    loadProductSalesData(productYearSelect.value); // Yıl değiştikçe veriyi güncelliyoruz
});

// Toplam satışlar verilerini yükleyecek fonksiyon
async function loadTotalSalesData(city, year, month) {
    try {
        const response = await fetch(`/api/sales/total-sales?city=${city}&year=${year}&month=${month}`);
        const data = await response.json();

        const labels = data.map(item => item.urun_adi); // Ürün isimlerini al
        const values = data.map(item => item.toplam_satis); // Satış adetlerini al

        // Eğer grafik varsa, önceki grafiği sil
        if (window.totalSalesChart instanceof Chart) {
            window.totalSalesChart.destroy(); // Grafik nesnesi varsa, eskiyi sil
        }

        // Yeni grafik oluşturuluyor
        window.totalSalesChart = new Chart(document.getElementById("totalSalesChart"), {
            type: "bar", // Grafik tipi
            data: {
                labels: labels, // X eksenine ürün isimleri
                datasets: [{
                    label: `${city} Şehri - ${year} Yılı - Ay: ${month}`,
                    data: values, // Y eksenine toplam satış adetleri
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        ticks: {
                            autoSkip: false,  // Etiketlerin kaydırılmasını engeller
                            maxRotation: 90,  // Etiketler fazla uzun olursa 90 derece döndürülsün
                            minRotation: 45,  // Etiketler çok kısa ise döndürülmesin
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error("Toplam satışlar verisi yüklenirken hata oluştu:", error);
    }
}


// Yıl, ay ve şehir seçildiğinde verileri güncelle
document.getElementById("loadTotalSalesButton").addEventListener("click", () => {
    const city = document.getElementById("totalSalesCitySelect").value;
    const year = document.getElementById("totalSalesYearSelect").value;
    const month = document.getElementById("totalSalesMonthSelect").value;
    loadTotalSalesData(city, year, month); // Veriyi yükleyip grafiği oluşturuyoruz
});



