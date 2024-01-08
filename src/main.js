/*!

=========================================================
* BootstrapVue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/bootstrap-vue-argon-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from 'vue';
import DashboardPlugin from './plugins/dashboard-plugin';
import App from './App.vue';
import axios from 'axios';
import router from './routes/router';
import VueTheMask from 'vue-the-mask';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// plugin setup
Vue.use(DashboardPlugin);
Vue.use(VueTheMask)
Vue.use(VueSweetalert2);


axios.defaults.baseURL = 'http://localhost:80/api'; 
Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
});
