import { inboundMessages } from './messages/content-script-messages';

export class Background {
  public async init() {
    inboundMessages.startListening();
  }
}

export const background = new Background();
