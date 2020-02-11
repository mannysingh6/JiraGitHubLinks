import { Operation, sendTabMessage } from '@/shared/extension-message';
import { getActiveTab } from '@/shared/util/tabs';
import { background } from './background';
import { popupApi } from "./popup-api";

window.debugMessaging = DEBUG_MESSAGING_ENABLED;
window.getPopupApi = popupApi;

background.init();

/**
 * Set the default page for the popup.
 */
xbrowser.browserAction.setPopup({
  popup: 'popup.html'
});

xbrowser.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-spotlight') {

    const tab = await getActiveTab();
    if (tab && tab.id) {
      try {
        const ping = await sendTabMessage(tab.id, { operation: Operation.PingSpotlightScript });
        if (ping) {
          sendTabMessage(tab.id, { operation: Operation.ToggleSpotlight });
          return;
        }
      } catch (err) {
        console.log('PING FAILED', err);
      }
      console.log('INJECTING spotlight SCRIPT');
      await xbrowser.tabs.executeScript(tab.id, { file: 'lib/xbrowser-polyfill.js' });
      await xbrowser.tabs.executeScript(tab.id, { file: 'scripts/spotlight-content-script.js' });
    }
  }
});

// it will automatically load content_scripts/styles on all current tabs anytime the background script reloads
// This really helps on chrome during dev after we reload the extension.
// FIX: it will load them regardless of whether they've been previously loaded
// (function enableAllCurrentTabs() {
//   const showErrors = () => {
//     if (xbrowser.runtime.lastError) {
//       console.error(xbrowser.runtime.lastError);
//     }
//   };
//   const contentScripts = xbrowser.runtime.getManifest().content_scripts;
//   if (contentScripts) {
//     contentScripts.forEach(async script => {
//       const allFrames = script.all_frames;
//       const url = script.matches;

//       const loadContentScripts = (tab: xbrowser.tabs.Tab) => {
//         const tabId = tab.id;
//         if (tabId) {
//           (script.js || []).forEach(file => {
//             xbrowser.tabs.executeScript(tabId, { allFrames, file }).then(showErrors).catch(showErrors);
//           });
//           (script.css || []).forEach(file => {
//             xbrowser.tabs.insertCSS(tabId, { allFrames, file }).then(showErrors).catch(showErrors);
//           });
//         }
//       };

//       const tabs = await xbrowser.tabs.query({ url });
//       tabs.forEach(loadContentScripts);
//     });
//   }
// })();
