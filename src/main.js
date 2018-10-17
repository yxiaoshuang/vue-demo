import apiConfig from '../config/api.config';
import babelpolyfill from 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import global_ from './utils/Global';
import baseFunc from './utils/Func';
import 'element-ui/lib/theme-default/index.css';
import VueRouter from 'vue-router';
import store from './vuex/store';
import Vuex from 'vuex';
import Blob from './vendor/Blob.js';
import Export2Excel from './vendor/Export2Excel.js';
import { postRequest } from './api/api';
import { getRequest } from './api/api';
import { deleteRequest } from './api/api';
import { putRequest } from './api/api';
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import router from './routes';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = apiConfig.baseUrl;
//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css';
import qs from 'qs';
Vue.prototype.$qs = qs;
import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(baseFunc);

Vue.prototype.GLOBAL = global_;
Vue.prototype.$ajax = axios;

Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;

//NProgress.configure({ showSpinner: false });


router.beforeEach((to, from, next) => {
	//NProgress.start();
	if (to.path == '/login') {
		sessionStorage.removeItem('user');
	}
	let user = JSON.parse(sessionStorage.getItem('user'));
	if (!user && to.path != '/login') {
		next({ path: '/login' });
	} else {
		next();
	}
});

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
	//el: '#app',
	//template: '<App/>',
	router,
	store,
	//components: { App }
	render: h => h(App),
}).$mount('#app');
