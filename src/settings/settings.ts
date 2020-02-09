import '@/shared/assets/fonts/proxima-nova/proxima-nova.css';
import VueLineClamp from '@/shared/plugins/line-clamp';
import Vue from "vue";
import vuetify from '../shared/plugins/vuetify';
import App from "./App.vue";
import router from "./router";
import store from "./store";

window.debugMessaging = DEBUG_MESSAGING_ENABLED;

Vue.config.productionTip = false;

Vue.use(VueLineClamp);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount("#app");
