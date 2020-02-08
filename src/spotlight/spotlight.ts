import '@/shared/assets/fonts/proxima-nova/proxima-nova.css';
import Vue from "vue";
import VueObserveVisibility from 'vue-observe-visibility';
import vuetify from '../shared/plugins/vuetify';
import App from "./App.vue";
import store from "./store";

window.debugMessaging = DEBUG_MESSAGING_ENABLED;

Vue.config.productionTip = false;

Vue.use(VueObserveVisibility);

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount("#app");
