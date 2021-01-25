import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Band } from '@shared/interfaces/band.interface';
import { RockBandsService } from '@shared/services/rock-bands.service';

import { ToastrService } from 'ngx-toastr';

import { Subscription } from 'rxjs';

import { BandDeleteDialogComponent } from '../band-delete-dialog/band-delete-dialog.component';

@Component({
  selector: 'app-band-list',
  templateUrl: './band-list.component.html',
  styleUrls: ['./band-list.component.scss']
})
export class BandListComponent implements OnInit, OnDestroy {

  bands!: Band[];
  bandList: Band[] = [];
  subscription!: Subscription;

  search = new FormControl('');

  constructor(
    private rockBandService: RockBandsService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.subscription = this.rockBandService.getBands().subscribe(bands => {
      this.bands = bands;
      this.bandList = this.bands;
    });

    this.search.valueChanges.subscribe((text: string) => {
      if (text) {
        this.bandList = this.bands.filter(b => b.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()));
      } else {
        this.bandList = this.bands;
      }
    });
  }

  openDialog(band: Band): void {
    const dialogRef = this.dialog.open(BandDeleteDialogComponent, {
      width: '360px',
      data: band.name
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rockBandService
          .deleteBand(band.id, band.slug)
          .then(() => {
            this.toastr.success(`${band.name} eliminada`, '', {
              positionClass: 'toast-bottom-center',
              tapToDismiss: true,
              closeButton: true
            });
          })
          .catch(error => {
            console.error('Error removing document: ', error);
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
