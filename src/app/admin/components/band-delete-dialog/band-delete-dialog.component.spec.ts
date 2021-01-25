import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandDeleteDialogComponent } from './band-delete-dialog.component';

describe('BandDeleteDialogComponent', () => {
  let component: BandDeleteDialogComponent;
  let fixture: ComponentFixture<BandDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
