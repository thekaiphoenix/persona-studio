console.log("Script loaded."); // لاگ اولیه: آیا اسکریپت اصلاً بارگذاری می‌شود؟

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded event fired."); // لاگ دوم: آیا این رویداد اجرا می‌شود؟

    const artistNameInput = document.getElementById('artist-name');
    const artistStyleInput = document.getElementById('artist-style');
    const artistInspirationsInput = document.getElementById('artist-inspirations');
    const createButton = document.getElementById('createButton');
    const resultContainer = document.getElementById('result-container');

    // لاگ سوم: آیا المان‌ها پیدا شده‌اند؟ (true یا false برمی‌گرداند)
    console.log("Elements found:", {
        artistNameInput: !!artistNameInput, // !! مقدار را به بولین تبدیل می‌کند
        artistStyleInput: !!artistStyleInput,
        artistInspirationsInput: !!artistInspirationsInput,
        createButton: !!createButton,
        resultContainer: !!resultContainer
    });

    if (createButton && artistNameInput && artistStyleInput && artistInspirationsInput && resultContainer) {
        console.log("All elements found. Adding event listener to button."); // لاگ چهارم
        createButton.addEventListener('click', () => {
            console.log("Create button clicked."); // لاگ پنجم: آیا کلیک ثبت می‌شود؟
            const dataToSend = {
                name: artistNameInput.value,
                style: artistStyleInput.value,
                inspirations: artistInspirationsInput.value
            };

            resultContainer.innerHTML = '<p>Creating magic... Please wait.</p>';
            console.log("Sending data:", dataToSend); // لاگ ششم

            fetch('https://phoenix-backend-rzd0.onrender.com/generate-persona', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(dataToSend),
            })
            .then(response => {
                console.log("Received response status:", response.status); // لاگ هفتم
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
                console.log("Received data:", data); // لاگ هشتم
                if (data.error) {
                     resultContainer.innerHTML = `<p style="color: red;">Backend Error: ${data.error}</p>`;
                } else {
                    const formattedText = data.persona_text.replace(/\n/g, '<br>');
                    resultContainer.innerHTML = `<p>${formattedText}</p>`;
                }
            })
            .catch((error) => {
                console.error('Fetch Error:', error); // لاگ نهم (در صورت خطا)
                resultContainer.innerHTML = `<p style="color: red;">Sorry, a communication error occurred. (${error.message || 'Unknown fetch error'})</p>`;
            });
        });

    } else {
        // این خطا همچنان ممکن است رخ دهد اگر یکی از المان‌ها null باشد
        console.error("Critical Error: One or more essential elements were null even after DOMContentLoaded.");
        if(resultContainer) {
            resultContainer.innerHTML = `<p style="color: red;">Page initialization error (elements not found). Please try refreshing.</p>`;
        }
    }
});