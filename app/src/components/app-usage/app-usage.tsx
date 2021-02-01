import { Component, h, Host, Prop } from '@stencil/core';
import { App } from 'src/app/app';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'app-usage',
  styleUrl: 'app-usage.scss',
})
export class AppUsage {
  @Prop()
  app: App;

  render() {
    return (
      <Host>
        <header>{this.app.msgs.usage.title}</header>
        <main>
          {this.app.msgs.usage.usageContent}
          <div class="back-btn">
            <a {...href('/')}>{this.app.msgs.common.back}</a>
          </div>
        </main>
      </Host>
    );
  }
}
