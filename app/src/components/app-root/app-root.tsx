import { Component, h, Host } from '@stencil/core';
import { App } from 'src/app/app';
import { AppEncryption } from 'src/app/encryption';
import { AppMsg } from 'src/app/msg';
import { createRouter, Route } from 'stencil-router-v2';

const Router = createRouter();

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {
  private app: App;

  // https://stenciljs.com/docs/service-workers
  /*
  @Listen('swUpdate', { target: 'window' })
  async onServiceWorkerUpdate() {
    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration?.waiting) {
      // If there is no waiting registration, this is the first service
      // worker being installed.
      return;
    }

    registration.waiting.postMessage('skipWaiting');
  }
  */

  componentWillLoad() {
    /*
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.active) {
          navigator.serviceWorker.addEventListener('controllerchange', () =>
            window.location.reload(),
          );
        }
      });
    }
    */

    const appMsg = new AppMsg();
    const appEncryption = new AppEncryption(appMsg);
    this.app = new App(appMsg, appEncryption);
  }

  componentWillRender() {
    const suffix = this.app.msgs.common.titleSuffix;

    switch (Router.activePath) {
      case '/keygen':
        this.app.setTitle(this.app.msgs.keygen.title + suffix);
        break;
      case '/encrypt':
        this.app.setTitle(this.app.msgs.encrypt.title + suffix);
        break;
      case '/decrypt':
        this.app.setTitle(this.app.msgs.decrypt.title + suffix);
        break;
      case '/usage':
        this.app.setTitle(this.app.msgs.usage.title + suffix);
        break;
      default:
        this.app.setTitle(this.app.msgs.home.title + suffix);
        break;
    }
  }

  private renderRoute(Tag: string, path: string) {
    return (
      <Route path={path}>
        <Tag app={this.app} class="page"></Tag>
      </Route>
    );
  }

  render() {
    return (
      <Host>
        <Router.Switch>
          {this.renderRoute('app-home', '/')}
          {this.renderRoute('app-keygen', '/keygen')}
          {this.renderRoute('app-encrypt', '/encrypt')}
          {this.renderRoute('app-decrypt', '/decrypt')}
          {this.renderRoute('app-usage', '/usage')}
        </Router.Switch>
        <footer>
          <div class="title">{this.app.msgs.footer.title}</div>
          <div class="copy">&copy;suzulabo</div>
          <div class="build-info">Version: {this.app.buildInfo.src}</div>
          <div class="build-info">Built at {new Date(this.app.buildInfo.time).toISOString()}</div>
          <div class="github">
            <a href="https://github.com/suzulabo/psop">
              <ap-icon icon="github" />
            </a>
          </div>
        </footer>
      </Host>
    );
  }
}
