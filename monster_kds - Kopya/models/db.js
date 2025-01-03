const mysql = require("mysql2");
const config = require("../config/config");

// MySQL Bağlantısı
const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Bağlantıyı test etme
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Veritabanına bağlanırken hata oluştu:", err.message);
    } else {
        console.log("Veritabanına başarıyla bağlandı!");
        connection.release(); // Bağlantıyı serbest bırak
    }
});

module.exports = pool.promise();
