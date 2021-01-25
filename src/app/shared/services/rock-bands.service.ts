import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment as env } from '@env/environment';

import { Band } from '@shared/interfaces/band.interface';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RockBandsService {
  private bandsCollection: AngularFirestoreCollection<any>;

  bands: Band[] = [];

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.bandsCollection = afs.collection<Band>('bands');
  }

  uploadFile(file: File, filePath: string): Promise<string> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return task
      .snapshotChanges()
      .toPromise()
      .then(() => {
        return fileRef.getDownloadURL().toPromise();
      });
  }

  createBand(band: Band): Promise<DocumentReference<any>> {
    return this.bandsCollection.add(band);
  }

  getBands(): Observable<Band[]> {
    return this.bandsCollection.valueChanges({ idField: 'id' });
  }

  getBand(field: string, value: any): Observable<Band> {
    return this.bandsCollection
      .valueChanges({ idField: 'id' })
      .pipe(map(bands => bands.find(b => b[field] === value)));
  }

  updateBand(id: string, band: Band): Promise<void> {
    return this.bandsCollection.doc(id).update(band);
  }

  deleteFiles(path: string): void {
    this.storage
      .ref(path)
      .listAll()
      .toPromise()
      .then(dir => {
        dir.items.forEach(file => {
          file.delete();
        });
      });
  }

  deleteBand(id: string, path: string): Promise<void> {
    this.deleteFiles(path);
    return this.bandsCollection.doc(id).delete();
  }
}
