import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandCreateEditComponent } from './band-create-edit.component';

describe('BandCreateEditComponent', () => {
  let component: BandCreateEditComponent;
  let fixture: ComponentFixture<BandCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
