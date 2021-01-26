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

  componentWillLoad() {
    const appMsg = new AppMsg();
    const appEncryption = new AppEncryption(appMsg);
    this.app = new App(appMsg, appEncryption);
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
