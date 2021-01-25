import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AppErrorStateMatcher } from '@admin/helpers/error-state.matcher';
import { Album } from '@shared/interfaces/album.interface';
import { Band } from '@shared/interfaces/band.interface';
import { Member } from '@shared/interfaces/member.interface';
import { SlugifyPipe } from '@admin/pipes/slugify.pipe';
import { RockBandsService } from '@shared/services/rock-bands.service';

import { ToastrService } from 'ngx-toastr';

import { first } from 'rxjs/operators';

import * as short from 'short-uuid';

@Component({
  selector: 'app-band-create-edit',
  templateUrl: './band-create-edit.component.html',
  styleUrls: ['./band-create-edit.component.scss'],
  providers: [SlugifyPipe]
})
export class BandCreateEditComponent implements OnInit {
  action!: 'create' | 'edit';
  id = '';
  slug!: string;
  bandForm!: FormGroup;
  matcher = new AppErrorStateMatcher();
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private slugifyPipe: SlugifyPipe,
    private rockBandService: RockBandsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params['slug'];
    this.action = this.slug === 'create' ? this.slug : 'edit';

    this.bandForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        slug: ['', [Validators.required]],
        description: ['', [Validators.required]],
        origin: ['', [Validators.required]],
        background: ['', [Validators.required]],
        spotify: ['', []],
        albums: this.fb.array([]),
        members: this.fb.array([])
      },
      { updateOn: 'blur' }
    );

    this.bandForm.get('name')?.valueChanges.subscribe(name => {
      this.bandForm.get('slug')?.setValue(this.slugifyPipe.transform(name));
    });

    if (this.action === 'create') {
      this.addMember();
      this.addAlbum();
    } else {
      this.loading = true;
      this.rockBandService
        .getBand('slug', this.slug)
        .pipe(first())
        .subscribe(band => {
          this.setForm(band);
        });
    }
  }

  get faAlbums(): FormArray {
    return this.bandForm.get('albums') as FormArray;
  }

  get faMembers(): FormArray {
    return this.bandForm.get('members') as FormArray;
  }

  setForm(band: Band): void {
    band.albums.forEach(() => this.addAlbum());
    band.members.forEach(() => this.addMember());
    this.bandForm.patchValue(band);
    if (band.id) this.id = band.id;
    this.loading = false;
  }

  addAlbum(): void {
    this.faAlbums.push(
      this.fb.group({
        name: ['', [Validators.required]],
        releaseYear: ['', [Validators.required]],
        spotify: ['', []],
        cover: ['', [Validators.required]]
      })
    );
  }

  removeAlbum(index: number): void {
    this.faAlbums.removeAt(index);
  }

  addMember(): void {
    this.faMembers.push(
      this.fb.group({
        name: ['', [Validators.required]],
        role: ['', [Validators.required]],
        image: ['', [Validators.required]]
      })
    );
  }

  removeMember(index: number): void {
    this.faMembers.removeAt(index);
  }

  setFileValue(
    file: File,
    control: AbstractControl,
    controlName: string
  ): void {
    control.get(controlName)?.setValue(file);
  }

  saveImages<T>(data: any[], key: string, slug: string): Promise<T>[] {
    return data.map(async el => {
      if (el[key] instanceof File) {
        el[key] = await this.rockBandService.uploadFile(
          el[key],
          `${slug}/${this.slugifyPipe.transform(el.name)}-${short.generate()}`
        );
      }

      return el;
    });
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    const data: Band = this.bandForm.value;

    if (data.background instanceof File) {
      await this.rockBandService
        .uploadFile(
          data.background,
          `${data.slug}/background-${short.generate()}`
        )
        .then(url => {
          data.background = url;
        });
    }

    const albumPromises = this.saveImages<Album>(data.albums, 'cover', data.slug);
    await Promise.all(albumPromises).then(albums => data.albums = albums);

    const memberPromises = this.saveImages<Member>(data.members, 'image', data.slug);
    await Promise.all(memberPromises).then(members => data.members = members);

    if (this.action === 'create') {
      this.rockBandService.createBand(data).then(() => {
        this.loading = false;
        this.toastr.success('Agregaste una nueva banda', '¡EEEEEOOOOOO!', {
          positionClass: 'toast-bottom-center',
          tapToDismiss: true,
          closeButton: true
        });
      });
    } else {
      this.rockBandService.updateBand(this.id, data).then(() => {
        this.loading = false;
        this.toastr.success('Datos guardados', '', {
          positionClass: 'toast-bottom-center',
          tapToDismiss: true,
          closeButton: true
        });
      });
    }
  }
}
