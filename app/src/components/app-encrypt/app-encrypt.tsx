import { Component, h, Host, Prop, State } from '@stencil/core';
import { App } from 'src/app/app';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'app-encrypt',
  styleUrl: 'app-encrypt.scss',
})
export class AppEncrypt {
  @Prop()
  app: App;

  @State()
  passwd: string;

  @State()
  encrypting = false;

  @State()
  encrypted: { name: string; url: string };

  private fileInput: HTMLInputElement;
  private handleFileInpuretRef = (el: HTMLInputElement) => {
    this.fileInput = el;
  };

  disconnectedCallback() {
    this.clearDownloadURL();
  }

  private clearDownloadURL() {
    if (this.encrypted) {
      URL.revokeObjectURL(this.encrypted.url);
      this.encrypted = undefined;
    }
  }

  private handlePasswdInput = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;
    this.passwd = el.value;
  };

  private handleFileSelectBtnClick = () => {
    this.fileInput.click();
  };

  private handleFileInputChange = async () => {
    const inputFiles = this.fileInput.files;
    if (inputFiles.length == 0) {
      return;
    }
    const files = [] as File[];
    for (let i = 0; i < inputFiles.length; i++) {
      const file = inputFiles.item(i);
      files.push(file);
    }
    this.fileInput.value = '';

    this.encrypting = true;
    try {
      const encrypted = await this.app.encryption.encryptFiles(files, this.passwd, () => {});
      this.clearDownloadURL();
      this.encrypted = {
        name: `${removeExtension(files[0]?.name)}.psop`,
        url: URL.createObjectURL(encrypted),
      };
    } finally {
      this.encrypting = false;
    }
  };

  render() {
    const canEncrypt =
      this.passwd && !!this.passwd.match(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{52}$/);

    return (
      <Host>
        <header>{this.app.msgs.encrypt.title}</header>
        <main>
          <section class="passwd">
            <input
              type="text"
              placeholder={this.app.msgs.encrypt.publicPasswd}
              value={this.passwd}
              onInput={this.handlePasswdInput}
            ></input>
          </section>
          <section class="file-select">
            <button onClick={this.handleFileSelectBtnClick} disabled={!canEncrypt}>
              {this.app.msgs.encrypt.fileSelectBtn}
            </button>
            <input
              type="file"
              multiple={true}
              ref={this.handleFileInpuretRef}
              onChange={this.handleFileInputChange}
            ></input>
          </section>
          {!!this.encrypted && (
            <section class="download">
              <div>{this.app.msgs.encrypt.completed}</div>
              <a class="button" href={this.encrypted.url} download={this.encrypted.name}>
                <ap-icon icon="download" />
                <span>{this.encrypted.name}</span>
              </a>
            </section>
          )}
          <section class="back-btn">
            <a {...href('/')}>{this.app.msgs.common.back}</a>
          </section>
        </main>
        {this.encrypting && (
          <ap-loading>
            <ap-icon icon="shield-lock"></ap-icon>
          </ap-loading>
        )}
      </Host>
    );
  }
}

const removeExtension = (filename: string) => {
  if (!filename) {
    return;
  }
  const a = filename.split('.');
  if (a.length <= 1) {
    return filename;
  } else {
    return a.slice(0, -1).join('.');
  }
};
