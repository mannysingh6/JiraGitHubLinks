import { listenForRuntimeMessages, MessageHandlersType, Operation } from "@/shared/extension-message";
import { contentScript } from '../content-script';
import { destruct } from '../destructor';

const handleResetContentScript = (data: any, sender: xbrowser.runtime.MessageSender) => {
  destruct();
  contentScript.init();
};

class InboundMessages {

  private listener!: MessageHandlersType;

  public startListening() {
    /**
     * Map of message handlers for messages sent to the content script.
     */
    this.listener = listenForRuntimeMessages(new Map<Operation, MessageHandlersType>([
      [Operation.ResetContentScript, handleResetContentScript]
    ]));
  }

  public stopListening() {
    xbrowser.runtime.onMessage.removeListener(this.listener);
  }
}

export const inboundMessages = new InboundMessages();
