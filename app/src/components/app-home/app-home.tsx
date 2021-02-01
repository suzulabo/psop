import { Component, h, Host, Prop } from '@stencil/core';
import { App } from 'src/app/app';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
})
export class AppHome {
  @Prop()
  app: App;

  render() {
    return (
      <Host>
        <div class="lniks">
          <a class="button full-width" {...href('keygen')}>
            <ap-icon icon="key" />
            <span>{this.app.msgs.home.keygen}</span>
            <ap-icon icon="key" />
          </a>
          <a class="button full-width" {...href('encrypt')}>
            <ap-icon icon="shield-lock" />
            <span>{this.app.msgs.home.encrypt}</span>
            <ap-icon icon="shield-lock" />
          </a>
          <a class="button full-width" {...href('decrypt')}>
            <ap-icon icon="unlock" />
            <span>{this.app.msgs.home.decrypt}</span>
            <ap-icon icon="unlock" />
          </a>
          <a {...href('usage')}>{this.app.msgs.home.usage}</a>
        </div>
      </Host>
    );
  }
}
