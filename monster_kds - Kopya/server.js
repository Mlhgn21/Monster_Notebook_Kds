const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // JSON verisi almak için
app.use("/api", apiRoutes);

// MySQL Bağlantısı
const db = mysql.createConnection({
    host: "localhost",
    user: "root",         // MySQL kullanıcı adı
    password: "",         // MySQL şifresi (boşsa "")
    database: "monster_kds"
});

db.connect((err) => {
    if (err) {
        console.error("Veritabanına bağlanırken hata oluştu:", err.message);
    } else {
        console.log("Veritabanına başarıyla bağlandı!");
    }
});

// Giriş Kontrolü
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Örnek kullanıcı kontrolü (admin bilgileri sabit)
    if (email === "admin@gmail.com" && password === "admin") {
        // Giriş başarılı, dashboard'a yönlendir
        res.redirect("/dashboard.html");
    } else {
        // Hatalı giriş, hata mesajı göster
        res.status(401).send("Hatalı giriş! Lütfen tekrar deneyin.");
    }
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
