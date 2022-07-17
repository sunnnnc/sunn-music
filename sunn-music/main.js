import App from './App'
import '@/common/iconfont.css'
import store from '@/store/index.js'
// #ifndef VUE3
import Vue from 'vue'
Vue.filter('formatCount', (value) => {
	if (value >= 10000 && value < 100000000) {
		value /= 10000;
		return value.toFixed(1) + '万'; //四舍五入为指定小数位数的数字
	} else if (value >= 100000000) {
		value /= 100000000;
		return value.toFixed(1) + '亿';
	} else {
		return value;
	}
});

Vue.filter('formatTime', (value) => {
	var date = new Date(value);
	return date.getFullYear() + '年' + (date.getMonth() + 1).toString().padStart(2, '0') + '月' + date.getDate()
		.toString().padStart(2, '0') + '日';
})

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
