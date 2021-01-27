import { Component, h, Host, Listen } from '@stencil/core';
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

  componentWillLoad() {
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.active) {
          navigator.serviceWorker.addEventListener('controllerchange', () =>
            window.location.reload(),
          );
        }
      });
    }

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
      default:
        this.app.setTitle(this.app.msgs.home.title + suffix);
        break;
    }
  }

  render() {
    return (
      <Host>
        <Router.Switch>
          <Route path="/">
            <app-home app={this.app}></app-home>
          </Route>
          <Route path="/keygen">
            <app-keygen app={this.app}></app-keygen>
          </Route>
          <Route path="/encrypt">
            <app-encrypt app={this.app}></app-encrypt>
          </Route>
          <Route path="/decrypt">
            <app-decrypt app={this.app}></app-decrypt>
          </Route>
        </Router.Switch>
      </Host>
    );
  }
}
