/**
 * options.ts
 *
 * The enclosed material is Lenovo confidential and is the sole property of Lenovo.
 * Unauthorized disclosure, distribution or other use of this material is expressly prohibited.
 *
 * © 2019 Lenovo Group Ltd.
 *
 * Created on June 24, 2019.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const response = await xbrowser.tabs.create({
    url: xbrowser.runtime.getURL('settings.html'),
    active: true
  });

  if (response) {
    window.close();
  }
});
