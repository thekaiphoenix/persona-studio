console.log("Script loaded (Simple Version).");

// مستقیماً تلاش برای پیدا کردن دکمه با هر دو روش
const buttonById = document.getElementById('createButton');
const buttonByQuery = document.querySelector('#createButton');

// لاگ کردن نتیجه‌ی هر دو جستجو
console.log("Attempting to find button...");
console.log("Result via getElementById:", buttonById);
console.log("Result via querySelector:", buttonByQuery);

// بررسی نوع نتیجه querySelector (مهم‌ترین لاگ)
console.log("Type of querySelector result:", typeof buttonByQuery, buttonByQuery);

// انتخاب دکمه‌ای که پیدا شده (اگر پیدا شده باشد)
const createButton = buttonByQuery || buttonById; // اولویت با querySelector

if (createButton && typeof createButton === 'object' && createButton.tagName === 'BUTTON') {
    // فقط اگر واقعاً یک المان دکمه پیدا کردیم
    console.log("Button element confirmed. Adding event listener.");
    createButton.addEventListener('click', () => {
        console.log("Create button clicked.");

        // پیدا کردن بقیه المان‌ها فقط در زمان کلیک (برای اطمینان بیشتر)
        const artistNameInput = document.getElementById('artist-name');
        const artistStyleInput = document.getElementById('artist-style');
        const artistInspirationsInput = document.getElementById('artist-inspirations');
        const resultContainer = document.getElementById('result-container');

        if (!artistNameInput || !artistStyleInput || !artistInspirationsInput || !resultContainer) {
            console.error("Error: Could not find input/output elements during click.");
            if (resultContainer) resultContainer.innerHTML = `<p style="color: red;">Error finding form elements.</p>`;
            return; // متوقف کردن اجرا اگر المان‌ها پیدا نشدند
        }

        const dataToSend = {
            name: artistNameInput.value,
            style: artistStyleInput.value,
            inspirations: artistInspirationsInput.value
        };

        resultContainer.innerHTML = '<p>Creating magic... Please wait.</p>';
        console.log("Sending data:", dataToSend);

        fetch('https://phoenix-backend-rzd0.onrender.com/generate-persona', { /* ... */ })
            .then(response => { /* ... */ })
            .then(data => { /* ... */ })
            .catch((error) => { /* ... */ });
    });
} else {
    // اگر دکمه پیدا نشد یا از نوع درستی نبود
    console.error("CRITICAL ERROR: Button element not found or invalid.");
    const errorContainer = document.getElementById('result-container');
    if (errorContainer) {
        errorContainer.innerHTML = `<p style="color: red;">Critical Error: Could not initialize button. Type: ${typeof createButton}</p>`;
    }
}