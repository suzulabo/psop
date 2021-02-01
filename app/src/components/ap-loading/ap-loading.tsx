import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'ap-loading',
  styleUrl: 'ap-loading.scss',
})
export class ApLoading {
  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
