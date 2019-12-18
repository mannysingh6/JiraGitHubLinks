/**
 * chrome-browser-polyfill.ts
 *
 * The enclosed material is Lenovo confidential and is the sole property of Lenovo.
 * Unauthorized disclosure, distribution or other use of this material is expressly prohibited.
 *
 * © 2019 Lenovo Group Ltd.
 *
 * Created on June 24, 2019.
 */

import * as browser from 'webextension-polyfill';

if (typeof (window as any).xbrowser === 'undefined') {
  (window as any).xbrowser = browser;
}
