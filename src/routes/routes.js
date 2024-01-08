import DashboardLayout from '@/views/Layout/DashboardLayout.vue';

const routes = [
  {
    path: '/',
    redirect: 'livro',
    component: DashboardLayout,
    children: [
      {
        path: '/assunto',
        name: 'assunto',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Assunto.vue')
      },
      {
        path: '/autor',
        name: 'autor',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Autor.vue')
      },
      {
        path: '/livro',
        name: 'livro',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Livro.vue')
      },
      {
        path: '/relatorio',
        name: 'relatorio',
        redirect: 'livro'
      }
    ]
  }
];

export default routes;
