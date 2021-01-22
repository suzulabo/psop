import { Component, h, Host } from '@stencil/core';
import { App } from 'src/app/app';
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
    this.app = new App(appMsg);
  }

  render() {
    return (
      <Host>
        <Router.Switch>
          <Route path="/">
            <app-home app={this.app}></app-home>
          </Route>
        </Router.Switch>
      </Host>
    );
  }
}
