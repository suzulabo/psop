import { Component, Host, h } from '@stencil/core';
import { createRouter, Route } from 'stencil-router-v2';

const Router = createRouter();

@Component({
  tag: 'app-root',
})
export class AppRoot {
  render() {
    console.log('render');
    return (
      <Host>
        <Router.Switch>
          <Route path="/">
            <app-home></app-home>
          </Route>
        </Router.Switch>
      </Host>
    );
  }
}
