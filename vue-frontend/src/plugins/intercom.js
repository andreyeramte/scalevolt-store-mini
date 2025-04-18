// src/plugins/intercom.js
import { bootIntercom, shutdownIntercom, showIntercom } from '@intercom/messenger-js-sdk';

export function initIntercom() {
  bootIntercom({
    app_id: 'mm6ivt97',
    alignment: 'right', // optional config
    hide_default_launcher: false // whether to show the default launcher
    // ... other Intercom options
  });
}

// Optionally export other Intercom methods if you need them later
export function stopIntercom() {
  shutdownIntercom();
}

export function openIntercom() {
  showIntercom();
}
