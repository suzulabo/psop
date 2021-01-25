export class DataReader {
  private pos = 0;

  constructor(private data: Uint8Array) {}

  readBytes(size: number) {
    if (this.pos >= this.data.byteLength) {
      return;
    }
    const b = this.data.slice(this.pos, this.pos + size);
    this.pos += size;
    return b;
  }

  readUint8Array() {
    const size = this.readInt32();
    if (!size) {
      return;
    }
    const b = this.readBytes(size);
    return b;
  }

  readInt8() {
    const b = this.readBytes(1);
    if (!b) {
      return;
    }
    const dv = new DataView(b.buffer);
    const v = dv.getInt8(0);
    return v;
  }

  readInt32() {
    const b = this.readBytes(4);
    if (!b) {
      return;
    }
    const dv = new DataView(b.buffer);
    const v = dv.getInt32(0);
    return v;
  }

  readString() {
    const size = this.readInt32();
    if (!size) {
      return;
    }
    const b = this.readBytes(size);
    if (!b) {
      return;
    }
    return new TextDecoder().decode(b);
  }

  readDate() {
    const s = this.readString();
    if (!s) {
      return;
    }
    return new Date(s);
  }
}
