import { AppEncryption } from './encryption';
import { AppMsg } from './msg';

const BUILD_INFO = {
  src: '__BUILD_SRC__',
  time: parseInt('__BUILT_TIME__'),
} as const;

export class App {
  constructor(private appMsg: AppMsg, private appEncryption: AppEncryption) {}

  readonly msgs = this.appMsg.msgs;
  readonly encryption = this.appEncryption;

  readonly buildInfo = BUILD_INFO;

  setTitle(v: string) {
    document.title = v;
  }
}
