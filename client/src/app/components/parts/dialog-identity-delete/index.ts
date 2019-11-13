import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dialogIdentityDelete',
  templateUrl: 'index.html',
  styleUrls: ['style.scss']
})
export class DialogIdentityDeleteComponent {

  constructor(
  public dialogRef: MatDialogRef<DialogIdentityDeleteComponent>,
  @Inject(MAT_DIALOG_DATA) public data: boolean) {}
}
