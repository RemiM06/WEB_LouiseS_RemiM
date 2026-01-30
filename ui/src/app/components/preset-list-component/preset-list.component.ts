import { Component, OnInit } from '@angular/core';
import { PresetService } from '../../services/preset.service';
import { Preset } from '../../models/preset.model';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPresetFormComponent } from '../add-preset-form-component/add-preset-form.component';
import { UpdatePresetFormComponent } from '../update-preset-form-component/update-preset-form.component';

@Component({
  selector: 'app-preset-list',
  standalone: true,
  imports: [MatListModule, MatDividerModule, MatIconModule, MatExpansionModule, MatDialogModule],
  templateUrl: './preset-list.component.html',
  styleUrls: ['./preset-list.component.css']
})
export class PresetListComponent implements OnInit {
  presets: Preset[] = [];

  constructor(private presetService: PresetService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPresets();
  }

  loadPresets(): void {
    this.presetService.getPresets().subscribe(data => this.presets = data);
  }

  onAddPreset(): void {
    const dialogRef = this.dialog.open(AddPresetFormComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.presetService.createPreset(result).subscribe(() => this.loadPresets());
      }
    });
  }

  onRename(preset: Preset): void {
    const dialogRef = this.dialog.open(UpdatePresetFormComponent, {
      width: '600px',
      data: preset
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.presetService.renamePreset(preset._id, result.category).subscribe(() => {
          this.loadPresets();
        });
      }
    });
  }

  onDelete(_id: string): void {
    if (confirm('Supprimer ce preset ?')) {
      this.presetService.deletePreset(_id).subscribe(() => this.loadPresets());
    }
  }

  onRestore(): void {
    this.presetService.restorePresets().subscribe(() => this.loadPresets());
  }
}