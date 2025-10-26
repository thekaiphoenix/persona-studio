console.log("Script loaded (Final Attempt Version).");

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded event fired.");

    // <<< افزایش تأخیر >>>
    setTimeout(() => {
        console.log("setTimeout(100ms) callback executed.");

        // --- تغییر کلیدی: یافتن دکمه بر اساس محتوا ---
        let createButton = null;
        const buttons = document.querySelectorAll('button'); // همه دکمه‌ها را بگیر
        console.log("Found buttons NodeList:", buttons);

        buttons.forEach(button => {
            // متن داخل دکمه را بررسی کن (با حذف فضاهای خالی احتمالی)
            const buttonText = button.textContent.trim();
            console.log("Checking button with text:", `"${buttonText}"`); // متن را لاگ کن
            if (buttonText === "Create My Persona") {
                createButton = button; // اگر متن مطابقت داشت، دکمه را پیدا کردیم
                console.log("!!! Button Found via textContent !!!", createButton);
            }
        });
        // --- پایان تغییر ---

        // بقیه المان‌ها را مثل قبل پیدا می‌کنیم
        const artistNameInput = document.getElementById('artist-name');
        const artistStyleInput = document.getElementById('artist-style');
        const artistInspInput = document.getElementById('artist-inspirations'); // ID درست
        const resultContainer = document.getElementById('result-container');

        // لاگ وضعیت پیدا شدن (createButton را چک می‌کنیم)
        console.log("Elements found (Button via text):", {
            artistNameInput: !!artistNameInput,
            artistStyleInput: !!artistStyleInput,
            artistInspInput: !!artistInspInput, // اسم متغیر آپدیت شد
            createButton: !!createButton, // آیا این بار true می‌شود؟
            resultContainer: !!resultContainer
        });

        // --- اشتباه تایپی اصلاح شد: artistInspirationsInput ---
        if (createButton && artistNameInput && artistStyleInput && artistInspInput && resultContainer) {
            console.log("All essential elements verified. Adding event listener.");
            createButton.addEventListener('click', () => {
                console.log("Create button clicked.");
                // اطمینان از خواندن مقادیر درست در لحظه کلیک
                const nameVal = document.getElementById('artist-name').value;
                const styleVal = document.getElementById('artist-style').value;
                const inspVal = document.getElementById('artist-inspirations').value; // ID درست

                const dataToSend = { name: nameVal, style: styleVal, inspirations: inspVal };

                resultContainer.innerHTML = '<p>Creating magic... Please wait.</p>';
                console.log("Sending data:", dataToSend);

                fetch('https://phoenix-backend-rzd0.onrender.com/generate-persona', { /* ... */ })
                 .then(response => { /* ... */ })
                 .then(data => { /* ... */ })
                 .catch((error) => { /* ... */ });

            });
        } else {
            console.error("CRITICAL ERROR: Failed to find essential elements even with text search and delay.");
            if(resultContainer) {
                 resultContainer.innerHTML = `<p style="color: red;">Critical page initialization error. Button/elements check failed.</p>`;
            }
        }
        // <<< افزایش تأخیر >>>
    }, 100); // تأخیر ۱۰۰ میلی‌ثانیه
});

// --- اطمینان از نبود کد اضافی در انتها ---