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
          <a {...href('keygen')}>{this.app.msgs.home.keygen}</a>
          <a {...href('encrypt')}>{this.app.msgs.home.encrypt}</a>
          <a {...href('decrypt')}>{this.app.msgs.home.decrypt}</a>
        </div>
      </Host>
    );
  }
}
