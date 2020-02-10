import { listenForRuntimeMessages, MessageHandlersType, Operation } from "@/shared/extension-message";
import { spotlightController } from '../controllers/spotlight-controller';

const handlePingSpotlightScript = (data: any, sender: xbrowser.runtime.MessageSender) => {
  return true;
};

const handleToggleSpotlight = (data: any, sender: xbrowser.runtime.MessageSender) => {
  spotlightController.toggleIframe();
  return true;
};

class InboundMessages {

  private listener!: MessageHandlersType;
  private dismissSpotlightListener: any;

  public startListening() {
    /**
     * Map of message handlers for messages sent to the content script.
     */
    this.listener = listenForRuntimeMessages(new Map<Operation, MessageHandlersType>([
      [Operation.PingSpotlightScript, handlePingSpotlightScript],
      [Operation.ToggleSpotlight, handleToggleSpotlight]
    ]));

    this.dismissSpotlightListener = (event: MessageEvent) => {
      if (event.data && event.data.operation === Operation.ToggleSpotlight) {
        spotlightController.toggleIframe();
      }
    };
    window.addEventListener('message', this.dismissSpotlightListener);
  }

  public stopListening() {
    xbrowser.runtime.onMessage.removeListener(this.listener);
    window.removeEventListener('message', this.dismissSpotlightListener);
  }
}

export const inboundMessages = new InboundMessages();
