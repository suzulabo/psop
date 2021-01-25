import { Component, Fragment, h, Host, Prop, State } from '@stencil/core';
import { App } from 'src/app/app';
import { humanFileSize } from 'src/app/utils';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'app-encrypt',
  styleUrl: 'app-encrypt.scss',
})
export class AppEncrypt {
  @Prop()
  app: App;

  @State()
  files: File[] = [];

  @State()
  passwd: string;

  @State()
  encrypting = false;

  @State()
  downloadURL: string;

  private fileInput: HTMLInputElement;
  private handleFileInpuretRef = (el: HTMLInputElement) => {
    this.fileInput = el;
  };

  disconnectedCallback() {
    this.clearDownloadURL();
  }

  private clearDownloadURL() {
    if (this.downloadURL) {
      URL.revokeObjectURL(this.downloadURL);
      this.downloadURL = null;
    }
  }

  private handleAddBtnClick = () => {
    this.fileInput.click();
  };

  private handleFileInputChange = () => {
    const files = this.fileInput.files;
    if (files.length == 0) {
      return;
    }
    const newFiles = [...this.files];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (
        !newFiles.find(f => {
          return f.name == file.name && f.size == file.size;
        })
      ) {
        newFiles.push(file);
      }
    }
    this.files = newFiles;
    this.fileInput.value = '';
  };

  private handleDeleteBtnClick = (event: Event) => {
    const el = event.currentTarget as HTMLElement;
    const index = parseInt(el.getAttribute('data-index'));
    this.files = this.files.filter((_, i) => {
      return i != index;
    });
  };

  private handlePasswdInput = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;
    this.passwd = el.value;
  };

  private handleEncryptBtnClick = async () => {
    this.encrypting = true;
    try {
      const encrypted = await this.app.encryption.encryptFiles(this.files, this.passwd, () => {});
      this.clearDownloadURL();
      this.downloadURL = URL.createObjectURL(encrypted);
    } finally {
      this.encrypting = false;
    }
  };

  private renderFiles = () => {
    return this.files.map((v, i) => {
      return (
        <div class="file">
          <span class="name">{v.name}</span>
          <span class="size">({humanFileSize(v.size)})</span>
          <button class="icon" data-index={i} onClick={this.handleDeleteBtnClick}>
            <ap-icon icon="x" />
          </button>
        </div>
      );
    });
  };

  render() {
    const totalSize = this.files.reduce((n, f) => {
      return n + f.size;
    }, 0);

    const canEncrypt =
      this.files.length > 0 &&
      this.passwd &&
      this.passwd.match(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{52}$/);

    return (
      <Host>
        <header>{this.app.msgs.encrypt.title}</header>
        <main>
          <div class="add-box">
            <button onClick={this.handleAddBtnClick}>{this.app.msgs.encrypt.addBtn}</button>
            <input
              type="file"
              multiple={true}
              ref={this.handleFileInpuretRef}
              onChange={this.handleFileInputChange}
            ></input>
          </div>
          {this.files.length > 0 && (
            <Fragment>
              <div class="files-block">
                <div class="files-box">{this.renderFiles()}</div>
                <div class="total-box">Total: {humanFileSize(totalSize)}</div>
              </div>
              <div class="pubkey-block">
                <input
                  type="password"
                  placeholder={this.app.msgs.encrypt.publicPasswd}
                  value={this.passwd}
                  onInput={this.handlePasswdInput}
                ></input>
              </div>
              {!this.downloadURL && (
                <div class="encrypt-btn">
                  <button disabled={!canEncrypt} onClick={this.handleEncryptBtnClick}>
                    {this.app.msgs.encrypt.encryptBtn}
                  </button>
                </div>
              )}
              {!!this.downloadURL && (
                <div class="encrypt-btn">
                  <a
                    class="button"
                    href={this.downloadURL}
                    download={`${removeExtension(this.files[0]?.name)}.psop`}
                  >
                    {this.app.msgs.encrypt.download}
                  </a>
                </div>
              )}
            </Fragment>
          )}
          <div class="back-btn">
            <a {...href('/')}>{this.app.msgs.common.back}</a>
          </div>
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
