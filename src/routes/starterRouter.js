import Vue from 'vue';
import Router from 'vue-router';
import DashboardLayout from '../views/Livro.vue';
import Starter from '../views/Livro.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/livro',
      component: DashboardLayout,
      children: [
        {
          path: 'livro',
          name: 'livro',
          components: { default: Starter }
        }
      ]
    }
  ],
  scrollBehavior: (to, from ,savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  }
});
