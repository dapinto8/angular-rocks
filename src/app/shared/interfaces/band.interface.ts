import { Album } from './album.interface';
import { Member } from './member.interface';

export interface Band {
  id: string;
  name: string;
  slug: string;
  origin: string;
  description: string;
  background: string | File;
  spotify: string;
  albums: Album[];
  members: Member[];
}
