/**
 * PresetService - Gère la communication avec le backend pour les presets
 */
export class PresetService {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }

    /**
     * Récupère tous les presets depuis le backend
     * @returns {Promise<Array>} Liste des presets
     */
    async getAllPresets() {
        try {
            const response = await fetch(`${this.baseUrl}/presets`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const presets = await response.json();
            console.log(`[PresetService] ${presets.length} presets récupérés`);
            return presets;
        } catch (error) {
            console.error('[PresetService] Erreur fetch presets:', error);
            throw error;
        }
    }

    /**
     * Récupère un preset par son ID
     * @param {string} id - ID du preset
     * @returns {Promise<Object>} Le preset
     */
    async getPresetById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/presets/${id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const preset = await response.json();
            console.log(`[PresetService] Preset récupéré: "${preset.category}"`);
            return preset;
        } catch (error) {
            console.error(`[PresetService] Erreur fetch preset ${id}:`, error);
            throw error;
        }
    }
}