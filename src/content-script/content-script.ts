import { Operation, sendRuntimeMessage } from '@/shared/extension-message';
import { PullRequest } from '@/shared/models/pull-request';
import { RestResponse } from '@/shared/models/rest-response';
import { injectPullRequests } from './core/dom-injector';
import DOMObserver from './core/dom-observer';
import { detectIssue } from './core/issue-detection';
import { inboundMessages } from './messages/background-messages';

class ContentScript {

  private domObserver = new DOMObserver();

  public init = async () => {
    inboundMessages.startListening();
    this.domObserver.startObserver(document.documentElement, this.domObserverCallback);
    this.findIssue();
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
    const issueNumber = await detectIssue();
    if (!issueNumber) {
      return;
    }

    const response = await sendRuntimeMessage<RestResponse<PullRequest[]>>({
      operation: Operation.GetPullRequests,
      data: {
        issue: issueNumber
      }
    });
    if (response.json) {
      injectPullRequests(response.json);
    }
    console.log('response', response);
  }
}

export const contentScript = new ContentScript();
