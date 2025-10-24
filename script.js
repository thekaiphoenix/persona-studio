// اطمینان از انتخاب صحیح المان‌ها
const artistNameInput = document.getElementById('artist-name');
const artistStyleInput = document.getElementById('artist-style');
const artistInspirationsInput = document.getElementById('artist-inspirations');
const createButton = document.getElementById('createButton'); // ID دکمه در create_persona.html
const resultContainer = document.getElementById('result-container');

// بررسی وجود المان‌ها قبل از افزودن Event Listener
if (createButton && artistNameInput && artistStyleInput && artistInspirationsInput && resultContainer) {
    createButton.addEventListener('click', () => {
        const dataToSend = {
            name: artistNameInput.value,
            style: artistStyleInput.value,
            inspirations: artistInspirationsInput.value
        };

        // نمایش پیام لودینگ
        resultContainer.innerHTML = '<p>Creating magic... Please wait.</p>';

        // استفاده از مسیر نسبی برای API endpoint
        fetch('/generate-persona', { // <<< آدرس API حالا فقط مسیر است
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // در آینده ممکن است نیاز به ارسال توکن CSRF یا احراز هویت باشد
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            // بررسی اولیه پاسخ سرور
            if (!response.ok) {
                // اگر پاسخ خطا بود (مثل 4xx, 5xx), سعی کن متن خطا را بخوانی
                return response.json().catch(() => {
                    // اگر پاسخ JSON نبود، یک خطای عمومی بساز
                    throw new Error(`HTTP error! status: ${response.status}`);
                }).then(errData => {
                    // اگر پاسخ JSON بود، متن خطا را از آن استخراج کن
                    throw new Error(errData.error || `HTTP error! status: ${response.status}`);
                });
            }
            // اگر پاسخ موفق بود، JSON را پارس کن
            return response.json();
        })
        .then(data => {
            // نمایش نتیجه از مغز AI
            if (data.error) {
                 resultContainer.innerHTML = `<p style="color: red;">Backend Error: ${data.error}</p>`;
            } else {
                // جایگزینی کاراکترهای خط جدید با <br> برای نمایش صحیح در HTML
                const formattedText = data.persona_text.replace(/\n/g, '<br>');
                resultContainer.innerHTML = `<p>${formattedText}</p>`;
            }
        })
        .catch((error) => {
            // نمایش خطای ارتباطی یا خطایی که در بالا throw شد
            console.error('Fetch Error:', error);
            resultContainer.innerHTML = `<p style="color: red;">Sorry, an error occurred communicating with the backend. (${error.message || 'Unknown fetch error'})</p>`;
        });
    });
} else {
    // اگر یکی از المان‌های اصلی پیدا نشد، یک خطا در کنسول ثبت کن
    console.error("Initialization failed: One or more essential elements not found on the page (createButton, inputs, resultContainer).");
}