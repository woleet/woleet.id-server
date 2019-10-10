import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'dialogMailReset',
  templateUrl: 'index.html'
})
export class DialogAskResetComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogAskResetComponent>) {}
  close(): void {
    this.dialogRef.close();
  }
}
