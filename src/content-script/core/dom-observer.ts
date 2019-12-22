/**
 * dom-observer.ts
 *
 * The enclosed material is Lenovo confidential and is the sole property of Lenovo.
 * Unauthorized disclosure, distribution or other use of this material is expressly prohibited.
 *
 * © 2018 Lenovo Group Ltd.
 *
 * Watches for any DOM changes and notifies the parent thru a callback.
 */

import { throttle } from '@/shared/util/throttle';

export default class DOMObserver {

  public observingDOM = false;
  private elementToObserve!: HTMLElement;
  private callback!: () => void;
  private mutationObserver!: MutationObserver | null;
  private callbackThrottle!: Function;

  /**
   * Start observing for dom changes.
   */
  public startObserver(elementToObserve: HTMLElement, callback: () => void) {
    if (this.observingDOM) {
      this.stopObserver();
    }
    this.elementToObserve = elementToObserve;
    this.callback = callback;
    this.mutationObserver = this.observeDOM();
    this.observingDOM = true;
    this.callbackThrottle = throttle(this.callback, 1000);
  }

  /**
   * Stop observing for dom changes.
   */
  public stopObserver() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    this.mutationObserver = null;
    this.observingDOM = false;
  }

  /**
   * Create a new MutationObserver. Invoke callback if it was a valid mutation.
   */
  private observeDOM(): MutationObserver {
    /**
     * Define a new observer.
     */
    const obs = new MutationObserver((mutations: MutationRecord[], observer) => {
      const validMutation = mutations.some(mutation => {
        if (mutation.type === 'childList') {

          const changedNodes = [...mutation.addedNodes, ...mutation.removedNodes];
          if (changedNodes.length === 0) {
            return false;
          }

          return true;
        }
        return false;
      });

      if (validMutation) {
        this.callbackThrottle();
      }
    });

    // have the observer observe foo for changes in children
    obs.observe(this.elementToObserve, {
      childList: true,
      subtree: true
    });

    return obs;
  }
}
