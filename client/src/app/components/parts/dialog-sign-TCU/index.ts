import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'dialogMailReset',
  templateUrl: 'index.html',
  styleUrls: ['style.scss']
})
export class DialogSignTCUComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogSignTCUComponent>) {}
  close(): void {
    this.dialogRef.close();
  }
}
