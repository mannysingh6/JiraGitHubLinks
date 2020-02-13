// You still need to register Vuetify itself
// src/plugins/vuetify.js

import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: {
        primary: '#CD2B2B',
        secondary: '#00CBE3',
        anchor: '#00838F'
      },
      dark: {
        primary: '#CD2B2B',
        secondary: '#00CBE3',
        anchor: '#00838F'
      }
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    iconfont: 'mdi' // mdi is the default
  }
})
