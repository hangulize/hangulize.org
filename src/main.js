// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import SuiVue from 'semantic-ui-vue'
import vClickOutside from 'v-click-outside'

import App from './App'

import H from './hangulize.adapter'

// H.hangulize('ita', 'gloria').then(x => { console.log(1, x) })
// H.specs().then(x => { console.log(2, x) })

// setInterval(() => {
//   H.hangulize('ita', 'gloria').then(x => { console.log(1, x) })
//   H.specs().then(x => { console.log(2, x) })
// }, 5000)

H.specs().then((specs) => {
  Vue.config.productionTip = false
  Vue.use(SuiVue)
  Vue.use(vClickOutside)

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
  })
})
