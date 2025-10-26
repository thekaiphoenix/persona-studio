// صبر کن تا تمام ساختار HTML صفحه به طور کامل بارگذاری شود
document.addEventListener('DOMContentLoaded', (event) => {

    // حالا که مطمئنیم HTML آماده است، المان‌ها را پیدا می‌کنیم
    const artistNameInput = document.getElementById('artist-name');
    const artistStyleInput = document.getElementById('artist-style');
    const artistInspirationsInput = document.getElementById('artist-inspirations');
    const createButton = document.getElementById('createButton');
    const resultContainer = document.getElementById('result-container');

    // بررسی دوباره وجود المان‌ها (برای اطمینان بیشتر)
    if (createButton && artistNameInput && artistStyleInput && artistInspirationsInput && resultContainer) {

        // فقط اگر همه چیز پیدا شد، به دکمه گوش بده
        createButton.addEventListener('click', () => {
            const dataToSend = {
                name: artistNameInput.value,
                style: artistStyleInput.value,
                inspirations: artistInspirationsInput.value
            };

            resultContainer.innerHTML = '<p>Creating magic... Please wait.</p>';

            // ارسال درخواست به بک‌اند Render
            fetch('https://phoenix-backend-rzd0.onrender.com/generate-persona', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().catch(() => {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }).then(errData => {
                        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                     resultContainer.innerHTML = `<p style="color: red;">Backend Error: ${data.error}</p>`;
                } else {
                    const formattedText = data.persona_text.replace(/\n/g, '<br>');
                    resultContainer.innerHTML = `<p>${formattedText}</p>`;
                }
            })
            .catch((error) => {
                console.error('Fetch Error:', error);
                resultContainer.innerHTML = `<p style="color: red;">Sorry, an communication error occurred. (${error.message || 'Unknown fetch error'})</p>`;
            });
        });

    } else {
        // اگر حتی بعد از DOMContentLoaded هم المان‌ها پیدا نشدند، خطا بده
        console.error("Critical Error: Essential elements not found even after DOMContentLoaded.");
        // می‌توانید یک پیام خطا به کاربر هم نشان دهید
        if(resultContainer) {
            resultContainer.innerHTML = `<p style="color: red;">Page initialization error. Please try refreshing.</p>`;
        }
    }

}); // <<< پایان event listener برای DOMContentLoaded