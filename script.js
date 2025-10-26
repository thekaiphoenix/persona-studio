console.log("Script loaded.");

// --- تغییر کلیدی: استفاده از querySelector برای دکمه ---
const artistNameInput = document.getElementById('artist-name');
const artistStyleInput = document.getElementById('artist-style');
const artistInspirationsInput = document.getElementById('artist-inspirations');
// به جای getElementById از querySelector با سلکتور ID (#) استفاده می‌کنیم
const createButton = document.querySelector('#createButton');
const resultContainer = document.getElementById('result-container');
// --- پایان تغییر ---

console.log("Elements found (using querySelector for button):", {
    artistNameInput: !!artistNameInput,
    artistStyleInput: !!artistStyleInput,
    artistInspirationsInput: !!artistInspirationsInput,
    createButton: !!createButton, // آیا این بار true می‌شود؟
    resultContainer: !!resultContainer
});

if (createButton && artistNameInput && artistStyleInput && artistInspirationsInput && resultContainer) {
    console.log("All elements found. Adding event listener.");
    createButton.addEventListener('click', () => {
        console.log("Create button clicked.");
        const dataToSend = {
            name: artistNameInput.value,
            style: artistStyleInput.value,
            inspirations: artistInspirationsInput.value
        };

        resultContainer.innerHTML = '<p>Creating magic... Please wait.</p>';
        console.log("Sending data:", dataToSend);

        fetch('https://phoenix-backend-rzd0.onrender.com/generate-persona', { // آدرس بک‌اند Render
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            console.log("Received response status:", response.status);
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
            console.log("Received data:", data);
            if (data.error) {
                 resultContainer.innerHTML = `<p style="color: red;">Backend Error: ${data.error}</p>`;
            } else {
                const formattedText = data.persona_text.replace(/\n/g, '<br>');
                resultContainer.innerHTML = `<p>${formattedText}</p>`;
            }
        })
        .catch((error) => {
            console.error('Fetch Error:', error);
            resultContainer.innerHTML = `<p style="color: red;">Sorry, a communication error occurred. (${error.message || 'Unknown fetch error'})</p>`;
        });
    });

} else {
    console.error("CRITICAL ERROR: Essential elements null even with querySelector.");
    if(resultContainer) {
        resultContainer.innerHTML = `<p style="color: red;">Critical page initialization error (elements not found). Please contact support.</p>`;
    }
}