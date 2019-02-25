import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'dialogResetPassword',
  templateUrl: 'index.html',
})
export class DialogResetPasswordComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogResetPasswordComponent>) {}
  close(): void {
    this.dialogRef.close();
  }
}
