import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-preset-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './add-preset-form.component.html'
})
export class AddPresetFormComponent {
  presetForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddPresetFormComponent>) {
    this.presetForm = this.fb.group({
      category: ['', [Validators.required]],
      samples: this.fb.array([this.createSampleGroup()]) // Un premier champ par défaut
    });
  }

  get samples() { return this.presetForm.get('samples') as FormArray; }

  createSampleGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  addSample() { this.samples.push(this.createSampleGroup()); }

  removeSample(index: number) { if (this.samples.length > 1) this.samples.removeAt(index); }

  onSubmit() {
    if (this.presetForm.valid) this.dialogRef.close(this.presetForm.value);
  }
}