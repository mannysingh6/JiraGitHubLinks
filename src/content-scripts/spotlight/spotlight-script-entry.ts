import { destruct } from './destructor';
import { contentScript } from './spotlight-script';

window.debugMessaging = DEBUG_MESSAGING_ENABLED;

// Destruction of old content script if it exists
destruct();

contentScript.init();
