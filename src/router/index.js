import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/administrador',
    component: () => import(/* webpackChunkName: "about" */ '../views/administrador/AdminPanel.vue'),
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'categoria',
        name: 'categoria',
        component: () => import(/* webpackChunkName: "about" */ '../components/administrador/Categoria.vue'),
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        path: 'producto',
        name: 'producto',
        component: () => import(/* webpackChunkName: "about" */ '../components/administrador/Producto.vue'),

      },
    ],
  },
  {
    path: '/tienda',
    name: 'tienda',
    component: Home,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
