console.log("Script loaded (Selector Test Version).");

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded event fired.");

    setTimeout(() => {
        console.log("setTimeout callback executed.");

        // --- تغییر کلیدی: پیدا کردن *تمام* دکمه‌ها ---
        const allButtons = document.querySelectorAll('button');
        console.log("Found buttons:", allButtons); // ببینیم چه دکمه‌هایی پیدا می‌شوند

        // حالا سعی می‌کنیم دکمه‌ی خودمان را از بین آن‌ها با ID پیدا کنیم
        let createButton = null; // متغیر را اول null تعریف می‌کنیم
        allButtons.forEach(button => {
            console.log("Checking button with ID:", button.id); // ID هر دکمه را لاگ می‌گیریم
            if (button.id === 'createButton') {
                createButton = button; // اگر پیدا شد، آن را ذخیره می‌کنیم
            }
        });
        // --- پایان تغییر ---

        // بقیه المان‌ها را مثل قبل پیدا می‌کنیم
        const artistNameInput = document.getElementById('artist-name');
        const artistStyleInput = document.getElementById('artist-style');
        const artistInspirationsInput = document.getElementById('artist-inspirations');
        const resultContainer = document.getElementById('result-container');

        // لاگ وضعیت پیدا شدن (حالا createButton را چک می‌کنیم)
        console.log("Elements found (Button via querySelectorAll):", {
            artistNameInput: !!artistNameInput,
            artistStyleInput: !!artistStyleInput,
            artistInspirationsInput: !!artistInspirationsInput,
            createButton: !!createButton, // آیا این بار true می‌شود؟
            resultContainer: !!resultContainer
        });

        if (createButton && artistNameInput && artistStyleInput && artistInspirationsInput && resultContainer) {
            console.log("All elements found. Adding event listener.");
            createButton.addEventListener('click', () => {
                // ... کد ارسال fetch (بدون تغییر) ...
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
            console.error("CRITICAL ERROR: Essential elements null or button check failed.");
            if(resultContainer) {
                 resultContainer.innerHTML = `<p style="color: red;">Critical page initialization error. Button ID mismatch or element not found.</p>`;
            }
        }
    }, 0);
});