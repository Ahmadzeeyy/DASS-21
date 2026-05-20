const questions = [
    "Saya sulit untuk ditenangkan",
    "Saya merasa mulut saya kering",
    "Saya tidak dapat merasakan perasaan yang positif",
    "Saya mengalami kesulitan bernafas",
    "Saya sulit mendapatkan semangat untuk melakukan sesuatu",
    "Saya cenderung bertindak berlebihan",
    "Saya mengalami gemetaran pada tangan",
    "Saya merasakan menggunakan banyak energi untuk cemas",
    "Saya merasa khawatir terhadap situasi yang membuat saya panik",
    "Saya merasa tidak memiliki masa depan",
    "Saya merasa semakin gelisah",
    "Saya sulit untuk rileksasi",
    "Saya merasa sedih dan murung",
    "Saya merasa tidak sabar terhadap sesuatu yang membuat saya bertahan dengan apa yang telah saya lakukan",
    "Saya mudah menjadi panik",
    "Saya tidak antusias terhadap sesuatu",
    "Saya merasa tidak berharga",
    "Saya mudah tersentuh",
    "Saya merasakan kerja jantung saya",
    "Saya merasa takut tanpa alasan yang jelas",
    "Saya merasa hidup ini tidak berarti"
];

const scaleOptions = [
    { val: 0, desc: "Tidak Pernah" },
    { val: 1, desc: "Kadang-kadang" },
    { val: 2, desc: "Sering" },
    { val: 3, desc: "Hampir Selalu" }
];

const container = document.getElementById('questions-container');

// Generate pertanyaan
questions.forEach((q, index) => {
    const qNum = index + 1;
    
    let optionsHtml = '';
    scaleOptions.forEach(opt => {
        optionsHtml += `
            <label class="option-label">
                <input type="radio" name="q${qNum}" value="${opt.val}" required>
                <div class="option-btn">
                    <span class="val">${opt.val}</span>
                    <span class="desc">${opt.desc}</span>
                </div>
            </label>
        `;
    });

    const html = `
        <div class="question-card">
            <span class="q-number">Pertanyaan ${qNum}</span>
            <div class="q-text">${q}</div>
            <div class="options-grid">
                ${optionsHtml}
            </div>
        </div>
    `;
    container.innerHTML += html;
});

// Handle form submit
document.getElementById('dassForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    
    // Loading state
    btn.innerHTML = 'Menganalisis...';
    btn.disabled = true;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        // Debug - lihat di Console (F12)
        console.log('Hasil dari server:', result);
        
        if (result.success) {
            showResult(result);  // ⚠️ PANGGIL FUNGSI showResult
        } else {
            alert('Error: ' + result.message);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi.');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

// ⚠️ FUNGSI PENTING: Menampilkan Hasil Analisis
function showResult(data) {
    const modal = document.getElementById('result-modal');
    const resultBox = document.getElementById('analysis-result');
    const icon = document.getElementById('modal-icon');
    
    // Tampilkan modal
    modal.style.display = 'flex';
    resultBox.style.display = 'block';
    
    let htmlContent = '';

    if (data.is_critical) {
        // KONDISI BERAT / SANGAT BERAT
        icon.style.background = '#FEE2E2';
        icon.style.color = '#EF4444';
        icon.innerHTML = '!';
        
        htmlContent = `
            <div class="analysis-box analysis-critical">
                <h4>⚠️ Hasil Analisis: ${data.kategori_tertinggi}</h4>
                
                <div class="score-details">
                    <div class="score-item ${getClassForScore(data.interp_depresi)}">
                        <span class="score-label">🧠 Depresi</span>
                        <span class="score-value">${data.skor_depresi}</span>
                        <span class="score-interpretation">${data.interp_depresi}</span>
                    </div>
                    
                    <div class="score-item ${getClassForScore(data.interp_kecemasan)}">
                        <span class="score-label">😰 Kecemasan</span>
                        <span class="score-value">${data.skor_kecemasan}</span>
                        <span class="score-interpretation">${data.interp_kecemasan}</span>
                    </div>
                    
                    <div class="score-item ${getClassForScore(data.interp_stres)}">
                        <span class="score-label">😤 Stres</span>
                        <span class="score-value">${data.skor_stres}</span>
                        <span class="score-interpretation">${data.interp_stres}</span>
                    </div>
                </div>
                
                <p class="recommendation">Berdasarkan hasil yang Anda peroleh, ada baiknya Anda berbicara dengan tenaga profesional agar 
                mendapatkan dukungan, pemahaman, dan penanganan yang sesuai dengan kondisi Anda..</p>
                
                <a href="https://wa.me/6281230032017?text=Halo dr. Ashoka Sulistyasmara, saya baru saja mengisi DASS-21. Hasil: Depresi ${data.skor_depresi} (${data.interp_depresi}), Kecemasan ${data.skor_kecemasan} (${data.interp_kecemasan}), Stres ${data.skor_stres} (${data.interp_stres}). Mohon bantuannya." class="btn-wa" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 8px; display: inline-block; vertical-align: middle;">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.59 1.97 14.122.95 11.498.95 6.062.95 1.637 5.32 1.633 10.749c0 1.673.443 3.31 1.283 4.747l-.994 3.633 3.725-.976zm11.367-6.877c-.302-.151-1.791-.882-2.074-.984-.282-.103-.487-.152-.692.152-.204.304-.793.984-.972 1.187-.18.203-.359.228-.661.077-.3-.152-1.27-.468-2.42-1.494-.896-.799-1.502-1.787-1.678-2.09-.177-.302-.019-.467.132-.617.136-.134.302-.354.453-.531.151-.177.202-.303.303-.506.101-.203.05-.38-.025-.531-.076-.151-.692-1.668-.949-2.287-.25-.601-.502-.52-.692-.53-.18-.011-.387-.013-.593-.013-.206 0-.54.077-.822.38-.282.304-1.077 1.053-1.077 2.566 0 1.513 1.101 2.978 1.253 3.18.152.202 2.167 3.309 5.252 4.64.733.317 1.307.507 1.753.649.736.233 1.406.2 1.937.121.59-.089 1.791-.733 2.043-1.442.253-.709.253-1.317.177-1.442-.076-.126-.282-.203-.585-.354z"/>
                    </svg>
                    <span>Hubungi dr. Ashoka Sulistyasmara</span>
                </a>
            </div>
        `;
    } else {
        // KONDISI NORMAL / RINGAN / SEDANG
        icon.style.background = '#D1FAE5';
        icon.style.color = '#10B981';
        icon.innerHTML = '✓';
        
        htmlContent = `
            <div class="analysis-box analysis-safe">
                <h4>✅ Hasil Analisis: Kondisi Stabil</h4>
                
                <div class="score-details">
                    <div class="score-item ${getClassForScore(data.interp_depresi)}">
                        <span class="score-label">🧠 Depresi</span>
                        <span class="score-value">${data.skor_depresi}</span>
                        <span class="score-interpretation">${data.interp_depresi}</span>
                    </div>
                    
                    <div class="score-item ${getClassForScore(data.interp_kecemasan)}">
                        <span class="score-label">😰 Kecemasan</span>
                        <span class="score-value">${data.skor_kecemasan}</span>
                        <span class="score-interpretation">${data.interp_kecemasan}</span>
                    </div>
                    
                    <div class="score-item ${getClassForScore(data.interp_stres)}">
                        <span class="score-label">😤 Stres</span>
                        <span class="score-value">${data.skor_stres}</span>
                        <span class="score-interpretation">${data.interp_stres}</span>
                    </div>
                </div>
                
                <p class="recommendation">Skor Anda menunjukkan kondisi emosional yang baik. Tetap jaga kesehatan mental dengan istirahat cukup, berolahraga, dan berbagi cerita dengan orang terdekat.</p>
                
                <p class="quote">"Kesehatan mental adalah bagian penting dari kesehatan secara keseluruhan."</p>
            </div>
        `;
    }

    resultBox.innerHTML = htmlContent;
}

// Helper function untuk class warna berdasarkan interpretasi
function getClassForScore(interp) {
    if (interp === 'Normal') return 'score-normal';
    if (interp === 'Ringan') return 'score-ringan';
    if (interp === 'Sedang') return 'score-sedang';
    if (interp === 'Berat') return 'score-berat';
    return 'score-sangat-berat';
}
