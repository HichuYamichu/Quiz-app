import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  theme: {
    primary: '#FFFFFF',
    accent: colors.green.lighten1,
    secondary: colors.red.lighten1,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3
  }
});
