import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dialogMailReset',
  templateUrl: 'index.html',
  styleUrls: ['style.scss']
})
export class DialogMailResetComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogMailResetComponent>) {}
  close(): void {
    this.dialogRef.close();
  }
}
