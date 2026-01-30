import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preset } from '../models/preset.model';

@Injectable({
  providedIn: 'root'  
})
export class PresetService {
  private apiUrl = 'http://localhost:3000/presets';

  constructor(private http: HttpClient) {}

  getPresets(): Observable<Preset[]> {
    return this.http.get<Preset[]>(this.apiUrl);
  }

  createPreset(presetData: Partial<Preset>): Observable<Preset> {
    return this.http.post<Preset>(this.apiUrl, presetData);
  }

  renamePreset(id: string, newName: string): Observable<Preset> {
    return this.http.patch<Preset>(`${this.apiUrl}/${id}/rename`, { newPresetName: newName });
  }

  deletePreset(id: string): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.apiUrl}/${id}`);
  }

  restorePresets(): Observable<Preset[]> {
    return this.http.post<Preset[]>(`${this.apiUrl}/restore`, {});
  }
}