// Giriş işlemi
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // Giriş başarılı, yönlendir
            window.location.href = "/dashboard.html"; // Yönlendirme
        } else {
            // Hatalı giriş
            const errorMessage = await response.text();
            document.getElementById('error-message').textContent = errorMessage;
        }
    } catch (error) {
        console.error('Giriş işlemi sırasında hata oluştu:', error);
    }
});
