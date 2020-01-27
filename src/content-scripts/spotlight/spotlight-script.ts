import { spotlightController } from './controllers/spotlight-controller';
import { inboundMessages } from './messages/background-messages';

class ContentScript {

  public init = async () => {
    console.log('SPOTLIGHT INIT');
    inboundMessages.startListening();
    spotlightController.toggleIframe();
  }

  public destruct = () => {
    console.log('SPOTLIGHT destruct');
    inboundMessages.stopListening();
  }
}

export const contentScript = new ContentScript();
