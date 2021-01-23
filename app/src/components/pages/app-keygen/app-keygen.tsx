import { Component, h, Host, Prop, State } from '@stencil/core';
import { App } from 'src/app/app';
import { href } from 'stencil-router-v2';
import * as clipboard from 'clipboard-polyfill/text';

@Component({
  tag: 'app-keygen',
  styleUrl: 'app-keygen.scss',
})
export class AppKeyGen {
  @Prop()
  app: App;

  @State()
  passwd = '';

  @State()
  keys: {
    secret: string;
    public: string;
  };

  private handlePasswdInput = (event: Event) => {
    this.passwd = (event.target as HTMLInputElement).value;
    this.keys = undefined;
  };

  private handleGenBtn = () => {
    this.keys = this.app.encryption.generatePair(this.passwd);
  };

  private handleCopyBtn = (event: Event) => {
    const el = event.target as HTMLElement;
    const keyEl = el.closest('.key-box').querySelector<HTMLElement>('.key');
    keyEl.classList.remove('copied');

    // void codeEl.offsetWidth; <- It is removed when production build
    if (!isNaN(keyEl.offsetWidth)) {
      keyEl.classList.add('copied');
    }

    const key = keyEl.textContent;
    return clipboard.writeText(key);
  };

  private renderKey = (isPublic: boolean, key: string) => {
    if (!key) {
      return;
    }

    const title = isPublic ? this.app.msgs.keygen.publicPasswd : this.app.msgs.keygen.secretPasswd;
    return (
      <fieldset
        class={{
          'key-box': true,
          'public': isPublic,
          'secret': !isPublic,
        }}
      >
        <legend>{title}</legend>
        <div class="inner">
          <span class="key">{key}</span>
          <button class="icon" onClick={this.handleCopyBtn}>
            <ap-icon icon="clipboard" />
          </button>
        </div>
      </fieldset>
    );
  };

  render() {
    return (
      <Host>
        <header>{this.app.msgs.keygen.title}</header>
        <main>
          <div class="form">
            <input
              type="password"
              placeholder={this.app.msgs.keygen.userPasswd}
              value={this.passwd}
              onInput={this.handlePasswdInput}
            ></input>
            <button type="button" onClick={this.handleGenBtn}>
              {this.app.msgs.keygen.genBtn}
            </button>
          </div>
          {this.renderKey(true, this.keys?.public)}
          {this.renderKey(false, this.keys?.secret)}
          <div class="back-btn">
            <a {...href('/')}>{this.app.msgs.common.back}</a>
          </div>
        </main>
      </Host>
    );
  }
}
