console.log("Script loaded.");

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded event fired.");

    setTimeout(() => {
        console.log("setTimeout callback executed.");

        // <<< لاگ جدید: تمام HTML داخل body را چاپ کن >>>
        console.log("Current body innerHTML:", document.body.innerHTML);

        const artistNameInput = document.getElementById('artist-name');
        const artistStyleInput = document.getElementById('artist-style');
        const artistInspirationsInput = document.getElementById('artist-inspirations');
        const createButton = document.getElementById('createButton'); // تلاش برای پیدا کردن دکمه
        const resultContainer = document.getElementById('result-container');

        // لاگ قبلی برای بررسی مقادیر
        console.log("Elements found inside setTimeout:", {
            artistNameInput: !!artistNameInput,
            artistStyleInput: !!artistStyleInput,
            artistInspirationsInput: !!artistInspirationsInput,
            createButton: !!createButton, // اینجا همچنان false خواهد بود؟
            resultContainer: !!resultContainer
        });

        // بقیه‌ی کد بدون تغییر...
        if (createButton && artistNameInput && artistStyleInput && artistInspirationsInput && resultContainer) {
            console.log("All elements found. Adding event listener to button.");
            createButton.addEventListener('click', () => {
                // ... کد ارسال fetch ...
                 console.log("Create button clicked.");
                 const dataToSend = { /* ... */ };
                 resultContainer.innerHTML = '<p>Creating magic... Please wait.</p>';
                 console.log("Sending data:", dataToSend);
                 fetch('https://phoenix-backend-rzd0.onrender.com/generate-persona', { /* ... */ })
                     .then(response => { /* ... */ })
                     .then(data => { /* ... */ })
                     .catch((error) => { /* ... */ });
            });
        } else {
            console.error("Critical Error: One or more essential elements were null even after setTimeout.");
            if(resultContainer) {
                resultContainer.innerHTML = `<p style="color: red;">Page initialization error (elements not found after delay). Please try refreshing.</p>`;
            }
        }
    }, 0);
});