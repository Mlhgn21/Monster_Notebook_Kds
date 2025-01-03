module.exports = (db) => {
    const express = require("express");
    const router = express.Router();

    // Ege Bölgesi'ndeki Şehirlerin Teknik Servis Talepleri
    router.get("/service-analysis", async (req, res) => {
        const egeSehirleri = [
            'Izmir', 'Aydin', 'Manisa', 'Denizli', 'Mugla', 'Usak', 'Kutahya', 'Afyon'
        ];

        try {
            // Ege Bölgesi'ndeki illere ait teknik servis taleplerini çekiyoruz
            const [rows] = await db.query(`
                SELECT sb.sehir_adi, YEAR(tst.talep_tarihi) AS yil, SUM(tst.talep_adeti) AS toplam_talep
                FROM teknik_servis_talepleri tst
                JOIN ilce_bilgileri ib ON tst.ilce_id = ib.ilce_id
                JOIN sehir_bilgileri sb ON ib.sehir_id = sb.sehir_id
                WHERE sb.sehir_adi IN (?) 
                GROUP BY sb.sehir_adi, yil
                ORDER BY sb.sehir_adi, yil;
            `, [egeSehirleri]);

            res.json(rows);
        } catch (error) {
            console.error("Teknik servis analiz hatası:", error);
            res.status(500).json({ error: "Teknik servis analiz verisi çekilemedi." });
        }
    });

    return router;
};
