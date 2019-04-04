import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dialogResetPassword',
  templateUrl: 'index.html'
})
export class DialogResetPasswordComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogResetPasswordComponent>,
  @Inject(MAT_DIALOG_DATA) public data: boolean) {}
  close(): void {
    this.dialogRef.close();
  }
}
