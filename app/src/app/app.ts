import { AppMsg } from './msg';

export class App {
  constructor(private appMsg: AppMsg) {}

  readonly msgs = this.appMsg.msgs;
}
