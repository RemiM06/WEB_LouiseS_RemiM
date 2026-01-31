/**
 * AudioEngine - Moteur audio isolé (peut fonctionner en mode headless)
 * Utilise la Web Audio API
 */
export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.samples = []; // Tableau de { name, url, buffer, trimStart, trimEnd }
        this.isInitialized = false;
    }

    /**
     * Initialise l'AudioContext (doit être appelé après une interaction utilisateur)
     */
    init() {
        if (this.isInitialized) return;
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isInitialized = true;
        console.log('[AudioEngine] Initialisé - Sample Rate:', this.audioContext.sampleRate);
    }

/**
 * Charge un sample individuel
 * @param {string} url - URL du sample
 * @param {string} name - Nom du sample
 * @param {number} index - Index du pad
 */
async loadSample(url, name, index) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} pour ${url}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        
        this.samples[index] = {
            name: name,
            buffer: audioBuffer,
            trimStart: 0,
            trimEnd: audioBuffer.duration
        };
        
        console.log(`[AudioEngine] Sample "${name}" chargé (${audioBuffer.duration.toFixed(2)}s)`);
        
    } catch (error) {
        console.error(`[AudioEngine] Erreur chargement ${url}:`, error);
        throw error;
    }
}

    /**
     * Charge un preset complet (tous les samples)
     * @param {Object} preset - Objet preset { name, samples: [{name, url}] }
     * @param {Function} onProgress - Callback de progression (0-100)
     * @returns {Promise<void>}
     */
    async loadPreset(preset, onProgress = () => {}) {
        if (!this.isInitialized) {
            this.init();
        }

        this.samples = [];
        const totalSamples = preset.samples.length;
        let loadedCount = 0;

        console.log(`[AudioEngine] Chargement du preset "${preset.name}" (${totalSamples} samples)`);

        for (const sample of preset.samples) {
            try {
                const buffer = await this.loadSample(sample.url);
                this.samples.push({
                    name: sample.name,
                    url: sample.url,
                    buffer: buffer,
                    trimStart: 0,
                    trimEnd: buffer.duration
                });
            } catch (error) {
                // On ajoute quand même le sample avec buffer null
                this.samples.push({
                    name: sample.name,
                    url: sample.url,
                    buffer: null,
                    trimStart: 0,
                    trimEnd: 0
                });
            }
            
            loadedCount++;
            const progress = Math.round((loadedCount / totalSamples) * 100);
            onProgress(progress, loadedCount, totalSamples);
        }

        console.log(`[AudioEngine] Preset "${preset.name}" chargé !`);
    }

    /**
     * Joue un sample par son index
     * @param {number} padIndex - Index du pad (0 = bas gauche)
     * @param {Object} options - Options { volume: 0-1, playbackRate: 0.5-2 }
     * @returns {AudioBufferSourceNode|null}
     */
    playSample(padIndex, options = {}) {
        if (!this.isInitialized) {
            console.warn('[AudioEngine] Non initialisé !');
            return null;
        }

        const sample = this.samples[padIndex];
        if (!sample || !sample.buffer) {
            console.warn(`[AudioEngine] Pas de sample pour le pad ${padIndex}`);
            return null;
        }

        const { volume = 1, playbackRate = 1 } = options;

        // Créer les nodes
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        // Configurer
        source.buffer = sample.buffer;
        source.playbackRate.value = playbackRate;
        gainNode.gain.value = volume;

        // Connecter : source -> gain -> destination
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Calculer la durée avec trim
        const startTime = sample.trimStart;
        const duration = sample.trimEnd - sample.trimStart;

        // Jouer
        source.start(0, startTime, duration);

        console.log(`[AudioEngine] Play pad ${padIndex}: "${sample.name}"`);
        return source;
    }

    /**
     * Retourne le buffer d'un sample (pour visualisation)
     * @param {number} padIndex 
     * @returns {AudioBuffer|null}
     */
    getBuffer(padIndex) {
        const sample = this.samples[padIndex];
        return sample ? sample.buffer : null;
    }

    /**
     * Définit les points de trim pour un sample
     * @param {number} padIndex 
     * @param {number} start - Temps de début en secondes
     * @param {number} end - Temps de fin en secondes
     */
    setTrim(padIndex, start, end) {
        const sample = this.samples[padIndex];
        if (sample && sample.buffer) {
            sample.trimStart = Math.max(0, start);
            sample.trimEnd = Math.min(sample.buffer.duration, end);
            console.log(`[AudioEngine] Trim pad ${padIndex}: ${sample.trimStart.toFixed(2)}s - ${sample.trimEnd.toFixed(2)}s`);
        }
    }

    /**
     * Retourne les infos d'un sample
     * @param {number} padIndex 
     * @returns {Object|null}
     */
    getSampleInfo(padIndex) {
        return this.samples[padIndex] || null;
    }

    /**
     * Nombre de samples chargés
     */
    get sampleCount() {
        return this.samples.length;
    }
}