// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import SuiVue from 'semantic-ui-vue'
import vClickOutside from 'v-click-outside'

import App from './App'
import messages from './messages'

import H from './hangulize.adapter'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(SuiVue)
Vue.use(vClickOutside)

const i18n = new VueI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
  messages: messages
})

H.specs().then((specs) => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    i18n
  })
})
