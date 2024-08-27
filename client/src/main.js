import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';

Vue.config.productionTip = false

import './assets/global.scss';


// az alapértelmezett vue http-moduljainak beállítása API-hívásokhoz
Vue.prototype.$http = axios;
// token betöltése lokális tárolóból
const token = localStorage.getItem('token');
// ha van token
if(token){
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
