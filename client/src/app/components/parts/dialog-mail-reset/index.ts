import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'dialogMailReset',
  templateUrl: 'index.html',
})
export class DialogMailResetComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogMailResetComponent>) {}
  close(): void {
    this.dialogRef.close();
  }
}
