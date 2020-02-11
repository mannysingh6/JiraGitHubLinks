import { spotlightController } from './controllers/spotlight-controller';
import { inboundMessages } from './messages/background-messages';

class ContentScript {

  public init = async () => {
    inboundMessages.startListening();
    spotlightController.toggleIframe();
  }

  public destruct = () => {
    inboundMessages.stopListening();
  }
}

export const contentScript = new ContentScript();
