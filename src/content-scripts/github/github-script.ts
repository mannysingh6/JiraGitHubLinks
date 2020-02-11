import { injectJiraLink } from './core/dom-injector';
import DOMObserver from './core/dom-observer';
import { detectIssue } from './core/issue-detection';
import { inboundMessages } from './messages/background-messages';

class ContentScript {

  private domObserver = new DOMObserver();

  public init = async () => {
    inboundMessages.startListening();
    this.findIssue();
    this.domObserver.startObserver(document.documentElement, this.domObserverCallback);
  }

  public destruct = () => {
    this.domObserver.stopObserver();
    inboundMessages.stopListening();
  }

  /**
  * This function will be attached to the dom observer and will be called anytime something on the DOM
  * is added or removed. It will also see if the URL has changed for SPAs.
  */
  private domObserverCallback = () => {
    this.findIssue();
  }

  private findIssue = async () => {
    const issue = detectIssue();
    if (issue) {
      injectJiraLink(issue);
    }
  }
}

export const contentScript = new ContentScript();
