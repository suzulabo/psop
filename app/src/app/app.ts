import { AppEncryption } from './encryption';
import { AppMsg } from './msg';

export class App {
  constructor(private appMsg: AppMsg, private appEncryption: AppEncryption) {}

  readonly msgs = this.appMsg.msgs;
  readonly encryption = this.appEncryption;

  setTitle(v: string) {
    document.title = v;
  }
}
