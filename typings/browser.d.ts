import { PopupApi } from "@/background-script/popup-api";

declare global {

  namespace xbrowser {
    export import runtime = browser.runtime;
    export import storage = browser.storage;
    export import browserAction = browser.browserAction;
    export import idle = browser.idle;
    export import tabs = browser.tabs;
    export import webRequest = browser.webRequest;
    export import webNavigation = browser.webNavigation;
    export import windows = browser.windows;
    export import contextMenus = browser.contextMenus;
    export import i18n = browser.i18n;
    export import extension = browser.extension;
    export import identity = browser.identity;
    export import commands = browser.commands;
  }

  interface Window {
    getPopupApi: PopupApi;
    debugMessaging: boolean;
    xdContext: any;
  }
}
