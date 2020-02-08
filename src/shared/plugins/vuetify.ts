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
        secondary: '#00838F',
        anchor: '#00838F',
        primaryGrey: '#414243',
        secondaryGrey: '#717273',
        hintGrey: '#B1B2B3',
        backgroundGrey: '#EDEFF0',
        textField: '#26C6D8',
        tabHover: '#F2F5F5'
      },
      dark: {
        primary: '#CD2B2B',
        secondary: '#00838F',
        anchor: '#00838F',
        primaryGrey: '#414243',
        secondaryGrey: '#717273',
        hintGrey: '#B1B2B3',
        backgroundGrey: '#EDEFF0',
        textField: '#26C6D8',
        tabHover: '#F2F5F5'
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
