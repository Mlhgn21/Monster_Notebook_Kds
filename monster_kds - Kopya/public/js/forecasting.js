// Satış Tahminleme Fonksiyonu
async function predictSales() {
    const dolar = document.getElementById("dollarInput").value; // Kullanıcıdan dolar miktarını al
    if (!dolar) {
        alert("Lütfen dolar miktarını girin!");
        return;
    }

    try {
        const response = await fetch(`/api/sales/predict-2025-sales?dolar=${dolar}`);
        const data = await response.json();

        const labels = data.predictedSales.map(item => `Ay ${item.month}`);
        const predictedValues = data.predictedSales.map(item => item.predicted_sales);
        const actualValues2024 = data.actualSales2024.map(item => item.toplam_satis);

        // Eğer önceki grafik varsa, onu yok et
        if (window.salesPredictionChart && window.salesPredictionChart.destroy) {
            window.salesPredictionChart.destroy();  // Önceki grafik yok ediliyor
        }

        // Yeni grafik oluşturuluyor
        window.salesPredictionChart = new Chart(document.getElementById("forecastSalesChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `2025 Tahmin Edilen Satışlar`,
                        data: predictedValues,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 2,
                    },
                    {
                        label: `2024 Gerçek Satışlar`,
                        data: actualValues2024,
                        backgroundColor: "rgba(255, 159, 64, 0.6)",
                        borderColor: "rgba(255, 159, 64, 1)",
                        borderWidth: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
            }
        });
    } catch (error) {
        console.error("Satış Tahminleme verisi yüklenirken hata oluştu:", error);
    }
}

// Teknik Servis Tahminleme Fonksiyonu
async function predictServiceRequests() {
    const cityId = document.getElementById("citySelect").value; // Kullanıcıdan şehir ID'sini al

    if (!cityId) {
        alert("Lütfen bir şehir seçin!");
        return;
    }

    try {
        const response = await fetch(`/api/service/predict-all-city-requests?cityId=${cityId}`);
        const data = await response.json();

        const labels = data.map(item => item.sehir);
        const predictedRequests2025 = data.map(item => item.predictedRequests2025);
        const actualRequests2024 = data.map(item => item.actualRequests2024);

        // Eğer önceki grafik varsa, onu yok et
        if (window.forecastServiceChart && window.forecastServiceChart.destroy) {
            window.forecastServiceChart.destroy();  // Önceki grafik yok ediliyor
        }

        // Yeni grafik oluşturuluyor
        window.forecastServiceChart = new Chart(document.getElementById("forecastServiceChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `2025 Tahmin Edilen Talepler`,
                        data: predictedRequests2025,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 2,
                    },
                    {
                        label: `2024 Gerçek Talepler`,
                        data: actualRequests2024,
                        backgroundColor: "rgba(255, 159, 64, 0.6)",
                        borderColor: "rgba(255, 159, 64, 1)",
                        borderWidth: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
            }
        });
    } catch (error) {
        console.error("Teknik Servis Tahminleme verisi yüklenirken hata oluştu:", error);
    }
}



// Butonlara tıklanarak tahminlemeyi başlat
document.getElementById("predictSalesButton").addEventListener("click", predictSales);
document.getElementById("predictServiceButton").addEventListener("click", predictServiceRequests);
