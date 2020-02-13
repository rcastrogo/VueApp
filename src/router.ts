
import Vue from 'vue'
import VueRouter from 'vue-router';
import HomePage from '@/views/home-page.vue';
import CounterPage from '@/views/counter-page.vue';
import AboutPage from '@/views/about-page.vue';

Vue.use(VueRouter);
Vue.config.productionTip = false

const routes =  [
    { path: '/', component: HomePage },
    { path: '/counter', component: CounterPage },   
    { path: '/about', component: AboutPage }
];

const router = new VueRouter({mode: 'history', routes});

export default router;
