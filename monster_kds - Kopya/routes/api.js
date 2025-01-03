const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Teknik Servis Talepleri
router.get("/service-requests", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT sb.sehir_adi, SUM(tst.talep_adeti) AS toplam_talep
            FROM teknik_servis_talepleri tst
            JOIN ilce_bilgileri ib ON tst.ilce_id = ib.ilce_id
            JOIN sehir_bilgileri sb ON ib.sehir_id = sb.sehir_id
            GROUP BY sb.sehir_adi
            ORDER BY toplam_talep DESC;
        `);
        res.json(rows);
    } catch (error) {
        console.error("Teknik servis verisi hatası:", error);
        res.status(500).json({ error: "Teknik servis verisi çekilemedi." });
    }
});

// Yıllık Satış Verileri
router.get("/annual-sales", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT YEAR(sv.satis_tarihi) AS yil, SUM(sv.satis_adeti) AS toplam_satis
            FROM satis_verileri sv
            GROUP BY yil
            ORDER BY yil;
        `);
        res.json(rows);
    } catch (error) {
        console.error("Yıllık satış verisi hatası:", error);
        res.status(500).json({ error: "Yıllık satış verisi çekilemedi." });
    }
});

// En Çok Satılan Ürünler
router.get("/top-products", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ub.urun_adi, SUM(sv.satis_adeti) AS toplam_satis
            FROM urun_bilgileri ub
            JOIN satis_verileri sv ON ub.urun_id = sv.urun_id
            GROUP BY ub.urun_adi
            ORDER BY toplam_satis DESC
            LIMIT 5;
        `);
        res.json(rows);
    } catch (error) {
        console.error("Top ürün verisi hatası:", error);
        res.status(500).json({ error: "En çok satılan ürün verisi çekilemedi." });
    }
});

// En Az Satılan Ürünler
router.get("/least-sold-products", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ub.urun_adi, SUM(sv.satis_adeti) AS toplam_satis
            FROM urun_bilgileri ub
            JOIN satis_verileri sv ON ub.urun_id = sv.urun_id
            GROUP BY ub.urun_adi
            ORDER BY toplam_satis ASC
            LIMIT 5;
        `);
        res.json(rows);
    } catch (error) {
        console.error("En az satılan ürün verisi hatası:", error);
        res.status(500).json({ error: "En az satılan ürün verisi çekilemedi." });
    }
});

// Şehir Bazlı Satışlar
router.get("/sales/city-sales", async (req, res) => {
    try {
        const query = `
            SELECT sb.sehir_adi AS label, SUM(sv.satis_adeti) AS value
            FROM satis_verileri sv
            JOIN sehir_bilgileri sb ON sv.sehir_id = sb.sehir_id
            GROUP BY sb.sehir_adi
            ORDER BY value DESC;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Şehir Bazlı Satışlar hatası:", error);
        res.status(500).json({ error: "Şehir Bazlı Satışlar verisi çekilemedi." });
    }
});

// Yıllık Satışlar
router.get("/sales/yearly-sales", async (req, res) => {
    try {
        const query = `
            SELECT YEAR(sv.satis_tarihi) AS label, SUM(sv.satis_adeti) AS value
            FROM satis_verileri sv
            GROUP BY label
            ORDER BY label;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Yıllık Satışlar hatası:", error);
        res.status(500).json({ error: "Yıllık Satışlar verisi çekilemedi." });
    }
});

// Şehir Bazlı Teknik Servis Talepleri
router.get("/service/city-requests", async (req, res) => {
    try {
        const query = `
            SELECT sb.sehir_adi AS label, COUNT(tst.talep_adeti) AS value
            FROM teknik_servis_talepleri tst
            JOIN ilce_bilgileri ib ON tst.ilce_id = ib.ilce_id
            JOIN sehir_bilgileri sb ON ib.sehir_id = sb.sehir_id
            GROUP BY sb.sehir_adi
            ORDER BY value DESC;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Şehir Bazlı Teknik Servis Talepleri hatası:", error);
        res.status(500).json({ error: "Şehir Bazlı Teknik Servis Talepleri verisi çekilemedi." });
    }
});

// Yıllık Teknik Servis Talepleri
router.get("/service/yearly-requests", async (req, res) => {
    try {
        const query = `
            SELECT YEAR(tst.talep_tarihi) AS label, SUM(tst.talep_adeti) AS value
            FROM teknik_servis_talepleri tst
            GROUP BY label
            ORDER BY label;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Yıllık Teknik Servis Talepleri hatası:", error);
        res.status(500).json({ error: "Yıllık Teknik Servis Talepleri verisi çekilemedi." });
    }
});

// Ege Bölgesi Teknik Servis Talepleri
router.get("/ege-region/service-requests", async (req, res) => {
    try {
        const query = `
            SELECT 
                sb.sehir_adi AS sehir, 
                YEAR(tst.talep_tarihi) AS yil, 
                SUM(tst.talep_adeti) AS toplam_talep
            FROM teknik_servis_talepleri tst
            JOIN ilce_bilgileri ib ON tst.ilce_id = ib.ilce_id
            JOIN sehir_bilgileri sb ON ib.sehir_id = sb.sehir_id
            GROUP BY sehir, yil
            ORDER BY yil, toplam_talep DESC;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Ege Bölgesi Teknik Servis Talepleri Hatası:", error);
        res.status(500).json({ error: "Veri çekilemedi." });
    }
});

// Yeni Grafik 1: Şehirlerin Yıllık Teknik Servis Talepleri
router.get("/service/city-yearly-requests", async (req, res) => {
    const year = req.query.year;

    try {
        const [rows] = await db.query(`
            SELECT 
                sb.sehir_adi, 
                YEAR(tst.talep_tarihi) AS yil, 
                SUM(tst.talep_adeti) AS toplam_talep
            FROM 
                teknik_servis_talepleri tst
            JOIN 
                ilce_bilgileri ib ON tst.ilce_id = ib.ilce_id
            JOIN 
                sehir_bilgileri sb ON ib.sehir_id = sb.sehir_id
            WHERE 
                YEAR(tst.talep_tarihi) = ?
            GROUP BY 
                sb.sehir_adi, YEAR(tst.talep_tarihi)
            ORDER BY 
                yil DESC, toplam_talep DESC;
        `, [year]);

        res.json(rows);
    } catch (error) {
        console.error("Şehirlerin yıllık talepleri verisi yüklenirken hata oluştu:", error);
        res.status(500).json({ error: "Veri çekilemedi." });
    }
});

// Yeni Grafik 2: Şehir ve Yıl Seçimiyle İlçelerin Talepleri
router.get("/service/district-requests", async (req, res) => {
    const city = req.query.city; // Şehir
    const year = req.query.year; // Yıl

    let query = `
        SELECT 
            ib.ilce_adi, 
            SUM(tst.talep_adeti) AS toplam_talep
        FROM 
            teknik_servis_talepleri tst
        JOIN 
            ilce_bilgileri ib ON tst.ilce_id = ib.ilce_id
        JOIN 
            sehir_bilgileri sb ON ib.sehir_id = sb.sehir_id
    `;

    // Eğer şehir seçildiyse, şehir koşulunu ekle
    if (city) {
        query += ` WHERE sb.sehir_adi = ?`;
    }

    // Eğer yıl seçildiyse, yıl koşulunu ekle
    if (year) {
        query += city ? ` AND YEAR(tst.talep_tarihi) = ?` : ` WHERE YEAR(tst.talep_tarihi) = ?`;
    }

    query += ` GROUP BY ib.ilce_adi ORDER BY toplam_talep DESC`;

    try {
        const [rows] = await db.query(query, [city, year].filter(val => val !== undefined));
        res.json(rows);
    } catch (error) {
        console.error("İlçe talepleri verisi yüklenirken hata oluştu:", error);
        res.status(500).json({ error: "Veri çekilemedi." });
    }
});
// Dönemsel Teknik Servis Talepleri (Şehir ve Yıl Seçimine Göre)
router.get("/service/periodic-requests", async (req, res) => {
    const { city, year } = req.query;

    try {
        const query = `
            SELECT 
                sb.sehir_adi, 
                CASE 
                    WHEN MONTH(tst.talep_tarihi) IN (1, 2, 3) THEN 'Q1'
                    WHEN MONTH(tst.talep_tarihi) IN (4, 5, 6) THEN 'Q2'
                    WHEN MONTH(tst.talep_tarihi) IN (7, 8, 9) THEN 'Q3'
                    WHEN MONTH(tst.talep_tarihi) IN (10, 11, 12) THEN 'Q4'
                END AS ceyrek,
                SUM(tst.talep_adeti) AS toplam_talep
            FROM 
                teknik_servis_talepleri tst
            JOIN 
                ilce_bilgileri ib ON tst.ilce_id = ib.ilce_id
            JOIN 
                sehir_bilgileri sb ON ib.sehir_id = sb.sehir_id
            WHERE 
                sb.sehir_adi = ? AND YEAR(tst.talep_tarihi) = ?
            GROUP BY 
                ceyrek
            ORDER BY 
                FIELD(ceyrek, 'Q1', 'Q2', 'Q3', 'Q4');
        `;
        const [rows] = await db.query(query, [city, year]);
        res.json(rows);
    } catch (error) {
        console.error("Dönemsel analiz verisi yüklenirken hata oluştu:", error);
        res.status(500).json({ error: "Veri çekilemedi." });
    }
});

router.get("/sales/campaign-sales", async (req, res) => {
    const { campaignName, year } = req.query; // Kampanya adı ve yıl alınıyor

    try {
        const query = `
            SELECT 
                urun_bilgileri.urun_adi,
                SUM(satis_verileri.satis_adeti) AS toplam_satis
            FROM 
                kampanya_onerileri
            JOIN 
                urun_bilgileri ON kampanya_onerileri.urun_id = urun_bilgileri.urun_id
            JOIN 
                satis_verileri ON urun_bilgileri.urun_id = satis_verileri.urun_id
            WHERE 
                kampanya_onerileri.kampanya_adi = ? 
                AND YEAR(satis_verileri.satis_tarihi) = ?
                AND (
                    (MONTH(satis_verileri.satis_tarihi) = 1 AND DAY(satis_verileri.satis_tarihi) = 31) -- 31 Ocak
                    OR
                    (MONTH(satis_verileri.satis_tarihi) = 6 AND DAY(satis_verileri.satis_tarihi) = 30) -- 30 Haziran
                )
            GROUP BY 
                urun_bilgileri.urun_adi
            ORDER BY 
                toplam_satis DESC;
        `;
        
        const [rows] = await db.query(query, [campaignName, year]); // Parametrelerle sorgu yapılır
        res.json(rows); // Sonuç döndürülür
    } catch (error) {
        console.error("Kampanya satışları verisi yüklenirken hata oluştu:", error);
        res.status(500).json({ error: "Veri çekilemedi." });
    }
});

// Yıl Bazında Ürün Satışları
router.get("/sales/product-sales", async (req, res) => {
    const year = req.query.year;
    try {
        const [rows] = await db.query(`
            SELECT 
                ub.urun_adi, 
                SUM(sv.satis_adeti) AS toplam_satis
            FROM urun_bilgileri ub
            JOIN satis_verileri sv ON ub.urun_id = sv.urun_id
            WHERE YEAR(sv.satis_tarihi) = ?
            GROUP BY ub.urun_adi
            ORDER BY toplam_satis DESC;
        `, [year]);

        res.json(rows);
    } catch (error) {
        console.error("Ürün satış verisi hatası:", error);
        res.status(500).json({ error: "Ürün satış verisi çekilemedi." });
    }
});

// 2025 Yılı Satış Tahminleme API'si
router.get("/sales/predict-2025-sales", async (req, res) => {
    const { dolar } = req.query; // Kullanıcıdan alınan dolar miktarı

    try {
        // 2024 yılı verilerini alıyoruz
        const query = `
            SELECT 
                SUM(sv.satis_adeti) AS toplam_satis,
                MONTH(sv.satis_tarihi) AS month
            FROM satis_verileri sv
            WHERE YEAR(sv.satis_tarihi) = 2024
            GROUP BY MONTH(sv.satis_tarihi)
        `;
        const [rows] = await db.query(query);

        // Dolar miktarına göre tahminleme hesaplama
        let predictedSales = rows.map((row) => {
            let salesDropFactor = 1;
            if (dolar <= 40) {
                salesDropFactor = 1 + (dolar / 1000) * 0.05; // Dolar arttıkça satışlar artacak
            } else {
                salesDropFactor = 1 - ((dolar - 40) / 1000) * 0.05; // Dolar 40'tan sonra satışlar azalmaya başlayacak
            }

            return {
                month: row.month,
                predicted_sales: row.toplam_satis * salesDropFactor
            };
        });

        res.json({ predictedSales, actualSales2024: rows }); // Tahmin edilen satış verisi ve 2024 satış verisi
    } catch (error) {
        console.error("Tahminleme verisi yüklenirken hata oluştu:", error);
        res.status(500).json({ error: "Veri çekilemedi." });
    }
});

// Teknik Servis Tahminleme API'si
router.get("/service/predict-all-city-requests", async (req, res) => {
    const { cityId } = req.query; // Kullanıcıdan alınan şehir ID'si

    try {
        // 2024 yılı teknik servis taleplerini çekiyoruz
        const query2024 = `
            SELECT sb.sehir_adi, SUM(tst.talep_adeti) AS toplam_talep_2024
            FROM teknik_servis_talepleri tst
            JOIN ilce_bilgileri ib ON tst.ilce_id = ib.ilce_id
            JOIN sehir_bilgileri sb ON ib.sehir_id = sb.sehir_id
            WHERE YEAR(tst.talep_tarihi) = 2024
            GROUP BY sb.sehir_adi;
        `;
        const [rows2024] = await db.query(query2024);

        // Şehir bazında azalma oranları
        const reductionFactor = 0.10;  // Seçilen şehirde %10 azalma
        const otherCityReductionFactor = 0.03; // Diğer şehirlerde %3 azalma

        // Şehirlerin güncellenmiş taleplerini hesaplıyoruz
        const result = rows2024.map(row => {
            let predictedRequests2025 = row.toplam_talep_2024;

            // Seçilen şehirde azalma
            if (row.sehir_adi === cityId) {
                predictedRequests2025 = row.toplam_talep_2024 * (1 - reductionFactor); // %10 azalma
            } else {
                // Diğer şehirlerde azalma
                predictedRequests2025 = row.toplam_talep_2024 * (1 - otherCityReductionFactor); // %3 azalma
            }

            return {
                sehir: row.sehir_adi,
                actualRequests2024: row.toplam_talep_2024,
                predictedRequests2025: Math.round(predictedRequests2025), // Yuvarlama işlemi
            };
        });

        res.json(result); // 2024 verisi ve 2025 tahmin edilen veriyi döndürüyoruz
    } catch (error) {
        console.error("Teknik servis tahminleme verisi yüklenirken hata oluştu:", error);
        res.status(500).json({ error: "Veri çekilemedi." });
    }
});


// Toplam satış verilerini almak için
router.get("/sales/total-sales", async (req, res) => {
    const { city, year, month } = req.query; // Yıl, ay ve şehir alınır

    try {
        // Şehir, yıl ve ay bilgilerine göre toplam satış verisini çekiyoruz
        const query = `
            SELECT ub.urun_adi, SUM(sv.satis_adeti) AS toplam_satis
            FROM satis_verileri sv
            JOIN sehir_bilgileri sb ON sv.sehir_id = sb.sehir_id
            JOIN urun_bilgileri ub ON sv.urun_id = ub.urun_id
            WHERE sb.sehir_adi = ? AND YEAR(sv.satis_tarihi) = ? AND MONTH(sv.satis_tarihi) = ?
            GROUP BY ub.urun_adi
        `;
        const [rows] = await db.query(query, [city, year, month]);

        res.json(rows);
    } catch (error) {
        console.error("Toplam satışlar verisi hatası:", error);
        res.status(500).json({ error: "Veri çekilemedi." });
    }
});






module.exports = router;

