import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-update-preset-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  templateUrl: './update-preset-form.component.html',
  styleUrls: ['./update-preset-form.component.css'] 
})
export class UpdatePresetFormComponent {
  presetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdatePresetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.presetForm = this.fb.group({
      category: [data.category, [Validators.required]]
    });
  }

  onSave(): void {
    if (this.presetForm.valid) {
      this.dialogRef.close(this.presetForm.value);
    }
  }
}