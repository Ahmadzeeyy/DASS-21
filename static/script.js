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
                    📞 Hubungi dr. Ashoka Sulistyasmara
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
