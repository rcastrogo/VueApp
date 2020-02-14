
import Vue from 'vue'
import VueRouter from 'vue-router';
import HomePage from '@/views/home-page.vue';
import CounterPage from '@/views/counter-page.vue';
import AboutPage from '@/views/about-page.vue';
import TabllyReportsPage from '@/views/tabbly-report-page.vue';
import UsuarioPage from '@/views/usuario-page.vue';
import ProveedorPage from '@/views/proveedor-page.vue';
import VehiculoPage from '@/views/vehiculo-page.vue';

Vue.use(VueRouter);
Vue.config.productionTip = false

const routes =  [
    { path: '/', component: HomePage },
    { path: '/counter', component: CounterPage },   
    { path: '/about', component: AboutPage },
    { path: '/tabbly-reports', component: TabllyReportsPage },
    { path: '/usuarios', component: UsuarioPage },
    { path: '/proveedores', component: ProveedorPage },
    { path: '/vehiculos', component: VehiculoPage }
];

const router = new VueRouter({mode: 'history', routes});

export default router;
