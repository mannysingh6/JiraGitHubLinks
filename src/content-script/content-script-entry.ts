import { contentScript } from './content-script';
import { destruct } from "./destructor";

// Destruction of old content script if it exists
destruct();

contentScript.init();
