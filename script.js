console.log("Script loaded (Final Verified Version).");

// --- اجرای کد پس از بارگذاری کامل HTML ---
// (قرار دادن اسکریپت در انتهای body بهترین روش است)

// --- پیدا کردن المان‌ها ---
const artistNameInput = document.getElementById('artist-name');
const artistStyleInput = document.getElementById('artist-style');
const artistInspirationsInput = document.getElementById('artist-inspirations');
const resultContainer = document.getElementById('result-container');

// --- پیدا کردن دکمه با روش مطمئن‌تر (بر اساس متن) ---
let createButton = null;
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    if (button.textContent.trim() === "Create My Persona") {
        createButton = button;
    }
});

// --- لاگ برای بررسی ---
console.log("Elements found (Final Check):", {
    artistNameInput: !!artistNameInput,
    artistStyleInput: !!artistStyleInput,
    artistInspirationsInput: !!artistInspirationsInput,
    createButton: !!createButton,
    resultContainer: !!resultContainer
});

// --- افزودن Event Listener فقط در صورت یافتن تمام المان‌ها ---
if (createButton && artistNameInput && artistStyleInput && artistInspirationsInput && resultContainer) {
    console.log("All essential elements verified. Adding event listener.");
    createButton.addEventListener('click', () => {
        console.log("Create button clicked.");

        // خواندن مقادیر در لحظه کلیک
        const nameVal = artistNameInput.value;
        const styleVal = artistStyleInput.value;
        const inspVal = artistInspirationsInput.value;

        const dataToSend = { name: nameVal, style: styleVal, inspirations: inspVal };

        resultContainer.innerHTML = '<p>Creating magic... Please wait.</p>';
        console.log("Sending data:", dataToSend);

        // --- ارسال درخواست به بک‌اند با متد POST ---
        fetch('https://phoenix-backend-rzd0.onrender.com/generate-persona', {
            method: 'POST', // <<< تأکید بر متد POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            console.log("Received response status:", response.status);
            if (!response.ok) {
                // تلاش برای خواندن پیام خطا از سرور در صورت عدم موفقیت
                return response.json().catch(() => {
                    // اگر پاسخ JSON نبود یا خطای دیگری رخ داد
                    throw new Error(`HTTP error! status: ${response.status}`);
                }).then(errData => {
                    // پرتاب خطا با پیام سرور (اگر وجود داشت)
                    throw new Error(errData.error || `HTTP error! status: ${response.status}`);
                });
            }
            // اگر پاسخ موفق بود، JSON را برگردان
            return response.json();
        })
        .then(data => {
            console.log("Received data:", data);
            if (data.error) {
                 // نمایش خطای دریافتی از بک‌اند
                 resultContainer.innerHTML = `<p style="color: red;">Backend Error: ${data.error}</p>`;
            } else {
                // نمایش نتیجه موفق
                const formattedText = data.persona_text.replace(/\n/g, '<br>');
                resultContainer.innerHTML = `<p>${formattedText}</p>`;
            }
        })
        .catch((error) => {
            // نمایش خطاهای ارتباطی یا خطاهای پرتاب شده در بالا
            console.error('Fetch Error:', error);
            resultContainer.innerHTML = `<p style="color: red;">Sorry, a communication error occurred. (${error.message || 'Unknown fetch error'})</p>`;
        });
    });

} else {
    // نمایش خطا اگر المان‌های ضروری پیدا نشدند
    console.error("CRITICAL ERROR: Failed to find essential elements for initialization.");
    if(resultContainer) {
         resultContainer.innerHTML = `<p style="color: red;">Critical page initialization error. Essential elements not found.</p>`;
    }
}