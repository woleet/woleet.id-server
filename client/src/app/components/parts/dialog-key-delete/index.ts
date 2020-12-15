import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'dialogKeyDelete',
  templateUrl: 'index.html',
  styleUrls: ['style.scss']
})
export class DialogKeyDeleteComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogKeyDeleteComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {}
}
