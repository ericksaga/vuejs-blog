import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'
import './rules/validation'
import VueFroala from 'vue-froala-wysiwyg'
import CxltToastr from 'cxlt-vue2-toastr'
import Notifications from 'vue-notification'
import axios from 'axios'
import VueAxios from 'vue-axios'

// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min.js')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('froala-editor/css/froala_style.min.css')

import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'

Vue.config.productionTip = false
Vue.use(VModal)
Vue.use(VueFroala)
Vue.use(Notifications)
Vue.use(VueAxios, axios)
axios.defaults.baseURL = 'http://localhost:3000';
Vue.use(CxltToastr, {
  position: 'top right',
  showDuration: 2000,
  timeOut: 5000
})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
