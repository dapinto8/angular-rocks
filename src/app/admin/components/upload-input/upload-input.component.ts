import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

type InputType = 'image' | 'file';

@Component({
  selector: 'app-upload-input',
  templateUrl: './upload-input.component.html',
  styleUrls: ['./upload-input.component.scss']
})
export class UploadInputComponent implements OnInit, OnChanges {
  @Input() type: InputType = 'image';
  @Input() label = 'Subir archivo';
  @Input() previewUrl!: string;
  @Output() data = new EventEmitter<File>();

  preview: string | ArrayBuffer | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.preview = changes.previewUrl.currentValue || null;
  }

  readFile($event: any): void {
    const file = $event.target.files[0];

    if (file) {
      this.data.emit(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.preview = reader.result;
      };
      reader.onerror = () => {
        console.log(reader.error);
      };
    }
  }
}
