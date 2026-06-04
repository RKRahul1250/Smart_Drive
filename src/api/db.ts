import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface StoredAsset {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  fileBlob: Blob;
  previewUrl?: string;
  order: number;
}

export class SmartDriveDB extends Dexie {
  assets!: Table<StoredAsset>;

  constructor() {
    super('SmartDriveDB');
    this.version(1).stores({
      assets: 'id, name, type, uploadDate, order'
    });
  }
}

export const db = new SmartDriveDB();
