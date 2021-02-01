import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'
import './rules/validation'
import VueFroala from 'vue-froala-wysiwyg'

// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min.js')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('froala-editor/css/froala_style.min.css')

Vue.config.productionTip = false
Vue.use(VModal)
Vue.use(VueFroala)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
