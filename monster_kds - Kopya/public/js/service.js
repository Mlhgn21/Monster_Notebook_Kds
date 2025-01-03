// Grafik verilerini çekip oluşturan genel fonksiyon
async function fetchData(url, canvasId, label, backgroundColor, borderColor = "") {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const labels = data.map(item => item.label || item.sehir_adi || item.ilce_adi);
        const values = data.map(item => item.value || item.toplam_talep);

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

// Şehir Bazlı Teknik Servis Talepleri (Chart.js)
fetchData(
    "/api/service/city-requests",
    "cityServiceChart",
    "Şehir Bazlı Teknik Servis Talepleri",
    "rgba(99, 132, 255, 0.6)"
);

// Yıllık Teknik Servis Talepleri (Chart.js)
fetchData(
    "/api/service/yearly-requests",
    "yearlyServiceChart",
    "Yıllık Teknik Servis Talepleri",
    "rgba(0, 255, 255, 0.3)",
    "rgba(0, 255, 255, 1)"
);

// Yeni Grafik 1: Şehirlerin Yıllık Teknik Servis Talepleri
const cityYearSelect = document.getElementById('cityYearSelect');
let cityYearChart = null;

async function loadCityYearlyData(year) {
    try {
        const response = await fetch(`/api/service/city-yearly-requests?year=${year}`);
        const data = await response.json();

        const labels = data.map(item => item.sehir_adi);
        const values = data.map(item => item.toplam_talep);

        // Eğer grafik varsa, önceki grafik silinsin
        if (cityYearChart) {
            cityYearChart.destroy();  // Önceki grafiği sil
        }

        // Yeni grafik oluşturuluyor
        cityYearChart = new Chart(document.getElementById("newChart1"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: `Yıllık Teknik Servis Talepleri - ${year}`,
                    data: values,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
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
        console.error("Şehirlerin yıllık talepleri verisi yüklenirken hata oluştu:", error);
    }
}

// İlk yükleme ve yıl seçimine göre veri güncelleme
loadCityYearlyData(cityYearSelect.value);

// Yıl seçildiğinde grafik güncellenmesi
cityYearSelect.addEventListener('change', () => {
    const selectedYear = cityYearSelect.value;
    loadCityYearlyData(selectedYear);
});

// Yeni Grafik 2: Şehir ve Yıl Seçimiyle İlçelerin Talepleri
const citySelect = document.getElementById('citySelect');
const districtYearSelect = document.getElementById('districtYearSelect');
let districtChart = null;

async function loadDistrictData(city, year) {
    try {
        const response = await fetch(`/api/service/district-requests?city=${city}&year=${year}`);
        const data = await response.json();

        const labels = data.map(item => item.ilce_adi);
        const values = data.map(item => item.toplam_talep);

        // Eğer grafik varsa, önceki grafiği silinsin
        if (districtChart) {
            districtChart.destroy();  // Önceki grafiği sil
        }

        // Yeni grafik oluşturuluyor
        districtChart = new Chart(document.getElementById("newChart2"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: `${city} - ${year} İlçelerinin Talepleri`,
                    data: values,
                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                    x: {
                        ticks: {
                            autoSkip: false,  // Etiketlerin kaydırılmasını engeller
                            maxRotation: 90,  // Etiketler fazla uzun olursa 90 derece döndürülsün
                            minRotation: 45,  // Etiketler çok kısa ise döndürülmesin
                        },
                    },
                },
            }
        });
    } catch (error) {
        console.error("İlçe talepleri verisi yüklenirken hata oluştu:", error);
    }
}

// İlk yükleme ve şehir-yıl seçimine göre veri güncelleme
loadDistrictData(citySelect.value, districtYearSelect.value);

// Şehir veya yıl seçildiğinde ilçelerin taleplerini güncelleme
citySelect.addEventListener('change', () => {
    const selectedCity = citySelect.value;
    const selectedYear = districtYearSelect.value;
    loadDistrictData(selectedCity, selectedYear);
});

districtYearSelect.addEventListener('change', () => {
    const selectedCity = citySelect.value;
    const selectedYear = districtYearSelect.value;
    loadDistrictData(selectedCity, selectedYear);
});

// Dönemsel Teknik Servis Talepleri Analizi (Çeyrek Bazında)
const periodCitySelect = document.getElementById('periodCitySelect');
const periodYearSelect = document.getElementById('periodYearSelect');
let periodChart = null;

async function loadPeriodData(city, year) {
    try {
        const response = await fetch(`/api/service/periodic-requests?city=${city}&year=${year}`);
        const data = await response.json();

        const labels = data.map(item => item.ceyrek); // Çeyrek bilgisi
        const values = data.map(item => item.toplam_talep);

        // Eğer grafik varsa, önceki grafik silinsin
        if (periodChart) {
            periodChart.destroy();  // Önceki grafiği sil
        }

        // Yeni grafik oluşturuluyor
        periodChart = new Chart(document.getElementById("periodChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: `${city} - ${year} Dönemsel Talepler`,
                    data: values,
                    backgroundColor: "rgba(255, 159, 64, 0.6)",
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
        console.error("Dönemsel talepler verisi yüklenirken hata oluştu:", error);
    }
}

// İlk yükleme ve dönemsel veriye göre veri güncelleme
loadPeriodData(periodCitySelect.value, periodYearSelect.value);

// Şehir ve yıl seçildiğinde dönemsel talepleri güncelleme
periodCitySelect.addEventListener('change', () => {
    const selectedCity = periodCitySelect.value;
    const selectedYear = periodYearSelect.value;
    loadPeriodData(selectedCity, selectedYear);
});

periodYearSelect.addEventListener('change', () => {
    const selectedCity = periodCitySelect.value;
    const selectedYear = periodYearSelect.value;
    loadPeriodData(selectedCity, selectedYear);
});
