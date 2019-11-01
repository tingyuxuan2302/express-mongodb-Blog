import Vue from 'vue';
import App from './index.vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import Register from 'views/register/register';
import SignIn from 'views/signIn/signIn';
import Home from 'views/home/home';
import Publish from 'views/publish/publish';

// const Vue = require('vue'),
// App = require('./index.vue'),
// VueRouter = require('vue-router'),
// ElementUI = require('element-ui'),
// Register = require('views/register/register');
// require('element-ui/lib/theme-chalk/index.css');

Vue.use(VueRouter);
Vue.use(ElementUI);
const routes = [
    { path: '/register', component: Register },
    { path: '/signIn', component: SignIn },
    { path: '/home', component: Home },
    { path: '/publish', component: Publish },
];
const router = new VueRouter({
    mode: 'history',
    routes
});

var app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
// export default app;

// const app = new Vue({
//     template: `<div>Hello World</div>`
//   })
//   const renderer = require('vue-server-renderer').createRenderer()
//   renderer.renderToString(app, (err, html) => {
//     if (err) throw err
//     console.log(html)
//     // => <div data-server-rendered="true">Hello World</div>
//   })
