import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'dialogMailReset',
  templateUrl: 'index.html',
  styleUrls: ['style.scss']
})
export class DialogEnrolMailComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogEnrolMailComponent>) {}
  close(): void {
    this.dialogRef.close();
  }
}
