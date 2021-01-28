import { Component, h, Host, Prop, State } from '@stencil/core';
import { App } from 'src/app/app';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'app-decrypt',
  styleUrl: 'app-decrypt.scss',
})
export class AppDecrypt {
  @Prop()
  app: App;

  @State()
  userPasswd: string;

  @State()
  secretPasswd: string;

  @State()
  decrypting = false;

  @State()
  errMsg: string;

  @State()
  decrypted: { name: string; url: string }[];

  private fileInput: HTMLInputElement;
  private handleFileInpuretRef = (el: HTMLInputElement) => {
    this.fileInput = el;
  };

  disconnectedCallback() {
    this.clearResults();
  }

  private clearResults() {
    if (this.decrypted) {
      for (const v of this.decrypted) {
        URL.revokeObjectURL(v.url);
      }
      this.decrypted = undefined;
    }
    this.errMsg = undefined;
    this.decrypted = undefined;
  }

  private handleUserPasswdInput = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;
    this.userPasswd = el.value;
    this.clearResults();
  };

  private handleSecretPasswdInput = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;
    this.secretPasswd = el.value;
    this.clearResults();
  };

  private handleFileSelectBtnClick = () => {
    this.fileInput.click();
  };

  private handleFileInputChange = async () => {
    const inputFiles = this.fileInput.files;
    if (inputFiles.length == 0) {
      return;
    }
    const file = inputFiles.item(0);
    this.fileInput.value = '';

    this.clearResults();
    this.decrypting = true;
    try {
      const result = await this.app.encryption.decryptFile(
        file,
        this.secretPasswd,
        this.userPasswd,
        () => {},
      );
      if (typeof result == 'string') {
        this.errMsg = result;
      } else {
        this.decrypted = result.map(v => {
          return {
            name: v.filename,
            url: URL.createObjectURL(new File([v.data], v.filename)),
          };
        });
      }
    } finally {
      this.decrypting = false;
    }
  };

  private renderFiles() {
    if (!this.decrypted) {
      return;
    }

    return this.decrypted.map(v => {
      return (
        <a href={v.url} download={v.name}>
          {v.name}
        </a>
      );
    });
  }

  render() {
    const canDecrypt =
      this.secretPasswd && !!this.secretPasswd.match(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{52}$/);

    return (
      <Host>
        <header>{this.app.msgs.decrypt.title}</header>
        <main>
          <section class="user-passwd">
            <input
              type="password"
              placeholder={this.app.msgs.decrypt.userPasswd}
              value={this.userPasswd}
              onInput={this.handleUserPasswdInput}
            ></input>
          </section>
          <section class="secret-passwd">
            <input
              type="text"
              placeholder={this.app.msgs.decrypt.sercretPasswd}
              value={this.secretPasswd}
              onInput={this.handleSecretPasswdInput}
            ></input>
          </section>
          <section class="file-select">
            <button onClick={this.handleFileSelectBtnClick} disabled={!canDecrypt}>
              {this.app.msgs.decrypt.fileSelectBtn}
            </button>
            <input
              type="file"
              ref={this.handleFileInpuretRef}
              onChange={this.handleFileInputChange}
            ></input>
          </section>
          {this.errMsg && (
            <section class="err">
              <div>{this.errMsg}</div>
            </section>
          )}
          {this.decrypted && (
            <section class="download">
              <div>{this.app.msgs.decrypt.completed}</div>
              <div class="files">{this.renderFiles()}</div>
            </section>
          )}
          <section class="back-btn">
            <a {...href('/')}>{this.app.msgs.common.back}</a>
          </section>
        </main>
        {this.decrypting && (
          <ap-loading>
            <ap-icon icon="unlock"></ap-icon>
          </ap-loading>
        )}
      </Host>
    );
  }
}
