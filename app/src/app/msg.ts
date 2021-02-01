import { msgs as jaMsgs } from './msgs/msg.ja';

const lang = 'ja';

const msgsMap = {
  ja: jaMsgs,
};

export class AppMsg {
  get lang() {
    return lang;
  }
  get msgs() {
    return msgsMap[lang];
  }
}
