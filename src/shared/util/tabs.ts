import { Operation, sendTabMessage } from '../extension-message';

export const getAllTabs = (): Promise<xbrowser.tabs.Tab[]> => {
  return xbrowser.tabs.query({ url: ['*://jira.tc.lenovo.com/*', '*://jira.stone-ware.com/*', '*://*.atlassian.net/*'] });
};

export const resetAllTabs = async () => {
  const tabs = await getAllTabs();
  tabs.forEach(tab => sendTabMessage(tab.id!, { operation: Operation.ResetContentScript }));
}
