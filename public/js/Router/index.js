Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/new',
      name: 'login',
      component: Login
    },
    {
      path: '/diet',
      name: 'diet',
      component: Diet
    },
    {
      path: '/fitness',
      name: 'fitness',
      component: Fitness
    }
  ]
})
