import { contentScript } from './content-script';
import { destruct } from "./destructor";

window.debugMessaging = DEBUG_MESSAGING_ENABLED;

// Destruction of old content script if it exists
destruct();

contentScript.init();
