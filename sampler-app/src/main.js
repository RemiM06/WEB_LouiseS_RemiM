import { AudioEngine } from './engine/AudioEngine.js';
import { PresetService } from './services/PresetService.js';

// ============================================
// INITIALISATION
// ============================================

const audioEngine = new AudioEngine();
const presetService = new PresetService('http://localhost:3000');

// Éléments DOM
const categoryButtons = document.getElementById('category-buttons');
const presetSelect = document.getElementById('preset-select');
const loadingStatus = document.getElementById('loading-status');
const progressSection = document.getElementById('progress-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const padsGrid = document.getElementById('pads-grid');
const waveformCanvas = document.getElementById('waveform-canvas');
const currentSampleName = document.getElementById('current-sample-name');

// Éléments Trim
const trimSection = document.getElementById('trim-section');
const trimSampleName = document.getElementById('trim-sample-name');
const trimStartSlider = document.getElementById('trim-start');
const trimEndSlider = document.getElementById('trim-end');
const trimStartValue = document.getElementById('trim-start-value');
const trimEndValue = document.getElementById('trim-end-value');
const resetTrimBtn = document.getElementById('reset-trim');

// État
let allPresets = [];
let filteredPresets = [];
let currentPreset = null;
let selectedPadIndex = null;
let currentCategory = 'all';

// ============================================
// CHARGEMENT DES PRESETS ET CATÉGORIES
// ============================================

async function loadPresetsList() {
    try {
        loadingStatus.textContent = 'Chargement...';
        
        allPresets = await presetService.getAllPresets();
        
        // Extraire les catégories uniques
        const categories = [...new Set(allPresets.map(p => p.category))].filter(Boolean);
        
        // Créer les boutons de catégorie
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.dataset.category = category;
            btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            btn.addEventListener('click', () => filterByCategory(category));
            categoryButtons.appendChild(btn);
        });
        
        // Afficher tous les presets par défaut
        filterByCategory('all');
        
        loadingStatus.textContent = `${allPresets.length} presets disponibles`;
        
    } catch (error) {
        loadingStatus.textContent = 'Erreur connexion serveur';
        console.error('Erreur chargement presets:', error);
    }
}

function filterByCategory(category) {
    currentCategory = category;
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Filtrer les presets
    if (category === 'all') {
        filteredPresets = allPresets;
    } else {
        filteredPresets = allPresets.filter(p => p.category === category);
    }
    
    // Mettre à jour le menu déroulant
    updatePresetSelect();
}

function updatePresetSelect() {
    presetSelect.innerHTML = '<option value="">-- Sélectionner un preset --</option>';
    
    filteredPresets.forEach(preset => {
        const option = document.createElement('option');
        option.value = preset._id;
        const displayName = preset.name || preset.category || 'Sans nom';
        option.textContent = `${displayName} (${preset.samples?.length || 0} sons)`;
        presetSelect.appendChild(option);
    });
    
    presetSelect.disabled = filteredPresets.length === 0;
    
    if (filteredPresets.length === 0) {
        loadingStatus.textContent = `Aucun preset dans la catégorie "${currentCategory}"`;
    } else {
        loadingStatus.textContent = `${filteredPresets.length} preset(s) dans "${currentCategory}"`;
    }
}

// ============================================
// CHARGEMENT D'UN PRESET
// ============================================

async function loadPreset(presetId) {
    if (!presetId) return;
    
    try {
        const preset = await presetService.getPresetById(presetId);
        currentPreset = preset;
        
        progressSection.style.display = 'block';
        updateProgress(0);
        
        audioEngine.init();
        
        const presetForEngine = {
            name: preset.name || preset.category || 'Preset',
            samples: preset.samples || []
        };
        
        await audioEngine.loadPreset(presetForEngine, (progress, loaded, total) => {
            updateProgress(progress);
            loadingStatus.textContent = `Chargement ${loaded}/${total}...`;
        });
        
        generatePads(presetForEngine.samples.length);
        
        progressSection.style.display = 'none';
        loadingStatus.textContent = `"${presetForEngine.name}" chargé !`;
        
    } catch (error) {
        loadingStatus.textContent = 'Erreur chargement preset';
        console.error('Erreur:', error);
    }
}

function updateProgress(percent) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${percent}%`;
}

// ============================================
// GÉNÉRATION DES PADS
// ============================================

function generatePads(count) {
    padsGrid.innerHTML = '';
    
    if (count === 0) {
        padsGrid.innerHTML = '<p style="color: #aaa; text-align: center;">Aucun sample dans ce preset</p>';
        return;
    }
    
    // Calcul de la grille (4 colonnes max)
    const cols = Math.min(4, count);
    const rows = Math.ceil(count / cols);
    
    padsGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    // Créer tous les pads
    const padsArray = [];
    
    for (let i = 0; i < count; i++) {
        const sampleInfo = audioEngine.getSampleInfo(i);
        
        const pad = document.createElement('div');
        pad.className = 'pad';
        pad.dataset.index = i;
        pad.innerHTML = `
            <span class="pad-number">${i + 1}</span>
            <span class="pad-name">${sampleInfo?.name || 'Vide'}</span>
        `;
        
        pad.addEventListener('click', () => onPadClick(i));
        
        padsArray.push(pad);
    }
    
    // Réorganiser pour afficher de bas en haut
    // Exemple avec 8 pads (2 lignes x 4 colonnes) :
    // DOM order:  row 1 (indices 4-7), puis row 0 (indices 0-3)
    // Visual:     row 0 en bas, row 1 en haut
    
    for (let row = rows - 1; row >= 0; row--) {
        for (let col = 0; col < cols; col++) {
            const padIndex = row * cols + col;
            if (padIndex < count) {
                padsGrid.appendChild(padsArray[padIndex]);
            } else {
                // Pad vide pour compléter la grille
                const emptyPad = document.createElement('div');
                emptyPad.className = 'pad empty';
                emptyPad.innerHTML = '<span class="pad-number">-</span><span class="pad-name">Vide</span>';
                padsGrid.appendChild(emptyPad);
            }
        }
    }
    
    console.log(`[Main] ${count} pads générés (grille ${cols}x${rows}, pad 0 en bas à gauche)`);
}

// ============================================
// INTERACTION PADS
// ============================================

function onPadClick(padIndex) {
    audioEngine.playSample(padIndex);
    
    const pad = padsGrid.querySelector(`[data-index="${padIndex}"]`);
    if (pad) {
        pad.classList.add('active');
        setTimeout(() => pad.classList.remove('active'), 150);
    }
    
    selectedPadIndex = padIndex;
    const sampleInfo = audioEngine.getSampleInfo(padIndex);
    currentSampleName.textContent = sampleInfo?.name || '-';
    
    drawWaveform(padIndex);
    updateTrimControls(padIndex);
}

// ============================================
// VISUALISATION WAVEFORM
// ============================================

function drawWaveform(padIndex) {
    const buffer = audioEngine.getBuffer(padIndex);
    if (!buffer) return;
    
    const canvas = waveformCanvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;
    
    // Dessiner la waveform
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        
        for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
        }
        
        ctx.moveTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
    }
    
    ctx.stroke();
    
    // Dessiner les zones de trim
    const sampleInfo = audioEngine.getSampleInfo(padIndex);
    if (sampleInfo && sampleInfo.buffer) {
        const duration = sampleInfo.buffer.duration;
        const startX = (sampleInfo.trimStart / duration) * width;
        const endX = (sampleInfo.trimEnd / duration) * width;
        
        // Zone grisée avant trim start
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, startX, height);
        
        // Zone grisée après trim end
        ctx.fillRect(endX, 0, width - endX, height);
        
        // Lignes de trim
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(endX, 0);
        ctx.lineTo(endX, height);
        ctx.stroke();
    }
}

// ============================================
// CONTRÔLES DE TRIM
// ============================================

function updateTrimControls(padIndex) {
    const sampleInfo = audioEngine.getSampleInfo(padIndex);
    
    if (!sampleInfo || !sampleInfo.buffer) {
        trimSection.style.display = 'none';
        return;
    }
    
    trimSection.style.display = 'block';
    trimSampleName.textContent = sampleInfo.name;
    
    const duration = sampleInfo.buffer.duration;
    
    // Convertir les valeurs en millisecondes pour les sliders
    const startMs = sampleInfo.trimStart * 1000;
    const endMs = sampleInfo.trimEnd * 1000;
    const durationMs = duration * 1000;
    
    trimStartSlider.max = durationMs;
    trimEndSlider.max = durationMs;
    trimStartSlider.value = startMs;
    trimEndSlider.value = endMs;
    
    updateTrimValues();
}

function updateTrimValues() {
    const startMs = parseFloat(trimStartSlider.value);
    const endMs = parseFloat(trimEndSlider.value);
    
    trimStartValue.textContent = (startMs / 1000).toFixed(2) + 's';
    trimEndValue.textContent = (endMs / 1000).toFixed(2) + 's';
}

function applyTrim() {
    if (selectedPadIndex === null) return;
    
    const startSeconds = parseFloat(trimStartSlider.value) / 1000;
    const endSeconds = parseFloat(trimEndSlider.value) / 1000;
    
    // Empêcher trim start > trim end
    if (startSeconds >= endSeconds) {
        trimStartSlider.value = (endSeconds - 0.01) * 1000;
        updateTrimValues();
        return;
    }
    
    audioEngine.setTrim(selectedPadIndex, startSeconds, endSeconds);
    drawWaveform(selectedPadIndex);
}

function resetTrim() {
    if (selectedPadIndex === null) return;
    
    const sampleInfo = audioEngine.getSampleInfo(selectedPadIndex);
    if (!sampleInfo || !sampleInfo.buffer) return;
    
    const duration = sampleInfo.buffer.duration;
    audioEngine.setTrim(selectedPadIndex, 0, duration);
    
    trimStartSlider.value = 0;
    trimEndSlider.value = duration * 1000;
    updateTrimValues();
    drawWaveform(selectedPadIndex);
}

// ============================================
// EVENT LISTENERS
// ============================================

presetSelect.addEventListener('change', (e) => {
    loadPreset(e.target.value);
});

trimStartSlider.addEventListener('input', () => {
    updateTrimValues();
    applyTrim();
});

trimEndSlider.addEventListener('input', () => {
    updateTrimValues();
    applyTrim();
});

resetTrimBtn.addEventListener('click', resetTrim);

// ============================================
// DÉMARRAGE
// ============================================

console.log('Sampler Audio - Démarrage');
loadPresetsList();