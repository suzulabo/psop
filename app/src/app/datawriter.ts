import { concatArray } from './utils';

export class DataWriter {
  private values = new Array<Uint8Array>();

  writeUint8Array(v: Uint8Array) {
    this.writeInt32(v.byteLength);
    this.values.push(v);
  }

  writeInt8(v: number) {
    if (!v) {
      v = 0;
    }
    const dv = new DataView(new ArrayBuffer(1));
    dv.setInt8(0, v);
    const b = new Uint8Array(dv.buffer);
    this.values.push(b);
  }

  writeInt32(v: number) {
    if (!v) {
      v = 0;
    }
    const dv = new DataView(new ArrayBuffer(4));
    dv.setInt32(0, v);
    const b = new Uint8Array(dv.buffer);
    this.values.push(b);
  }

  writeString(v: string) {
    if (!v) {
      v = '';
    }
    const b = new TextEncoder().encode(v);
    this.writeInt32(b.byteLength);
    this.values.push(b);
  }

  writeDate(v: Date) {
    const s = v ? v.toISOString() : '';
    this.writeString(s);
  }

  toUint8Array() {
    return concatArray(...this.values);
  }
}
