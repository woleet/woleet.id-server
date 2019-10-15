import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dialogMailReset',
  templateUrl: 'index.html',
  styleUrls: ['style.scss']
})
export class DialogAskResetComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogAskResetComponent>,
  @Inject(MAT_DIALOG_DATA) public data: string) {}
  close(): void {
    this.dialogRef.close();
  }
}
