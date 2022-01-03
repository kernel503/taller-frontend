import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/administrador',
    component: () => import('../views/administrador/AdminPanel.vue'),
    children: [
      {
        path: 'categoria',
        name: 'categoria',
        component: () => import('../components/administrador/Categoria.vue'),
      },
      {
        path: 'producto',
        name: 'producto',
        component: () => import('../components/administrador/Producto.vue'),
      },
      {
        path: 'registro-venta',
        name: 'venta',
        component: () => import('../components/administrador/RegistroVenta.vue'),
      },
    ],
  },
  {
    path: '/tienda',
    name: 'tienda',
    component: () => import('../components/Tienda.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
