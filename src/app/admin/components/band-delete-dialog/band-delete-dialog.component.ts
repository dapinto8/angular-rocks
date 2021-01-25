import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-band-delete-dialog',
  templateUrl: './band-delete-dialog.component.html',
  styleUrls: ['./band-delete-dialog.component.scss']
})
export class BandDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BandDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public bandName: string
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
